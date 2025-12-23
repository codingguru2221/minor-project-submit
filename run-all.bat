@echo off
echo Starting FinTrack Application...

REM Start backend in a new command prompt window
start "FinTrack Backend" cmd /k "cd /d backend && mvn clean install && java -jar target/backend-1.0-SNAPSHOT.jar"

REM Wait a bit for backend to start
timeout /t 5 /nobreak >nul

REM Start frontend in another command prompt window
start "FinTrack Frontend" cmd /k "cd /d frontend && npm install && npm run dev"

echo Both applications are starting!
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5002
echo Access your application at: http://localhost:5002
pause