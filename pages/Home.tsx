import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Brain, Lightbulb } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-16">
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-green rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-brand-red rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/2 w-72 h-72 bg-brand-purple rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Text Column (Right Side) */}
            <div className="text-center lg:text-right order-2 lg:order-1 space-y-8">
              {/* Headline */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tight animate-fade-in-up leading-tight">
                {/* Wrapper for Marhaba */}
                <span className="relative inline-block ml-4 group cursor-default">
                  مرحباً
                  {/* Hidden Name: Hamza 
                      - Straight (no rotation)
                      - Darker color (slate-800)
                      - Position bottom-[15%]
                  */}
                  <span className="absolute bottom-[15%] left-[33%] text-[6px] md:text-[8px] text-slate-800 font-black select-none pointer-events-none tracking-tight z-10">
                    حمزة
                  </span>
                </span>
                
                ، أنا 
                <span className="relative inline-block mr-4">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green via-brand-purple to-brand-red">pl.m</span>
                </span>
              </h1>
              
              {/* Main Description */}
              <div className="space-y-6">
                <p className="text-xl md:text-3xl font-bold text-slate-700 animate-fade-in-up leading-relaxed max-w-2xl mx-auto lg:mx-0" style={{animationDelay: '0.1s'}}>
                  مطلع ومتمكن جداً من <span className="text-brand-green">تعديل الصور</span> ومتحمس <span className="text-brand-purple">للتكنولوجيا</span>.
                </p>
                
                {/* Birth Date - Separated below description with slight rotation */}
                <div className="animate-fade-in-up" style={{animationDelay: '0.15s'}}>
                   <span className="text-lg md:text-xl font-bold text-slate-500 inline-block transform -rotate-2 hover:rotate-0 transition-transform duration-300 origin-bottom-right">
                     مواليد <span className="text-brand-red mr-1">2012/9/1</span>
                   </span>
                </div>
              </div>

              {/* The Riddle */}
              <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <p className="text-lg text-slate-500 font-medium leading-relaxed bg-slate-50/50 inline-block px-6 py-3 rounded-2xl border border-slate-100 backdrop-blur-sm">
                  مش هقولك اسمي، بس هتعرفه كل ما تقعد في الموقع أكتر.
                </p>
              </div>

              {/* Buttons with Glassy iPhone Style */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-in-up pt-4" style={{animationDelay: '0.3s'}}>
                 <Link to="/blog" className="w-full sm:w-auto px-8 py-4 btn-ios-dark rounded-full font-bold flex items-center justify-center gap-2 group">
                    اقرأ المقالات <ArrowRight size={20} className="transition-transform group-hover:-translate-x-1" />
                 </Link>
                 <Link to="/signup" className="w-full sm:w-auto px-8 py-4 btn-ios rounded-full font-bold flex items-center justify-center">
                    انضم للمجتمع
                 </Link>
              </div>
            </div>

            {/* Image Column (Left Side) */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end animate-slide-in relative">
               <div className="relative w-72 h-72 md:w-96 md:h-96 lg:w-[500px] lg:h-[550px]">
                  {/* Decorative Abstract Shapes behind image */}
                  <div className="absolute top-10 -right-10 w-full h-full border-2 border-brand-green/20 rounded-[3rem] transform rotate-6 z-0"></div>
                  <div className="absolute -bottom-5 -left-5 w-2/3 h-2/3 bg-gradient-to-tr from-brand-purple/10 to-brand-red/10 rounded-full blur-2xl z-0"></div>
                  
                  {/* Profile Image Container */}
                  <div className="relative z-10 w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white transform hover:scale-[1.02] transition duration-700 ease-out group">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-60 z-10"></div>
                    {/* 
                        تم تحديث الاسم ليطابق ملف المستخدم: profile.jpg
                    */}
                    <img 
                      src="./profile.jpg" 
                      onError={(e) => {e.currentTarget.src = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop"}}
                      alt="Profile Portrait" 
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition duration-700"
                    />
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features / About Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
             <div className="order-2 md:order-1 relative">
                {/* Image Gradient: Green -> Purple -> Red */}
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-green via-brand-purple to-brand-red rounded-3xl transform rotate-3 opacity-10"></div>
                {/* 
                   تم تغيير الصورة لرابط Unsplash مباشر لضمان الظهور
                */}
                <img 
                  src="https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1000&auto=format&fit=crop" 
                  alt="مجموعة كتب متنوعة لتغذية العقل" 
                  className="rounded-3xl shadow-2xl relative z-10 w-full object-cover transform transition hover:-translate-y-2 duration-500 h-[500px]"
                />
             </div>
             
             <div className="order-1 md:order-2 space-y-8">
               <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
                 العقل <span className="text-brand-purple">المبدع</span> بيحتاج غذاء.
               </h2>
               <p className="text-lg text-slate-600 leading-relaxed">
                 القراءة هي الوقود اللي بيحرك شغفي. دي المواضيع اللي بتشغل تفكيري وبحب أكتب عنها باستمرار:
               </p>
               
               <div className="space-y-6">
                 {/* 1. Green - Economics/Invest (Left side of gradient spectrum) */}
                 <div className="flex gap-4 items-start group">
                   <div className="bg-emerald-50 p-3 rounded-2xl group-hover:bg-emerald-100 transition">
                     <TrendingUp className="w-6 h-6 text-brand-green" />
                   </div>
                   <div>
                     <h3 className="text-xl font-bold text-slate-900 mb-2">اقتصاد واستثمار</h3>
                     <p className="text-slate-500">لغة المال والأعمال، إزاي نبني ثروة ونفهم السوق.</p>
                   </div>
                 </div>
                 
                 {/* 2. Purple - Psychology (Middle of gradient spectrum) */}
                 <div className="flex gap-4 items-start group">
                   <div className="bg-purple-50 p-3 rounded-2xl group-hover:bg-purple-100 transition">
                     <Brain className="w-6 h-6 text-brand-purple" />
                   </div>
                   <div>
                     <h3 className="text-xl font-bold text-slate-900 mb-2">علم النفس</h3>
                     <p className="text-slate-500">فهم النفس البشرية هو مفتاح التعامل مع كل حاجة في الحياة.</p>
                   </div>
                 </div>

                 {/* 3. Red - Self Development (Right side of gradient spectrum) */}
                 <div className="flex gap-4 items-start group">
                   <div className="bg-red-50 p-3 rounded-2xl group-hover:bg-red-100 transition">
                     <Lightbulb className="w-6 h-6 text-brand-red" />
                   </div>
                   <div>
                     <h3 className="text-xl font-bold text-slate-900 mb-2">تطوير الذات</h3>
                     <p className="text-slate-500">محاولات مستمرة عشان نكون أفضل، سواء في الشغل أو الحياة.</p>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Contact Section Removed (Now in Footer) */}
    </div>
  );
};