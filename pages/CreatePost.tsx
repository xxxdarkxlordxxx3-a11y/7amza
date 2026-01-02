import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { savePost } from '../services/storage';
import { generateImage } from '../services/gemini';
import { BlogPost, UserRole } from '../types';
import { Save, XCircle, PenTool, Layout, FileText, Image as ImageIcon, UploadCloud, Sparkles, Loader2, Wand2 } from 'lucide-react';

export const CreatePost: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  // AI Image Generation State
  const [showAiGen, setShowAiGen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [imageSize, setImageSize] = useState('1K');
  const [isGenerating, setIsGenerating] = useState(false);

  // حماية الصفحة: للأدمن فقط
  if (!user || user.role !== UserRole.ADMIN) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md w-full border border-red-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-pink-500"></div>
          <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
             <XCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-3">منطقة محظورة</h2>
          <p className="text-slate-500 mb-8 text-lg">آسف يا صديقي، الصفحة دي خاصة بالأدمن بس للكتابة والنشر.</p>
          <button onClick={() => navigate('/')} className="w-full py-3.5 btn-ios-dark rounded-full font-bold shadow-lg shadow-slate-200">
            العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    );
  }

  // دالة تحويل الصورة لكود Base64 عشان تتخزن
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAiGeneration = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);

    try {
      // 1. Check for API Key (Gemini Nano Banana Requirement)
      const aiStudio = (window as any).aistudio;
      if (aiStudio) {
         const hasKey = await aiStudio.hasSelectedApiKey();
         if (!hasKey) {
            await aiStudio.openSelectKey();
         }
      }

      // 2. Generate
      const generatedBase64 = await generateImage(aiPrompt, "16:9", imageSize);
      if (generatedBase64) {
        setImageUrl(generatedBase64);
        setShowAiGen(false); // Close panel on success
      }
    } catch (error: any) {
      console.error("AI Generation failed", error);
      
      const errorMessage = JSON.stringify(error);
      
      // Handle Permission/Auth errors (403 or Permission Denied)
      if (
        errorMessage.includes("403") || 
        errorMessage.includes("PERMISSION_DENIED") ||
        (error.message && error.message.includes("PERMISSION_DENIED"))
      ) {
         const aiStudio = (window as any).aistudio;
         if (aiStudio) {
            // Check if we were trying high quality
            const isHighQual = imageSize === '2K' || imageSize === '4K';
            const msg = isHighQual 
                ? "الجودة العالية (2K/4K) تتطلب مشروعاً مدفوعاً. هل تريد تغيير المفتاح؟"
                : "حدث خطأ في الصلاحيات. هل تريد إعادة اختيار مفتاح API؟";
                
            const confirmRetry = window.confirm(msg);
            if (confirmRetry) {
               try {
                   await aiStudio.openSelectKey();
               } catch(e) {
                   console.error(e);
               }
            }
         }
      } else {
        alert("حصلت مشكلة أثناء التوليد. حاول مرة تانية أو جرب تغير الوصف.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const newPost: BlogPost = {
      id: Date.now().toString(),
      title,
      content,
      summary: summary || content.substring(0, 100) + '...',
      createdAt: new Date().toISOString(),
      author: user.name,
      imageUrl: imageUrl || '' // لو مفيش صورة هتبقى فاضية
    };

    savePost(newPost);
    navigate('/blog');
  };

  return (
    <div className="min-h-screen py-12 px-4 animate-fade-in-up">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
           <div>
             <h1 className="text-3xl font-black text-slate-800">إضافة جديد</h1>
             <p className="text-slate-500 mt-1">أهلاً بيك يا {user.name}، إيه الجديد النهاردة؟</p>
           </div>
           {/* Plus icon is now in Navbar, kept simple header here */}
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            {/* Title Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                 {/* تم إزالة الأيقونة المربعة (Layout) من هنا */}
                 عنوان المقال
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-5 py-4 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-purple-500 focus:bg-white focus:ring-0 transition-all font-bold text-lg placeholder:font-normal"
                placeholder="اكتب عنوان يشد..."
                required
              />
            </div>

            {/* Image Section (Upload + AI) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <ImageIcon size={18} className="text-blue-600" /> صورة الغلاف (اختياري)
                </label>
                <button 
                  type="button"
                  onClick={() => setShowAiGen(!showAiGen)}
                  className="text-xs flex items-center gap-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1.5 rounded-full font-bold hover:shadow-lg hover:scale-105 transition-all"
                >
                  <Sparkles size={12} /> {showAiGen ? 'إغلاق الرسام' : 'توليد بالذكاء الاصطناعي'}
                </button>
              </div>

              {/* AI Generation Panel */}
              {showAiGen && (
                <div className="bg-slate-50 border border-purple-100 rounded-2xl p-5 mb-4 animate-fade-in-up">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1 block">وصف الصورة</label>
                      <input 
                        type="text" 
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="مثال: مكتبة قديمة مليانة كتب طايرة في الفضاء بإضاءة نيون..."
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-purple-500 outline-none text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="flex-1">
                          <label className="text-xs font-bold text-slate-500 mb-1 block">الجودة (Resolution)</label>
                          <select 
                            value={imageSize}
                            onChange={(e) => setImageSize(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-purple-500 outline-none text-sm bg-white"
                          >
                            <option value="1K">1K (قياسي - سريع)</option>
                            <option value="2K">2K (جودة عالية - Pro)</option>
                            <option value="4K">4K (فائق الجودة - Pro)</option>
                          </select>
                       </div>
                       <button
                         type="button"
                         onClick={handleAiGeneration}
                         disabled={isGenerating || !aiPrompt}
                         className="flex-1 mt-auto h-[38px] btn-ios-gradient rounded-xl font-bold text-sm flex items-center justify-center gap-2 text-white"
                       >
                         {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <><Wand2 size={16} /> ابتكر لي صورة</>}
                       </button>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      * جودة 1K متاحة للجميع. جودة 2K و 4K تتطلب مشروعاً ببطاقة دفع (Billing Enabled).
                      <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline ml-1">معلومات الفوترة</a>
                    </p>
                  </div>
                </div>
              )}

              {/* Image Preview / Upload Box */}
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label 
                  htmlFor="image-upload" 
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition overflow-hidden relative"
                >
                  {imageUrl ? (
                    <>
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white font-bold opacity-0 hover:opacity-100 transition rounded-lg backdrop-blur-sm">
                        تغيير الصورة (من الجهاز)
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-slate-500">
                      <UploadCloud size={32} className="mb-2" />
                      <span className="text-sm font-medium">اضغط لرفع صورة أو استخدم الزر أعلاه للتوليد</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Content Textarea */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <PenTool size={18} className="text-green-600" /> المحتوى
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={15}
                className="w-full px-5 py-4 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-green-500 focus:bg-white focus:ring-0 transition-all leading-relaxed"
                placeholder="احكي يا شهرزاد..."
                required
              />
            </div>

            {/* Summary Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <FileText size={18} className="text-orange-600" /> ملخص سريع
              </label>
              <input
                type="text"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-5 py-4 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-orange-500 focus:bg-white focus:ring-0 transition-all"
                placeholder="المقال في كلمتين..."
              />
            </div>

            {/* Actions */}
            <div className="pt-6 flex items-center justify-end gap-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate('/blog')}
                className="px-6 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-700 rounded-full transition font-bold"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-8 py-4 btn-ios-gradient rounded-full font-bold shadow-lg transition transform hover:-translate-y-1 flex items-center gap-2"
              >
                <Save size={20} /> نشر المقال
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};