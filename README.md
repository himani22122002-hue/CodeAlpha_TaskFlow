
TaskFlow
Full-Stack Project Management System

A modern full-stack project management application built with React, Node.js, Express, and MongoDB that enables users to efficiently manage projects, tasks, and team collaboration through a clean and responsive dashboard.

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-38BDF8?style=for-the-badge&logo=tailwindcss)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange?style=for-the-badge)

</div>


Overview

TaskFlow is a modern project management platform that helps users organize projects, manage tasks, monitor progress, and collaborate through comments.

The application provides secure authentication, an intuitive dashboard, responsive UI, and complete CRUD operations for projects and tasks.

Features
Authentication

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Secure Password Hashing using bcrypt
Dashboard

- Project Statistics
- Active Tasks
- Completed Tasks
- Recent Activity
- Quick Action Buttons
- Responsive Dashboard Layout
Project Management

- Create Project
- Update Project
- Delete Project
- Search Projects
- Filter by Status
- Project Details Page
Task Management

- Create Task
- Edit Task
- Delete Task
- Task Status
- Task Priority
- Due Date
- Search Tasks
- Filter Tasks

Comments

- Add Comments
- Delete Comments
- Comment History
- Task Discussion

Modern UI

- Responsive Design
- Sidebar Navigation
- Sticky Header
- Dashboard Cards
- Progress Bars
- Loading Skeletons
- Empty States
- Confirmation Modals
- Toast Notifications
- Smooth Animations

Tech Stack

| Frontend | Backend | Database |
|----------|----------|-----------|
| React.js | Node.js | MongoDB |
| Vite | Express.js | Mongoose |
| React Router | JWT | |
| Axios | bcrypt | |
| Tailwind CSS | REST API | |
| React Icons | | |
| Framer Motion | | |
| React Hot Toast | | |

Project Structure
TaskFlow
│
├── client
│   ├── src
│   │   ├── api
│   │   ├── assets
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── server
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── server.js
│   └── package.json
│
└── README.md


 Installation

1. Clone Repository

bash
git clone https://github.com/YOUR_USERNAME/CodeAlpha_TaskFlow.git

cd CodeAlpha_TaskFlow

2. Install Backend

bash
cd server

npm install

3. Install Frontend

bash
cd ../client

npm install

4. Create Environment Variables

Inside server/.env

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

 5. Run Backend

bash
cd server

npm run dev

6. Run Frontend

bash
cd client

npm run dev

API Endpoints

Authentication

POST   /api/auth/register

POST   /api/auth/login


 Projects

GET      /api/projects

POST     /api/projects

PUT      /api/projects/:id

DELETE   /api/projects/:id
Tasks

GET      /api/tasks

POST     /api/tasks

PUT      /api/tasks/:id

DELETE   /api/tasks/:id
Comments

GET      /api/comments/:taskId

POST     /api/comments

DELETE   /api/comments/:id

- Drag & Drop Kanban Board
- Team Collaboration
- User Profile
- File Attachments
- Email Notifications
- Real-Time Updates using Socket.io
- Dark Mode

# 📄 License

This project was developed as part of the **CodeAlpha Full Stack Development Internship** and is intended for learning, portfolio, and demonstration purposes.

---

<div align="center">

### ⭐ If you like this project, consider giving it a Star on GitHub!

</div>