import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Camera, Save, Lock, User, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  // Tab State
  const [activeTab, setActiveTab] = useState<'info' | 'security'>('info');

  // Info State
  const [name, setName] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [isUpdatingInfo, setIsUpdatingInfo] = useState(false);
  const [infoMessage, setInfoMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // Password State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPwd, setIsChangingPwd] = useState(false);
  const [pwdMessage, setPwdMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // Update initial state when user loads
  useEffect(() => {
    if (user) {
      setName(user.name);
      setPreviewImage(user.profilePicture || '');
    }
  }, [user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingInfo(true);
    setInfoMessage(null);
    try {
      await updateProfile(name, selectedFile);
      setInfoMessage({ type: 'success', text: 'تم تحديث بياناتك بنجاح!' });
    } catch (error) {
      console.error(error);
      setInfoMessage({ type: 'error', text: 'حصلت مشكلة أثناء التحديث.' });
    } finally {
      setIsUpdatingInfo(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPwdMessage({ type: 'error', text: 'كلمة المرور الجديدة غير متطابقة.' });
      return;
    }
    if (newPassword.length < 6) {
        setPwdMessage({ type: 'error', text: 'كلمة المرور قصيرة جداً.' });
        return;
    }

    setIsChangingPwd(true);
    setPwdMessage(null);
    try {
      await changePassword(oldPassword, newPassword);
      setPwdMessage({ type: 'success', text: 'تم تغيير كلمة المرور بنجاح!' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setPwdMessage({ type: 'error', text: error.message || 'كلمة المرور القديمة غلط.' });
    } finally {
      setIsChangingPwd(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen py-24 px-4 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black text-slate-900 mb-8 text-center">إعدادات الحساب</h1>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-100">
            <button 
              onClick={() => setActiveTab('info')}
              className={`flex-1 py-4 font-bold text-sm transition-colors flex items-center justify-center gap-2 ${activeTab === 'info' ? 'bg-slate-50 text-brand-purple border-b-2 border-brand-purple' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <User size={18} /> البيانات الشخصية
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`flex-1 py-4 font-bold text-sm transition-colors flex items-center justify-center gap-2 ${activeTab === 'security' ? 'bg-slate-50 text-brand-red border-b-2 border-brand-red' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Lock size={18} /> الأمان وكلمة السر
            </button>
          </div>

          {/* Info Tab */}
          {activeTab === 'info' && (
            <div className="p-8 animate-fade-in-up">
              <form onSubmit={handleInfoSubmit} className="space-y-8">
                
                {/* Image Upload */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative group cursor-pointer">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 shadow-lg bg-slate-200">
                      {previewImage ? (
                        <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                           <User size={48} />
                        </div>
                      )}
                    </div>
                    <label htmlFor="pic-upload" className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                      <Camera size={24} />
                    </label>
                    <input type="file" id="pic-upload" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </div>
                  <p className="text-xs text-slate-400">اضغط على الصورة للتغيير</p>
                </div>

                {/* Name Input */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">اسم المستخدم</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition font-bold"
                  />
                </div>

                {infoMessage && (
                  <div className={`p-4 rounded-xl flex items-center gap-2 text-sm font-bold ${infoMessage.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {infoMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    {infoMessage.text}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isUpdatingInfo}
                  className="w-full btn-ios-dark py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  {isUpdatingInfo ? <Loader2 className="animate-spin" /> : <><Save size={18} /> حفظ التغييرات</>}
                </button>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="p-8 animate-fade-in-up">
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">كلمة المرور الحالية</label>
                  <input 
                    type="password" 
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none transition"
                    required
                  />
                </div>

                <div className="border-t border-slate-100 my-4"></div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">كلمة المرور الجديدة</label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none transition"
                    placeholder="على الأقل 6 حروف"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">تأكيد كلمة المرور الجديدة</label>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none transition"
                    required
                  />
                </div>

                {pwdMessage && (
                  <div className={`p-4 rounded-xl flex items-center gap-2 text-sm font-bold ${pwdMessage.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {pwdMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    {pwdMessage.text}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isChangingPwd}
                  className="w-full btn-ios-gradient py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  {isChangingPwd ? <Loader2 className="animate-spin" /> : 'تحديث كلمة المرور'}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};