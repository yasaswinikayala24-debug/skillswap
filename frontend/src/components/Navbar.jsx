import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Repeat,
  LayoutDashboard,
  Sliders,
  Compass,
  Users,
  Sparkles,
  Inbox,
  MessageSquare,
  Calendar,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  ArrowRight
} from 'lucide-react';

const Navbar = () => {
  const {
    user,
    isAuthenticated,
    logout,
    unreadNotificationsCount,
    unreadMessagesCount,
    pendingRequestsCount
  } = useContext(AuthContext);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link
            to={isAuthenticated ? '/dashboard' : '/'}
            className="flex items-center space-x-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-600/20 group-hover:scale-105 transition-transform">
              <Repeat className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-purple-300 bg-clip-text text-transparent tracking-tight">
                SkillSwap
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider -mt-1 uppercase hidden sm:block">
                Learn. Teach. Exchange.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center space-x-1">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className={`text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${
                    isActive('/') ? 'text-purple-400 font-bold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/login"
                  className={`text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${
                    isActive('/login') ? 'text-purple-400 font-bold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center space-x-2 text-xs font-bold px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 transition-all ml-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-1 text-xs font-semibold px-2 py-1.5 rounded-lg transition-colors ${
                    isActive('/dashboard')
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/my-skills"
                  className={`flex items-center space-x-1 text-xs font-semibold px-2 py-1.5 rounded-lg transition-colors ${
                    isActive('/my-skills')
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Skills</span>
                </Link>

                <Link
                  to="/skills"
                  className={`flex items-center space-x-1 text-xs font-semibold px-2 py-1.5 rounded-lg transition-colors ${
                    isActive('/skills')
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Explore</span>
                </Link>

                <Link
                  to="/find-people"
                  className={`flex items-center space-x-1 text-xs font-semibold px-2 py-1.5 rounded-lg transition-colors ${
                    isActive('/find-people')
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>People</span>
                </Link>

                <Link
                  to="/matches"
                  className={`flex items-center space-x-1 text-xs font-semibold px-2 py-1.5 rounded-lg transition-colors ${
                    isActive('/matches')
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Matches</span>
                </Link>

                <Link
                  to="/requests"
                  className={`flex items-center space-x-1 text-xs font-semibold px-2 py-1.5 rounded-lg transition-colors relative ${
                    isActive('/requests')
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Inbox className="w-3.5 h-3.5" />
                  <span>Requests</span>
                  {pendingRequestsCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-extrabold animate-pulse">
                      {pendingRequestsCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/my-exchanges"
                  className={`flex items-center space-x-1 text-xs font-semibold px-2 py-1.5 rounded-lg transition-colors ${
                    isActive('/my-exchanges')
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Repeat className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Exchanges</span>
                </Link>

                <Link
                  to="/chat"
                  className={`flex items-center space-x-1 text-xs font-semibold px-2 py-1.5 rounded-lg transition-colors relative ${
                    isActive('/chat')
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                  <span>Chat</span>
                  {unreadMessagesCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-purple-600 text-white text-[10px] font-extrabold">
                      {unreadMessagesCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/my-sessions"
                  className={`flex items-center space-x-1 text-xs font-semibold px-2 py-1.5 rounded-lg transition-colors ${
                    isActive('/my-sessions')
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sessions</span>
                </Link>

                <Link
                  to="/notifications"
                  className={`flex items-center space-x-1 text-xs font-semibold px-2 py-1.5 rounded-lg transition-colors relative ${
                    isActive('/notifications')
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Alerts</span>
                  {unreadNotificationsCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-indigo-500 text-white text-[10px] font-extrabold animate-pulse">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/profile"
                  className={`flex items-center space-x-1 text-xs font-semibold px-2 py-1.5 rounded-lg transition-colors ${
                    isActive('/profile')
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-3.5 h-3.5 rounded-full object-cover border border-purple-500/40"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <User className="w-3.5 h-3.5" />
                  )}
                  <span>Profile</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-xs font-semibold px-2 py-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex xl:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-slate-800 bg-slate-900/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
          {!isAuthenticated ? (
            <>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  isActive('/') ? 'bg-purple-600/20 text-purple-400 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                Home
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  isActive('/login') ? 'bg-purple-600/20 text-purple-400 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-lg shadow-purple-600/30"
              >
                Register Account
              </Link>
            </>
          ) : (
            <>
              <div className="px-3 py-2 border-b border-slate-800 mb-2">
                <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              </div>

              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive('/dashboard') ? 'bg-purple-600/20 text-purple-400 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/my-skills"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive('/my-skills') ? 'bg-purple-600/20 text-purple-400 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>My Skills</span>
              </Link>

              <Link
                to="/skills"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive('/skills') ? 'bg-purple-600/20 text-purple-400 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Explore Skills</span>
              </Link>

              <Link
                to="/find-people"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive('/find-people') ? 'bg-purple-600/20 text-purple-400 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Find People</span>
              </Link>

              <Link
                to="/matches"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive('/matches') ? 'bg-purple-600/20 text-purple-400 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Matches</span>
              </Link>

              <Link
                to="/requests"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive('/requests') ? 'bg-purple-600/20 text-purple-400 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Inbox className="w-4 h-4" />
                  <span>Requests</span>
                </div>
                {pendingRequestsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold">
                    {pendingRequestsCount}
                  </span>
                )}
              </Link>

              <Link
                to="/my-exchanges"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive('/my-exchanges') ? 'bg-purple-600/20 text-purple-400 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Repeat className="w-4 h-4 text-emerald-400" />
                <span>Active Exchanges</span>
              </Link>

              <Link
                to="/chat"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive('/chat') ? 'bg-purple-600/20 text-purple-400 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                  <span>Real-time Chat</span>
                </div>
                {unreadMessagesCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white text-xs font-bold">
                    {unreadMessagesCount}
                  </span>
                )}
              </Link>

              <Link
                to="/my-sessions"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive('/my-sessions') ? 'bg-purple-600/20 text-purple-400 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Scheduled Sessions</span>
              </Link>

              <Link
                to="/notifications"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive('/notifications') ? 'bg-purple-600/20 text-purple-400 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Bell className="w-4 h-4 text-indigo-400" />
                  <span>Notifications</span>
                </div>
                {unreadNotificationsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500 text-white text-xs font-bold">
                    {unreadNotificationsCount}
                  </span>
                )}
              </Link>

              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive('/profile') ? 'bg-purple-600/20 text-purple-400 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
