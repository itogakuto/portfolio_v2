
import React from 'react';
import { motion } from 'framer-motion';
import { useCMS } from '../store/CMSContext';

const News: React.FC = () => {
  const { data } = useCMS();

  return (
    <div className="min-h-screen pt-32 px-6 md:px-24 pb-24 max-w-6xl mx-auto">
      <header className="mb-20">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-4">News</h1>
        <p className="text-slate-500 tracking-widest uppercase text-xs">Stay updated with our latest milestones.</p>
      </header>

      <div className="space-y-12">
        {data.news.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group flex flex-col md:flex-row md:items-center py-10 border-b border-white/5 hover:bg-white/[0.02] transition-colors rounded-lg px-6 -mx-6"
          >
            <div className="md:w-32 mb-4 md:mb-0">
              <span className="text-xs font-bold text-slate-500">{item.date}</span>
            </div>
            
            <div className="flex-1">
              <span className="inline-block text-[10px] font-bold text-blue-500 tracking-widest uppercase mb-2">
                {item.category}
              </span>
              <h2 className="text-2xl font-bold group-hover:text-blue-400 transition-colors cursor-pointer">
                {item.title}
              </h2>
              <p className="text-slate-400 mt-2 max-w-2xl">{item.shortText}</p>
            </div>
            
            <div className="md:w-24 flex justify-end">
              <span className="text-2xl opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-2 text-blue-500">
                &rarr;
              </span>
            </div>
          </motion.div>
        ))}

        {data.news.length === 0 && (
             <div className="py-24 text-center border border-dashed border-white/10 rounded-3xl">
                <p className="text-slate-500 italic">No news updates available at this moment.</p>
             </div>
        )}
      </div>
    </div>
  );
};

export default News;
