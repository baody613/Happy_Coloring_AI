# Paint by Numbers AI - Firebase Deployment Script
# Usage:
#   .\deploy.ps1                    # Deploy both frontend and backend
#   .\deploy.ps1 -Target frontend   # Deploy frontend only
#   .\deploy.ps1 -Target backend    # Deploy backend only

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("all", "frontend", "backend")]
    [string]$Target = "all",
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipBuild = $false
)

$ErrorActionPreference = "Stop"

# Paths
$FirebaseProject = "paint-by-numbers-ai-607c4"
$FrontendPath = Join-Path $PSScriptRoot "frontend"
$BackendPath = Join-Path $PSScriptRoot "backend"
$FunctionsPath = Join-Path $PSScriptRoot "functions"

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  Paint by Numbers AI - Firebase Deploy" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Check Firebase CLI
Write-Host "[*] Checking Firebase CLI..." -ForegroundColor Cyan
$firebaseCmd = Get-Command firebase -ErrorAction SilentlyContinue
if (-not $firebaseCmd) {
    Write-Host "[X] Firebase CLI not installed!" -ForegroundColor Red
    Write-Host "    Install: npm install -g firebase-tools" -ForegroundColor Yellow
    exit 1
}
Write-Host "[OK] Firebase CLI ready" -ForegroundColor Green
Write-Host ""

# Deploy Frontend
if ($Target -eq "all" -or $Target -eq "frontend") {
    Write-Host "===============================================" -ForegroundColor Cyan
    Write-Host "  DEPLOY FRONTEND - Firebase Hosting" -ForegroundColor Cyan
    Write-Host "===============================================" -ForegroundColor Cyan
    Write-Host ""
    
    if (-not (Test-Path $FrontendPath)) {
        Write-Host "[X] Frontend directory not found!" -ForegroundColor Red
        exit 1
    }
    
    Set-Location $FrontendPath
    Write-Host "[*] Working directory: $FrontendPath" -ForegroundColor Green
    
    # Install dependencies if needed
    if (-not (Test-Path "node_modules")) {
        Write-Host "[*] Installing dependencies..." -ForegroundColor Yellow
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Host "[X] Installation failed!" -ForegroundColor Red
            exit 1
        }
        Write-Host "[OK] Dependencies installed" -ForegroundColor Green
    }
    
    # Build
    if (-not $SkipBuild) {
        Write-Host "[*] Building frontend..." -ForegroundColor Yellow
        npm run build
        if ($LASTEXITCODE -ne 0) {
            Write-Host "[X] Build failed!" -ForegroundColor Red
            exit 1
        }
        Write-Host "[OK] Build successful!" -ForegroundColor Green
    }
    
    # Deploy
    Set-Location $PSScriptRoot
    Write-Host "[*] Deploying to Firebase Hosting..." -ForegroundColor Yellow
    firebase deploy --only hosting --project $FirebaseProject
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "[OK] Frontend deployed successfully!" -ForegroundColor Green
        Write-Host "    URL: https://$FirebaseProject.web.app" -ForegroundColor Cyan
        Write-Host "    Alt: https://$FirebaseProject.firebaseapp.com" -ForegroundColor Cyan
        Write-Host ""
    } else {
        Write-Host "[X] Frontend deployment failed!" -ForegroundColor Red
        exit 1
    }
}

# Deploy Backend
if ($Target -eq "all" -or $Target -eq "backend") {
    Write-Host "===============================================" -ForegroundColor Cyan
    Write-Host "  DEPLOY BACKEND - Firebase Functions" -ForegroundColor Cyan
    Write-Host "===============================================" -ForegroundColor Cyan
    Write-Host ""
    
    if (-not (Test-Path $FunctionsPath)) {
        Write-Host "[*] Creating functions directory..." -ForegroundColor Yellow
        New-Item -ItemType Directory -Force -Path $FunctionsPath | Out-Null
    }
    
    # Copy backend code to functions
    Write-Host "[*] Copying backend code to functions..." -ForegroundColor Yellow
    if (Test-Path "$BackendPath\src") {
        Copy-Item -Path "$BackendPath\src" -Destination $FunctionsPath -Recurse -Force
        Write-Host "[OK] Source code copied" -ForegroundColor Green
    }
    
    Set-Location $FunctionsPath
    
    # Install dependencies
    if (-not (Test-Path "node_modules")) {
        Write-Host "[*] Installing dependencies for Functions..." -ForegroundColor Yellow
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Host "[X] Installation failed!" -ForegroundColor Red
            exit 1
        }
        Write-Host "[OK] Dependencies installed" -ForegroundColor Green
    }
    
    # Deploy
    Set-Location $PSScriptRoot
    Write-Host "[*] Deploying to Firebase Functions..." -ForegroundColor Yellow
    firebase deploy --only functions --project $FirebaseProject
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "[OK] Backend deployed successfully!" -ForegroundColor Green
        Write-Host "    API URL: https://us-central1-$FirebaseProject.cloudfunctions.net/api" -ForegroundColor Cyan
        Write-Host ""
    } else {
        Write-Host "[X] Backend deployment failed!" -ForegroundColor Red
        exit 1
    }
}

# Final message
Write-Host ""
Write-Host "===============================================" -ForegroundColor Green
Write-Host "  DEPLOYMENT COMPLETED!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host ""

if ($Target -eq "all") {
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Check frontend: https://$FirebaseProject.web.app" -ForegroundColor White
    Write-Host "  2. Test API: https://us-central1-$FirebaseProject.cloudfunctions.net/api/health" -ForegroundColor White
    Write-Host "  3. View logs: firebase functions:log" -ForegroundColor White
    Write-Host ""
}

Set-Location $PSScriptRoot
