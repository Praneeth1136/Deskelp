# Deskelp — IT Helpdesk Ticketing System

A production-ready full-stack IT service desk web application with a **Java REST API backend** (Servlets, JDBC, MySQL, JWT, BCrypt) and a **modern React (Vite + Tailwind CSS)** Single Page Application.

The application implements strict role-based access control (RBAC), priority-based SLA calculation, ticket assignment workflows, resolution verification, and an audited status history timeline for **Employees**, **Support Agents**, and **Administrators**.

---

## 🚀 Technology Stack

### Backend
- **Java 17** (Standard OOP, Layered Architecture)
- **Java Servlets** (Stateless REST JSON endpoints)
- **JDBC & MySQL 8** (Prepared statements, connection management, transactions)
- **JWT (JSON Web Tokens)** via Auth0 `java-jwt` (Stateless token authentication)
- **jBCrypt** (Industry-standard password hashing with random salt)
- **Jackson** (JSON serialization & deserialization)
- **CORS Filter** (Full cross-origin support for SPA frontend)

### Frontend
- **React 18** (Functional components, custom hooks, Context API)
- **Vite** (Next-generation lightning-fast build tool)
- **React Router v6** (Nested routes, role-based Protected Routes)
- **Tailwind CSS** (Custom responsive design replicating enterprise IT desk)
- **Axios** (Configured interceptors for automatic JWT header injection and 401 handling)

---

## 📋 Ticket Lifecycle & Business Rules

```text
OPEN  ──(Admin Assigns)──>  ASSIGNED  ──(Agent Starts)──>  IN_PROGRESS
                                                                 │
                                                          (Agent Resolves)
                                                                 │
                                                                 ▼
CLOSED  <──(Employee Confirms & Closes)──  RESOLVED
```

### SLA Targets (Auto-calculated on creation)
| Priority | SLA Resolution Window |
|---|---|
| **Critical** | **4 hours** |
| **High** | **8 hours** |
| **Medium** | **24 hours** |
| **Low** | **48 hours** |

---

## 👥 Role Workflows

### 1. Employee
- Register account with instant BCrypt credential hashing.
- Submit tickets with category (`HARDWARE`, `SOFTWARE`, `NETWORK`, `ACCOUNT_ACCESS`, `OTHER`) and priority.
- View personal tickets with real-time status and SLA countdown badges.
- Post comments and collaborate with assigned IT agents.
- Verify resolution and confirm ticket closure.

### 2. Support Agent
- Access assigned queue ordered by priority (Critical & High at top).
- Advance tickets from `ASSIGNED` &rarr; `IN_PROGRESS` &rarr; `RESOLVED`.
- Troubleshoot issues and communicate via threaded ticket comments.

### 3. Administrator
- View system-wide dashboard metrics (Total, Open, In Progress, Resolved).
- Oversee global ticket registry with live SLA compliance badges.
- Assign unassigned `OPEN` tickets to available support specialists.
- Inspect complete status audit trail for any ticket.

---

## 🛠️ Quick Start & Running the Project

### Prerequisites
1. **Java JDK 17+**
2. **Node.js 18+** & npm
3. **MySQL 8** running locally

### Step 1: Database Setup
1. Open your MySQL client (e.g. MySQL Workbench).
2. Execute [`database/schema.sql`](database/schema.sql) to create the schema and tables.
3. Execute [`database/sample-data.sql`](database/sample-data.sql) for initial sample records.
4. Execute [`database/migrate-passwords.sql`](database/migrate-passwords.sql) to update sample accounts to BCrypt.

Configure credentials in [`src/main/resources/db.properties`](src/main/resources/db.properties):
```properties
db.url=jdbc:mysql://localhost:3306/helpdesk_system?useSSL=false&serverTimezone=Asia/Kolkata
db.username=root
db.password=root
```

### Step 2: Start the Java Backend
Double-click `run-backend.bat` or run:
```bash
mvn cargo:run
```
> Backend runs at: `http://localhost:8080/helpdesk-ticket-system`  
> REST API base: `http://localhost:8080/helpdesk-ticket-system/api`

### Step 3: Start the React Frontend
Double-click `run-frontend.bat` or run:
```bash
cd frontend
npm run dev
```
> Open your browser at: **`http://localhost:5173`**

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@helpdesk.com` | `admin123` |
| **Support Agent** | `agent@helpdesk.com` | `agent123` |
| **Employee** | Register a new account or use any employee record | Any 6+ char password |

---

## 📄 Resume Project Description (MERN / Full-Stack Developer)

> **Deskelp — IT Helpdesk Ticketing System (Java & React)**
> - Engineered an enterprise IT helpdesk ticketing web application managing support lifecycles across Employee, Agent, and Administrator roles with automated SLA deadline tracking.
> - Developed stateless Java REST API backends using Java Servlets, JDBC, and MySQL; implemented JWT token authentication and salted BCrypt password security.
> - Built a responsive Single Page Application (SPA) using React 18, Vite, React Router v6, and Tailwind CSS; structured centralized authentication via React Context and Axios interceptors.
> - Architected database transactions for thread-safe ticket assignment and atomic audit trail history logging in MySQL.
