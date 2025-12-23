# PowerShell script to run both backend and frontend
Write-Host "Starting FinTrack Application..." -ForegroundColor Green

# Function to run backend
function Start-Backend {
    Write-Host "Starting Java Backend..." -ForegroundColor Yellow
    Set-Location -Path "backend"
    
    # Build the project first
    Write-Host "Building backend..." -ForegroundColor Cyan
    & mvn clean install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Backend built successfully. Starting server..." -ForegroundColor Green
        Start-Process -FilePath "java" -ArgumentList "-jar", "target/backend-1.0-SNAPSHOT.jar"
        Write-Host "Backend started on http://localhost:8080" -ForegroundColor Green
    } else {
        Write-Host "Failed to build backend!" -ForegroundColor Red
        exit 1
    }
}

# Function to run frontend
function Start-Frontend {
    Write-Host "Starting Frontend..." -ForegroundColor Yellow
    Set-Location -Path "frontend"
    
    Write-Host "Installing frontend dependencies if needed..." -ForegroundColor Cyan
    & npm install
    
    Write-Host "Starting frontend development server..." -ForegroundColor Green
    Start-Process -FilePath "npm" -ArgumentList "run", "dev"
    Write-Host "Frontend started on http://localhost:5002" -ForegroundColor Green
}

# Main execution
try {
    # Start backend in a new PowerShell window
    Start-Process -FilePath "powershell" -ArgumentList "-Command", "
        Set-Location -Path '$(Get-Location)\backend';
        Write-Host 'Building backend...' -ForegroundColor Cyan;
        & mvn clean install;
        if (`$LASTEXITCODE -eq 0) {
            Write-Host 'Backend built successfully. Starting server...' -ForegroundColor Green;
            & java -jar target/backend-1.0-SNAPSHOT.jar
        } else {
            Write-Host 'Failed to build backend!' -ForegroundColor Red
        }
    " -WindowStyle Normal

    # Wait a bit for backend to start
    Start-Sleep -Seconds 5

    # Start frontend in another PowerShell window
    Start-Process -FilePath "powershell" -ArgumentList "-Command", "
        Set-Location -Path '$(Get-Location)\frontend';
        Write-Host 'Installing frontend dependencies if needed...' -ForegroundColor Cyan;
        & npm install;
        Write-Host 'Starting frontend development server...' -ForegroundColor Green;
        & npm run dev
    " -WindowStyle Normal

    Write-Host "Both applications are starting!" -ForegroundColor Green
    Write-Host "Backend: http://localhost:8080" -ForegroundColor Cyan
    Write-Host "Frontend: http://localhost:5002" -ForegroundColor Cyan
    Write-Host "Access your application at: http://localhost:5002" -ForegroundColor Green
} catch {
    Write-Host "Error occurred: $($_.Exception.Message)" -ForegroundColor Red
}