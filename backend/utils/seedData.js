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
  // Web & Mobile Development
  { name: 'React.js', category: 'Web Development', description: 'Popular frontend JavaScript library for building interactive user interfaces.' },
  { name: 'Node.js', category: 'Web Development', description: 'Server-side JavaScript runtime built on Chrome V8 engine.' },
  { name: 'TypeScript', category: 'Web Development', description: 'Typed superset of JavaScript for scalable web application development.' },
  { name: 'Next.js', category: 'Web Development', description: 'Full-stack React framework with server-side rendering and static generation.' },
  { name: 'Flutter & Dart', category: 'Mobile Development', description: 'Cross-platform mobile app development framework for iOS and Android.' },
  
  // Programming Languages
  { name: 'Python', category: 'Programming', description: 'General-purpose programming language for web, data science, and automation.' },
  { name: 'Java', category: 'Programming', description: 'Object-oriented programming language for enterprise systems and Android apps.' },
  { name: 'C++', category: 'Programming', description: 'High-performance system programming language for games and systems.' },
  { name: 'Go (Golang)', category: 'Programming', description: 'Statically typed language built for fast backend microservices and concurrency.' },
  
  // AI & Data Science
  { name: 'Machine Learning', category: 'Machine Learning', description: 'Predictive modeling, scikit-learn, PyTorch, and artificial intelligence.' },
  { name: 'Deep Learning & PyTorch', category: 'Machine Learning', description: 'Neural networks, computer vision, and NLP model training.' },
  { name: 'Data Science & Pandas', category: 'Data Science', description: 'Data analysis, visualization, pandas, numpy, and matplotlib.' },
  { name: 'SQL & Database Design', category: 'Database', description: 'Relational database management, SQL queries, indexing, and modeling.' },

  // Design & Creative
  { name: 'UI/UX Design', category: 'UI/UX Design', description: 'User experience and interface design using Figma and design principles.' },
  { name: 'Video Editing', category: 'Video Production', description: 'Post-production video editing using Premiere Pro and DaVinci Resolve.' },
  { name: 'Photography & Editing', category: 'Photography', description: 'Composition, lighting, Lightroom, and digital photo editing.' },

  // Cloud & Infrastructure
  { name: 'AWS & Cloud Architecture', category: 'Cloud Computing', description: 'Amazon Web Services, EC2, S3, Lambda, and cloud architecture.' },
  { name: 'Docker & DevOps', category: 'DevOps', description: 'Containerization, CI/CD pipelines, Docker, and Kubernetes basics.' },
  { name: 'Cyber Security Basics', category: 'Cyber Security', description: 'Network security, ethical hacking fundamentals, and cryptography.' },

  // Languages & Communication
  { name: 'Spanish', category: 'Languages', description: 'Conversational Spanish grammar, vocabulary, and pronunciation.' },
  { name: 'Conversational French', category: 'Languages', description: 'French language basics, everyday conversation, and accent training.' },
  { name: 'Public Speaking', category: 'Communication', description: 'Confidence building, presentation skills, and public speaking techniques.' },
  { name: 'Technical Writing', category: 'Writing', description: 'Documentation, API guides, engineering blogs, and clear technical prose.' },

  // Business & Marketing
  { name: 'Digital Marketing & SEO', category: 'Digital Marketing', description: 'Search engine optimization, content strategy, and social media analytics.' },
  { name: 'Product Management', category: 'Business', description: 'Product roadmaps, user stories, agile sprints, and market research.' }
];

