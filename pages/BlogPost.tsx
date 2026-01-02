import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { BlogPost as BlogPostType, UserRole } from '../types';
import { getPostById, deletePost } from '../services/storage';
import { useAuth } from '../context/AuthContext';
import { CommentSection } from '../components/CommentSection';
import { Calendar, User, ArrowRight, Trash2, Clock, Share2 } from 'lucide-react';

export const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // محاكاة التحميل
    setTimeout(() => {
      if (id) {
        const foundPost = getPostById(id);
        setPost(foundPost);
      }
      setLoading(false);
    }, 600);
  }, [id]);

  const handleDeletePost = () => {
    if (window.confirm('متأكد إنك عايز تحذف المقال ده نهائي؟ مفيش رجعة!')) {
      if (post) {
        deletePost(post.id);
        navigate('/blog');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-24 px-4 max-w-4xl mx-auto animate-pulse">
        <div className="h-8 w-32 bg-slate-200 rounded-full mb-8"></div>
        <div className="h-64 md:h-96 w-full bg-slate-200 rounded-3xl mb-8"></div>
        <div className="h-10 w-3/4 bg-slate-200 rounded-xl mb-4"></div>
        <div className="space-y-3">
           <div className="h-4 w-full bg-slate-200 rounded"></div>
           <div className="h-4 w-full bg-slate-200 rounded"></div>
           <div className="h-4 w-2/3 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-4">🕵️‍♂️</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">المقال ده مش موجود</h2>
        <p className="text-slate-500 mb-6">ممكن يكون اتمسح أو الرابط غلط.</p>
        <Link to="/blog" className="btn-ios-dark px-6 py-3 rounded-full font-bold">رجعني للمدونة</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation & Controls */}
        <div className="flex justify-between items-center mb-8">
          <Link to="/blog" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition">
            <ArrowRight size={20} /> كل المقالات
          </Link>

          <div className="flex gap-2">
            {user && user.role === UserRole.ADMIN && (
              <button 
                onClick={handleDeletePost}
                className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-full transition font-bold text-sm"
              >
                <Trash2 size={16} /> حذف المقال
              </button>
            )}
          </div>
        </div>

        {/* Hero Image */}
        {post.imageUrl && (
          <div className="rounded-[2.5rem] overflow-hidden shadow-2xl mb-10 aspect-video relative group">
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
             <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover transform group-hover:scale-105 transition duration-1000" />
          </div>
        )}

        {/* Header Info */}
        <div className="mb-10 animate-fade-in-up">
           <div className="flex flex-wrap gap-4 text-sm font-bold text-slate-500 mb-4">
             <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg">
                <Calendar size={16} className="text-brand-green" /> {new Date(post.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
             </span>
             <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg">
                <User size={16} className="text-brand-purple" /> {post.author}
             </span>
             <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg">
                <Clock size={16} className="text-brand-red" /> قراءة 3 دقائق
             </span>
           </div>
           
           <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-6">
             {post.title}
           </h1>
           
           <div className="w-20 h-1.5 bg-gradient-to-r from-brand-green via-brand-purple to-brand-red rounded-full"></div>
        </div>

        {/* Content */}
        <div className="prose prose-lg prose-slate max-w-none mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {post.content.split('\n').map((paragraph, idx) => (
            paragraph.trim() && <p key={idx} className="text-slate-700 leading-loose mb-6 text-lg">{paragraph}</p>
          ))}
        </div>

        {/* Share Hint */}
        <div className="flex items-center justify-center gap-2 text-slate-400 font-medium py-8 border-y border-slate-100 border-dashed">
          <Share2 size={20} /> عجبك المقال؟ شاركه مع صحابك
        </div>

        {/* Comments Section */}
        <CommentSection postId={post.id} />
      
      </div>
    </div>
  );
};