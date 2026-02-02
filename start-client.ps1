# Triplane Travel Agency - Start Client
# Run this in PowerShell terminal 2

Write-Host "🌐 Starting Triplane Client..." -ForegroundColor Cyan
Write-Host ""

# Navigate to client directory
Set-Location -Path "c:\Users\arunv\Desktop\Triplane\client"

# Check if node_modules exists
if (-Not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "🎨 Starting Vite development server on http://localhost:3000" -ForegroundColor Green
Write-Host "🌍 Make sure the server is running on http://localhost:5000" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the client" -ForegroundColor Gray
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host ""

# Start the development server
npm run dev
