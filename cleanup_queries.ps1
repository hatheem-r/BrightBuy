# BrightBuy Queries Cleanup Script
# Removes conflicting Cart Table approach files

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "BrightBuy Queries Cleanup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "This will DELETE the following files:" -ForegroundColor Yellow
Write-Host ""
Write-Host "CONFLICTING SCHEMA FILES:" -ForegroundColor Red
Write-Host "  - schema.sql (Cart table approach)"
Write-Host "  - schema_fixed.sql (Cart table approach)"
Write-Host ""
Write-Host "CART TABLE PROCEDURES:" -ForegroundColor Red
Write-Host "  - cart-procedures.sql (old/broken)"
Write-Host "  - migration_cart_procedures.sql (cart table approach)"
Write-Host ""
Write-Host "MIGRATION FILES:" -ForegroundColor Red
Write-Host "  - alter_cart_item_to_customer.sql (not needed)"
Write-Host "  - setup_cart_images.sql (obsolete)"
Write-Host ""
Write-Host "TEST/DUPLICATE FILES:" -ForegroundColor Red
Write-Host "  - test.sql"
Write-Host "  - SETUP_CUSTOMER_APPROACH.sql"
Write-Host "  - brightbuy-2.session.sql"
Write-Host "  - cart_procedures_customer.sql (has @block issues, keeping _clean version)"
Write-Host ""

$response = Read-Host "Continue with cleanup? (Y/N)"

if ($response -ne "Y" -and $response -ne "y") {
    Write-Host "Cleanup cancelled." -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "Starting cleanup..." -ForegroundColor Cyan
Write-Host ""

$filesToDelete = @(
    "queries\schema.sql",
    "queries\schema_fixed.sql",
    "queries\cart-procedures.sql",
    "queries\migration_cart_procedures.sql",
    "queries\alter_cart_item_to_customer.sql",
    "queries\setup_cart_images.sql",
    "queries\test.sql",
    "queries\SETUP_CUSTOMER_APPROACH.sql",
    "queries\brightbuy-2.session.sql",
    "queries\cart_procedures_customer.sql"
)

$deletedCount = 0
$notFoundCount = 0

foreach ($file in $filesToDelete) {
    if (Test-Path $file) {
        Write-Host "[DELETING] $file" -ForegroundColor Yellow
        Remove-Item $file -Force
        $deletedCount++
    } else {
        Write-Host "[NOT FOUND] $file" -ForegroundColor Gray
        $notFoundCount++
    }
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Cleanup Complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Files deleted: $deletedCount" -ForegroundColor White
Write-Host "Files not found: $notFoundCount" -ForegroundColor Gray
Write-Host ""
Write-Host "Remaining files in queries folder:" -ForegroundColor Green
Write-Host ""
Get-ChildItem "queries\*.sql" | Select-Object Name, @{Name="Size";Expression={"{0:N1} KB" -f ($_.Length/1KB)}} | Format-Table -AutoSize

Write-Host ""
Write-Host "Expected files (7 total):" -ForegroundColor Cyan
Write-Host "  1. schema_customer_approach.sql" -ForegroundColor White
Write-Host "  2. cart_procedures_customer_clean.sql" -ForegroundColor White
Write-Host "  3. recreate_users_table.sql" -ForegroundColor White
Write-Host "  4. population.sql" -ForegroundColor White
Write-Host "  5. populate-2.sql" -ForegroundColor White
Write-Host "  6. create_staff_account.sql" -ForegroundColor White
Write-Host "  7. allow_backorders.sql" -ForegroundColor White
Write-Host ""