const seedAllData = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting comprehensive database seeding...');

    // 1. Seed Skills Catalog
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

    console.log(`✓ Skills catalog populated (${allSkills.length} skills ready)`);

    const getSkillId = (name) => skillsMap[name];

    // 2. Seed Users List
    const usersData = [
      {
        email: 'yasaswinikayala23@gmail.com',
        name: 'nick',
        password: 'password123',
        bio: 'Full-Stack Developer passionate about building high-performance web apps, Python data automation, and sleek UI designs.',
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
        skillsToTeach: [
          { skill: getSkillId('Python'), level: 'Expert' },
          { skill: getSkillId('Data Science & Pandas'), level: 'Advanced' },
          { skill: getSkillId('Node.js'), level: 'Intermediate' }
        ],
        skillsToLearn: [
          { skill: getSkillId('React.js'), level: 'Intermediate' },
          { skill: getSkillId('UI/UX Design'), level: 'Beginner' },
          { skill: getSkillId('AWS & Cloud Architecture'), level: 'Beginner' }
        ]
      },
      {
        email: 'rahul@example.com',
        name: 'Rahul Kumar',
        password: 'password123',
        bio: 'Frontend Specialist with 5+ years of experience in React.js and Next.js. Eager to master Python for data pipelines.',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
        skillsToTeach: [
          { skill: getSkillId('React.js'), level: 'Expert' },
          { skill: getSkillId('TypeScript'), level: 'Advanced' },
          { skill: getSkillId('Next.js'), level: 'Advanced' }
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
        bio: 'Senior Product Designer & native Spanish speaker. I design design systems in Figma and love learning web scripting.',
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
        bio: 'AI Researcher building deep learning models in PyTorch. Wanting to learn AWS deployment and cloud infrastructure.',
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
        skillsToTeach: [
          { skill: getSkillId('Machine Learning'), level: 'Expert' },
          { skill: getSkillId('Deep Learning & PyTorch'), level: 'Advanced' },
          { skill: getSkillId('Python'), level: 'Expert' }
        ],
        skillsToLearn: [
          { skill: getSkillId('AWS & Cloud Architecture'), level: 'Intermediate' },
          { skill: getSkillId('Docker & DevOps'), level: 'Beginner' }
        ]
      },
      {
        email: 'sophia@example.com',
        name: 'Sophia Chen',
        password: 'password123',
        bio: 'Cloud Architect specialized in AWS microservices and relational SQL databases. Learning Spanish and Public Speaking.',
        profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
        skillsToTeach: [
          { skill: getSkillId('AWS & Cloud Architecture'), level: 'Expert' },
          { skill: getSkillId('SQL & Database Design'), level: 'Advanced' },
          { skill: getSkillId('Docker & DevOps'), level: 'Advanced' }
        ],
        skillsToLearn: [
          { skill: getSkillId('Spanish'), level: 'Intermediate' },
          { skill: getSkillId('Public Speaking'), level: 'Beginner' }
        ]
      },
      {
        email: 'david@example.com',
        name: 'David Miller',
        password: 'password123',
        bio: 'Digital Marketer & Video Producer helping tech startups build brand presence with SEO and video content.',
        profileImage: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400',
        skillsToTeach: [
          { skill: getSkillId('Digital Marketing & SEO'), level: 'Expert' },
          { skill: getSkillId('Video Editing'), level: 'Advanced' },
          { skill: getSkillId('Photography & Editing'), level: 'Advanced' }
        ],
        skillsToLearn: [
          { skill: getSkillId('Public Speaking'), level: 'Intermediate' },
          { skill: getSkillId('Product Management'), level: 'Beginner' }
        ]
      },
      {
        email: 'emma@example.com',
        name: 'Emma Watson',
        password: 'password123',
        bio: 'Frontend engineer focused on React and Next.js performance optimizations. Wants to learn Python for automation.',
        profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
        skillsToTeach: [
          { skill: getSkillId('React.js'), level: 'Advanced' },
          { skill: getSkillId('TypeScript'), level: 'Intermediate' }
        ],
        skillsToLearn: [
          { skill: getSkillId('Python'), level: 'Beginner' },
          { skill: getSkillId('UI/UX Design'), level: 'Intermediate' }
        ]
      },
      {
        email: 'carlos@example.com',
        name: 'Carlos Rodriguez',
        password: 'password123',
        bio: 'Polyglot language teacher offering Spanish and French conversation practice. Interested in Python and web building.',
        profileImage: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400',
        skillsToTeach: [
          { skill: getSkillId('Spanish'), level: 'Expert' },
          { skill: getSkillId('Conversational French'), level: 'Advanced' }
        ],
        skillsToLearn: [
          { skill: getSkillId('Python'), level: 'Beginner' },
          { skill: getSkillId('React.js'), level: 'Beginner' }
        ]
      },
      {
        email: 'ananya@example.com',
        name: 'Ananya Patel',
        password: 'password123',
        bio: 'Data Analyst & SQL specialist with a love for Tableau and Python pandas. Eager to master UI/UX principles.',
        profileImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400',
        skillsToTeach: [
          { skill: getSkillId('Data Science & Pandas'), level: 'Advanced' },
          { skill: getSkillId('SQL & Database Design'), level: 'Expert' }
        ],
        skillsToLearn: [
          { skill: getSkillId('UI/UX Design'), level: 'Intermediate' },
          { skill: getSkillId('Machine Learning'), level: 'Beginner' }
        ]
      },
      {
        email: 'lucas@example.com',
        name: 'Lucas Vance',
        password: 'password123',
        bio: 'DevOps Engineer building Kubernetes clusters and CI/CD pipelines. Seeking to learn Golang and Cloud Security.',
        profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
        skillsToTeach: [
          { skill: getSkillId('Docker & DevOps'), level: 'Expert' },
          { skill: getSkillId('AWS & Cloud Architecture'), level: 'Advanced' }
        ],
        skillsToLearn: [
          { skill: getSkillId('Go (Golang)'), level: 'Intermediate' },
          { skill: getSkillId('Cyber Security Basics'), level: 'Intermediate' }
        ]
      }
    ];

    const usersMap = {};

    for (const uData of usersData) {
      let u = await User.findOne({ email: uData.email });
      if (!u) {
        u = new User(uData);
        await u.save();
      } else {
        u.name = uData.name;
        u.bio = uData.bio;
        u.profileImage = uData.profileImage;
        u.skillsToTeach = uData.skillsToTeach;
        u.skillsToLearn = uData.skillsToLearn;
        u.password = uData.password; // Triggers pre('save') password hashing
        await u.save();
      }
      usersMap[u.email] = u;
    }


    console.log(`✓ Users created & skill portfolios populated (${usersData.length} users ready)`);

    const nick = usersMap['yasaswinikayala23@gmail.com'];
    const rahul = usersMap['rahul@example.com'];
    const priya = usersMap['priya@example.com'];
    const arjun = usersMap['arjun@example.com'];
    const sophia = usersMap['sophia@example.com'];
    const david = usersMap['david@example.com'];
    const emma = usersMap['emma@example.com'];
    const carlos = usersMap['carlos@example.com'];
    const ananya = usersMap['ananya@example.com'];

    // 3. Create Diverse Exchange Requests
    // Request 1: nick <-> rahul (Accepted)
    const ex1 = await ExchangeRequest.findOneAndUpdate(
      { sender: nick._id, receiver: rahul._id },
      {
        sender: nick._id,
        receiver: rahul._id,
        offeredSkill: getSkillId('Python'),
        requestedSkill: getSkillId('React.js'),
        message: 'Hi Rahul! I saw you teach React.js. I can teach you Python data analysis in exchange!',
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
        message: 'Hi Nick! Let us connect to discuss Machine Learning models & Pandas data processing pipelines.',
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
        requestedSkill: getSkillId('AWS & Cloud Architecture'),
        message: 'Hello Sophia! I am interested in cloud deployment on AWS EC2 & S3.',
        status: 'pending'
      },
      { upsert: true, new: true }
    );

    // Request 5: emma -> nick (Accepted)
    const ex5 = await ExchangeRequest.findOneAndUpdate(
      { sender: emma._id, receiver: nick._id },
      {
        sender: emma._id,
        receiver: nick._id,
        offeredSkill: getSkillId('React.js'),
        requestedSkill: getSkillId('Python'),
        message: 'Hi Nick! I can help you master React component performance if you guide me in Python automation.',
        status: 'accepted'
      },
      { upsert: true, new: true }
    );

    // Request 6: carlos -> nick (Pending)
    const ex6 = await ExchangeRequest.findOneAndUpdate(
      { sender: carlos._id, receiver: nick._id },
      {
        sender: carlos._id,
        receiver: nick._id,
        offeredSkill: getSkillId('Spanish'),
        requestedSkill: getSkillId('Python'),
        message: 'Hola Nick! I can offer conversational Spanish lessons in exchange for beginner Python tutorials.',
        status: 'pending'
      },
      { upsert: true, new: true }
    );

    // Request 7: nick -> david (Rejected)
    await ExchangeRequest.findOneAndUpdate(
      { sender: nick._id, receiver: david._id },
      {
        sender: nick._id,
        receiver: david._id,
        offeredSkill: getSkillId('Python'),
        requestedSkill: getSkillId('Digital Marketing & SEO'),
        message: 'Hi David! Interested in learning SEO basics.',
        status: 'rejected'
      },
      { upsert: true, new: true }
    );

    console.log('✓ Exchange requests populated across partners');

    // 4. Conversations & Detailed Messages
    // Conversation 1: nick & rahul
    let conv1 = await Conversation.findOne({ exchangeRequest: ex1._id });
    if (!conv1) {
      conv1 = await Conversation.create({
        participants: [nick._id, rahul._id],
        exchangeRequest: ex1._id,
        lastMessage: 'Awesome! Let us meet tomorrow at 6:00 PM for the React component tutorial.',
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
        createdAt: new Date(Date.now() - 3600000 * 8)
      },
      {
        conversation: conv1._id,
        sender: rahul._id,
        receiver: nick._id,
        text: 'Hey Nick! Glad to connect. I am really excited to learn Python data analysis from you!',
        read: true,
        createdAt: new Date(Date.now() - 3600000 * 7)
      },
      {
        conversation: conv1._id,
        sender: nick._id,
        receiver: rahul._id,
        text: 'Sounds great! I can walk you through Python syntax, functions, list comprehensions, and Pandas dataframes.',
        read: true,
        createdAt: new Date(Date.now() - 3600000 * 5)
      },
      {
        conversation: conv1._id,
        sender: rahul._id,
        receiver: nick._id,
        text: 'That is perfect! And for React, we will build a full stateful component with custom hooks.',
        read: true,
        createdAt: new Date(Date.now() - 3600000 * 3)
      },
      {
        conversation: conv1._id,
        sender: rahul._id,
        receiver: nick._id,
        text: 'Awesome! Let us meet tomorrow at 6:00 PM for the React component tutorial.',
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
        lastMessage: 'Hi Nick! I prepared a design system template in Figma for our session.',
        lastMessageAt: new Date(Date.now() - 1800000)
      });
    }

    await Message.deleteMany({ conversation: conv2._id });
    await Message.create([
      {
        conversation: conv2._id,
        sender: priya._id,
        receiver: nick._id,
        text: 'Hola Nick! Thanks for accepting my request. Looking forward to our design & code exchange.',
        read: true,
        createdAt: new Date(Date.now() - 3600000 * 4)
      },
      {
        conversation: conv2._id,
        sender: nick._id,
        receiver: priya._id,
        text: 'Hey Priya! Absolutely. I am super excited to learn Figma autolayout and color theory from you!',
        read: true,
        createdAt: new Date(Date.now() - 3600000 * 2)
      },
      {
        conversation: conv2._id,
        sender: priya._id,
        receiver: nick._id,
        text: 'Hi Nick! I prepared a design system template in Figma for our session.',
        read: false,
        createdAt: new Date(Date.now() - 1800000)
      }
    ]);

    // Conversation 3: nick & emma
    let conv3 = await Conversation.findOne({ exchangeRequest: ex5._id });
    if (!conv3) {
      conv3 = await Conversation.create({
        participants: [nick._id, emma._id],
        exchangeRequest: ex5._id,
        lastMessage: 'Sounds good! See you on Friday.',
        lastMessageAt: new Date(Date.now() - 7200000)
      });
    }

    await Message.deleteMany({ conversation: conv3._id });
    await Message.create([
      {
        conversation: conv3._id,
        sender: emma._id,
        receiver: nick._id,
        text: 'Hi Nick! Thanks for connecting. I can help you with React performance & memoization.',
        read: true,
        createdAt: new Date(Date.now() - 3600000 * 10)
      },
      {
        conversation: conv3._id,
        sender: nick._id,
        receiver: emma._id,
        text: 'Thanks Emma! And I will teach you Python web scraping and automation scripts.',
        read: true,
        createdAt: new Date(Date.now() - 3600000 * 8)
      },
      {
        conversation: conv3._id,
        sender: emma._id,
        receiver: nick._id,
        text: 'Sounds good! See you on Friday.',
        read: true,
        createdAt: new Date(Date.now() - 7200000)
      }
    ]);

    console.log('✓ Conversations & messages populated');

    // 5. Create Sessions
    await Session.deleteMany({});

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(18, 0, 0, 0);

    const inThreeDays = new Date();
    inThreeDays.setDate(inThreeDays.getDate() + 3);
    inThreeDays.setHours(19, 0, 0, 0);

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 6);
    nextWeek.setHours(17, 30, 0, 0);

    const pastDate1 = new Date();
    pastDate1.setDate(pastDate1.getDate() - 2);

    const pastDate2 = new Date();
    pastDate2.setDate(pastDate2.getDate() - 5);

    await Session.create([
      {
        exchangeRequest: ex1._id,
        organizer: rahul._id,
        participant: nick._id,
        title: 'React Components & Custom Hooks Deep Dive',
        description: 'Covering useState, useEffect, custom hooks, and state management best practices.',
        scheduledAt: tomorrow,
        duration: 60,
        status: 'scheduled'
      },
      {
        exchangeRequest: ex2._id,
        organizer: priya._id,
        participant: nick._id,
        title: 'Figma Design Systems & Responsive Layouts',
        description: 'Introduction to Figma autolayout, component libraries, and color palette creation.',
        scheduledAt: inThreeDays,
        duration: 90,
        status: 'scheduled'
      },
      {
        exchangeRequest: ex5._id,
        organizer: nick._id,
        participant: emma._id,
        title: 'React Performance & Memoization Techniques',
        description: 'Exploring React.memo, useMemo, and useCallback optimizations.',
        scheduledAt: nextWeek,
        duration: 60,
        status: 'scheduled'
      },
      {
        exchangeRequest: ex1._id,
        organizer: nick._id,
        participant: rahul._id,
        title: 'Python Fundamentals & Data Structures',
        description: 'First introductory session covering list comprehensions and dictionaries.',
        scheduledAt: pastDate1,
        duration: 60,
        status: 'completed'
      },
      {
        exchangeRequest: ex2._id,
        organizer: nick._id,
        participant: priya._id,
        title: 'Intro to Python Data Analysis with Pandas',
        description: 'Covering DataFrames, series, CSV parsing, and filtering datasets.',
        scheduledAt: pastDate2,
        duration: 60,
        status: 'completed'
      }
    ]);

    console.log('✓ Scheduled & completed sessions populated');

    // 6. Create Notifications
    await Notification.deleteMany({ recipient: nick._id });

    await Notification.create([
      {
        recipient: nick._id,
        sender: rahul._id,
        type: 'session_created',
        title: 'New Session Scheduled',
        message: 'Rahul Kumar scheduled "React Components & Custom Hooks Deep Dive" for tomorrow at 6:00 PM',
        relatedId: ex1._id,
        read: false
      },
      {
        recipient: nick._id,
        sender: rahul._id,
        type: 'new_message',
        title: 'New message from Rahul Kumar',
        message: 'Awesome! Let us meet tomorrow at 6:00 PM for the React component tutorial.',
        relatedId: conv1._id,
        read: false
      },
      {
        recipient: nick._id,
        sender: priya._id,
        type: 'new_message',
        title: 'New message from Priya Sharma',
        message: 'Hi Nick! I prepared a design system template in Figma for our session.',
        relatedId: conv2._id,
        read: false
      },
      {
        recipient: nick._id,
        sender: arjun._id,
        type: 'exchange_request',
        title: 'New Skill Exchange Request',
        message: 'Arjun Mehta sent you a skill exchange request for Machine Learning!',
        relatedId: ex3._id,
        read: false
      },
      {
        recipient: nick._id,
        sender: carlos._id,
        type: 'exchange_request',
        title: 'New Skill Exchange Request',
        message: 'Carlos Rodriguez sent you a skill exchange request for Spanish!',
        relatedId: ex6._id,
        read: false
      },
      {
        recipient: nick._id,
        sender: emma._id,
        type: 'request_accepted',
        title: 'Exchange Request Accepted!',
        message: 'Emma Watson accepted your skill exchange request for React.js!',
        relatedId: ex5._id,
        read: true
      }
    ]);

    console.log('✓ Notifications populated');
    console.log('🎉 Comprehensive database seeding completed successfully!');
  } catch (err) {
    console.error('❌ Database seeding failed:', err);
  }
};

module.exports = seedAllData;

if (require.main === module) {
  seedAllData().then(() => mongoose.connection.close());
}
