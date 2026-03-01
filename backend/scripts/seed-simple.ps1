# Simple seed script - requires manual auth token
# Usage: 
#   1. Login at http://localhost:3000/login with baody613@gmail.com
#   2. Open DevTools > Application > Local Storage
#   3. Copy the "authToken" value
#   4. Run: .\scripts\seed-simple.ps1 "YOUR_TOKEN_HERE"

param(
    [Parameter(Mandatory=$false)]
    [string]$AuthToken
)

if (-not $AuthToken) {
    Write-Host ""
    Write-Host "ERROR: Auth token required!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Steps to get token:" -ForegroundColor Yellow
    Write-Host "  1. Open http://localhost:3000/login" -ForegroundColor White
    Write-Host "  2. Login with: baody613@gmail.com" -ForegroundColor White
    Write-Host "  3. Press F12 > Application > Local Storage" -ForegroundColor White
    Write-Host "  4. Copy 'authToken' value" -ForegroundColor White
    Write-Host "  5. Run: .\scripts\seed-simple.ps1 YOUR_TOKEN" -ForegroundColor White
    Write-Host ""
    exit 1
}

# Read products data
$productsJson = Get-Content "scripts\products-seed-data.json" -Raw | ConvertFrom-Json

Write-Host ""
Write-Host "Seeding $($productsJson.Count) products to Firestore..." -ForegroundColor Cyan
Write-Host ""

$successCount = 0
$errorCount = 0

foreach ($product in $productsJson) {
    try {
        # Call backend API to create product
        $apiUrl = "http://localhost:3001/api/admin/products"
        $headers = @{
            "Authorization" = "Bearer $AuthToken"
            "Content-Type" = "application/json"
        }
        
        $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Headers $headers -Body ($product | ConvertTo-Json -Depth 10)
        
        $currentNum = $successCount + 1
        Write-Host "[OK] [$currentNum/$($productsJson.Count)] $($product.title)" -ForegroundColor Green
        $successCount++
        
        # Small delay to avoid rate limiting
        Start-Sleep -Milliseconds 100
    } catch {
        Write-Host "[ERROR] $($product.title)" -ForegroundColor Red
        Write-Host "  Message: $($_.Exception.Message)" -ForegroundColor Gray
        $errorCount++
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "RESULTS:" -ForegroundColor Yellow
Write-Host "  Success: $successCount products" -ForegroundColor Green
Write-Host "  Failed: $errorCount products" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Cyan

if ($successCount -gt 0) {
    Write-Host ""
    Write-Host "Seed completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Check results at:" -ForegroundColor Cyan
    Write-Host "  - API: http://localhost:3001/api/products" -ForegroundColor White
    Write-Host "  - Gallery: http://localhost:3000/gallery" -ForegroundColor White
    Write-Host "  - Firestore Console: https://console.firebase.google.com/project/paint-by-numbers-ai-607c4/firestore" -ForegroundColor White
    Write-Host ""
}
