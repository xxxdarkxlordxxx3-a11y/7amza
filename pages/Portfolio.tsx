import React from 'react';
import { 
  Presentation, 
  Video, 
  FileText, 
  Search, 
  Mic, 
  Instagram,
  Sparkles
} from 'lucide-react';

export const Portfolio: React.FC = () => {
  const services = [
    {
      title: "عروض تقديمية (PowerPoint)",
      desc: "تصميم بريزنتيشن احترافية وجذابة توصل فكرتك بأفضل شكل.",
      icon: <Presentation className="text-brand-purple" size={28} />,
    },
    {
      title: "تعديل صور وفيديوهات",
      desc: "مونتاج فيديوهات وتعديل صور بلمسات فنية سينمائية.",
      icon: <Video className="text-brand-green" size={28} />,
    },
    {
      title: "تنسيق ملفات Word",
      desc: "كتابة وتنسيق المستندات والأبحاث بشكل منظم وبروفيشنال.",
      icon: <FileText className="text-brand-red" size={28} />,
    },
    {
      title: "أبحاث معمقة",
      desc: "عمل أبحاث دقيقة وشاملة في أي موضوع تحتاجه.",
      icon: <Search className="text-brand-purple" size={28} />,
    },
    {
      title: "ملخصات صوتية",
      desc: "تحويل النصوص والكتب لملخصات صوتية واضحة ومفيدة.",
      icon: <Mic className="text-brand-green" size={28} />,
    }
  ];

  const portfolioImages = [
    "https://api.aistudio.google.com/v1/files/sc_f_01jnnd4p6mfsh9k2x6s7f60742",
    "https://api.aistudio.google.com/v1/files/sc_f_01jnnd8unfsh9k2x6s7f60j646",
    "https://api.aistudio.google.com/v1/files/sc_f_01jnnd93bfsh9k2x6s7f60z4a6",
    "https://api.aistudio.google.com/v1/files/sc_f_01jnnd96nfsh9k2x6s7f6186j6",
    "https://api.aistudio.google.com/v1/files/sc_f_01jnnd99kfsh9k2x6s7f61k6c6",
    "https://api.aistudio.google.com/v1/files/sc_f_01jnnd9cmfsh9k2x6s7f61v6m6",
    "https://api.aistudio.google.com/v1/files/sc_f_01jnnd9fkfsh9k2x6s7f6266s6",
    "https://api.aistudio.google.com/v1/files/sc_f_01jnnd9j0fsh9k2x6s7f62m6z6"
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">
            معرض <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green via-brand-purple to-brand-red">الأعمال والخدمات</span>
          </h1>
          <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-2 rounded-full text-sm font-bold shadow-xl">
            <Sparkles size={16} className="text-brand-green" />
            جميع الخدمات مدعومة بالذكاء الاصطناعي لضمان أعلى جودة
          </div>
        </div>

        {/* Services Grid */}
        <div className="mb-24">
          <h2 className="text-2xl font-black text-slate-800 mb-10 border-r-4 border-brand-red pr-4">الخدمات التي أقدمها</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
                <div className="mb-6 group-hover:scale-110 transition-transform">{service.icon}</div>
                <h3 className="text-xl font-black text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-500 font-bold text-sm leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Image Portfolio */}
        <div className="mb-24">
          <h2 className="text-2xl font-black text-slate-800 mb-10 border-r-4 border-brand-green pr-4">معرض الصور</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {portfolioImages.map((img, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 border-2 border-white shadow-sm hover:shadow-lg transition-all">
                <img src={img} alt={`Work ${i}`} className="w-full h-full object-cover hover:scale-110 transition duration-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl font-black mb-6">حابب نشتغل مع بعض؟</h2>
          <p className="text-slate-400 mb-10 font-bold">تقدر تتواصل معايا مباشرة بخصوص أي خدمة من الخدمات اللي فوق</p>
          <a 
            href="https://www.instagram.com/h7amza318/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-slate-900 px-10 py-4 rounded-full font-black text-lg hover:bg-brand-red hover:text-white transition-all shadow-xl"
          >
            <Instagram size={24} /> تواصل عبر إنستجرام
          </a>
        </div>
      </div>
    </div>
  );
};