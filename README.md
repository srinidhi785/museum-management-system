# Museum Management System

A full-stack Museum Management System built using React, FastAPI, PostgreSQL, and SQLAlchemy.

## 📌 Project Purpose

The purpose of this project is to provide a simple web-based system for managing museum information such as artists and artworks.

The application demonstrates how a React frontend can communicate with a FastAPI backend and store structured data in a PostgreSQL database.

## 🚀 Features

* User authentication/login
* Museum dashboard
* View artists
* View artworks
* Add artist records
* Add artwork records
* Delete artist records
* Delete artwork records
* PostgreSQL database integration
* Dataset loading from CSV files
* REST API using FastAPI
* React-based frontend
* Docker-based PostgreSQL setup
* Persistent PostgreSQL data storage

## 🛠️ Technologies Used

### Frontend

* React
* Vite
* JavaScript
* HTML
* CSS

### Backend

* Python
* FastAPI
* SQLAlchemy
* Pydantic
* Uvicorn

### Database

* PostgreSQL
* Psycopg2

### DevOps / Environment

* Docker
* Docker Compose

## 📂 Project Structure

```text
museum-management-system/
│
├── backend/
│   ├── dataset/
│   ├── artists.py
│   ├── artworks.py
│   ├── auth.py
│   ├── dashboard.py
│   ├── database.py
│   ├── load_dataset.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml
└── README.md
```

## ⚙️ Prerequisites

Make sure the following are installed:

* Python 3.x
* Node.js
* npm
* Docker Desktop
* Git

## 🗄️ Database Setup

The project uses PostgreSQL through Docker Compose.

From the root project directory, run:

```bash
docker compose up -d
```

This starts the PostgreSQL database container and uses a persistent Docker volume for database storage.

## 🔧 Backend Setup

Open a terminal and move into the backend directory:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment.

### Windows

```bash
venv\Scripts\activate
```

Install the required Python packages:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

The backend will normally be available at:

```text
http://127.0.0.1:8000
```

FastAPI API documentation can be accessed at:

```text
http://127.0.0.1:8000/docs
```

## 🎨 Frontend Setup

Open another terminal and move into the frontend directory:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

## 🔄 Application Flow

```text
User
  ↓
React Frontend
  ↓
FastAPI REST API
  ↓
SQLAlchemy
  ↓
PostgreSQL Database
```

The React frontend sends requests to the FastAPI backend. The backend processes the requests and uses SQLAlchemy to interact with PostgreSQL.

## 📊 Dataset

The project uses museum collection data containing information about artists and artworks.

The dataset is loaded into the PostgreSQL database through the backend dataset-loading functionality.

## 🔐 Authentication

The application includes a login/authentication component to control access to the museum management functionality.

## 🧪 API Testing

FastAPI automatically provides interactive API documentation.

After starting the backend, open:

```text
http://127.0.0.1:8000/docs
```

This can be used to view and test the available API endpoints.

## 🎯 Project Objective

This project was developed to demonstrate a complete full-stack application using:

* React for the user interface
* FastAPI for backend APIs
* PostgreSQL for persistent data storage
* SQLAlchemy for database interaction
* Docker for database containerization

## 👩‍💻 Author

Sri Nidhi

GitHub: https://github.com/srinidhi785
