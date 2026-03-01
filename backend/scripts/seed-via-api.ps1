# PowerShell script to seed products into Firestore via REST API
# Requirement: Firebase Web API Key

$PROJECT_ID = "paint-by-numbers-ai-607c4"
$WEB_API_KEY = "AIzaSyCVJNcvjl7gDx6dNp8lsC-J_w9Bb-dMdPg"
$ADMIN_EMAIL = "baody613@gmail.com"
$ADMIN_PASSWORD = Read-Host "Enter admin password" -AsSecureString
$ADMIN_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($ADMIN_PASSWORD))

Write-Host ""
Write-Host "Logging in with admin account..." -ForegroundColor Cyan

# Login to get ID token
$loginUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=$WEB_API_KEY"
$loginBody = @{
    email = $ADMIN_EMAIL
    password = $ADMIN_PASSWORD
    returnSecureToken = $true
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri $loginUrl -Method Post -Body $loginBody -ContentType "application/json"
    $idToken = $loginResponse.idToken
    Write-Host "Login successful!" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "Login error: $_" -ForegroundColor Red
    exit 1
}

# Read products data
$productsJson = Get-Content "scripts\products-seed-data.json" -Raw | ConvertFrom-Json

Write-Host "Seeding $($productsJson.Count) products..." -ForegroundColor Cyan
Write-Host ""

$successCount = 0
$errorCount = 0

foreach ($product in $productsJson) {
    try {
        # Call backend API to create product
        $apiUrl = "http://localhost:3001/api/admin/products"
        $headers = @{
            "Authorization" = "Bearer $idToken"
            "Content-Type" = "application/json"
        }
        
        $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Headers $headers -Body ($product | ConvertTo-Json -Depth 10)
        
        $currentNum = $successCount + 1
        Write-Host "[OK] [$currentNum/$($productsJson.Count)] $($product.title)" -ForegroundColor Green
        $successCount++
    } catch {
        Write-Host "[ERROR] $($product.title) - $($_.Exception.Message)" -ForegroundColor Red
        $errorCount++
    }
}

Write-Host ""
Write-Host "RESULTS:" -ForegroundColor Yellow
Write-Host "  Success: $successCount products" -ForegroundColor Green
Write-Host "  Failed: $errorCount products" -ForegroundColor Red

if ($successCount -gt 0) {
    Write-Host ""
    Write-Host "Seed completed! Check at:" -ForegroundColor Green
    Write-Host "  - API: http://localhost:3001/api/products" -ForegroundColor Cyan
    Write-Host "  - Frontend: http://localhost:3000/gallery" -ForegroundColor Cyan
    Write-Host "  - Firestore: https://console.firebase.google.com/project/$PROJECT_ID/firestore" -ForegroundColor Cyan
}
