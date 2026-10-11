# Student Skill & Internship Management System (SSIMS)

A full-stack, enterprise-grade production web application designed to bridge the gap between student competencies, academic credentials, and corporate internship recruitment.

Built strictly according to the abstract specifications using **Spring Boot 3 (Java 21)**, **React 19 (Vite)**, **SQL Database (JPA / Hibernate / H2 / MySQL)**, **JWT Stateless Security**, **Tailwind CSS**, and **Swagger OpenAPI 3**.

---

## 🌟 Key System Capabilities

### 1. Student Portal
- **Profile & Academic Credentials**: Manage Roll number, Degree/Course, Department, Graduation year, Cumulative CGPA, and career objectives.
- **Skills Matrix**: Categorized technical and soft skills (Technical, Frameworks & Tools, Databases, Cloud & DevOps, Soft Skills) with multi-tiered proficiency levels (*Beginner*, *Intermediate*, *Advanced*, *Expert*).
- **Skill Endorsement**: Display of coordinator-verified endorsements to prevent resume exaggeration.
- **Professional Certifications Vault**: Upload certificates (AWS, Oracle, Meta, Google) with credential IDs, verification links, and approval tracking (*Pending*, *Verified*, *Rejected*).
- **Project Portfolio Showcase**: Highlight full-stack, AI, and systems engineering projects with live demos and repository links.
- **Skill-Based Internship Matching Engine**: Intelligent recommendation algorithm that calculates real-time match percentages (%) comparing candidate skills and CGPA against job requirements.
- **1-Click Application Hub**: Apply with personalized statement/cover letter and attached resume.
- **Real-Time Application Status Progression**: Timeline tracking (*Applied* → *Under Review* → *Shortlisted* → *Interview Scheduled* → *Offered* / *Accepted*).
- **Automated In-App Notification Center**: Instant alert delivery upon status changes, interview bookings, and credential approvals.
- **ATS-Optimized Resume Generator & Instant Export**: Generates clean, ATS-compliant, single-page printable/PDF resumes directly from verified profile data.

### 2. Coordinator & Placement Administration Portal
- **Executive Analytics Dashboard**: Real-time KPI metrics for Total Students, Active Listings, Applications Count, and Placement Rate (%).
- **Interactive Visual Distribution**:
  - Top in-demand corporate skills bar breakdown.
  - Recruitment pipeline stage distribution.
  - Academic department candidate enrollment.
- **Internship Opportunity Manager**: Create, edit, toggle active/closed, and publish internship openings with custom eligibility criteria and required skill tags.
- **Candidate Evaluation & Decision Hub**: Filter applications by status or company, schedule technical interview date & time, update pipeline stages, and dispatch direct feedback to students.
- **Student Directory & Verification System**: Inspect candidate portfolios, review pending certifications (Approve / Reject with comments), and endorse student technical skills.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Backend** | Spring Boot 3.3.4, Java 21 LTS, Spring Data JPA, Spring Security 6, JJWT 0.12.6, Hibernate |
| **Frontend** | React 19, Vite, Tailwind CSS, Lucide React, Axios |
| **Database** | SQL Engine: Persistent File H2 Database (`./data/ssimsdb`) with MySQL compatibility, and ready MySQL profile |
| **API Docs & Testing** | Swagger / OpenAPI 3 UI (`/swagger-ui/index.html`), Postman compatible REST APIs |
| **Architecture** | RESTful Stateless Micro-Architecture with Bearer JWT Authentication |

---

## 🚀 Quick Start Guide

### 1. Backend (Spring Boot)
The backend runs on **port 8080** and automatically initializes and seeds realistic demo data.

```bash
cd backend
# Run with discovered Maven 3.10.0:
& "C:\Users\DELL\.maven\maven-3.10.0\bin\mvn.cmd" spring-boot:run
```

