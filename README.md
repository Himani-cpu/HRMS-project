# HRMS Lite – Full Stack Employee Management System

## Project Overview

HRMS Lite is a full-stack web application designed to manage employees and their attendance in a simple and efficient way.

The system provides:

Secure JWT-based login

Complete Employee CRUD operations

Attendance tracking per employee

Dashboard statistics

Fully deployed backend (Render) and frontend (Vercel)

This project demonstrates real-world full-stack development using FastAPI and React.

## Tech Stack Used

### Backend

FastAPI – REST API framework

SQLAlchemy – ORM for database handling

SQLite – Database

JWT Authentication – Secure login system

Uvicorn – ASGI server

### Frontend

React (Vite) – UI framework

React Router – Navigation & protected routes

Fetch API – Backend communication

Basic CSS styling – Clean UI

### Deployment

Render → Backend hosting

Vercel → Frontend hosting

GitHub → Source code management

## Steps to Run the Project Locally

### Clone the repository
git clone https://github.com/YOUR-USERNAME/HRMS-project.git
cd HRMS-project

### Run Backend 
cd backend
python -m venv venv
venv\Scripts\activate      # Windows
pip install -r requirements.txt
uvicorn main:app --reload

### Run Frontend
cd frontend
npm install
npm run dev

### Default Login Credentials
Username: admin
Password: admin123


## Assumptions / Limitations

Uses SQLite, not production cloud DB.

Passwords are stored without hashing (for learning/demo only).

Only single admin user supported.

No role-based access control.

No email/password reset system.

Basic UI (not fully styled production design).
