Write-Host "Restarting application..." -ForegroundColor Yellow
docker-compose restart
Start-Sleep -Seconds 10
docker-compose ps
Write-Host "`n✓ Restarted" -ForegroundColor Green
