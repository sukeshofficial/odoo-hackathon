const express = require('express');
const { getUserCalendar, getUserProfile, updateUserProfile } = require('../controllers/user.controller');
const upload = require('../middleware/upload.middleware');

const router = express.Router();

router.get('/:id/calendar', getUserCalendar);
router.get('/:id/profile', getUserProfile);
router.put('/:id/profile', upload.single('profilePhoto'), updateUserProfile);

module.exports = router;
