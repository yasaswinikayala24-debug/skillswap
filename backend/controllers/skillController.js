const Skill = require('../models/Skill');
const User = require('../models/User');

// @desc    Get all skills with search and category filtering
// @route   GET /api/skills
// @access  Public
const getSkills = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    if (category && category.trim() && category !== 'All') {
      query.category = category.trim();
    }

    const skills = await Skill.find(query).sort({ name: 1 });

    // Optional: attach swapper counts for each skill
    const users = await User.find({}, 'skillsToTeach skillsToLearn');
    const skillsWithStats = skills.map((skill) => {
      const skillObj = skill.toObject();
      let teacherCount = 0;
      let learnerCount = 0;

      users.forEach((u) => {
        if (u.skillsToTeach?.some((s) => s.skill && s.skill.toString() === skill._id.toString())) {
          teacherCount++;
        }
        if (u.skillsToLearn?.some((s) => s.skill && s.skill.toString() === skill._id.toString())) {
          learnerCount++;
        }
      });

      skillObj.teacherCount = teacherCount;
      skillObj.learnerCount = learnerCount;
      return skillObj;
    });

    res.status(200).json({
      success: true,
      count: skillsWithStats.length,
      data: skillsWithStats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single skill by ID
// @route   GET /api/skills/:id
// @access  Public
const getSkillById = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    res.status(200).json({
      success: true,
      data: skill
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new skill
// @route   POST /api/skills
// @access  Private / Public
const createSkill = async (req, res, next) => {
  try {
    const { name, category, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Skill name is required'
      });
    }

    const trimmedName = name.trim();
    const existingSkill = await Skill.findOne({
      name: { $regex: `^${trimmedName}$`, $options: 'i' }
    });

    if (existingSkill) {
      return res.status(409).json({
        success: false,
        message: 'A skill with this name already exists',
        data: existingSkill
      });
    }

    const skill = await Skill.create({
      name: trimmedName,
      category: category || 'Other',
      description: description ? description.trim() : ''
    });

    res.status(201).json({
      success: true,
      message: 'Skill created successfully',
      data: skill
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSkills,
  getSkillById,
  createSkill
};
