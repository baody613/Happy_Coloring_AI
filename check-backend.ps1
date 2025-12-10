# Script kiem tra backend truoc khi deploy

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Backend Pre-Deploy Checker" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$errors = @()
$warnings = @()

# Kiem tra vi tri hien tai
$backendPath = Join-Path $PSScriptRoot "backend"
if (-not (Test-Path $backendPath)) {
    Write-Host "ERROR: Khong tim thay thu muc backend" -ForegroundColor Red
    exit 1
}

Set-Location $backendPath

Write-Host "Dang kiem tra cau truc project..." -ForegroundColor Yellow

# 1. Kiem tra package.json
Write-Host "`n1. Kiem tra package.json..." -ForegroundColor Cyan
if (Test-Path "package.json") {
    $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
    
    if ($packageJson.scripts.start) {
        Write-Host "   OK Script 'start' ton tai: $($packageJson.scripts.start)" -ForegroundColor Green
    } else {
        $errors += "Script 'start' khong ton tai trong package.json"
    }
    
    if ($packageJson.type -eq "module") {
        Write-Host "   OK Type module duoc set dung" -ForegroundColor Green
    } else {
        $warnings += "Package.json nen co 'type': 'module'"
    }
    
    $requiredDeps = @("express", "firebase-admin", "cors", "dotenv")
    foreach ($dep in $requiredDeps) {
        if ($packageJson.dependencies.$dep) {
            Write-Host "   OK Dependency '$dep' co san" -ForegroundColor Green
        } else {
            $errors += "Thieu dependency: $dep"
        }
    }
} else {
    $errors += "Khong tim thay package.json"
}

# 2. Kiem tra file index.js
Write-Host "`n2. Kiem tra src/index.js..." -ForegroundColor Cyan
if (Test-Path "src/index.js") {
    $indexContent = Get-Content "src/index.js" -Raw
    
    if ($indexContent -match '/api/health') {
        Write-Host "   OK Health check endpoint /api/health ton tai" -ForegroundColor Green
    } else {
        $errors += "Khong tim thay health check endpoint /api/health"
    }
    
    if ($indexContent -match '0\.0\.0\.0') {
        Write-Host "   OK Server lang nghe tren 0.0.0.0" -ForegroundColor Green
    } else {
        $errors += "Server nen lang nghe tren 0.0.0.0 cho Render"
    }
    
    if ($indexContent -match 'CORS_ORIGIN') {
        Write-Host "   OK CORS_ORIGIN duoc cau hinh" -ForegroundColor Green
    } else {
        $warnings += "Nen them bien CORS_ORIGIN vao cau hinh CORS"
    }
} else {
    $errors += "Khong tim thay src/index.js"
}

# 3. Kiem tra Firebase config
Write-Host "`n3. Kiem tra Firebase config..." -ForegroundColor Cyan
if (Test-Path "src/config/firebase.js") {
    $firebaseContent = Get-Content "src/config/firebase.js" -Raw
    
    if ($firebaseContent -match 'FIREBASE_PRIVATE_KEY_BASE64') {
        Write-Host "   OK Ho tro FIREBASE_PRIVATE_KEY_BASE64" -ForegroundColor Green
    } else {
        $warnings += "Nen them ho tro FIREBASE_PRIVATE_KEY_BASE64"
    }
} else {
    $errors += "Khong tim thay src/config/firebase.js"
}

# 4. Kiem tra node_modules
Write-Host "`n4. Kiem tra dependencies..." -ForegroundColor Cyan
if (Test-Path "node_modules") {
    Write-Host "   OK node_modules da duoc cai dat" -ForegroundColor Green
} else {
    Write-Host "   WARNING: node_modules chua duoc cai dat" -ForegroundColor Yellow
    $warnings += "Chay 'npm install' truoc khi test"
}

# 5. Kiem tra render.yaml
Write-Host "`n5. Kiem tra render.yaml..." -ForegroundColor Cyan
$renderYaml = Join-Path $PSScriptRoot "render.yaml"
if (Test-Path $renderYaml) {
    Write-Host "   OK File render.yaml ton tai" -ForegroundColor Green
} else {
    $warnings += "Khong tim thay render.yaml"
}

# Tong ket
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "KET QUA KIEM TRA" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if ($errors.Count -eq 0 -and $warnings.Count -eq 0) {
    Write-Host ""
    Write-Host "HOAN HAO! Backend san sang deploy!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Cac buoc tiep theo:" -ForegroundColor Yellow
    Write-Host "1. Dam bao code da duoc commit va push len GitHub" -ForegroundColor White
    Write-Host "2. Chay script encode-firebase-key.ps1 de ma hoa Firebase key" -ForegroundColor White
    Write-Host "3. Tao service tren Render va them environment variables" -ForegroundColor White
    Write-Host "4. Xem huong dan chi tiet trong file RENDER_DEPLOY.md" -ForegroundColor White
    Write-Host ""
    exit 0
} else {
    if ($errors.Count -gt 0) {
        Write-Host ""
        Write-Host "LOI ($($errors.Count)):" -ForegroundColor Red
        foreach ($error in $errors) {
            Write-Host "   - $error" -ForegroundColor Red
        }
    }
    
    if ($warnings.Count -gt 0) {
        Write-Host ""
        Write-Host "CANH BAO ($($warnings.Count)):" -ForegroundColor Yellow
        foreach ($warning in $warnings) {
            Write-Host "   - $warning" -ForegroundColor Yellow
        }
    }
    
    Write-Host ""
    Write-Host "Vui long sua cac loi truoc khi deploy!" -ForegroundColor Red
    Write-Host ""
    exit 1
}
