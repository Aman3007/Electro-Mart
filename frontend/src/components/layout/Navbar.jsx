import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { getAvatarUrl } from '../../utils/helpers';

const Navbar = () => {
  const { user } = useSelector(state => state.auth);
  const { conversations } = useSelector(state => state.chat);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const totalUnread = conversations.reduce((acc, c) => acc + (c.myUnreadCount || 0), 0);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
    setProfileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-dark-950/90 backdrop-blur-md border-b border-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-dark-950 font-bold text-lg group-hover:glow transition-all">
              ⚡
            </div>
            <span className="text-xl font-bold font-display text-gradient">ElectroMart</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-primary-400 bg-primary-500/10' : 'text-dark-200 hover:text-white hover:bg-dark-800'}`
            }>Home</NavLink>
            <NavLink to="/contact" className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-primary-400 bg-primary-500/10' : 'text-dark-200 hover:text-white hover:bg-dark-800'}`
            }>Contact</NavLink>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Create listing button */}
                <Link to="/create-listing" className="hidden sm:flex btn-primary text-sm py-2 px-4">
                  <span>+</span> Sell Item
                </Link>

                {/* Chat */}
                <Link to="/chat" className="relative p-2 rounded-lg text-dark-200 hover:text-white hover:bg-dark-800 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {totalUnread > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger text-white text-xs rounded-full flex items-center justify-center">
                      {totalUnread > 9 ? '9+' : totalUnread}
                    </span>
                  )}
                </Link>

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1 rounded-lg hover:bg-dark-800 transition-colors"
                  >
                    <img
                      src={getAvatarUrl(user.avatar, user.name)}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border border-dark-600"
                    />
                    <svg className="w-4 h-4 text-dark-300 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-dark-900 border border-dark-700 rounded-xl shadow-xl z-50 animate-fade-in">
                      <div className="p-3 border-b border-dark-700">
                        <p className="text-sm font-semibold text-white">{user.name}</p>
                        <p className="text-xs text-dark-300 truncate">{user.email}</p>
                      </div>
                      <div className="p-1">
                        <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm text-dark-200 hover:text-white hover:bg-dark-800 rounded-lg transition-colors" onClick={() => setProfileOpen(false)}>
                          <span>📊</span> Dashboard
                        </Link>
                        <Link to={`/profile/${user._id}`} className="flex items-center gap-2 px-3 py-2 text-sm text-dark-200 hover:text-white hover:bg-dark-800 rounded-lg transition-colors" onClick={() => setProfileOpen(false)}>
                          <span>👤</span> My Profile
                        </Link>
                        <Link to="/create-listing" className="flex items-center gap-2 px-3 py-2 text-sm text-dark-200 hover:text-white hover:bg-dark-800 rounded-lg transition-colors sm:hidden" onClick={() => setProfileOpen(false)}>
                          <span>➕</span> Sell Item
                        </Link>
                        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-dark-800 rounded-lg transition-colors">
                          <span>🚪</span> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm py-2 px-4 hidden sm:flex">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-dark-200 hover:text-white hover:bg-dark-800"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-3 border-t border-dark-800 animate-fade-in">
            <div className="flex flex-col gap-1">
              <NavLink to="/" end className="px-3 py-2 text-sm text-dark-200 hover:text-white" onClick={() => setMenuOpen(false)}>Home</NavLink>
              <NavLink to="/contact" className="px-3 py-2 text-sm text-dark-200 hover:text-white" onClick={() => setMenuOpen(false)}>Contact</NavLink>
              {!user && (
                <Link to="/login" className="px-3 py-2 text-sm text-dark-200 hover:text-white" onClick={() => setMenuOpen(false)}>Login</Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Backdrop for profile dropdown */}
      {profileOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
      )}
    </nav>
  );
};

export default Navbar;