# Triplane Travel Agency - Complete Startup Script
# This will start both server and client in separate PowerShell windows

Write-Host "🚀 Triplane Travel Agency - Starting Application" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host ""

# Check if .env files exist
$serverEnvExists = Test-Path "c:\Users\arunv\Desktop\Triplane\server\.env"
$clientEnvExists = Test-Path "c:\Users\arunv\Desktop\Triplane\client\.env"

if (-Not $serverEnvExists) {
    Write-Host "⚠️  ERROR: server/.env file not found!" -ForegroundColor Red
    Write-Host "Please configure MongoDB and Cloudinary credentials first." -ForegroundColor Yellow
    Write-Host "See SETUP_GUIDE.md for instructions." -ForegroundColor Yellow
    Write-Host ""
    exit
}

if (-Not $clientEnvExists) {
    Write-Host "⚠️  WARNING: client/.env file not found!" -ForegroundColor Yellow
    Write-Host "Using default API URL (http://localhost:5000/api)" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "✅ Configuration files found" -ForegroundColor Green
Write-Host ""
Write-Host "📌 Starting two PowerShell windows:" -ForegroundColor Cyan
Write-Host "   1. Server (Backend) - http://localhost:5000" -ForegroundColor White
Write-Host "   2. Client (Frontend) - http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "⏳ Please wait while the application starts..." -ForegroundColor Yellow
Write-Host ""

# Start server in new PowerShell window
$serverScript = "c:\Users\arunv\Desktop\Triplane\start-server.ps1"
Start-Process powershell -ArgumentList "-NoExit", "-File", $serverScript

# Wait 3 seconds before starting client
Start-Sleep -Seconds 3

# Start client in new PowerShell window
$clientScript = "c:\Users\arunv\Desktop\Triplane\start-client.ps1"
Start-Process powershell -ArgumentList "-NoExit", "-File", $clientScript

Write-Host "✨ Application is starting!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Notes:" -ForegroundColor Cyan
Write-Host "   - Two PowerShell windows will open" -ForegroundColor White
Write-Host "   - Server will start first, then client" -ForegroundColor White
Write-Host "   - Browser will open automatically to http://localhost:3000" -ForegroundColor White
Write-Host "   - Use Ctrl+C in each window to stop the servers" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Happy Coding!" -ForegroundColor Green
Write-Host ""
