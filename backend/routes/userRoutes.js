const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile
} = require('../controllers/userController');
const {
  getMySkills,
  addTeachingSkill,
  addLearningSkill,
  updateTeachingSkill,
  updateLearningSkill,
  deleteTeachingSkill,
  deleteLearningSkill,
  searchUsersBySkill,
  getPublicUserProfile
} = require('../controllers/userSkillController');
const { protect } = require('../middleware/authMiddleware');

// Phase 1 Profile routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Phase 2 Skill Management routes
router.get('/me/skills', protect, getMySkills);
router.post('/me/skills/teach', protect, addTeachingSkill);
router.post('/me/skills/learn', protect, addLearningSkill);
router.put('/me/skills/teach/:skillId', protect, updateTeachingSkill);
router.put('/me/skills/learn/:skillId', protect, updateLearningSkill);
router.delete('/me/skills/teach/:skillId', protect, deleteTeachingSkill);
router.delete('/me/skills/learn/:skillId', protect, deleteLearningSkill);

// Phase 2 User Discovery & Public Profile routes
router.get('/search', searchUsersBySkill);
router.get('/:id', getPublicUserProfile);

module.exports = router;
