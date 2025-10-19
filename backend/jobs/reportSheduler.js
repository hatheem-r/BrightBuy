// jobs/reportScheduler.js
const cron = require('node-cron');
const ReportModel = require('../models/reportModel');
const db = require('../config/db');

// Run daily at 2 AM
cron.schedule('0 2 * * *', async () => {
  console.log('📊 Running daily report generation...');
  try {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];
    
    const report = await ReportModel.getDailySalesReport(yesterday, yesterday);
    
    // Store report in database for archive
    await db.query(
      `INSERT INTO report_archive (report_type, report_date, data) VALUES (?, ?, ?)`,
      ['daily_sales', yesterday, JSON.stringify(report)]
    );
    
    console.log('✓ Daily report generated');
  } catch (error) {
    console.error('✗ Error generating daily report:', error);
  }
});

// Run monthly on 1st at 3 AM
cron.schedule('0 3 1 * *', async () => {
  console.log('📊 Running monthly report generation...');
  try {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const report = await ReportModel.getMonthlySalesReport(year);
    
    await db.query(
      `INSERT INTO report_archive (report_type, report_date, data) VALUES (?, ?, ?)`,
      ['monthly_sales', new Date(year, month, 1).toISOString().split('T')[0], JSON.stringify(report)]
    );
    
    console.log('✓ Monthly report generated');
  } catch (error) {
    console.error('✗ Error generating monthly report:', error);
  }
});

module.exports = { startScheduler: () => console.log('✓ Report scheduler started') };