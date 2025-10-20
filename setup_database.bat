@echo off
echo =====================================
echo BrightBuy Database Setup
echo Customer ID Approach
echo =====================================
echo.

set MYSQL_PATH="C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"

set /p PASSWORD="Enter MySQL root password: "

echo.
echo Starting setup...
echo.

cd queries

echo [1/5] Executing schema_customer_approach.sql...
%MYSQL_PATH% -u root -p%PASSWORD% < schema_customer_approach.sql
if %ERRORLEVEL% EQU 0 (echo   SUCCESS) else (echo   ERROR)
echo.

echo [2/5] Executing recreate_users_table.sql...
%MYSQL_PATH% -u root -p%PASSWORD% < recreate_users_table.sql
if %ERRORLEVEL% EQU 0 (echo   SUCCESS) else (echo   ERROR)
echo.

echo [3/5] Executing cart_procedures_customer_clean.sql...
%MYSQL_PATH% -u root -p%PASSWORD% < cart_procedures_customer_clean.sql
if %ERRORLEVEL% EQU 0 (echo   SUCCESS) else (echo   ERROR)
echo.

echo [4/5] Executing population.sql...
%MYSQL_PATH% -u root -p%PASSWORD% < population.sql
if %ERRORLEVEL% EQU 0 (echo   SUCCESS) else (echo   ERROR)
echo.

echo [5/5] Executing populate-2.sql...
%MYSQL_PATH% -u root -p%PASSWORD% < populate-2.sql
if %ERRORLEVEL% EQU 0 (echo   SUCCESS) else (echo   ERROR)
echo.

cd ..

echo =====================================
echo Setup Complete!
echo =====================================
echo.
pause
