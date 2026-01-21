
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCMS } from '../store/CMSContext';
import { Category } from '../types';

const Topics: React.FC = () => {
  const { data } = useCMS();
  const [filter, setFilter] = useState<Category | 'ALL'>('ALL');

  const filteredTopics = filter === 'ALL' 
    ? data.topics 
    : data.topics.filter(t => t.category === filter);

  const filters: (Category | 'ALL')[] = ['ALL', 'Projects', 'Works', 'Others'];

  return (
    <div className="min-h-screen pt-32 px-6 md:px-24 pb-24">
      <header className="mb-20">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8">Topics</h1>
        
        <div className="flex flex-wrap gap-8">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-[10px] font-bold tracking-[0.3em] uppercase py-2 transition-all border-b-2 ${
                filter === f ? 'border-blue-500 text-white' : 'border-transparent text-slate-600 hover:text-slate-400'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredTopics.map((topic, index) => (
            <motion.div
              layout
              key={topic.id}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="relative group perspective-1000"
            >
              <Link to={`/topics/${topic.slug}`} className="block">
                <div className="relative h-[500px] rounded-2xl overflow-hidden bg-slate-900 border border-white/5 transition-all duration-700 transform-gpu group-hover:-translate-y-2 group-hover:border-blue-500/50 group-hover:shadow-[0_20px_50px_rgba(0,163,255,0.15)]">
                  <img 
                    src={topic.media[0]} 
                    alt={topic.title}
                    className="w-full h-full object-cover opacity-90 transition-all duration-1000 group-hover:scale-110 group-hover:opacity-100"
                  />
                  
                  {/* Subtle color-maintaining overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700"></div>
                  
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="flex items-center space-x-2 mb-3">
                        <span className="text-[9px] font-bold text-blue-400 tracking-widest uppercase bg-blue-500/20 px-2 py-0.5 rounded border border-blue-500/30 backdrop-blur-sm">
                            {topic.category}
                        </span>
                        {topic.featured && (
                             <span className="text-[9px] font-bold text-amber-400 tracking-widest uppercase bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30 backdrop-blur-sm">
                             Featured
                         </span>
                        )}
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight mb-2 group-hover:text-blue-400 transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed group-hover:text-slate-300 transition-colors">
                      {topic.summary}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredTopics.length === 0 && (
        <div className="py-48 text-center">
            <p className="text-slate-500 tracking-widest uppercase text-xs">No records found for this category.</p>
        </div>
      )}
    </div>
  );
};

export default Topics;
