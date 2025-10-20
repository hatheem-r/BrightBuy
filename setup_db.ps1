# Automated Database Setup Script
# Customer ID Approach
param(
    [string]$Password = ""
)

$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "BrightBuy Database Setup" -ForegroundColor Cyan
Write-Host "Customer ID Approach" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

if (-not $Password) {
    $Password = Read-Host "Enter MySQL root password" -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($Password)
    $Password = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
}

Write-Host "🚀 Starting setup..." -ForegroundColor Yellow
Write-Host ""

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
    
    $filePath = "queries\$file"
    if (Test-Path $filePath) {
        $passwordArg = "-p$Password"
        $output = & $mysqlPath -u root $passwordArg -e "SOURCE $filePath" 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  Success" -ForegroundColor Green
        } else {
            Write-Host "  Output:" -ForegroundColor Yellow
            Write-Host $output -ForegroundColor Gray
        }
    } else {
        Write-Host "  File not found: $filePath" -ForegroundColor Red
    }
    
    $fileNum++
    Write-Host ""
}

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Verify setup
Write-Host "Verifying setup..." -ForegroundColor Cyan
$passwordArg = "-p$Password"
& $mysqlPath -u root $passwordArg -e "USE brightbuy; SELECT COUNT(*) as Total_Tables FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'brightbuy';" -t
& $mysqlPath -u root $passwordArg -e "USE brightbuy; DESCRIBE Cart_item;" -t

Write-Host ""
Write-Host "Done! Database brightbuy is ready." -ForegroundColor Green
