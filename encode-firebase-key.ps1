# Script để mã hóa Firebase Private Key thành Base64
# Sử dụng cho Render deployment

param(
    [Parameter(Mandatory=$false)]
    [string]$ServiceAccountPath = ""
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Firebase Private Key Base64 Encoder" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Nếu không có path, yêu cầu nhập
if ([string]::IsNullOrWhiteSpace($ServiceAccountPath)) {
    Write-Host "Nhập đường dẫn đến file service account key (JSON):" -ForegroundColor Yellow
    $ServiceAccountPath = Read-Host "Path"
}

# Kiểm tra file có tồn tại không
if (-not (Test-Path $ServiceAccountPath)) {
    Write-Host "❌ Không tìm thấy file: $ServiceAccountPath" -ForegroundColor Red
    exit 1
}

try {
    Write-Host ""
    Write-Host "Đang đọc file..." -ForegroundColor Green
    
    # Đọc file JSON
    $serviceAccount = Get-Content $ServiceAccountPath -Raw | ConvertFrom-Json
    
    # Lấy các thông tin cần thiết
    $projectId = $serviceAccount.project_id
    $clientEmail = $serviceAccount.client_email
    $privateKey = $serviceAccount.private_key
    $storageBucket = "$projectId.appspot.com"
    
    # Mã hóa private key thành Base64
    $privateKeyBytes = [System.Text.Encoding]::UTF8.GetBytes($privateKey)
    $base64PrivateKey = [Convert]::ToBase64String($privateKeyBytes)
    
    Write-Host "✅ Đã mã hóa thành công!" -ForegroundColor Green
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "CÁC BIẾN MÔI TRƯỜNG CHO RENDER" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "Copy các dòng sau vào Render Environment Variables:" -ForegroundColor Yellow
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
    
    # Lưu vào clipboard nếu có thể
    Write-Host ""
    Write-Host "Bạn có muốn copy FIREBASE_PRIVATE_KEY_BASE64 vào clipboard không? (Y/N)" -ForegroundColor Yellow
    $copyToClipboard = Read-Host
    
    if ($copyToClipboard -eq "Y" -or $copyToClipboard -eq "y") {
        $base64PrivateKey | Set-Clipboard
        Write-Host "✅ Đã copy vào clipboard!" -ForegroundColor Green
    }
    
    # Tạo file output
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
    Write-Host "✅ Đã lưu vào file: $outputFile" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "LƯU Ý" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "1. Không chia sẻ file này với bất kỳ ai" -ForegroundColor Red
    Write-Host "2. Xóa file sau khi đã thêm vào Render" -ForegroundColor Red
    Write-Host "3. Đảm bảo thêm tất cả các biến khác:" -ForegroundColor Yellow
    Write-Host "   - NODE_ENV=production" -ForegroundColor White
    Write-Host "   - PORT=10000" -ForegroundColor White
    Write-Host "   - CORS_ORIGIN=<frontend-url>" -ForegroundColor White
    Write-Host "   - JWT_SECRET=<random-string>" -ForegroundColor White
    Write-Host "   - REPLICATE_API_TOKEN=<token>" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host "❌ Lỗi: $_" -ForegroundColor Red
    exit 1
}
