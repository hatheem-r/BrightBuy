// backend/routes/staff.js
const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');


// POST /api/staff/add
// We will use a POST request to create a new resource.
router.post('/add', staffController.addStaff);
router.get('/', staffController.getAllStaff);

module.exports = router;