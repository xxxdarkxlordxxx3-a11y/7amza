import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User as UserIcon, Loader2 } from 'lucide-react';

export const Login: React.FC = () => {
  const isSignup = useLocation().pathname === '/signup';
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSignup) {
        if (!name) throw new Error('لازم تكتب اسمك');
        if (password.length < 6) throw new Error('الباسوورد قصير أوي، خليه 6 حروف على الأقل');
        
        await signup(email, name, password);
      } else {
        await login(email, password);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'حصلت مشكلة غريبة، جرب تاني');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white/95 backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up border border-white/20">
        <div className="text-center mb-8">
          {/* Updated Gradient: Green -> Purple -> Red */}
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-green via-brand-purple to-brand-red mb-2">
            {isSignup ? 'انضم للعيلة' : 'نورت يا غالي'}
          </h2>
          <p className="text-slate-500">
            {isSignup ? 'سجل حساب جديد وابقى واحد مننا' : 'سجل دخول عشان تكمل تصفح'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-brand-red p-3 rounded mb-4 text-sm text-center border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignup && (
            <div className="relative group">
              <UserIcon className="absolute right-3 top-3.5 text-slate-400 group-focus-within:text-brand-red transition" size={20} />
              <input
                type="text"
                placeholder="الاسم"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pr-10 pl-4 py-3 rounded-xl border border-slate-200 focus:border-brand-red focus:ring-2 focus:ring-red-200 outline-none transition bg-slate-50 focus:bg-white"
              />
            </div>
          )}

          <div className="relative group">
            <Mail className="absolute right-3 top-3.5 text-slate-400 group-focus-within:text-brand-red transition" size={20} />
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pr-10 pl-4 py-3 rounded-xl border border-slate-200 focus:border-brand-red focus:ring-2 focus:ring-red-200 outline-none transition bg-slate-50 focus:bg-white"
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute right-3 top-3.5 text-slate-400 group-focus-within:text-brand-red transition" size={20} />
            <input
              type="password"
              placeholder="كلمة السر"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pr-10 pl-4 py-3 rounded-xl border border-slate-200 focus:border-brand-red focus:ring-2 focus:ring-red-200 outline-none transition bg-slate-50 focus:bg-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-ios-gradient rounded-full font-bold py-3 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (isSignup ? 'إنشاء حساب' : 'دخول')}
          </button>
        </form>

        <div className="mt-6 text-center text-slate-600">
          {isSignup ? 'عندك حساب أصلاً؟ ' : 'لسة معملتش حساب؟ '}
          <button
            onClick={() => {
                setError('');
                navigate(isSignup ? '/login' : '/signup');
            }}
            className="text-brand-red font-bold hover:underline hover:text-red-800"
          >
            {isSignup ? 'سجل دخول' : 'اعمل واحد دلوقتي'}
          </button>
        </div>
      </div>
    </div>
  );
};