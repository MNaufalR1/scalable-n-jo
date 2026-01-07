Write-Host "Testing application..." -ForegroundColor Cyan
1..10 | ForEach-Object {
    $r = Invoke-RestMethod "http://localhost:8080/"
    Write-Host "Request $_ : Container $($r.container_id.Substring(0,8))" -ForegroundColor Green
}
Write-Host "`n✓ Test complete!" -ForegroundColor Green
