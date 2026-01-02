import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto">
      {/* قسم التواصل والروابط - خلفية فاتحة */}
      <div className="py-24 px-6 bg-slate-50 border-t border-slate-200" id="contact">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            
            {/* العمود 1: السوشيال ميديا */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">سوشيال ميديا</h3>
              <ul className="space-y-4 text-sm text-slate-500">
                <li>
                  <a href="https://www.facebook.com/hamzaDXE" target="_blank" rel="noopener noreferrer" className="hover:text-brand-red transition flex items-center gap-2">
                    فيسبوك
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/h7amza318/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-purple transition flex items-center gap-2">
                    إنستجرام
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900 transition flex items-center gap-2">
                    تويتر / X
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-red-600 transition flex items-center gap-2">
                    يوتيوب
                  </a>
                </li>
              </ul>
            </div>

            {/* العمود 2: تواصل مباشر */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">تواصل مباشر</h3>
              <ul className="space-y-4 text-sm text-slate-500">
                <li>
                  <a href="mailto:contact@example.com" className="hover:text-brand-red transition flex items-center gap-2">
                    الإيميل الرسمي
                  </a>
                </li>
                <li>
                  <Link to="/create-post" className="hover:text-brand-red transition">
                     للأعمال والتعاون
                  </Link>
                </li>
              </ul>
            </div>

            {/* العمود 3: تصفح */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">تصفح</h3>
              <ul className="space-y-4 text-sm text-slate-500">
                <li>
                  <Link to="/" className="hover:text-brand-green transition">الرئيسية</Link>
                </li>
                <li>
                  <Link to="/blog" className="hover:text-brand-green transition">المدونة</Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-brand-green transition">تسجيل الدخول</Link>
                </li>
                <li>
                   <span className="text-slate-400 cursor-not-allowed">التطبيقات (قريباً)</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* قسم الحقوق - خلفية غامقة */}
      <div className="bg-slate-900 border-t border-slate-800 text-slate-400 py-10 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="mb-2 font-medium">
            © {new Date().getFullYear()} جميع الحقوق محفوظة لـ 
            <span className="font-bold mx-1 select-none text-slate-200">
               pl.m
            </span>
          </p>
          <div className="flex justify-center gap-2 text-sm opacity-60">
            <span className="w-2 h-2 rounded-full bg-brand-green block"></span>
            <span className="w-2 h-2 rounded-full bg-brand-purple block"></span>
            <span className="w-2 h-2 rounded-full bg-brand-red block"></span>
          </div>
          <p className="text-xs mt-2 opacity-50">معمولة بمزاج وكود نضيف</p>
        </div>
      </div>
    </footer>
  );
};