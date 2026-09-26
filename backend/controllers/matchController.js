const User = require('../models/User');
const calculateSkillMatch = require('../utils/matchingAlgorithm');

// @desc    Get recommended skill matches for authenticated user
// @route   GET /api/matches
// @access  Private
const getMatches = async (req, res, next) => {
  try {
    const { minMatch, matchType, skill, category, sortBy } = req.query;

    const currentUser = await User.findById(req.user._id)
      .populate('skillsToTeach.skill')
      .populate('skillsToLearn.skill');

    const otherUsers = await User.find({ _id: { $ne: req.user._id } })
      .select('-password')
      .populate('skillsToTeach.skill')
      .populate('skillsToLearn.skill');

    let matches = [];

    otherUsers.forEach((otherUser) => {
      const matchResult = calculateSkillMatch(currentUser, otherUser);
      if (matchResult && matchResult.matchPercentage > 0) {
        matches.push(matchResult);
      }
    });

    // Apply filtering
    if (minMatch) {
      const minVal = parseInt(minMatch, 10);
      if (!isNaN(minVal)) {
        matches = matches.filter((m) => m.matchPercentage >= minVal);
      }
    }

    if (matchType && matchType !== 'All') {
      matches = matches.filter((m) => m.matchType === matchType);
    }

    if (skill && skill.trim()) {
      const searchSkill = skill.trim().toLowerCase();
      matches = matches.filter((m) =>
        m.matchedSkills.some((sName) =>
          typeof sName === 'string' && sName.toLowerCase().includes(searchSkill)
        )
      );
    }

    if (category && category !== 'All') {
      matches = matches.filter((m) =>
        m.user.skillsToTeach?.some(
          (s) => s.skill && s.skill.category === category
        )
      );
    }

    // Apply sorting
    if (sortBy === 'recent') {
      matches.sort((a, b) => new Date(b.user.createdAt) - new Date(a.user.createdAt));
    } else {
      // Default: Highest match percentage
      matches.sort((a, b) => b.matchPercentage - a.matchPercentage);
    }

    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single match details between current user and target user
// @route   GET /api/matches/:userId
// @access  Private
const getMatchDetails = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const currentUser = await User.findById(req.user._id)
      .populate('skillsToTeach.skill')
      .populate('skillsToLearn.skill');

    const targetUser = await User.findById(userId)
      .select('-password')
      .populate('skillsToTeach.skill')
      .populate('skillsToLearn.skill');

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'Target user not found'
      });
    }

    const matchResult = calculateSkillMatch(currentUser, targetUser);

    res.status(200).json({
      success: true,
      data: matchResult || {
        user: targetUser,
        matchPercentage: 0,
        matchType: 'No Match',
        skillsYouCanLearn: [],
        skillsYouCanTeach: [],
        matchedSkills: []
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMatches,
  getMatchDetails
};
