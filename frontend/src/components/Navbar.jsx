import { memo, useState, useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Tv, LogOut, LayoutDashboard, Upload, FileText,
  ClipboardCheck, Archive, ChevronLeft, Menu
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
const teacherLinks = [
  { to: '/teacher', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/teacher/upload', label: 'Upload Content', icon: Upload },
  { to: '/teacher/content', label: 'My Content', icon: FileText },
];
const principalLinks = [
  { to: '/principal', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/principal/pending', label: 'Pending Approvals', icon: ClipboardCheck },
  { to: '/principal/content', label: 'All Content', icon: Archive },
];
const Navbar = () => {
  const { user, logout, isTeacher } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const links = isTeacher ? teacherLinks : principalLinks;
  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);
  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 bg-black/40 backdrop-blur-xl border-b border-white/5 z-40 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(prev => !prev)}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white lg:hidden"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Tv size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight hidden sm:block">EDU-CAST</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">{user?.name || 'User'}</p>
            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">{user?.role}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
            {(user?.name || 'U').charAt(0).toUpperCase()}
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-rose-400"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>
      <aside className={`fixed top-16 left-0 bottom-0 bg-black/20 backdrop-blur-xl border-r border-white/5 z-30 transition-all duration-300 ${sidebarOpen ? 'w-60' : 'w-0 lg:w-16'} overflow-hidden`}>
        <nav className="flex flex-col gap-1 p-3 mt-4">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${isActive
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`
              }
            >
              <link.icon size={18} className="flex-shrink-0" />
              <span className={`${sidebarOpen ? 'block' : 'hidden lg:hidden'} truncate`}>{link.label}</span>
            </NavLink>
          ))}
        </nav>
        <button
          onClick={() => setSidebarOpen(prev => !prev)}
          className="absolute bottom-4 left-0 right-0 mx-auto w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all hidden lg:flex"
        >
          <ChevronLeft size={16} className={`transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
        </button>
      </aside>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};
export default memo(Navbar);
