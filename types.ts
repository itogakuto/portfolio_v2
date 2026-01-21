
export type Category = 'Projects' | 'Works' | 'Others';

export interface Topic {
  id: string;
  category: Category;
  title: string;
  slug: string;
  summary: string;
  body: string;
  tags: string[];
  role: string;
  links: { label: string; url: string }[];
  featured: boolean;
  order: number;
  publishedAt: string;
  status: 'draft' | 'published';
  media: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  category: string;
  shortText: string;
  body: string;
  date: string;
  status: 'draft' | 'published';
}

export interface Activity {
  id: string;
  date: string;
  title: string;
  summary: string;
  body: string;
  links: string[];
  media: string[];
  tags: string[];
  featured: boolean;
  order: number;
  status: 'draft' | 'published';
}

export interface PortfolioData {
  topics: Topic[];
  news: NewsItem[];
  activities: Activity[];
  heroWords: string[];
  profileImage: string;
}
