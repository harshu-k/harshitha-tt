package com.ssims.seed;

import com.ssims.model.*;
import com.ssims.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentProfileRepository profileRepository;
    private final SkillRepository skillRepository;
    private final CertificationRepository certificationRepository;
    private final ProjectRepository projectRepository;
    private final InternshipRepository internshipRepository;
    private final ApplicationRepository applicationRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      StudentProfileRepository profileRepository,
                      SkillRepository skillRepository,
                      CertificationRepository certificationRepository,
                      ProjectRepository projectRepository,
                      InternshipRepository internshipRepository,
                      ApplicationRepository applicationRepository,
                      NotificationRepository notificationRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.skillRepository = skillRepository;
        this.certificationRepository = certificationRepository;
        this.projectRepository = projectRepository;
        this.internshipRepository = internshipRepository;
        this.applicationRepository = applicationRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Data already exists
        }

        // 1. Coordinator / Administrator
        User coordinator = new User(
                "Dr. Rajesh Sharma",
                "admin@ssims.edu",
                passwordEncoder.encode("admin123"),
                Role.ROLE_COORDINATOR,
                "Internship & Placement Cell",
                "+91 9876543210"
        );
        coordinator.setBio("Dean of Industry Relations & Senior Placement Coordinator.");
        coordinator.setAvatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80");
        coordinator = userRepository.save(coordinator);

        // 2. Primary Student - Harshitha Rao
        User student1 = new User(
                "Harshitha Rao",
                "student@ssims.edu",
                passwordEncoder.encode("student123"),
                Role.ROLE_STUDENT,
                "Computer Science & Engineering",
                "+91 9123456780"
        );
        student1.setBio("Passionate full-stack Java developer with hands-on experience building scalable Spring Boot microservices and modern React applications.");
        student1.setAvatarUrl("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80");
        student1 = userRepository.save(student1);

        StudentProfile profile1 = new StudentProfile(
                student1,
                "22CSE108",
                "B.Tech in Computer Science & Engineering",
                "Computer Science & Engineering",
                2026,
                9.15
        );
        profile1.setGithubUrl("https://github.com/harshitha-dev");
        profile1.setLinkedinUrl("https://linkedin.com/in/harshitha-rao");
        profile1.setPortfolioUrl("https://harshitha.dev");
        profile1.setResumeFileName("Harshitha_Rao_Resume.pdf");
        profile1.setResumeUrl("https://example.com/resumes/harshitha-resume.pdf");
        profile1.setCareerObjective("Seeking a challenging Full-Stack Software Engineering Internship where I can leverage Spring Boot, React, and cloud architectures to deliver impact.");
        profileRepository.save(profile1);

        // Skills for Harshitha
        skillRepository.save(new Skill(student1, "Java", Skill.Category.TECHNICAL, Skill.Proficiency.EXPERT, 3));
        skillRepository.save(new Skill(student1, "Spring Boot", Skill.Category.FRAMEWORK_TOOL, Skill.Proficiency.ADVANCED, 2));
        skillRepository.save(new Skill(student1, "React.js", Skill.Category.FRAMEWORK_TOOL, Skill.Proficiency.ADVANCED, 2));
        skillRepository.save(new Skill(student1, "SQL & PostgreSQL", Skill.Category.DATABASE, Skill.Proficiency.ADVANCED, 2));
        skillRepository.save(new Skill(student1, "RESTful APIs", Skill.Category.TECHNICAL, Skill.Proficiency.EXPERT, 3));
        skillRepository.save(new Skill(student1, "Docker", Skill.Category.CLOUD_DEVOPS, Skill.Proficiency.INTERMEDIATE, 1));
        skillRepository.save(new Skill(student1, "Git & GitHub", Skill.Category.FRAMEWORK_TOOL, Skill.Proficiency.ADVANCED, 3));
        skillRepository.save(new Skill(student1, "Agile Collaboration", Skill.Category.SOFT_SKILL, Skill.Proficiency.EXPERT, 2));
        skillRepository.save(new Skill(student1, "Problem Solving", Skill.Category.SOFT_SKILL, Skill.Proficiency.EXPERT, 3));

        // Mark some skills verified by coordinator
        final String coordinatorFullName = coordinator.getFullName();
        skillRepository.findAll().forEach(s -> {
            if (s.getName().equals("Java") || s.getName().equals("Spring Boot") || s.getName().equals("React.js")) {
                s.setVerified(true);
                s.setVerifiedBy(coordinatorFullName);
                s.setVerifiedAt(LocalDateTime.now().minusDays(5));
                skillRepository.save(s);
            }
        });

        // Certifications for Harshitha
        Certification cert1 = new Certification(
                student1,
                "AWS Certified Cloud Practitioner",
                "Amazon Web Services (AWS)",
                LocalDate.now().minusMonths(6),
                "AWS-CC-89210",
                "https://aws.amazon.com/verification"
        );
        cert1.setVerificationStatus(Certification.Status.VERIFIED);
        cert1.setVerifiedBy(coordinator.getFullName());
        cert1.setVerifiedAt(LocalDateTime.now().minusDays(10));
        certificationRepository.save(cert1);

        Certification cert2 = new Certification(
                student1,
                "Oracle Certified Associate: Java SE Programmer",
                "Oracle University",
                LocalDate.now().minusMonths(3),
                "OCA-J21-4491",
                "https://catalog-education.oracle.com"
        );
        cert2.setVerificationStatus(Certification.Status.VERIFIED);
        cert2.setVerifiedBy(coordinator.getFullName());
        cert2.setVerifiedAt(LocalDateTime.now().minusDays(8));
        certificationRepository.save(cert2);

        Certification cert3 = new Certification(
                student1,
                "Meta Front-End Developer Professional Certificate",
                "Meta / Coursera",
                LocalDate.now().minusDays(15),
                "COURSERA-META-782",
                "https://coursera.org/verify/professional-cert"
        );
        cert3.setVerificationStatus(Certification.Status.PENDING);
        certificationRepository.save(cert3);

        // Projects for Harshitha
        projectRepository.save(new Project(
                student1,
                "Student Skill & Internship Management System",
                "A full-stack enterprise platform featuring JWT stateless security, skill-to-job matching recommendation algorithm, real-time tracking, ATS resume export, and coordinator analytics.",
                "Java 21, Spring Boot 3, React 19, Vite, Tailwind CSS, JPA/Hibernate, SQL",
                "https://github.com/harshitha-dev/ssims-platform",
                "http://localhost:5173",
                Project.ProjectStatus.COMPLETED
        ));

        projectRepository.save(new Project(
                student1,
                "Microservices E-Commerce Core",
                "Event-driven microservices architecture utilizing Spring Cloud, Kafka event streaming, Redis caching, and resilient Dockerized services with circuit breaking.",
                "Spring Cloud, Apache Kafka, Redis, Docker, PostgreSQL",
                "https://github.com/harshitha-dev/ecommerce-microservices",
                "https://ecom-demo.dev",
                Project.ProjectStatus.COMPLETED
        ));

        projectRepository.save(new Project(
                student1,
                "AI Code Review Assistant",
                "Automated PR code analyzer that evaluates code smells, complexity metrics, and security vulnerabilities using LLM embeddings.",
                "Python, FastAPI, LangChain, React",
                "https://github.com/harshitha-dev/ai-code-reviewer",
                null,
                Project.ProjectStatus.IN_PROGRESS
        ));

        // 3. Second Student - Aarav Patel
        User student2 = new User(
                "Aarav Patel",
                "aarav@ssims.edu",
                passwordEncoder.encode("student123"),
                Role.ROLE_STUDENT,
                "Information Technology",
                "+91 9988776655"
        );
        student2.setAvatarUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80");
        student2 = userRepository.save(student2);

        StudentProfile profile2 = new StudentProfile(
                student2,
                "22IT045",
                "B.Tech in Information Technology",
                "Information Technology",
                2026,
                8.72
        );
        profileRepository.save(profile2);

        skillRepository.save(new Skill(student2, "Python", Skill.Category.TECHNICAL, Skill.Proficiency.EXPERT, 3));
        skillRepository.save(new Skill(student2, "Machine Learning", Skill.Category.TECHNICAL, Skill.Proficiency.ADVANCED, 2));
        skillRepository.save(new Skill(student2, "FastAPI", Skill.Category.FRAMEWORK_TOOL, Skill.Proficiency.INTERMEDIATE, 1));
        skillRepository.save(new Skill(student2, "SQL", Skill.Category.DATABASE, Skill.Proficiency.ADVANCED, 2));

        // 4. Internship Opportunities
        Internship intern1 = new Internship(
                "Full-Stack Java Software Engineer Intern",
                "Google Cloud",
                "Bengaluru, Karnataka",
                Internship.WorkplaceType.HYBRID,
                "Software Engineering",
                "₹65,000 / month",
                "6 Months",
                "Join Google Cloud engineering team building next-generation distributed enterprise platforms. You will design clean RESTful microservices, optimize high-throughput database queries, and contribute to developer console user experiences.",
                "Must be pursuing B.Tech/M.Tech in CS/IT. Strong understanding of OOP, Data Structures, Java, and modern web frameworks.",
                "Java, Spring Boot, React.js, SQL, RESTful APIs, Git",
                7.5,
                LocalDate.now().plusMonths(2),
                8,
                coordinator
        );
        intern1.setCompanyLogo("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg");
        internshipRepository.save(intern1);

        Internship intern2 = new Internship(
                "Frontend Platform Engineer Intern",
                "Microsoft",
                "Hyderabad, Telangana",
                Internship.WorkplaceType.REMOTE,
                "Web Development",
                "₹55,000 / month",
                "4 Months",
                "Work with Microsoft 365 core engineering team to build lightning-fast web applications. Implement responsive design systems, accessibility standards (WCAG), and state management architectures.",
                "Proficiency in React, modern JavaScript/TypeScript, CSS layouts, and performance profiling.",
                "React.js, JavaScript, Tailwind CSS, RESTful APIs, Git",
                7.0,
                LocalDate.now().plusMonths(1),
                5,
                coordinator
        );
        intern2.setCompanyLogo("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoft/microsoft-original.svg");
        internshipRepository.save(intern2);

        Internship intern3 = new Internship(
                "Cloud & DevOps Systems Intern",
                "Amazon AWS",
                "Pune, Maharashtra",
                Internship.WorkplaceType.REMOTE,
                "Cloud & DevOps",
                "₹60,000 / month",
                "6 Months",
                "Build CI/CD pipelines, containerize microservice workloads, and automate cloud infrastructure using AWS CloudFormation and Docker.",
                "Experience with Linux environments, Docker containers, basic cloud architectures, and shell scripting.",
                "Docker, Cloud Computing, Linux, Git, CI/CD",
                7.5,
                LocalDate.now().plusMonths(2),
                6,
                coordinator
        );
        intern3.setCompanyLogo("https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg");
        internshipRepository.save(intern3);

        Internship intern4 = new Internship(
                "Backend Engineering Intern",
                "Swiggy Tech",
                "Bengaluru, Karnataka",
                Internship.WorkplaceType.ONSITE,
                "Software Engineering",
                "₹45,000 / month",
                "3 Months",
                "Develop high-concurrency order processing services and cache layers handling millions of active delivery requests per hour.",
                "Solid grasp of Java, Spring Framework, relational databases, and caching strategies.",
                "Java, Spring Boot, SQL, Redis, RESTful APIs",
                7.0,
                LocalDate.now().plusDays(25),
                10,
                coordinator
        );
        intern4.setCompanyLogo("https://images.unsplash.com/photo-1563986768609-322da13575f3?w=100&auto=format&fit=crop&q=80");
        internshipRepository.save(intern4);

        Internship intern5 = new Internship(
                "AI & Machine Learning Research Intern",
                "NVIDIA",
                "Bengaluru, Karnataka",
                Internship.WorkplaceType.HYBRID,
                "Artificial Intelligence",
                "₹70,000 / month",
                "6 Months",
                "Collaborate with research scientists on deep learning neural network training, model inference optimizations, and GPU compute pipelines.",
                "Strong background in Linear Algebra, Python, PyTorch/TensorFlow, and ML algorithms.",
                "Python, Machine Learning, Deep Learning, SQL",
                8.0,
                LocalDate.now().plusMonths(2),
                4,
                coordinator
        );
        intern5.setCompanyLogo("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80");
        internshipRepository.save(intern5);

        // 5. Pre-seed Applications for Harshitha
        Application app1 = new Application(
                student1,
                intern1,
                "I am thrilled to apply for the Full-Stack Java Engineer Intern role at Google Cloud. My extensive projects in Spring Boot and React align closely with your technology stack.",
                profile1.getResumeUrl()
        );
        app1.setStatus(Application.Status.INTERVIEW_SCHEDULED);
        app1.setCoordinatorFeedback("Shortlisted for Technical Round 1! Interview link sent via email.");
        app1.setInterviewSchedule(LocalDateTime.now().plusDays(3).withHour(14).withMinute(0));
        applicationRepository.save(app1);

        Application app2 = new Application(
                student1,
                intern2,
                "With deep interest in scalable frontend UI systems and component-driven architecture, I look forward to contributing to Microsoft 365.",
                profile1.getResumeUrl()
        );
        app2.setStatus(Application.Status.UNDER_REVIEW);
        app2.setCoordinatorFeedback("Profile currently being evaluated by Engineering Lead.");
        applicationRepository.save(app2);

        // Pre-seed Application for Aarav
        Application app3 = new Application(
                student2,
                intern5,
                "Excited to apply for NVIDIA AI Research internship focusing on model acceleration.",
                null
        );
        app3.setStatus(Application.Status.SHORTLISTED);
        app3.setCoordinatorFeedback("Shortlisted based on strong machine learning project credentials.");
        applicationRepository.save(app3);

        // 6. Notifications for Harshitha
        notificationRepository.save(new Notification(
                student1,
                "Interview Scheduled: Google Cloud",
                "Your technical interview for 'Full-Stack Java Software Engineer Intern' is scheduled on " +
                        app1.getInterviewSchedule().toLocalDate() + " at 2:00 PM IST.",
                Notification.Type.APPLICATION_UPDATE,
                "/applications"
        ));

        notificationRepository.save(new Notification(
                student1,
                "New Matching Internship Found!",
                "Google Cloud has posted an opening matching 95% of your registered skills.",
                Notification.Type.NEW_INTERNSHIP,
                "/internships"
        ));

        notificationRepository.save(new Notification(
                student1,
                "Certification Verified!",
                "Your AWS Certified Cloud Practitioner credential has been verified by coordinator Dr. Rajesh Sharma.",
                Notification.Type.CERTIFICATION_STATUS,
                "/certifications"
        ));
    }
}
