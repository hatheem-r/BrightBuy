# Testing MySQL Connection

Try connecting to MySQL with different passwords to find the correct one:

## Option 1: No password (empty)
```
mysql -u root
```

## Option 2: Password: 12345
```
mysql -u root -p12345
```

## Option 3: Password: root
```
mysql -u root -proot
```

## Option 4: Password: (empty string - press Enter when prompted)
```
mysql -u root -p
(then press Enter)
```

## Option 5: Password: admin
```
mysql -u root -padmin
```

Once you find the correct password, update the .env file:
1. Open: backend/.env
2. Change: DB_PASSWORD=YOUR_CORRECT_PASSWORD
3. Restart the backend server

## Alternative: Check your MySQL installation
If you're using XAMPP, WAMP, or MAMP, the default passwords are usually:
- XAMPP: (empty password)
- WAMP: (empty password)  
- MAMP: root

If you installed MySQL directly, you set the password during installation.
