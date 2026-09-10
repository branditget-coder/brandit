# BrandIt 🚀 — Professional Personal Branding & Career Consulting Platform

<div align="center">

[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Bundler-Vite%205-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Material UI](https://img.shields.io/badge/UI-Material--UI%20%2B%20Framer%20Motion-007FFF?logo=mui&logoColor=white)](https://mui.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**An end-to-end modern personal branding, LinkedIn advisory, and 1-on-1 career consulting platform designed to help executives, students, and professionals elevate their digital presence.**

[Live Demo](https://go-brandit.vercel.app/) • [Report Bug](https://github.com/raghavdhir1510/BrandIt/issues) • [Request Feature](https://github.com/raghavdhir1510/BrandIt/issues)

</div>

---

## 🌟 Overview

**BrandIt** is a full-stack digital personal branding and executive consulting platform. It allows clients to book personalized LinkedIn optimization, account building, and strategic advisory sessions. It features a modern glassmorphism UI, real-time consultation slot management, multi-role access control, secure authentication, and an administrative suite for managing users, revenue, and offline/walk-in transactions.

---

## ✨ Key Features

### 👤 Client-Facing Experience
- **Tailored Consultation Packages**:
  - **₹129**: Profile Setup + Account Building Advice (Kickstart Audit)
  - **₹249**: LinkedIn Consulting & Advisory (Growth & Content Strategy)
  - **₹349**: Profile Setup + Personal Branding (Authority & Positioning)
  - **₹499**: Branding + Network Growth Engine (End-to-End Executive Brand)
- **Interactive Booking Engine**:
  - Live public calendar slot availability check.
  - Seamless appointment scheduling with preferred dates and times.
  - Instant Google Meet invite generation and email confirmations.
- **Transparent Payment Options**:
  - 🌐 **Through Website**: Fast online booking & UPI checkout.
  - 💵 **Offline Cash in Person**: In-person walk-ins and offline client records.
- **Client Portal**:
  - View upcoming and completed consultations.
  - Download branded tax invoices and transaction receipts.
  - Access personalized profile audit reports.

---

### 🛡️ Administrative & Team Suite (`/admin`)
- **Full Booking Management (CRUD)**:
  - Create manual bookings for offline/walk-in clients with auto-provisioned accounts.
  - Edit session dates, times, consultation plans, amounts, and meeting links.
  - Fast status updates (`CONFIRMED`, `PENDING`, `COMPLETED`, `CANCELLED`).
  - Delete obsolete records with double-confirmation safeguards.
  - Live search and filtering by payment method and status.
- **Role-Categorized User Directory**:
  - Segmented user cards for **Admins**, **Team Members**, and **Standard Clients**.
  - Admin controls for role elevation, profile edits, password resets, and account deletion.
- **Analytics & Revenue Visualizations**:
  - Realistic monthly and weekly revenue charts, conversion tracking, and session pipeline metrics.
- **Activity & Audit Logging**:
  - Automated activity trail tracking administrative changes and user onboarding events.

---

### 🎨 Modern UI & Responsive Architecture
- **Aesthetic Glassmorphism**: Frosted glass panels, dynamic lighting mesh, and smooth micro-animations powered by **Framer Motion**.
- **100% Mobile & Tablet Compatible**:
  - Adaptive dual-mode interface: Desktop structured grid tables and mobile-native touch cards on smartphone screens.
  - Zero layout shifts with vector SVG iconography.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 5](https://vitejs.dev/)
- **UI Components**: [Material-UI (MUI v5)](https://mui.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts & Visualizations**: [Recharts](https://recharts.org/)
- **Icons**: [React Icons (Feather Icons)](https://react-icons.github.io/react-icons/)
- **HTTP Client**: [Axios](https://axios-http.com/)

### Backend
- **Framework**: [Spring Boot 3](https://spring.io/projects/spring-boot) (Java 21)
- **Security**: [Spring Security](https://spring.io/projects/spring-security) with Stateless JWT Authentication & Role-Based Access Control (RBAC)
- **Database / ORM**: [PostgreSQL](https://www.postgresql.org/) with [Spring Data JPA](https://spring.io/projects/spring-data-jpa) & Hibernate
- **Email Service**: JavaMailSender with automated HTML templates
- **Validation**: Jakarta Bean Validation API

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or newer) & **npm**
- **JDK 21** & **Maven 3.8+**
- **PostgreSQL** instance

---

### 1. Clone the Repository
```bash
git clone https://github.com/raghavdhir1510/BrandIt.git
cd BrandIt
```

---

### 2. Backend Setup
```bash
cd backend

# Configure database & JWT secrets in src/main/resources/application.properties

# Build the project
mvn clean package -DskipTests

# Run the backend
mvn spring-boot:run
```
*Backend runs by default at `http://localhost:8080`.*

---

### 3. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
*Frontend runs by default at `http://localhost:5173`.*

---

## 🔒 Security Highlights
- Stateless JWT authentication with token validation filters.
- Strict Role-Based Access Control (`ROLE_ADMIN`, `ROLE_TEAM`, `ROLE_USER`).
- BCrypt password hashing for local accounts.
- Mandatory date-of-birth (DOB) client profile verification.
- Protected admin API routes with Spring `@PreAuthorize`.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Crafted with ❤️ for building impactful personal brands.
</div>
