
import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCMS } from '../store/CMSContext';

const TopicDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data } = useCMS();
  const topic = data.topics.find(t => t.slug === slug);

  if (!topic) return <Navigate to="/topics" />;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-24 px-6 md:px-24"
    >
      <div className="max-w-6xl mx-auto">
        <Link to="/topics" className="inline-block text-[10px] font-bold tracking-widest uppercase text-slate-500 hover:text-blue-400 transition-colors mb-12">
          &larr; Back to Topics
        </Link>

        <header className="mb-16">
          <div className="flex items-center space-x-3 mb-6">
            <span className="px-3 py-1 bg-blue-600/20 text-blue-400 text-[10px] font-bold tracking-widest uppercase rounded border border-blue-500/30">
              {topic.category}
            </span>
            <span className="text-slate-500 text-[10px] font-bold tracking-widest uppercase">{topic.publishedAt}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-tight">{topic.title}</h1>
          <p className="text-xl md:text-2xl text-slate-400 font-light leading-relaxed max-w-3xl">
            {topic.summary}
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            <div className="aspect-video rounded-3xl overflow-hidden bg-slate-900 border border-white/5">
              <img 
                src={topic.media[0] || 'https://picsum.photos/1200/800'} 
                alt={topic.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <article className="prose prose-invert prose-blue max-w-none">
                <div className="text-slate-300 leading-loose space-y-6 text-lg">
                    {topic.body.split('\n').map((para, i) => (
                        <p key={i}>{para}</p>
                    ))}
                </div>
            </article>

            <div className="grid md:grid-cols-2 gap-8 pt-12 border-t border-white/10">
                {topic.media.slice(1).map((m, i) => (
                    <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-slate-800">
                        <img src={m} alt="" className="w-full h-full object-cover" />
                    </div>
                ))}
            </div>
          </div>

          <aside className="space-y-12">
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
                <h3 className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-6">Project Metadata</h3>
                
                <div className="space-y-6">
                    <div>
                        <span className="block text-[10px] text-blue-500 font-bold uppercase mb-1">Role</span>
                        <p className="text-sm font-medium">{topic.role || 'Interaction Designer'}</p>
                    </div>
                    <div>
                        <span className="block text-[10px] text-blue-500 font-bold uppercase mb-1">Stack</span>
                        <div className="flex flex-wrap gap-2">
                            {topic.tags.map(tag => (
                                <span key={tag} className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-slate-400">{tag}</span>
                            ))}
                        </div>
                    </div>
                    {topic.links.length > 0 && (
                        <div>
                            <span className="block text-[10px] text-blue-500 font-bold uppercase mb-3">Links</span>
                            <div className="space-y-2">
                                {topic.links.map(link => (
                                    <a key={link.url} href={link.url} className="block text-sm hover:text-blue-400 transition-colors flex items-center">
                                        {link.label} <span className="ml-2 opacity-50 text-[10px]">&nearrow;</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="p-8 border border-white/5 rounded-3xl">
                <p className="text-sm text-slate-500 italic">Interested in collaborating on similar ventures?</p>
                <Link to="/contact" className="inline-block mt-4 text-xs font-bold tracking-widest uppercase text-blue-400 hover:underline">
                    Reach Out
                </Link>
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  );
};

export default TopicDetail;
