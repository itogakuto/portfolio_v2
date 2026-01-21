
import React, { useState, useRef } from 'react';
import { useCMS } from '../../store/CMSContext';
import { Topic, NewsItem, Activity, Category } from '../../types';

const Dashboard: React.FC = () => {
  const { data, upsertTopic, deleteTopic, upsertNews, deleteNews, upsertActivity, deleteActivity, updateHeroWords, updateProfileImage, logout } = useCMS();
  const [activeTab, setActiveTab] = useState<'topics' | 'news' | 'activities' | 'settings'>('topics');
  
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [editingTopic, setEditingTopic] = useState<Partial<Topic>>({});
  const [editingNews, setEditingNews] = useState<Partial<NewsItem>>({});
  const [editingActivity, setEditingActivity] = useState<Partial<Activity>>({});
  const [tempHeroWords, setTempHeroWords] = useState<string>(data.heroWords.join('\n'));
  const [tempProfileImage, setTempProfileImage] = useState<string>(data.profileImage);

  const profileInputRef = useRef<HTMLInputElement>(null);
  const topicMediaInputRef = useRef<HTMLInputElement>(null);

  const optimizeImage = (file: File, maxWidth = 1600): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });

  const handleProfileFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await optimizeImage(file, 800);
      setTempProfileImage(base64);
    }
  };

  const handleTopicMediaFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newMedia = [...(editingTopic.media || [])];
      for (let i = 0; i < files.length; i++) {
        const base64 = await optimizeImage(files[i]);
        newMedia.push(base64);
      }
      setEditingTopic({ ...editingTopic, media: newMedia });
    }
  };

  const removeMedia = (index: number) => {
    const newMedia = [...(editingTopic.media || [])];
    newMedia.splice(index, 1);
    setEditingTopic({ ...editingTopic, media: newMedia });
  };

  const handleSaveTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
        const topic = {
            id: editingTopic.id || Math.random().toString(36).substr(2, 9),
            category: (editingTopic.category as Category) || 'Projects',
            title: editingTopic.title || '',
            slug: editingTopic.slug || '',
            summary: editingTopic.summary || '',
            body: editingTopic.body || '',
            tags: editingTopic.tags || [],
            role: editingTopic.role || '',
            links: editingTopic.links || [],
            featured: editingTopic.featured || false,
            order: editingTopic.order || 0,
            publishedAt: editingTopic.publishedAt || new Date().toISOString().split('T')[0],
            status: editingTopic.status || 'published',
            media: editingTopic.media || []
        } as Topic;
        await upsertTopic(topic);
        setIsTopicModalOpen(false);
    } catch (err) {
        alert('Failed to save topic.');
    } finally {
        setIsSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
        const words = tempHeroWords.split('\n').filter(w => w.trim());
        await updateHeroWords(words);
        await updateProfileImage(tempProfileImage);
        alert('Global settings updated successfully.');
    } catch (err) {
        console.error(err);
        alert('Failed to update settings. Check console for details.');
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-6 pb-24 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter uppercase">Gakuto Ito <span className="text-blue-500 font-light">CMS</span></h1>
          <p className="text-slate-500 text-[10px] tracking-widest uppercase mt-2">Data-Driven Ecosystem</p>
        </div>
        <button onClick={logout} className="px-6 py-2 border border-red-500/30 text-red-500 text-[10px] font-bold tracking-widest uppercase hover:bg-red-500/10 transition-colors rounded">Sign Out</button>
      </div>

      <div className="flex space-x-8 mb-12 border-b border-white/5">
        {(['topics', 'news', 'activities', 'settings'] as const).map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-xs font-bold tracking-widest uppercase border-b-2 transition-colors ${activeTab === tab ? 'border-blue-500 text-white' : 'border-transparent text-slate-600'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'settings' ? (
        <div className="bg-slate-900 rounded-2xl border border-white/5 p-12 max-w-2xl shadow-2xl relative overflow-hidden">
          {isSaving && <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10 flex items-center justify-center font-bold tracking-[0.5em] text-blue-400 text-[10px] uppercase">Processing...</div>}
          <h2 className="text-xl font-bold mb-8">Global Settings</h2>
          <div className="space-y-8">
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase mb-4 text-slate-500">Profile Image</label>
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 rounded-full bg-slate-800 overflow-hidden border border-white/10">
                  <img src={tempProfileImage} alt="" className="w-full h-full object-cover" />
                </div>
                <button onClick={() => profileInputRef.current?.click()} className="px-4 py-2 bg-white/5 border border-white/10 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">Upload Photo</button>
                <input type="file" ref={profileInputRef} className="hidden" accept="image/*" onChange={handleProfileFile} />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase mb-2 text-slate-500">Hero Words (One phrase per line)</label>
              <textarea className="w-full bg-white/5 border border-white/10 rounded-xl p-4 h-40 font-mono text-sm focus:border-blue-500 outline-none transition-colors" value={tempHeroWords} onChange={e => setTempHeroWords(e.target.value)} />
            </div>
            <button 
              onClick={handleSaveSettings} 
              disabled={isSaving}
              className="w-full py-4 bg-blue-600 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-colors disabled:opacity-50"
            >
              Save Site Settings
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-slate-400 text-xs uppercase font-bold tracking-widest">Managing <span className="text-white">{activeTab}</span></p>
            <button 
              onClick={() => {
                if (activeTab === 'topics') { setEditingTopic({ media: [] }); setIsTopicModalOpen(true); }
                if (activeTab === 'news') { setEditingNews({}); setIsNewsModalOpen(true); }
                if (activeTab === 'activities') { setEditingActivity({}); setIsActivityModalOpen(true); }
              }}
              className="px-6 py-2 bg-blue-600 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500 transition-all"
            >
              + Add {activeTab.slice(0, -1)}
            </button>
          </div>
          
          <div className="bg-slate-900 rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
             <table className="w-full text-left">
               <thead className="bg-white/5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                 <tr>
                   <th className="px-6 py-4">Content</th>
                   <th className="px-6 py-4">Status</th>
                   <th className="px-6 py-4">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                 {activeTab === 'topics' && data.topics.map(t => (
                   <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                     <td className="px-6 py-4 flex items-center space-x-4">
                       <div className="w-10 h-10 rounded-lg bg-slate-800 border border-white/5 overflow-hidden">
                            <img src={t.media[0] || ''} className="w-full h-full object-cover" alt="" />
                       </div>
                       <span className="font-bold">{t.title}</span>
                     </td>
                     <td className="px-6 py-4">
                        <span className={`text-[9px] uppercase font-bold ${t.status === 'published' ? 'text-green-500' : 'text-slate-500'}`}>{t.status}</span>
                     </td>
                     <td className="px-6 py-4 space-x-6">
                       <button onClick={() => { setEditingTopic(t); setIsTopicModalOpen(true); }} className="text-blue-400 text-[10px] uppercase font-bold hover:text-blue-300">Edit</button>
                       <button onClick={() => deleteTopic(t.id)} className="text-red-400 text-[10px] uppercase font-bold hover:text-red-300">Delete</button>
                     </td>
                   </tr>
                 ))}
                 {activeTab === 'news' && data.news.map(n => (
                   <tr key={n.id} className="hover:bg-white/[0.02] transition-colors">
                     <td className="px-6 py-4 font-bold">{n.title}</td>
                     <td className="px-6 py-4">
                        <span className={`text-[9px] uppercase font-bold ${n.status === 'published' ? 'text-green-500' : 'text-slate-500'}`}>{n.status}</span>
                     </td>
                     <td className="px-6 py-4 space-x-6">
                       <button onClick={() => { setEditingNews(n); setIsNewsModalOpen(true); }} className="text-blue-400 text-[10px] uppercase font-bold">Edit</button>
                       <button onClick={() => deleteNews(n.id)} className="text-red-400 text-[10px] uppercase font-bold">Delete</button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>
      )}

      {isTopicModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-4xl bg-slate-900 border border-white/10 rounded-3xl p-10 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            {isSaving && <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-20 flex items-center justify-center font-bold tracking-[0.5em] text-blue-400 text-[10px] uppercase">Saving...</div>}
            <h2 className="text-2xl font-bold mb-8 flex items-center uppercase tracking-tighter">
                Manage Topic Record
                <span className="ml-6 flex-1 h-px bg-white/5"></span>
            </h2>
            <form onSubmit={handleSaveTopic} className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-bold uppercase mb-2 text-slate-500">Title</label>
                  <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500" value={editingTopic.title || ''} onChange={e => setEditingTopic({...editingTopic, title: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase mb-2 text-slate-500">Slug (URL path)</label>
                  <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500" value={editingTopic.slug || ''} onChange={e => setEditingTopic({...editingTopic, slug: e.target.value})} required />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase mb-4 text-slate-500">Media Assets (Drag & Drop not supported, use Upload)</label>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {editingTopic.media?.map((m, i) => (
                    <div key={i} className="aspect-video relative rounded-lg overflow-hidden group border border-white/10">
                      <img src={m} className="w-full h-full object-cover" alt="" />
                      <button type="button" onClick={() => removeMedia(i)} className="absolute inset-0 bg-red-600/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold uppercase tracking-widest">Remove Asset</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => topicMediaInputRef.current?.click()} className="aspect-video border-2 border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center hover:bg-white/5 transition-all text-slate-500 hover:text-white">
                    <span className="text-xl">+</span>
                    <span className="text-[8px] font-bold uppercase">Add Photo</span>
                  </button>
                </div>
                <input type="file" multiple ref={topicMediaInputRef} className="hidden" accept="image/*" onChange={handleTopicMediaFiles} />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase mb-2 text-slate-500">Body Content (Supports Markdown)</label>
                <textarea className="w-full bg-white/5 border border-white/10 rounded-xl p-4 h-64 font-mono text-sm outline-none focus:border-blue-500 transition-colors" value={editingTopic.body || ''} onChange={e => setEditingTopic({...editingTopic, body: e.target.value})} />
              </div>
              <div className="flex justify-end space-x-6 border-t border-white/5 pt-8">
                <button type="button" onClick={() => setIsTopicModalOpen(false)} className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Discard</button>
                <button type="submit" disabled={isSaving} className="px-10 py-3 bg-blue-600 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all disabled:opacity-50">Publish Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
