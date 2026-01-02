import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, User as UserIcon, PlusCircle, Settings } from 'lucide-react';

interface NavbarProps {
  onTriggerEasterEgg: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onTriggerEasterEgg }) => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClass = `fixed w-full top-0 z-50 transition-all duration-300 ${
    scrolled ? 'glass-nav shadow-sm py-2' : 'bg-transparent py-4'
  }`;

  const isActive = (path: string) => 
    location.pathname === path 
      ? "text-brand-red font-bold bg-red-50 px-3 py-1 rounded-lg" 
      : "text-slate-600 hover:text-brand-red px-3 py-1 font-medium transition";

  return (
    <nav className={navClass}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-14">
          
          {/* Logo with Easter Egg Trigger (Double Click) */}
          <Link 
            to="/" 
            onDoubleClick={(e) => {
              e.preventDefault(); // Optional: prevent text selection issues
              onTriggerEasterEgg();
            }}
            className="text-2xl font-black tracking-tighter flex items-center gap-1 group select-none cursor-pointer -mt-4"
            title="Double click for a surprise..."
          >
            <span className="bg-gradient-to-r from-brand-green via-brand-purple to-brand-red text-transparent bg-clip-text group-hover:scale-105 transition-transform">pl.m</span>
          </Link>

          {/* Desktop Menu - Raised with -mt-4 */}
          <div className="hidden md:flex items-center space-x-2 space-x-reverse -mt-4">
            <div className="flex space-x-2 space-x-reverse ml-6">
               <Link to="/" className={isActive('/')}>الرئيسية</Link>
               <Link to="/portfolio" className={isActive('/portfolio')}>الأعمال</Link>
               <Link to="/blog" className={isActive('/blog')}>المدونة</Link>
            </div>

            {user ? (
              <div className="flex items-center gap-3 pl-2 border-r-2 border-slate-100 pr-4 mr-2">
                {user.role === 'ADMIN' && (
                   <Link to="/create-post" className="text-slate-900 hover:text-brand-red transition transform hover:scale-110" title="إضافة جديد">
                     <PlusCircle size={28} strokeWidth={2.5} />
                   </Link>
                )}
                
                <Link to="/profile" className="flex items-center gap-2 text-sm font-bold text-slate-700 mr-2 group hover:bg-slate-50 p-1.5 rounded-full transition pr-4">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt={user.name} className="w-8 h-8 rounded-full object-cover border-2 border-slate-200 group-hover:border-brand-purple transition" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-red to-brand-purple flex items-center justify-center text-white">
                       <UserIcon size={16} />
                    </div>
                  )}
                  <span className="group-hover:text-brand-purple transition">{user.name}</span>
                </Link>
                
                <button onClick={logout} className="p-2 text-slate-400 hover:text-brand-red transition rounded-full hover:bg-red-50" title="خروج">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                 <Link to="/login" className="text-slate-600 hover:text-brand-red font-bold text-sm px-4">تسجيل دخول</Link>
                 <Link to="/signup" className="btn-ios-dark px-5 py-2 rounded-full font-bold text-sm">
                   انضم لينا
                 </Link>
              </div>
            )}
          </div>

          {/* Mobile Button - Raised with -mt-4 for consistency */}
          <div className="md:hidden -mt-4">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-700 p-2 hover:bg-slate-100 rounded-lg transition">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl animate-fade-in-up">
          <div className="p-4 space-y-2 flex flex-col">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-4 py-3 bg-slate-50 rounded-xl font-bold text-slate-700">الرئيسية</Link>
            <Link to="/portfolio" onClick={() => setIsOpen(false)} className="block px-4 py-3 hover:bg-slate-50 rounded-xl font-medium text-slate-600">الأعمال</Link>
            <Link to="/blog" onClick={() => setIsOpen(false)} className="block px-4 py-3 hover:bg-slate-50 rounded-xl font-medium text-slate-600">المدونة</Link>
            
            <div className="border-t border-slate-100 my-2 pt-2">
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-xl">
                     {user.profilePicture ? (
                        <img src={user.profilePicture} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                           <UserIcon size={16} />
                        </div>
                      )}
                     <span className="font-bold text-slate-700">{user.name}</span>
                     <Settings size={16} className="mr-auto text-slate-400" />
                  </Link>
                  <button onClick={() => {logout(); setIsOpen(false);}} className="w-full text-right px-4 py-3 text-brand-red font-bold text-sm hover:bg-red-50 rounded-xl mt-1">خروج</button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <Link to="/login" onClick={() => setIsOpen(false)} className="text-center py-3 border border-slate-200 rounded-xl font-bold text-slate-700">دخول</Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)} className="text-center py-3 btn-ios-dark rounded-full font-bold">حساب جديد</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};