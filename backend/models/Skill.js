const mongoose = require('mongoose');

const CATEGORIES = [
  'Programming',
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Artificial Intelligence',
  'Machine Learning',
  'Database',
  'Cloud Computing',
  'Cyber Security',
  'UI/UX Design',
  'Digital Marketing',
  'Communication',
  'Languages',
  'Business',
  'Photography',
  'Video Editing',
  'Other'
];

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      unique: true,
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: CATEGORIES,
      default: 'Other'
    },
    description: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;
module.exports.CATEGORIES = CATEGORIES;
