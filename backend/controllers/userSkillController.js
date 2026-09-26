const User = require('../models/User');
const Skill = require('../models/Skill');

// Helper to validate Mongo ObjectId
const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

// @desc    Get logged-in user's skills
// @route   GET /api/users/me/skills
// @access  Private
const getMySkills = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('skillsToTeach.skill')
      .populate('skillsToLearn.skill');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        skillsToTeach: user.skillsToTeach || [],
        skillsToLearn: user.skillsToLearn || []
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a teaching skill
// @route   POST /api/users/me/skills/teach
// @access  Private
const addTeachingSkill = async (req, res, next) => {
  try {
    const { skillId, skillName, category, level } = req.body;
    const validLevel = ['Beginner', 'Intermediate', 'Advanced', 'Expert'].includes(level)
      ? level
      : 'Intermediate';

    let targetSkill;

    if (skillId) {
      if (!isValidObjectId(skillId)) {
        return res.status(400).json({ success: false, message: 'Invalid Skill ID format' });
      }
      targetSkill = await Skill.findById(skillId);
    } else if (skillName && skillName.trim()) {
      const nameTrimmed = skillName.trim();
      targetSkill = await Skill.findOne({ name: { $regex: `^${nameTrimmed}$`, $options: 'i' } });
      if (!targetSkill) {
        targetSkill = await Skill.create({
          name: nameTrimmed,
          category: category || 'Other'
        });
      }
    }

    if (!targetSkill) {
      return res.status(400).json({
        success: false,
        message: 'Please select or provide a valid skill'
      });
    }

    const user = await User.findById(req.user._id);

    // Check duplicate
    const isDuplicate = user.skillsToTeach.some(
      (item) => item.skill && item.skill.toString() === targetSkill._id.toString()
    );

    if (isDuplicate) {
      return res.status(400).json({
        success: false,
        message: `You have already added "${targetSkill.name}" to your teaching skills.`
      });
    }

    user.skillsToTeach.push({
      skill: targetSkill._id,
      level: validLevel
    });

    await user.save();

    const updatedUser = await User.findById(user._id).populate('skillsToTeach.skill');

    res.status(200).json({
      success: true,
      message: `Added "${targetSkill.name}" to your teaching skills`,
      data: updatedUser.skillsToTeach
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a learning skill
// @route   POST /api/users/me/skills/learn
// @access  Private
const addLearningSkill = async (req, res, next) => {
  try {
    const { skillId, skillName, category, level } = req.body;
    const validLevel = ['Beginner', 'Intermediate', 'Advanced', 'Expert'].includes(level)
      ? level
      : 'Beginner';

    let targetSkill;

    if (skillId) {
      if (!isValidObjectId(skillId)) {
        return res.status(400).json({ success: false, message: 'Invalid Skill ID format' });
      }
      targetSkill = await Skill.findById(skillId);
    } else if (skillName && skillName.trim()) {
      const nameTrimmed = skillName.trim();
      targetSkill = await Skill.findOne({ name: { $regex: `^${nameTrimmed}$`, $options: 'i' } });
      if (!targetSkill) {
        targetSkill = await Skill.create({
          name: nameTrimmed,
          category: category || 'Other'
        });
      }
    }

    if (!targetSkill) {
      return res.status(400).json({
        success: false,
        message: 'Please select or provide a valid skill'
      });
    }

    const user = await User.findById(req.user._id);

    // Check duplicate
    const isDuplicate = user.skillsToLearn.some(
      (item) => item.skill && item.skill.toString() === targetSkill._id.toString()
    );

    if (isDuplicate) {
      return res.status(400).json({
        success: false,
        message: `You have already added "${targetSkill.name}" to your learning skills.`
      });
    }

    user.skillsToLearn.push({
      skill: targetSkill._id,
      level: validLevel
    });

    await user.save();

    const updatedUser = await User.findById(user._id).populate('skillsToLearn.skill');

    res.status(200).json({
      success: true,
      message: `Added "${targetSkill.name}" to your learning skills`,
      data: updatedUser.skillsToLearn
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update teaching skill level
// @route   PUT /api/users/me/skills/teach/:skillId
// @access  Private
const updateTeachingSkill = async (req, res, next) => {
  try {
    const { skillId } = req.params;
    const { level } = req.body;

    if (!['Beginner', 'Intermediate', 'Advanced', 'Expert'].includes(level)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid skill level provided'
      });
    }

    const user = await User.findById(req.user._id);
    const item = user.skillsToTeach.find(
      (s) => s.skill && s.skill.toString() === skillId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Teaching skill not found in your profile'
      });
    }

    item.level = level;
    await user.save();

    const updatedUser = await User.findById(user._id).populate('skillsToTeach.skill');

    res.status(200).json({
      success: true,
      message: 'Teaching skill level updated successfully',
      data: updatedUser.skillsToTeach
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update learning skill level
// @route   PUT /api/users/me/skills/learn/:skillId
// @access  Private
const updateLearningSkill = async (req, res, next) => {
  try {
    const { skillId } = req.params;
    const { level } = req.body;

    if (!['Beginner', 'Intermediate', 'Advanced', 'Expert'].includes(level)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid skill level provided'
      });
    }

    const user = await User.findById(req.user._id);
    const item = user.skillsToLearn.find(
      (s) => s.skill && s.skill.toString() === skillId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Learning skill not found in your profile'
      });
    }

    item.level = level;
    await user.save();

    const updatedUser = await User.findById(user._id).populate('skillsToLearn.skill');

    res.status(200).json({
      success: true,
      message: 'Learning skill level updated successfully',
      data: updatedUser.skillsToLearn
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete teaching skill
// @route   DELETE /api/users/me/skills/teach/:skillId
// @access  Private
const deleteTeachingSkill = async (req, res, next) => {
  try {
    const { skillId } = req.params;
    const user = await User.findById(req.user._id);

    user.skillsToTeach = user.skillsToTeach.filter(
      (item) => item.skill && item.skill.toString() !== skillId
    );

    await user.save();
    const updatedUser = await User.findById(user._id).populate('skillsToTeach.skill');

    res.status(200).json({
      success: true,
      message: 'Teaching skill removed successfully',
      data: updatedUser.skillsToTeach
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete learning skill
// @route   DELETE /api/users/me/skills/learn/:skillId
// @access  Private
const deleteLearningSkill = async (req, res, next) => {
  try {
    const { skillId } = req.params;
    const user = await User.findById(req.user._id);

    user.skillsToLearn = user.skillsToLearn.filter(
      (item) => item.skill && item.skill.toString() !== skillId
    );

    await user.save();
    const updatedUser = await User.findById(user._id).populate('skillsToLearn.skill');

    res.status(200).json({
      success: true,
      message: 'Learning skill removed successfully',
      data: updatedUser.skillsToLearn
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search users based on skill or name
// @route   GET /api/users/search?skill=...
// @access  Public
const searchUsersBySkill = async (req, res, next) => {
  try {
    const { skill } = req.query;

    let users = await User.find({})
      .select('-password')
      .populate('skillsToTeach.skill')
      .populate('skillsToLearn.skill');

    if (skill && skill.trim()) {
      const searchTerm = skill.trim().toLowerCase();
      users = users.filter((u) => {
        const matchesName = u.name.toLowerCase().includes(searchTerm);
        const matchesBio = u.bio ? u.bio.toLowerCase().includes(searchTerm) : false;
        const matchesTeach = u.skillsToTeach?.some(
          (s) =>
            s.skill &&
            (s.skill.name.toLowerCase().includes(searchTerm) ||
              s.skill.category.toLowerCase().includes(searchTerm))
        );
        const matchesLearn = u.skillsToLearn?.some(
          (s) =>
            s.skill &&
            (s.skill.name.toLowerCase().includes(searchTerm) ||
              s.skill.category.toLowerCase().includes(searchTerm))
        );
        return matchesName || matchesBio || matchesTeach || matchesLearn;
      });
    }

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public user profile by User ID
// @route   GET /api/users/:id
// @access  Public
const getPublicUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid User ID format'
      });
    }

    const user = await User.findById(id)
      .select('-password')
      .populate('skillsToTeach.skill')
      .populate('skillsToLearn.skill');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        bio: user.bio,
        profileImage: user.profileImage,
        role: user.role,
        skillsToTeach: user.skillsToTeach || [],
        skillsToLearn: user.skillsToLearn || [],
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMySkills,
  addTeachingSkill,
  addLearningSkill,
  updateTeachingSkill,
  updateLearningSkill,
  deleteTeachingSkill,
  deleteLearningSkill,
  searchUsersBySkill,
  getPublicUserProfile
};
