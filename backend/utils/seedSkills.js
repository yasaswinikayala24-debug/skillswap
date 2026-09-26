const Skill = require('../models/Skill');

const initialSkills = [
  { name: 'Python', category: 'Programming', description: 'General-purpose programming language for web, data science, and automation.' },
  { name: 'React.js', category: 'Web Development', description: 'Popular frontend JavaScript library for building modern user interfaces.' },
  { name: 'Node.js', category: 'Web Development', description: 'Server-side JavaScript runtime built on Chrome V8 engine.' },
  { name: 'UI/UX Design', category: 'UI/UX Design', description: 'User experience and interface design using Figma and user research principles.' },
  { name: 'Machine Learning', category: 'Machine Learning', description: 'Predictive modeling, scikit-learn, PyTorch, and artificial intelligence.' },
  { name: 'Spanish', category: 'Languages', description: 'Conversational Spanish grammar, vocabulary, and pronunciation.' },
  { name: 'Data Science & Pandas', category: 'Data Science', description: 'Data analysis, visualization, pandas, numpy, and matplotlib.' },
  { name: 'AWS & Cloud Infrastructure', category: 'Cloud Computing', description: 'Amazon Web Services, EC2, S3, Lambda, and cloud architecture.' },
  { name: 'Digital Marketing & SEO', category: 'Digital Marketing', description: 'Search engine optimization, content strategy, and social media analytics.' },
  { name: 'Flutter & Dart', category: 'Mobile Development', description: 'Cross-platform mobile app development for iOS and Android.' },
  { name: 'Cyber Security Basics', category: 'Cyber Security', description: 'Network security, ethical hacking fundamentals, and cryptography.' },
  { name: 'Public Speaking', category: 'Communication', description: 'Confidence building, presentation skills, and public speaking techniques.' },
  { name: 'SQL & Database Design', category: 'Database', description: 'Relational database management, SQL queries, indexing, and modeling.' },
  { name: 'Photography & Editing', category: 'Photography', description: 'Composition, lighting, Lightroom, and digital photo editing.' }
];

const seedInitialSkills = async () => {
  try {
    const count = await Skill.countDocuments();
    if (count === 0) {
      console.log('Seeding initial skills database...');
      await Skill.insertMany(initialSkills);
      console.log('Initial skills seeded successfully!');
    }
  } catch (err) {
    console.error('Error seeding initial skills:', err.message);
  }
};

module.exports = seedInitialSkills;
