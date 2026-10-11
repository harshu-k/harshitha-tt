package com.ssims.service;

import com.ssims.exception.ResourceNotFoundException;
import com.ssims.model.Role;
import com.ssims.model.User;
import com.ssims.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new ResourceNotFoundException("No authenticated user");
        }
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + auth.getName()));
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public List<User> getStudents() {
        return userRepository.findByRole(Role.ROLE_STUDENT);
    }

    public User updateUserProfile(Long userId, String fullName, String phone, String department, String bio, String avatarUrl) {
        User user = getUserById(userId);
        if (fullName != null) user.setFullName(fullName);
        if (phone != null) user.setPhone(phone);
        if (department != null) user.setDepartment(department);
        if (bio != null) user.setBio(bio);
        if (avatarUrl != null) user.setAvatarUrl(avatarUrl);
        return userRepository.save(user);
    }
}

