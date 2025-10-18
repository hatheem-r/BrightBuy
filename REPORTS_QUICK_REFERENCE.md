# 📊 Staff Reports - Quick Reference Card

## 🚀 Quick Start

### Access Reports
1. Login at: `http://localhost:3000/login`
2. Go to Staff Dashboard
3. Click **"View Reports"** button
4. Or visit: `http://localhost:3000/staff/reports`

### Test Accounts
**Level 01 Staff:** admin@brightbuy.com : 123456  
**Level 02 Staff:** mike@brightbuy.com : 123456

---

## 📊 Available Reports

### 1️⃣ Sales Summary 📈
**What:** Overview of sales performance  
**Shows:** Total orders, revenue, unique customers, avg order value  
**Filters:** Date range (start/end dates)  
**Use Case:** Daily/weekly/monthly performance review

### 2️⃣ Top Selling Products 🏆
**What:** Best-performing products  
**Shows:** Product rankings by quantity sold and revenue  
**Filters:** Date range, limit (default: top 10)  
**Use Case:** Identify bestsellers, restock planning

### 3️⃣ Quarterly Sales 📅
**What:** Sales breakdown by quarter  
**Shows:** Q1, Q2, Q3, Q4 totals and order counts  
**Filters:** Year selection  
**Use Case:** Year-end reviews, trend analysis

### 4️⃣ Customer Summary 👥
**What:** Customer purchase history  
**Shows:** Customer names, total orders, total spent, avg order value  
**Filters:** Limit, minimum orders  
**Use Case:** Identify VIP customers, loyalty programs

### 5️⃣ Inventory Status 📦
**What:** Current stock levels  
**Shows:** Products, variants, SKU, stock quantity, status  
**Filters:** All / In Stock / Low Stock / Out of Stock  
**Use Case:** Restock alerts, inventory management

### 6️⃣ Category Orders 🏷️
**What:** Orders per category  
**Shows:** Category names and total order counts  
**Filters:** None  
**Use Case:** Category performance, marketing focus

### 7️⃣ Inventory Updates 🔄
**What:** Recent stock changes  
**Shows:** Staff actions, quantity changes, timestamps, notes  
**Filters:** Days back (default: 30), limit  
**Use Case:** Audit trail, accountability tracking

### 8️⃣ Delivery Estimates 🚚
**What:** Order delivery tracking  
**Shows:** Order IDs, cities, zip codes, estimated delivery dates  
**Filters:** City selection  
**Use Case:** Logistics planning, customer service

---

## 🎯 Common Tasks

### View Sales Performance
1. Click **"Sales Summary"**
2. Set date range (last month, last quarter, etc.)
3. Review metrics: orders, revenue, customers
4. Check top category and inventory status

### Find Best Sellers
1. Click **"Top Products"**
2. Set date range
3. Review ranked list
4. Note top 3 products (marked with special color)

### Check Low Stock Items
1. Click **"Inventory Status"**
2. Select filter: **"Low Stock"**
3. Review items with < 10 units
4. Plan restocking

### Track Recent Changes
1. Click **"Inventory Updates"**
2. See last 30 days of changes
3. Verify staff actions
4. Check notes for context

### Analyze Customer Spending
1. Click **"Customer Summary"**
2. Sort by total spent (auto-sorted)
3. Identify high-value customers
4. Review purchase patterns

---

## 🔍 Filter Guide

### Date Range (Sales, Top Products)
- **Start Date:** First day of period
- **End Date:** Last day of period
- **Tip:** Use 30/60/90 day ranges for trends

### Year Selection (Quarterly Sales)
- Choose from available years
- View Q1-Q4 breakdown
- Compare different years

### Inventory Status
- **All:** Show everything
- **In Stock:** ≥ 10 units
- **Low Stock:** 1-9 units
- **Out of Stock:** 0 units

### City Selection (Delivery)
- **All Cities:** Show all orders
- **Specific City:** Filter by delivery location
- **Use Case:** Regional logistics

---

## 🎨 Visual Indicators

### Status Colors
- 🟢 **Green** = In Stock / Good / Positive
- 🟠 **Orange** = Low Stock / Warning
- 🔴 **Red** = Out of Stock / Critical / Negative

### Ranking (Top Products)
- 🥇 **#1-3** = Gold/Yellow highlight
- **#4-10** = Regular gray

### Trends
- **+** = Positive change (green)
- **-** = Negative change (red)

---

## 💡 Tips & Best Practices

### Daily Tasks
- [ ] Check **Sales Summary** for yesterday
- [ ] Review **Inventory Status** for low stock
- [ ] Check **Inventory Updates** for recent changes

