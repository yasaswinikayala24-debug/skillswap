const express = require('express');
const router = express.Router();
const {
  getSkills,
  getSkillById,
  createSkill
} = require('../controllers/skillController');

router.route('/')
  .get(getSkills)
  .post(createSkill);

router.route('/:id')
  .get(getSkillById);

module.exports = router;
