
import { createClient } from '@supabase/supabase-js';
import { PortfolioData, Topic, NewsItem, Activity } from '../types';

// 環境変数の取得（Viteの場合は import.meta.env、通常のNode環境は process.env）
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

// Supabaseクライアントの初期化
export const supabase = (SUPABASE_URL && SUPABASE_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

// IndexedDB Wrapper (Fallback for offline/dev without Supabase)
const DB_NAME = 'NexusPortfolioDB';
const STORE_NAME = 'app_data';

const getIDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const idbGet = async (key: string): Promise<any> => {
  const db = await getIDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const idbSet = async (key: string, value: any): Promise<void> => {
  const db = await getIDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(value, key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const api = {
  async fetchAll(): Promise<PortfolioData> {
    if (!supabase) {
      console.warn('Supabase not configured. Using IndexedDB.');
      return this.fetchFallback();
    }

    try {
      const [topics, news, activities, settings] = await Promise.all([
        supabase.from('topics').select('*').order('order', { ascending: true }),
        supabase.from('news').select('*').order('date', { ascending: false }),
        supabase.from('activities').select('*').order('date', { ascending: false }),
        supabase.from('site_settings').select('*')
      ]);

      if (topics.error) console.error('Error fetching topics:', topics.error);
      if (news.error) console.error('Error fetching news:', news.error);
      if (activities.error) console.error('Error fetching activities:', activities.error);

      // site_settingsの取得ロジック
      const heroWordsRecord = settings.data?.find(s => s.key === 'hero_words');
      const profileImageRecord = settings.data?.find(s => s.key === 'profile_image');

      return {
        topics: topics.data || [],
        news: news.data || [],
        activities: activities.data || [],
        heroWords: heroWordsRecord?.value || ["Complex Systems into Elegant Motion."],
        profileImage: profileImageRecord?.value || './profile.png'
      };
    } catch (err) {
      console.error('Supabase fetch failed entirely:', err);
      return this.fetchFallback();
    }
  },

  async upsertTopic(topic: Topic): Promise<void> {
    if (!supabase) {
        const data = await this.fetchFallback();
        const index = data.topics.findIndex(t => t.id === topic.id);
        if (index > -1) data.topics[index] = topic;
        else data.topics.push(topic);
        await idbSet('portfolio_data', data);
        return;
    }
    const { error } = await supabase.from('topics').upsert(topic);
    if (error) throw error;
  },

  async deleteTopic(id: string): Promise<void> {
    if (!supabase) {
        const data = await this.fetchFallback();
        data.topics = data.topics.filter(t => t.id !== id);
        await idbSet('portfolio_data', data);
        return;
    }
    const { error } = await supabase.from('topics').delete().eq('id', id);
    if (error) throw error;
  },

  async upsertNews(news: NewsItem): Promise<void> {
    if (!supabase) {
        const data = await this.fetchFallback();
        const index = data.news.findIndex(n => n.id === news.id);
        if (index > -1) data.news[index] = news;
        else data.news.push(news);
        await idbSet('portfolio_data', data);
        return;
    }
    const { error } = await supabase.from('news').upsert(news);
    if (error) throw error;
  },

  async deleteNews(id: string): Promise<void> {
    if (!supabase) {
        const data = await this.fetchFallback();
        data.news = data.news.filter(n => n.id !== id);
        await idbSet('portfolio_data', data);
        return;
    }
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (error) throw error;
  },

  async upsertActivity(activity: Activity): Promise<void> {
    if (!supabase) {
        const data = await this.fetchFallback();
        const index = data.activities.findIndex(a => a.id === activity.id);
        if (index > -1) data.activities[index] = activity;
        else data.activities.push(activity);
        await idbSet('portfolio_data', data);
        return;
    }
    const { error } = await supabase.from('activities').upsert(activity);
    if (error) throw error;
  },

  async deleteActivity(id: string): Promise<void> {
    if (!supabase) {
        const data = await this.fetchFallback();
        data.activities = data.activities.filter(a => a.id !== id);
        await idbSet('portfolio_data', data);
        return;
    }
    const { error } = await supabase.from('activities').delete().eq('id', id);
    if (error) throw error;
  },

  async updateHeroWords(words: string[]): Promise<void> {
    if (!supabase) {
        const data = await this.fetchFallback();
        data.heroWords = words;
        await idbSet('portfolio_data', data);
        return;
    }
    const { error } = await supabase.from('site_settings').upsert({ key: 'hero_words', value: words });
    if (error) {
        console.error('Failed to update hero words in Supabase:', error);
        throw error;
    }
  },

  async updateProfileImage(url: string): Promise<void> {
    if (!supabase) {
        const data = await this.fetchFallback();
        data.profileImage = url;
        await idbSet('portfolio_data', data);
        return;
    }
    const { error } = await supabase.from('site_settings').upsert({ key: 'profile_image', value: url });
    if (error) {
        console.error('Failed to update profile image in Supabase:', error);
        throw error;
    }
  },

  async fetchFallback(): Promise<PortfolioData> {
    const data = await idbGet('portfolio_data');
    if (data) return data;

    return { 
      topics: [], 
      news: [], 
      activities: [], 
      heroWords: ["Complex Systems into Elegant Motion."],
      profileImage: './profile.png'
    };
  }
};