### Weekly Tasks
- [ ] Run **Top Products** for the week
- [ ] Review **Customer Summary** for new VIPs
- [ ] Check **Delivery Estimates** for delays

### Monthly Tasks
- [ ] Generate **Quarterly Sales** report
- [ ] Analyze **Category Orders** performance
- [ ] Review **Top Products** for the month

### Quarterly Tasks
- [ ] Compare quarterly sales year-over-year
- [ ] Review customer spending patterns
- [ ] Plan inventory based on top sellers

---

## 🔧 Troubleshooting

### Report Not Loading
1. Refresh page (F5)
2. Check internet connection
3. Verify backend server is running
4. Try logging out and back in

### No Data Showing
1. Adjust date range (expand it)
2. Change filters (try "All")
3. Verify database has data
4. Check console for errors (F12)

### Wrong Numbers
1. Double-check date range
2. Verify filters are correct
3. Compare with database directly
4. Report to admin if persists

### Slow Loading
1. Reduce date range
2. Use more specific filters
3. Limit number of results
4. Check network speed

---

## 🎓 Training Checklist

### New Staff Onboarding
- [ ] Learn to login as staff
- [ ] Navigate to reports section
- [ ] Understand each report type
- [ ] Practice using filters
- [ ] Learn visual indicators
- [ ] Know common tasks
- [ ] Understand status colors
- [ ] Practice troubleshooting

### Certification Tasks
- [ ] Generate a sales summary for last month
- [ ] Find top 5 selling products this quarter
- [ ] Identify all low stock items
- [ ] Track inventory changes for a specific product
- [ ] Find VIP customers (> $1000 spent)
- [ ] Generate quarterly sales for current year
- [ ] Filter orders by city
- [ ] Explain each status color

---

## 📱 Mobile Access

### Responsive Design
✅ Works on tablets (768px+)  
⚠️ Limited on phones (not optimized)  
💡 Recommend laptop/desktop for best experience

---

## 🔐 Security Reminders

- ✅ Always logout when finished
- ✅ Never share staff credentials
- ✅ Report suspicious activity
- ✅ Keep token secure (don't share)
- ✅ Lock screen when away

---

## 📞 Support Contacts

**Technical Issues:**
- Check REPORTS_SYSTEM_DOCUMENTATION.md
- Review REPORTS_IMPLEMENTATION_SUMMARY.md
- Contact IT/Admin team

**Data Questions:**
- Verify with database directly
- Compare with other reports
- Ask Level 01 staff for clarification

**Access Issues:**
- Check your staff role (Level 01 or 02)
- Verify account is active
- Contact admin for access

---

## 📊 Report Output Examples

### Sales Summary Output
```
Total Orders: 150
Total Revenue: $45,320.50
Unique Customers: 67
Average Order Value: $302.14
Top Category: Electronics (85 orders)
```

### Top Product Output
```
#1  Laptop Pro       125 units   $124,875.00
#2  Wireless Mouse   89 units    $4,450.00
#3  USB Cable        76 units    $912.00
```

### Inventory Status Output
```
SKU001  Laptop Pro  Silver  15-inch  $999.99  5   Low Stock
SKU002  Mouse       Black   Standard $49.99   0   Out of Stock
SKU003  Cable       White   1m       $12.00   15  In Stock
```

---

## ⚡ Keyboard Shortcuts

- **F5** - Refresh page
- **Ctrl + F** - Find in page
- **F12** - Open developer console
- **Ctrl + P** - Print report (browser)
- **Esc** - Close modals/dialogs

---

## 🎯 Performance Metrics

### Expected Load Times
- Sales Summary: < 2 seconds
- Top Products: < 3 seconds
- Inventory Status: < 2 seconds
- Other Reports: < 3 seconds

### Data Limits
- Most reports: 50-100 records
- Top Products: 10 records
- Customer Summary: 50 records
- Configurable via query parameters

---

## ✅ Daily Workflow Example

**Morning (8:00 AM)**
1. Login to system
2. Check Sales Summary (yesterday)
3. Review Inventory Status (low stock alerts)
4. Note items needing restock

**Midday (12:00 PM)**
1. Check Inventory Updates (morning changes)
2. Review customer orders (Customer Summary)
3. Check delivery estimates for today

**Afternoon (4:00 PM)**
1. Run Top Products report (today)
2. Update inventory if needed
3. Plan for tomorrow

**End of Day (6:00 PM)**
1. Final Sales Summary check
2. Note any critical low stock
3. Logout

---

**Quick Reference Version:** 1.0  
**Last Updated:** October 19, 2025  
**Print This:** For desk reference 📋
