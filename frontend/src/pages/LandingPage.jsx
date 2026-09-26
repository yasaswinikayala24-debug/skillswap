import React from 'react';
import { Link } from 'react-router-dom';
import { ConstellationField } from '../shaders/constellation-field/ConstellationField';
import '../shaders/threeui.css';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Users,
  Award,
  Zap,
  Code,
  Palette,
  Globe,
  TrendingUp,
  MessageSquare,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

const LandingPage = () => {
  const popularSkills = [
    { name: 'Full-Stack Web Dev', category: 'Technology', icon: Code, count: '1.2k learners' },
    { name: 'UI/UX & Product Design', category: 'Design', icon: Palette, count: '850 learners' },
    { name: 'Spanish & Japanese', category: 'Languages', icon: Globe, count: '2.1k learners' },
    { name: 'Digital Marketing & SEO', category: 'Business', icon: TrendingUp, count: '640 learners' },
    { name: 'Public Speaking', category: 'Personal Growth', icon: MessageSquare, count: '920 learners' },
    { name: 'Data Science & Python', category: 'Technology', icon: Zap, count: '1.5k learners' },
  ];

  const steps = [
    {
      number: '01',
      title: 'Create Your Skill Profile',
      description: 'Sign up and showcase the skills you can teach alongside the skills you are eager to learn.',
      icon: BookOpen,
    },
    {
      number: '02',
      title: 'Discover Compatible Partners',
      description: 'Our matching algorithm pairs you with peers who hold the exact knowledge you seek.',
      icon: Users,
    },
    {
      number: '03',
      title: 'Swap Knowledge 1-on-1',
      description: 'Schedule interactive peer sessions and grow together through real hands-on learning.',
      icon: Award,
    },
  ];

  const whyChooseUs = [
    '100% Free Peer-to-Peer Knowledge Sharing',
    'Learn at Your Own Pace with Real Mentors',
    'Build a Verified Skill Portfolio & Network',
    'Mutual Exchange Ensures Balanced Learning',
  ];

  return (
    <div className="relative space-y-24 pb-20 min-h-screen">
      {/* Background Animated Constellation Field Wallpaper (Landing Page Only) */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-50">
        <ConstellationField
          mode="dark"
          speed={1.00}
          size={1.00}
          strokeWidth={1.00}
          length={1.00}
          density={1.00}
          opacity={1.00}
          hue={0}
          saturation={1.00}
          brightness={1.00}
        />
      </div>
      {/* Hero Section */}
      <section className="relative pt-16 pb-12 overflow-hidden">
        {/* Glow background elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-purple-600/15 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-8 shadow-lg shadow-indigo-950/50 animate-fadeIn">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>The Future of Collaborative Learning</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            SkillSwap
          </h1>

          <p className="mt-4 text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-100 bg-clip-text text-transparent">
            Learn. Teach. Exchange.
          </p>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Connect with people who have the skills you want to learn and share the skills you know.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 transition-all hover:shadow-indigo-500/50 hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-white font-semibold text-base border border-slate-700/80 transition-all hover:border-slate-600"
            >
              <span>Login</span>
            </Link>
          </div>

          {/* Stats teaser */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-800/80">
            <div>
              <p className="text-3xl font-extrabold text-white">5,000+</p>
              <p className="text-xs text-slate-400 font-medium mt-1">Active Swappers</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white">350+</p>
              <p className="text-xs text-slate-400 font-medium mt-1">Skills Exchanged</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white">12,000+</p>
              <p className="text-xs text-slate-400 font-medium mt-1">Session Hours</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white">99%</p>
              <p className="text-xs text-slate-400 font-medium mt-1">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* How SkillSwap Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">Step-By-Step Process</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">How SkillSwap Works</p>
          <p className="mt-4 text-slate-400">Trade knowledge seamlessly in three straightforward steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl bg-slate-800/40 border border-slate-700/60 p-8 backdrop-blur-sm hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-slate-700 group-hover:text-indigo-500/40 transition-colors">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why SkillSwap */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/80 border border-slate-800 p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2 block">Our Value Proposition</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 leading-tight">
                Why SkillSwap is the Smarter Way to Learn
              </h2>
              <p className="text-slate-300 text-base leading-relaxed mb-8">
                Traditional courses are expensive and static. SkillSwap unlocks human potential by connecting you directly with passionate practitioners who want to learn what you already know.
              </p>

              <div className="space-y-4">
                {whyChooseUs.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-slate-200 font-medium text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
                <div className="flex items-center space-x-4 border-b border-slate-800 pb-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-lg">
                    JD
                  </div>
                  <div>
                    <p className="font-bold text-white text-base">John Doe</p>
                    <p className="text-xs text-indigo-400 font-medium">Teaches Python • Learns Web Design</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
                  <span className="font-semibold text-emerald-400">Match Status: Active</span>
                  <span>100% Peer Exchange</span>
                </div>
                <p className="text-xs text-slate-400 italic">
                  "I taught Python data structures in exchange for responsive Tailwind CSS styling lessons. It's the most effective way I've ever learned!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Skills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">Explore Exchange Topics</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">Popular Skills on SkillSwap</p>
          <p className="mt-4 text-slate-400">Discover top categories currently being shared in our community.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularSkills.map((skill, idx) => {
            const SkillIcon = skill.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 hover:border-indigo-500/40 transition-all duration-300 flex items-start space-x-4"
              >
                <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400 shrink-0">
                  <SkillIcon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">{skill.category}</span>
                  <h3 className="text-lg font-bold text-white mt-0.5 mb-1">{skill.name}</h3>
                  <p className="text-xs text-slate-400">{skill.count}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-10 sm:p-16 text-center text-white relative overflow-hidden shadow-2xl">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Ready to Swap Skills?
          </h2>
          <p className="text-indigo-100 max-w-2xl mx-auto text-base sm:text-lg mb-8">
            Join thousands of learners and teachers swapping knowledge around the world. Create your account in less than 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-indigo-900 font-bold hover:bg-slate-100 transition-colors shadow-lg"
            >
              Get Started Now
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-800/80 hover:bg-indigo-800 text-white font-semibold border border-indigo-400/40 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
