import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../types';
import { getPosts } from '../services/storage';
import { Calendar, User, ArrowLeft } from 'lucide-react';

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // محاكاة وقت التحميل
    setTimeout(() => {
      setPosts(getPosts());
      setLoading(false);
    }, 800);
  }, []);

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            المدونة <span className="text-brand-red">.</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">أحدث المقالات، الأفكار العشوائية، والحكايات اللي بحب أشاركها معاكوا</p>
          <div className="h-1 w-24 bg-gradient-to-r from-brand-green via-brand-purple to-brand-red mx-auto mt-6 rounded-full"></div>
        </div>

        {loading ? (
          // --- Skeleton Loader ---
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-full flex flex-col animate-pulse">
                <div className="h-52 bg-slate-200/70"></div>
                <div className="p-7 flex-1 space-y-4">
                  <div className="flex gap-4">
                    <div className="h-4 bg-slate-200 rounded w-20"></div>
                    <div className="h-4 bg-slate-200 rounded w-24"></div>
                  </div>
                  <div className="h-8 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div className="space-y-2.5">
                    <div className="h-3 bg-slate-200 rounded w-full"></div>
                    <div className="h-3 bg-slate-200 rounded w-full"></div>
                    <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                  </div>
                  <div className="h-5 bg-slate-200 rounded w-24 mt-6 self-end mr-auto"></div>
                </div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col border border-slate-100 group h-full">
                
                {/* Image Link */}
                <Link to={`/blog/${post.id}`} className="block h-52 overflow-hidden bg-gray-100 relative shrink-0 cursor-pointer">
                  {post.imageUrl ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <img 
                        src={post.imageUrl} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition transform duration-700 group-hover:scale-110"
                      />
                    </>
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center text-slate-300">
                        <span className="text-4xl">📝</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-brand-green to-brand-red text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md z-20">
                    مقال جديد
                  </div>
                </Link>

                <div className="p-7 flex-1 flex flex-col">
                  <div className="flex items-center text-sm text-slate-500 mb-4 gap-4">
                    <span className="flex items-center gap-1.5"><Calendar size={15} className="text-brand-green" /> {new Date(post.createdAt).toLocaleDateString('ar-EG')}</span>
                    <span className="flex items-center gap-1.5"><User size={15} className="text-brand-red" /> {post.author}</span>
                  </div>
                  
                  <Link to={`/blog/${post.id}`}>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 hover:text-brand-red transition cursor-pointer line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>
                  
                  <p className="text-slate-600 mb-6 line-clamp-3 text-sm flex-1 leading-relaxed">
                    {post.summary}
                  </p>
                  
                  <Link to={`/blog/${post.id}`} className="mt-auto text-brand-red font-bold hover:text-slate-900 flex items-center gap-2 self-end group/btn transition-colors">
                    اقرأ المزيد <ArrowLeft size={18} className="transition-transform group-hover/btn:-translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-slate-100">
            <div className="mb-4 text-6xl">🏜️</div>
            <p className="text-xl text-slate-500">لسة مفيش مقالات، استنى الجديد 😉</p>
          </div>
        )}
      </div>
    </div>
  );
};