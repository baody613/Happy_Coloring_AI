# Script to encode Firebase Private Key to Base64
# For Render deployment

param(
    [Parameter(Mandatory=$false)]
    [string]$ServiceAccountPath = ""
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Firebase Private Key Base64 Encoder" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# If no path provided, ask for it
if ([string]::IsNullOrWhiteSpace($ServiceAccountPath)) {
    Write-Host "Enter path to service account key JSON file:" -ForegroundColor Yellow
    $ServiceAccountPath = Read-Host "Path"
}

# Check if file exists
if (-not (Test-Path $ServiceAccountPath)) {
    Write-Host "ERROR: File not found: $ServiceAccountPath" -ForegroundColor Red
    exit 1
}

try {
    Write-Host ""
    Write-Host "Reading file..." -ForegroundColor Green
    
    # Read JSON file
    $serviceAccount = Get-Content $ServiceAccountPath -Raw | ConvertFrom-Json
    
    # Get required information
    $projectId = $serviceAccount.project_id
    $clientEmail = $serviceAccount.client_email
    $privateKey = $serviceAccount.private_key
    $storageBucket = "$projectId.appspot.com"
    
    # Encode private key to Base64
    $privateKeyBytes = [System.Text.Encoding]::UTF8.GetBytes($privateKey)
    $base64PrivateKey = [Convert]::ToBase64String($privateKeyBytes)
    
    Write-Host "SUCCESS: Encoded successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "RENDER ENVIRONMENT VARIABLES" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "Copy these lines to Render Environment Variables:" -ForegroundColor Yellow
    Write-Host ""
    
    Write-Host "FIREBASE_PROJECT_ID=" -NoNewline -ForegroundColor White
    Write-Host $projectId -ForegroundColor Green
    
    Write-Host "FIREBASE_CLIENT_EMAIL=" -NoNewline -ForegroundColor White
    Write-Host $clientEmail -ForegroundColor Green
    
    Write-Host "FIREBASE_STORAGE_BUCKET=" -NoNewline -ForegroundColor White
    Write-Host $storageBucket -ForegroundColor Green
    
    Write-Host "FIREBASE_PRIVATE_KEY_BASE64=" -NoNewline -ForegroundColor White
    Write-Host $base64PrivateKey -ForegroundColor Green
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    
    # Ask to copy to clipboard
    Write-Host ""
    Write-Host "Copy FIREBASE_PRIVATE_KEY_BASE64 to clipboard? (Y/N)" -ForegroundColor Yellow
    $copyToClipboard = Read-Host
    
    if ($copyToClipboard -eq "Y" -or $copyToClipboard -eq "y") {
        $base64PrivateKey | Set-Clipboard
        Write-Host "SUCCESS: Copied to clipboard!" -ForegroundColor Green
    }
    
    # Create output file
    $outputFile = Join-Path $PSScriptRoot "render-env-vars.txt"
    $envVars = @"
# Render Environment Variables
# Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

FIREBASE_PROJECT_ID=$projectId
FIREBASE_CLIENT_EMAIL=$clientEmail
FIREBASE_STORAGE_BUCKET=$storageBucket
FIREBASE_PRIVATE_KEY_BASE64=$base64PrivateKey
"@
    
    $envVars | Out-File -FilePath $outputFile -Encoding UTF8
    Write-Host ""
    Write-Host "SUCCESS: Saved to file: $outputFile" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "IMPORTANT NOTES" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "1. Do not share this file with anyone" -ForegroundColor Red
    Write-Host "2. Delete the file after adding to Render" -ForegroundColor Red
    Write-Host "3. Make sure to add other required variables:" -ForegroundColor Yellow
    Write-Host "   - NODE_ENV=production" -ForegroundColor White
    Write-Host "   - PORT=10000" -ForegroundColor White
    Write-Host "   - CORS_ORIGIN=<frontend-url>" -ForegroundColor White
    Write-Host "   - JWT_SECRET=<random-string>" -ForegroundColor White
    Write-Host "   - REPLICATE_API_TOKEN=<token>" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
    exit 1
}
