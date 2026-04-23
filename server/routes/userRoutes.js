const express = require('express');
const {
  getMe,
  getLeaderboard,
  getUsers,
  deleteUser,
  getAdminStats,
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/me', protect, getMe);
router.get('/leaderboard', getLeaderboard);
router.get('/admin/stats', protect, adminOnly, getAdminStats);
router.get('/', protect, adminOnly, getUsers);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;
