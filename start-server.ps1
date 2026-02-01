# Triplane Travel Agency - Start Server
# Run this in PowerShell terminal 1

Write-Host "🚀 Starting Triplane Server..." -ForegroundColor Cyan
Write-Host ""

# Navigate to server directory
Set-Location -Path "c:\Users\arunv\Desktop\Triplane\server"

# Check if .env exists
if (-Not (Test-Path ".env")) {
    Write-Host "⚠️  WARNING: .env file not found!" -ForegroundColor Yellow
    Write-Host "Please configure your .env file with MongoDB and Cloudinary credentials." -ForegroundColor Yellow
    Write-Host ""
    exit
}

# Check if node_modules exists
if (-Not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "🔧 Starting server on http://localhost:5000" -ForegroundColor Green
Write-Host "📊 API endpoints available at http://localhost:5000/api" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host ""

# Start the development server
npm run dev
