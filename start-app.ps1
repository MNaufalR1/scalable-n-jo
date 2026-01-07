Set-Location "$env:USERPROFILE\OneDrive\Desktop\scalable-app"
Write-Host "Starting Scalable Application..." -ForegroundColor Cyan
docker-compose up -d --scale app=5
Write-Host "Waiting..." -ForegroundColor Yellow
Start-Sleep -Seconds 20
docker-compose ps
Start-Process "http://localhost:8080"
Write-Host "`n✓ Application started!" -ForegroundColor Green
