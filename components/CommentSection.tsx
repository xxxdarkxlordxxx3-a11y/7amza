import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Comment, UserRole } from '../types';
import { getCommentsByPostId, addComment, deleteComment } from '../services/storage';
import { Send, Trash2, UserCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CommentSectionProps {
  postId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  // تحميل التعليقات
  const loadComments = () => {
    const data = getCommentsByPostId(postId);
    setComments(data);
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  // إضافة تعليق
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setLoading(true);
    // محاكاة تأخير الشبكة لواقعية أكتر
    await new Promise(resolve => setTimeout(resolve, 300));

    const comment: Comment = {
      id: Date.now().toString(),
      postId,
      userName: user.name,
      userEmail: user.email,
      content: newComment,
      createdAt: new Date().toISOString()
    };

    addComment(comment);
    setNewComment('');
    loadComments();
    setLoading(false);
  };

  // حذف تعليق (للأدمن فقط)
  const handleDelete = (commentId: string) => {
    if (window.confirm('متأكد عايز تمسح التعليق ده؟')) {
      deleteComment(commentId);
      loadComments();
    }
  };

  return (
    <div className="mt-16 border-t border-slate-100 pt-10">
      <h3 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-2">
        التعليقات <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{comments.length}</span>
      </h3>

      {/* نموذج الكتابة */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-12 relative group">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="شاركنا رأيك..."
            className="w-full bg-slate-50 rounded-2xl p-5 pr-5 pl-14 min-h-[100px] border-2 border-transparent focus:border-brand-purple focus:bg-white focus:ring-0 transition-all resize-none shadow-inner"
            required
          />
          <button
            type="submit"
            disabled={loading || !newComment.trim()}
            className="absolute left-3 bottom-3 p-2 bg-brand-purple text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:scale-105"
          >
            <Send size={18} className={loading ? 'animate-pulse' : ''} />
          </button>
        </form>
      ) : (
        <div className="bg-slate-50 p-6 rounded-2xl text-center mb-10 border border-slate-200 border-dashed">
          <p className="text-slate-600 mb-3">عشان تقدر تعلق وتشاركنا، لازم تكون مسجل دخول.</p>
          <div className="flex justify-center gap-3">
            <Link to="/login" className="text-brand-purple font-bold hover:underline">سجل دخول</Link>
            <span className="text-slate-300">|</span>
            <Link to="/signup" className="text-brand-green font-bold hover:underline">حساب جديد</Link>
          </div>
        </div>
      )}

      {/* قائمة التعليقات */}
      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 group">
              <div className="shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 shadow-sm border border-white">
                  <UserCircle2 size={24} />
                </div>
              </div>
              <div className="flex-1 bg-white p-4 rounded-2xl rounded-tr-none shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{comment.userName}</h4>
                    <span className="text-xs text-slate-400 font-medium">
                      {new Date(comment.createdAt).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  {/* زر الحذف للأدمن فقط */}
                  {user && user.role === UserRole.ADMIN && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-slate-300 hover:text-red-500 transition p-1 opacity-0 group-hover:opacity-100"
                      title="حذف التعليق"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-slate-400 text-center text-sm py-4">لسة مفيش تعليقات، كن أول واحد يعلق! ✨</p>
        )}
      </div>
    </div>
  );
};