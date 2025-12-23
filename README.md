# FinTrack Application

This is a personal finance tracking application with a React frontend and Java Spring Boot backend.

## Project Structure

- `backend/` - Java Spring Boot application
- `frontend/` - React application with Vite

## Prerequisites

- Java 17 or higher
- Maven
- Node.js and npm

## Running the Application

### Option 1: Using the Run Scripts (Recommended)

#### Windows PowerShell:
```powershell
.\run-all.ps1
```

#### Windows Command Prompt:
```cmd
run-all.bat
```

### Option 2: Manual Startup

1. **Start the Backend:**
   ```bash
   cd backend
   mvn clean install
   java -jar target/backend-1.0-SNAPSHOT.jar
   ```

2. **Start the Frontend (in a new terminal):**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Access the Application

- Frontend: http://localhost:5002
- Backend API: http://localhost:8080
- H2 Database Console: http://localhost:8080/h2-console (for development)

## Features

- User authentication (registration and login)
- Bank account management
- Transaction tracking
- Saving goals
- Loan tracking
- Responsive UI with modern design

## API Endpoints

- `POST /api/users` - Create a new user
- `GET /api/users/{id}` - Get user by ID
- `POST /api/login` - User login
- `GET /api/banks` - Get all banks
- `GET /api/accounts?userId={id}` - Get accounts for a user
- `POST /api/accounts` - Create a new account
- `PATCH /api/accounts/{id}/link` - Link/unlink an account
- `GET /api/transactions?accountId={id}` - Get transactions for an account
- `GET /api/saving-goals?userId={id}` - Get saving goals for a user
- `GET /api/loans?userId={id}` - Get loans for a user

## Development

The frontend makes API calls to the backend using the `/api` prefix, which are automatically redirected to `http://localhost:8080`.

## Data Storage

The application uses an in-memory H2 database for development purposes. All data will be lost when the backend server is restarted.