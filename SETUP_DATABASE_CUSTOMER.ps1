# ============================
# BrightBuy Database Setup Script
# Customer ID Approach
# PowerShell Script
# ============================

param(
    [string]$MySQLPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
    [string]$Username = "root",
    [string]$Password = ""
)

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "BrightBuy Database Setup" -ForegroundColor Cyan
Write-Host "Customer ID Approach" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if MySQL exists
if (-not (Test-Path $MySQLPath)) {
    Write-Host "❌ MySQL not found at: $MySQLPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common MySQL locations:" -ForegroundColor Yellow
    Write-Host "  - C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
    Write-Host "  - C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe"
    Write-Host "  - C:\xampp\mysql\bin\mysql.exe"
    Write-Host ""
    $customPath = Read-Host "Enter full path to mysql.exe (or press Enter to exit)"
    if ($customPath) {
        $MySQLPath = $customPath
    } else {
        exit 1
    }
}

# Prompt for password if not provided
if (-not $Password) {
    $securePassword = Read-Host "Enter MySQL root password" -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
    $Password = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
}

Write-Host ""
Write-Host "📂 Setting up database with following files:" -ForegroundColor Green
Write-Host "  1. schema_customer_approach.sql" -ForegroundColor White
Write-Host "  2. recreate_users_table.sql" -ForegroundColor White
Write-Host "  3. cart_procedures_customer.sql" -ForegroundColor White
Write-Host "  4. population.sql" -ForegroundColor White
Write-Host "  5. populate-2.sql" -ForegroundColor White
Write-Host ""

$queriesPath = "queries"
$files = @(
    "schema_customer_approach.sql",
    "recreate_users_table.sql",
    "cart_procedures_customer.sql",
    "population.sql",
    "populate-2.sql"
)

# Check if all files exist
$allFilesExist = $true
foreach ($file in $files) {
    $filePath = Join-Path $queriesPath $file
    if (-not (Test-Path $filePath)) {
        Write-Host "❌ File not found: $filePath" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if (-not $allFilesExist) {
    Write-Host ""
    Write-Host "❌ Some files are missing. Please ensure all files exist in the queries folder." -ForegroundColor Red
    exit 1
}

Write-Host "✅ All files found!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Starting database setup..." -ForegroundColor Yellow
Write-Host ""

# Execute each file
$fileNumber = 1
foreach ($file in $files) {
    Write-Host "[$fileNumber/$($files.Count)] Executing $file..." -ForegroundColor Cyan
    
    $filePath = Join-Path $queriesPath $file
    
    # Execute the SQL file
    $arguments = @(
        "-u", $Username,
        "-p$Password",
        "-e", "SOURCE $filePath"
    )
    
    try {
        $output = & $MySQLPath $arguments 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✅ Success" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️  Warning or Error:" -ForegroundColor Yellow
            Write-Host $output -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  ❌ Error executing $file" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        exit 1
    }
    
    $fileNumber++
    Write-Host ""
}

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "✅ Database Setup Complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Database: brightbuy" -ForegroundColor White
Write-Host "Cart Approach: customer_id (direct)" -ForegroundColor White
Write-Host ""
Write-Host "📊 Verification Commands:" -ForegroundColor Yellow
Write-Host "  SHOW TABLES;" -ForegroundColor Gray
Write-Host "  DESCRIBE Cart_item;" -ForegroundColor Gray
Write-Host "  SHOW PROCEDURE STATUS WHERE Db = 'brightbuy';" -ForegroundColor Gray
Write-Host ""
Write-Host "🧪 Test Cart Procedures:" -ForegroundColor Yellow
Write-Host "  CALL AddToCart(1, 5, 2);" -ForegroundColor Gray
Write-Host "  CALL GetCustomerCart(1);" -ForegroundColor Gray
Write-Host ""

# Offer to run verification
$verify = Read-Host "Would you like to verify the setup? (Y/N)"
if ($verify -eq "Y" -or $verify -eq "y") {
    Write-Host ""
    Write-Host "Running verification..." -ForegroundColor Cyan
    
    & $MySQLPath -u $Username "-p$Password" -e "USE brightbuy; SHOW TABLES;" -t
    & $MySQLPath -u $Username "-p$Password" -e "USE brightbuy; SELECT COUNT(*) as Total_Tables FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'brightbuy';" -t
    & $MySQLPath -u $Username "-p$Password" -e "USE brightbuy; DESCRIBE Cart_item;" -t
}

Write-Host ""
Write-Host "Done! 🎉" -ForegroundColor Green
