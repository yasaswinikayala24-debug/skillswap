const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');
const Skill = require('../models/Skill');
const ExchangeRequest = require('../models/ExchangeRequest');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Session = require('../models/Session');
const Notification = require('../models/Notification');

dotenv.config();

const skillsList = [
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

const seedAllData = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting comprehensive SkillSwap database seeding...');

    // 1. Seed Skills
    for (const item of skillsList) {
      await Skill.findOneAndUpdate(
        { name: item.name },
        item,
        { upsert: true, new: true }
      );
    }

    const skillsMap = {};
    const allSkills = await Skill.find({});
    allSkills.forEach((s) => {
      skillsMap[s.name] = s._id;
    });

    console.log('✓ Skills catalog ready');

    // Helper for finding skills
    const getSkillId = (name) => skillsMap[name];

    // 2. Clear old demo users or create/update them
    const usersData = [
      {
        email: 'yasaswinikayala23@gmail.com',
        name: 'nick',
        password: 'password123',
        bio: 'Full-Stack Developer enthusiastic about Python, React, and UI design. Eager to trade knowledge!',
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
        skillsToTeach: [
          { skill: getSkillId('Python'), level: 'Expert' },
          { skill: getSkillId('Data Science & Pandas'), level: 'Advanced' }
        ],
        skillsToLearn: [
          { skill: getSkillId('React.js'), level: 'Intermediate' },
          { skill: getSkillId('UI/UX Design'), level: 'Beginner' }
        ]
      },
      {
        email: 'rahul@example.com',
        name: 'Rahul Kumar',
        password: 'password123',
        bio: 'Frontend Specialist with 4+ years of experience in React and Node.js. Looking to learn Python for data science!',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
        skillsToTeach: [
          { skill: getSkillId('React.js'), level: 'Expert' },
          { skill: getSkillId('Node.js'), level: 'Advanced' }
        ],
        skillsToLearn: [
          { skill: getSkillId('Python'), level: 'Intermediate' },
          { skill: getSkillId('Machine Learning'), level: 'Beginner' }
        ]
      },
      {
        email: 'priya@example.com',
        name: 'Priya Sharma',
        password: 'password123',
        bio: 'Senior UI/UX Designer & native Spanish speaker. Passionate about web development and data visualization.',
        profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
        skillsToTeach: [
          { skill: getSkillId('UI/UX Design'), level: 'Expert' },
          { skill: getSkillId('Spanish'), level: 'Expert' }
        ],
        skillsToLearn: [
          { skill: getSkillId('Python'), level: 'Beginner' },
          { skill: getSkillId('Data Science & Pandas'), level: 'Intermediate' }
        ]
      },
      {
        email: 'arjun@example.com',
        name: 'Arjun Mehta',
        password: 'password123',
        bio: 'AI & Machine Learning Engineer. Wanting to expand into Cloud Infrastructure and AWS.',
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
        skillsToTeach: [
          { skill: getSkillId('Machine Learning'), level: 'Expert' },
          { skill: getSkillId('Python'), level: 'Expert' }
        ],
        skillsToLearn: [
          { skill: getSkillId('AWS & Cloud Infrastructure'), level: 'Intermediate' },
          { skill: getSkillId('React.js'), level: 'Beginner' }
        ]
      },
      {
        email: 'sophia@example.com',
        name: 'Sophia Chen',
        password: 'password123',
        bio: 'Cloud Architect specialized in AWS & Database design. Interested in learning Spanish and Public Speaking.',
        profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
        skillsToTeach: [
          { skill: getSkillId('AWS & Cloud Infrastructure'), level: 'Expert' },
          { skill: getSkillId('SQL & Database Design'), level: 'Advanced' }
        ],
        skillsToLearn: [
          { skill: getSkillId('Spanish'), level: 'Intermediate' },
          { skill: getSkillId('Public Speaking'), level: 'Beginner' }
        ]
      }
    ];

    const usersMap = {};

    for (const uData of usersData) {
      let u = await User.findOne({ email: uData.email });
      if (!u) {
        u = await User.create(uData);
      } else {
        u.skillsToTeach = uData.skillsToTeach;
        u.skillsToLearn = uData.skillsToLearn;
        u.bio = uData.bio;
        u.profileImage = uData.profileImage;
        await u.save();
      }
      usersMap[u.email] = u;
    }

    console.log('✓ Users created & skill portfolios populated');

    const nick = usersMap['yasaswinikayala23@gmail.com'];
    const rahul = usersMap['rahul@example.com'];
    const priya = usersMap['priya@example.com'];
    const arjun = usersMap['arjun@example.com'];
    const sophia = usersMap['sophia@example.com'];

    // 3. Create Exchange Requests
    // Request 1: nick <-> rahul (Accepted)
    const ex1 = await ExchangeRequest.findOneAndUpdate(
      { sender: nick._id, receiver: rahul._id },
      {
        sender: nick._id,
        receiver: rahul._id,
        offeredSkill: getSkillId('Python'),
        requestedSkill: getSkillId('React.js'),
        message: 'Hi Rahul! I saw you teach React.js. I can teach you Python in exchange!',
        status: 'accepted'
      },
      { upsert: true, new: true }
    );

    // Request 2: priya <-> nick (Accepted)
    const ex2 = await ExchangeRequest.findOneAndUpdate(
      { sender: priya._id, receiver: nick._id },
      {
        sender: priya._id,
        receiver: nick._id,
        offeredSkill: getSkillId('UI/UX Design'),
        requestedSkill: getSkillId('Python'),
        message: 'Hey nick! Would love to learn Python from you in exchange for Figma UI/UX design lessons.',
        status: 'accepted'
      },
      { upsert: true, new: true }
    );

    // Request 3: arjun -> nick (Pending)
    const ex3 = await ExchangeRequest.findOneAndUpdate(
      { sender: arjun._id, receiver: nick._id },
      {
        sender: arjun._id,
        receiver: nick._id,
        offeredSkill: getSkillId('Machine Learning'),
        requestedSkill: getSkillId('Data Science & Pandas'),
        message: 'Hi! Let us connect to discuss Machine Learning models & Pandas data pipelines.',
        status: 'pending'
      },
      { upsert: true, new: true }
    );

    // Request 4: nick -> sophia (Pending)
    const ex4 = await ExchangeRequest.findOneAndUpdate(
      { sender: nick._id, receiver: sophia._id },
      {
        sender: nick._id,
        receiver: sophia._id,
        offeredSkill: getSkillId('Python'),
        requestedSkill: getSkillId('AWS & Cloud Infrastructure'),
        message: 'Hello Sophia! I am interested in cloud deployment on AWS.',
        status: 'pending'
      },
      { upsert: true, new: true }
    );

    console.log('✓ Skill exchange requests created');

    // 4. Create Conversations & Messages
    // Conversation 1: nick & rahul
    let conv1 = await Conversation.findOne({ exchangeRequest: ex1._id });
    if (!conv1) {
      conv1 = await Conversation.create({
        participants: [nick._id, rahul._id],
        exchangeRequest: ex1._id,
        lastMessage: 'Awesome! Let us meet tomorrow at 6:00 PM for the React tutorial.',
        lastMessageAt: new Date()
      });
    }

    await Message.deleteMany({ conversation: conv1._id });
    await Message.create([
      {
        conversation: conv1._id,
        sender: nick._id,
        receiver: rahul._id,
        text: 'Hi Rahul! Thanks for accepting the exchange request.',
        read: true,
        createdAt: new Date(Date.now() - 3600000 * 5)
      },
      {
        conversation: conv1._id,
        sender: rahul._id,
        receiver: nick._id,
        text: 'Hey nick! Glad to connect. I am excited to learn Python data analysis from you!',
        read: true,
        createdAt: new Date(Date.now() - 3600000 * 4)
      },
      {
        conversation: conv1._id,
        sender: nick._id,
        receiver: rahul._id,
        text: 'Sounds great! I can walk you through Python syntax, functions, and Pandas dataframes.',
        read: true,
        createdAt: new Date(Date.now() - 3600000 * 3)
      },
      {
        conversation: conv1._id,
        sender: rahul._id,
        receiver: nick._id,
        text: 'Awesome! Let us meet tomorrow at 6:00 PM for the React tutorial.',
        read: false,
        createdAt: new Date(Date.now() - 3600000 * 1)
      }
    ]);

    // Conversation 2: nick & priya
    let conv2 = await Conversation.findOne({ exchangeRequest: ex2._id });
    if (!conv2) {
      conv2 = await Conversation.create({
        participants: [nick._id, priya._id],
        exchangeRequest: ex2._id,
        lastMessage: 'Hi nick! I created a wireframe template for our Figma design session.',
        lastMessageAt: new Date(Date.now() - 1800000)
      });
    }

    await Message.deleteMany({ conversation: conv2._id });
    await Message.create([
      {
        conversation: conv2._id,
        sender: priya._id,
        receiver: nick._id,
        text: 'Hi nick! I created a wireframe template for our Figma design session.',
        read: false,
        createdAt: new Date(Date.now() - 1800000)
      }
    ]);

    console.log('✓ Conversations & messages populated');

    // 5. Create Sessions
    await Session.deleteMany({ organizer: nick._id });
    await Session.deleteMany({ participant: nick._id });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(18, 0, 0, 0);

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 5);
    nextWeek.setHours(17, 30, 0, 0);

    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 2);

    await Session.create([
      {
        exchangeRequest: ex1._id,
        organizer: rahul._id,
        participant: nick._id,
        title: 'React Components & Hooks Deep Dive',
        description: 'Covering useState, useEffect, custom hooks, and state management best practices.',
        scheduledAt: tomorrow,
        duration: 60,
        status: 'scheduled'
      },
      {
        exchangeRequest: ex2._id,
        organizer: priya._id,
        participant: nick._id,
        title: 'Figma UI/UX Design & Design Systems',
        description: 'Introduction to Figma autolayout, component libraries, and color palette creation.',
        scheduledAt: nextWeek,
        duration: 90,
        status: 'scheduled'
      },
      {
        exchangeRequest: ex1._id,
        organizer: nick._id,
        participant: rahul._id,
        title: 'Python Fundamentals & Data Structures',
        description: 'First introductory session covering list comprehensions and dictionaries.',
        scheduledAt: pastDate,
        duration: 60,
        status: 'completed'
      }
    ]);

    console.log('✓ Scheduled & completed sessions created');

    // 6. Create Notifications
    await Notification.deleteMany({ recipient: nick._id });

    await Notification.create([
      {
        recipient: nick._id,
        sender: rahul._id,
        type: 'session_created',
        title: 'New Session Scheduled',
        message: 'Rahul Kumar scheduled "React Components & Hooks Deep Dive" for tomorrow at 6:00 PM',
        relatedId: ex1._id,
        read: false
      },
      {
        recipient: nick._id,
        sender: rahul._id,
        type: 'new_message',
        title: 'New message from Rahul Kumar',
        message: 'Awesome! Let us meet tomorrow at 6:00 PM for the React tutorial.',
        relatedId: conv1._id,
        read: false
      },
      {
        recipient: nick._id,
        sender: priya._id,
        type: 'request_accepted',
        title: 'Exchange Request Accepted!',
        message: 'Priya Sharma accepted your skill exchange request!',
        relatedId: ex2._id,
        read: true
      },
      {
        recipient: nick._id,
        sender: arjun._id,
        type: 'exchange_request',
        title: 'New Skill Exchange Request',
        message: 'Arjun Mehta sent you a skill exchange request!',
        relatedId: ex3._id,
        read: false
      }
    ]);

    console.log('✓ Notifications created');
    console.log('🎉 SkillSwap database seeding completed successfully!');
  } catch (err) {
    console.error('❌ Database seeding failed:', err);
  }
};

module.exports = seedAllData;

if (require.main === module) {
  seedAllData().then(() => mongoose.connection.close());
}
