# Simple Database Setup Script
# Customer ID Approach

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "BrightBuy Database Setup" -ForegroundColor Cyan
Write-Host "Customer ID Approach" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Prompt for MySQL path
$defaultPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
Write-Host "MySQL Path (press Enter for default):" -ForegroundColor Yellow
Write-Host "  Default: $defaultPath" -ForegroundColor Gray
$mysqlPath = Read-Host "Path"
if (-not $mysqlPath) {
    $mysqlPath = $defaultPath
}

# Check if MySQL exists
if (-not (Test-Path $mysqlPath)) {
    Write-Host "❌ MySQL not found at: $mysqlPath" -ForegroundColor Red
    exit 1
}

# Prompt for password
$password = Read-Host "Enter MySQL root password"

Write-Host ""
Write-Host "🚀 Starting setup..." -ForegroundColor Yellow
Write-Host ""

# Change to queries directory
Set-Location "queries"

# Execute each file
$files = @(
    "schema_customer_approach.sql",
    "recreate_users_table.sql",
    "cart_procedures_customer.sql",
    "population.sql",
    "populate-2.sql"
)

$fileNum = 1
foreach ($file in $files) {
    Write-Host "[$fileNum/5] Executing $file..." -ForegroundColor Cyan
    
    if (Test-Path $file) {
        $result = & $mysqlPath -u root "-p$password" -e "SOURCE $file" 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✅ Success" -ForegroundColor Green
        } else {
            Write-Host "  ❌ Error:" -ForegroundColor Red
            Write-Host $result -ForegroundColor Yellow
        }
    } else {
        Write-Host "  ❌ File not found: $file" -ForegroundColor Red
    }
    
    $fileNum++
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan

# Return to parent directory
Set-Location ".."
