# Fix Cart Schema - PowerShell Script
# This script fixes the Cart_item table to use customer_id approach

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "FIX CART SCHEMA" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get MySQL credentials
$mysqlUser = Read-Host "Enter MySQL username (default: root)"
if ([string]::IsNullOrWhiteSpace($mysqlUser)) {
    $mysqlUser = "root"
}

$securePassword = Read-Host "Enter MySQL password" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
$mysqlPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

Write-Host ""
Write-Host "Warning: This will drop the Cart_item and Cart tables!" -ForegroundColor Yellow
Write-Host "All current cart data will be lost." -ForegroundColor Yellow
$confirm = Read-Host "Do you want to continue? (yes/no)"

if ($confirm -ne "yes") {
    Write-Host "Operation cancelled." -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "Fixing cart schema..." -ForegroundColor Green

# Run the fix script
$env:MYSQL_PWD = $mysqlPassword
try {
    mysql -u $mysqlUser -e "source queries/fix_cart_schema.sql"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "Cart schema fixed successfully!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. Restart your Node.js server" -ForegroundColor White
        Write-Host "2. Test adding items to cart" -ForegroundColor White
        Write-Host "3. Cart data has been cleared" -ForegroundColor White
    } else {
        Write-Host "Error fixing cart schema!" -ForegroundColor Red
    }
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
} finally {
    $env:MYSQL_PWD = ""
}

Write-Host ""
Read-Host "Press Enter to exit"
