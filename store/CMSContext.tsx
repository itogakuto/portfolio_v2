
import React, { createContext, useContext, useState, useEffect } from 'react';
import { PortfolioData, Topic, NewsItem, Activity } from '../types';
import { api, supabase } from '../services/api';

interface CMSContextType {
  data: PortfolioData;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  upsertTopic: (topic: Topic) => Promise<void>;
  deleteTopic: (id: string) => Promise<void>;
  upsertNews: (news: NewsItem) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;
  upsertActivity: (activity: Activity) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
  updateHeroWords: (words: string[]) => Promise<void>;
  updateProfileImage: (url: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>({ 
    topics: [], 
    news: [], 
    activities: [], 
    heroWords: [],
    profileImage: './profile.png' // デフォルト値
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const refresh = async () => {
    try {
      setIsLoading(true);
      const res = await api.fetchAll();
      setData({
        ...res,
        profileImage: res.profileImage || './profile.png'
      });
      setError(null);
    } catch (e) {
      console.error(e);
      setError('データの取得に失敗しました。DB接続を確認してください。');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const login = async (email: string, password: string) => {
    if (!supabase) {
        if (password === 'admin123') {
            setUser({ email: 'demo@nexus.core' });
            return true;
        }
        return false;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return false;
    setUser(data.user);
    return true;
  };

  const logout = async () => {
    if (supabase) await supabase.auth.signOut();
    setUser(null);
  };

  const upsertTopic = async (topic: Topic) => {
    await api.upsertTopic(topic);
    await refresh();
  };

  const deleteTopic = async (id: string) => {
    await api.deleteTopic(id);
    await refresh();
  };

  const upsertNews = async (news: NewsItem) => {
    await api.upsertNews(news);
    await refresh();
  };

  const deleteNews = async (id: string) => {
    await api.deleteNews(id);
    await refresh();
  };

  const upsertActivity = async (activity: Activity) => {
    await api.upsertActivity(activity);
    await refresh();
  };

  const deleteActivity = async (id: string) => {
    await api.deleteActivity(id);
    await refresh();
  };

  const updateHeroWords = async (words: string[]) => {
    await api.updateHeroWords(words);
    await refresh();
  };

  const updateProfileImage = async (url: string) => {
    await api.updateProfileImage(url);
    await refresh();
  };

  return (
    <CMSContext.Provider value={{
      data, isLoading, error, 
      isAuthenticated: !!user, 
      login, logout,
      upsertTopic, deleteTopic, upsertNews, deleteNews, upsertActivity, deleteActivity, updateHeroWords, updateProfileImage, refresh
    }}>
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) throw new Error('useCMS must be used within a CMSProvider');
  return context;
};