- **API Base URL**: `http://localhost:8080/api`
- **Swagger OpenAPI 3 UI**: `http://localhost:8080/swagger-ui/index.html`
- **H2 Database Console**: `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:file:./data/ssimsdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;MODE=MySQL`
  - User: `sa` | Password: *(blank)*

*(Optional: To connect to an external MySQL 8 instance, run with `--spring.profiles.active=mysql`)*

---

### 2. Frontend (React + Vite)
The frontend runs on **port 5173**.

```bash
cd frontend
npm install
npm run dev
```

- Access the web application at: **`http://localhost:5173`**

---

## 🔑 Pre-Configured Demo Accounts

For instant grading and demonstration, click the **"⚡ 1-Click Demo Login"** buttons in the header:

| Role | Email | Password | Pre-seeded Features |
|---|---|---|---|
| **Student** | `student@ssims.edu` | `student123` | Harshitha Rao (CGPA 9.15), 9 Skills, 3 Certifications, 3 Projects, 2 Active Applications, Interview Scheduled |
| **Coordinator / Admin** | `admin@ssims.edu` | `admin123` | Dr. Rajesh Sharma, Full Placement Analytics Dashboard, 5 Active Corporate Openings, Review Hub |
| **Student 2** | `aarav@ssims.edu` | `student123` | Aarav Patel (IT, CGPA 8.72), AI/ML Specialist |

---

## 📡 RESTful API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /api/auth/login` — Authenticate user and return JWT token
- `POST /api/auth/register` — Register student or coordinator account
- `GET /api/auth/me` — Get authenticated session profile

### Student Profile (`/api/student`)
- `GET /api/student/profile` — Get full student profile with skills, certs & projects
- `PUT /api/student/profile` — Update academic credentials & contact info
- `GET /api/student/all` — List all registered students (Coordinator only)
- `GET /api/student/resume` — Structured JSON payload for ATS resume generation

### Skills Matrix (`/api/skills`)
- `GET /api/skills` — Fetch current student's registered skills
- `POST /api/skills` — Add new technical/soft skill
- `PUT /api/skills/{id}` — Modify proficiency or years of experience
- `DELETE /api/skills/{id}` — Remove a skill
- `PATCH /api/skills/{id}/verify` — Coordinator skill endorsement

### Certifications Vault (`/api/certifications`)
- `GET /api/certifications` — Fetch student's certifications
- `GET /api/certifications/all` — Fetch all submissions for review (Coordinator only)
- `POST /api/certifications` — Submit new certificate credential
- `PATCH /api/certifications/{id}/status` — Approve or reject with notes (Coordinator only)

### Projects Portfolio (`/api/projects`)
- `GET /api/projects` — Fetch student projects
- `POST /api/projects` — Add project with tech stack and live links
- `DELETE /api/projects/{id}` — Delete project

### Internship Opportunities (`/api/internships`)
- `GET /api/internships` — Explore open positions (supports `?search=...`)
- `GET /api/internships/recommendations` — Skill-compatibility matching recommendations
- `POST /api/internships` — Post new internship (Coordinator only)
- `PUT /api/internships/{id}` — Update internship details (Coordinator only)
- `DELETE /api/internships/{id}` — Remove opening (Coordinator only)

### Application Pipeline (`/api/applications`)
- `POST /api/applications` — Submit application with cover letter & resume
- `GET /api/applications/my` — Fetch student's submitted applications
- `GET /api/applications/all` — Fetch all candidate applications (Coordinator only)
- `PATCH /api/applications/{id}/status` — Update pipeline stage, schedule interview, add feedback

### Placement Analytics (`/api/analytics`)
- `GET /api/analytics/dashboard` — Aggregated KPI metrics, skill demand, and pipeline funnel

### Real-Time In-App Notifications (`/api/notifications`)
- `GET /api/notifications` — List alerts for logged-in user
- `GET /api/notifications/unread-count` — Real-time badge counter
- `PATCH /api/notifications/{id}/read` — Mark notification read

