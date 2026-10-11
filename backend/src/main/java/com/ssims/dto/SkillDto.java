package com.ssims.dto;

import com.ssims.model.Skill;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SkillDto {
    private Long id;

    @NotBlank(message = "Skill name is required")
    private String name;

    @NotNull(message = "Category is required")
    private Skill.Category category;

    @NotNull(message = "Proficiency is required")
    private Skill.Proficiency proficiency;

    private Integer yearsOfExperience = 1;

    public SkillDto() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Skill.Category getCategory() {
        return category;
    }

    public void setCategory(Skill.Category category) {
        this.category = category;
    }

    public Skill.Proficiency getProficiency() {
        return proficiency;
    }

    public void setProficiency(Skill.Proficiency proficiency) {
        this.proficiency = proficiency;
    }

    public Integer getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(Integer yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }
}

