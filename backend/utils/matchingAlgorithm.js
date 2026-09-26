/**
 * Deterministic Skill Matching Algorithm for SkillSwap
 * Compares currentUser (User A) skills against targetUser (User B) skills
 */
const calculateSkillMatch = (currentUser, targetUser) => {
  if (!currentUser || !targetUser || currentUser._id.toString() === targetUser._id.toString()) {
    return null;
  }

  const myTeach = currentUser.skillsToTeach || [];
  const myLearn = currentUser.skillsToLearn || [];
  const targetTeach = targetUser.skillsToTeach || [];
  const targetLearn = targetUser.skillsToLearn || [];

  // 1. Skills User A can learn from User B (A's learn match B's teach)
  const skillsYouCanLearn = [];
  myLearn.forEach((myLearnItem) => {
    if (!myLearnItem.skill) return;
    const mySkillId = myLearnItem.skill._id ? myLearnItem.skill._id.toString() : myLearnItem.skill.toString();

    const matchingTeach = targetTeach.find((tItem) => {
      if (!tItem.skill) return false;
      const tSkillId = tItem.skill._id ? tItem.skill._id.toString() : tItem.skill.toString();
      return mySkillId === tSkillId;
    });

    if (matchingTeach) {
      skillsYouCanLearn.push({
        skill: myLearnItem.skill,
        yourTargetLevel: myLearnItem.level,
        theirTeachLevel: matchingTeach.level
      });
    }
  });

  // 2. Skills User A can teach to User B (A's teach match B's learn)
  const skillsYouCanTeach = [];
  myTeach.forEach((myTeachItem) => {
    if (!myTeachItem.skill) return;
    const mySkillId = myTeachItem.skill._id ? myTeachItem.skill._id.toString() : myTeachItem.skill.toString();

    const matchingLearn = targetLearn.find((tItem) => {
      if (!tItem.skill) return false;
      const tSkillId = tItem.skill._id ? tItem.skill._id.toString() : tItem.skill.toString();
      return mySkillId === tSkillId;
    });

    if (matchingLearn) {
      skillsYouCanTeach.push({
        skill: myTeachItem.skill,
        yourTeachLevel: myTeachItem.level,
        theirTargetLevel: matchingLearn.level
      });
    }
  });

  const forwardCount = skillsYouCanLearn.length;
  const reverseCount = skillsYouCanTeach.length;
  let matchPercentage = 0;

  if (forwardCount > 0 && reverseCount > 0) {
    // Two-way match (Strong)
    matchPercentage = Math.min(100, 80 + (forwardCount + reverseCount - 2) * 10);
  } else if (forwardCount > 0) {
    // One-way match (A learns from B)
    matchPercentage = Math.min(75, 50 + (forwardCount - 1) * 10);
  } else if (reverseCount > 0) {
    // One-way match (A teaches B)
    matchPercentage = Math.min(60, 40 + (reverseCount - 1) * 10);
  } else {
    matchPercentage = 0;
  }

  let matchType = 'No Match';
  if (matchPercentage >= 80) {
    matchType = 'Strong Match';
  } else if (matchPercentage >= 60) {
    matchType = 'Good Match';
  } else if (matchPercentage >= 40) {
    matchType = 'Possible Match';
  } else if (matchPercentage >= 1) {
    matchType = 'Low Match';
  }

  // Combined matched skills names
  const matchedSkillsList = [
    ...skillsYouCanLearn.map((item) => (item.skill.name ? item.skill.name : item.skill)),
    ...skillsYouCanTeach.map((item) => (item.skill.name ? item.skill.name : item.skill))
  ];
  const matchedSkills = Array.from(new Set(matchedSkillsList));

  return {
    user: {
      _id: targetUser._id,
      name: targetUser.name,
      bio: targetUser.bio,
      profileImage: targetUser.profileImage,
      role: targetUser.role,
      createdAt: targetUser.createdAt,
      skillsToTeach: targetUser.skillsToTeach,
      skillsToLearn: targetUser.skillsToLearn
    },
    matchPercentage,
    matchType,
    isTwoWay: forwardCount > 0 && reverseCount > 0,
    skillsYouCanLearn,
    skillsYouCanTeach,
    matchedSkills
  };
};

module.exports = calculateSkillMatch;
