
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCMS } from '../store/CMSContext';

const Home: React.FC = () => {
  const { data } = useCMS();
  const [wordIndex, setWordIndex] = useState(0);
  const featuredTopic = data.topics.find(t => t.featured) || data.topics[0];
  const heroWords = data.heroWords || ['Complex Systems into Elegant Motion.'];

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % heroWords.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [heroWords.length]);

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-6xl"
        >
          <span className="text-blue-500 font-bold tracking-[0.4em] text-xs uppercase mb-6 block">
            Engineering for
          </span>
          
          <div className="relative">
              <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-[1.1] min-h-[2.2em] md:min-h-[1.1em]">
                <AnimatePresence mode="wait">
                    <motion.span
                        key={wordIndex}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute left-0 top-0 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 block w-full"
                    >
                        {heroWords[wordIndex]}
                    </motion.span>
                </AnimatePresence>
              </h1>
          </div>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed font-light mt-12 mb-12">
            直感に響く高精度のデジタルプロダクトを。
            エンジニアリングの規律と流麗な美学を融合させ、次世代のイマーシブなウェブインターフェースを構築します。
          </p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center"
        >
          <span className="text-[10px] font-bold tracking-[0.5em] text-slate-500 uppercase mb-4">Scroll</span>
          <div className="w-px h-16 bg-gradient-to-b from-blue-500/50 to-transparent relative overflow-hidden">
            <motion.div 
              animate={{ 
                y: [0, 64, 0],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute top-0 left-0 w-full h-1/3 bg-blue-400"
            />
          </div>
        </motion.div>
      </section>

      {/* NEW: My Purpose Section - Added before Profile */}
      <section className="relative py-48 px-6 md:px-24 overflow-hidden bg-gradient-to-b from-transparent via-[#020617]/20 to-transparent">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.5fr] gap-20 md:gap-32 items-start">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1 }}
            >
                <span className="text-blue-500 font-bold tracking-[0.6em] text-[10px] uppercase mb-10 block">My Purpose</span>
                <h2 className="text-4xl md:text-7xl font-bold tracking-tighter leading-tight">
                    Crafting<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">Invisible Resonance.</span>
                </h2>
            </motion.div>
            
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 }}
                className="space-y-10 text-slate-300 text-xl md:text-2xl font-light leading-relaxed"
            >
                <p>
                    私の目的は、技術の「冷たさ」を消し去り、デジタルの向こう側に確かな「手触り」と「呼吸」を感じさせることです。
                </p>
                <p className="text-slate-500">
                    単に美しく動くものを作るのではなく、触れた瞬間にユーザーの心がわずかに揺れ動く。
                    そんな、無意識の心地よさを設計することに情熱を注いでいます。
                </p>
                <div className="pt-10">
                    <Link to="/topics" className="inline-flex items-center space-x-6 group">
                        <span className="text-[10px] font-bold tracking-[0.4em] uppercase group-hover:text-blue-400 transition-colors">View Our Philosophy</span>
                        <div className="w-12 h-px bg-blue-500 group-hover:w-24 transition-all duration-700"></div>
                    </Link>
                </div>
            </motion.div>
        </div>
      </section>

      {/* Philosophy & About Section (Profile) */}
      <section className="py-32 px-6 md:px-24 border-t border-white/5">
        <div className="grid md:grid-cols-2 gap-16 md:gap-32 items-center max-w-7xl mx-auto mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-blue-500 font-bold tracking-[0.4em] text-[10px] uppercase mb-6 block">Profile</span>
            <h3 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">Gakuto Ito</h3>
            <p className="text-blue-400 font-medium tracking-widest text-xs uppercase mb-12">Interaction Designer & Engineer</p>
            
            <div className="text-slate-400 text-lg leading-relaxed font-light space-y-6">
              <p>
                デジタルと物理世界の境界線を美しく、そして滑らかに繋ぐことを追求しています。
                フロントエンド技術を核としながら、3D表現や感覚的なインタラクション設計を得意とし、
                ユーザーが「手触り」を感じられるような体験を構築します。
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[40px] overflow-hidden border border-white/10 bg-slate-900 relative group shadow-2xl">
              <img 
                src={data.profileImage} 
                alt="Gakuto Ito Profile" 
                className="w-full h-full object-cover opacity-90 transition-all duration-1000 group-hover:scale-105 group-hover:opacity-100"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-40"></div>
            </div>
          </motion.div>
        </div>

        {/* Featured Project Display */}
        {featuredTopic && (
          <div className="pt-16 border-t border-white/5">
            <Link to={`/topics/${featuredTopic.slug}`} className="block group">
                <div className="relative h-[60vh] md:h-[70vh] overflow-hidden rounded-3xl bg-slate-900 mb-8 border border-white/5 shadow-2xl">
                <img 
                    src={featuredTopic.media[0] || 'https://picsum.photos/1200/800'} 
                    alt={featuredTopic.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-black/10 to-transparent opacity-80"></div>
                <div className="absolute bottom-12 left-8 md:left-12 right-8 md:right-12">
                    <span className="px-3 py-1 bg-blue-600/20 text-blue-400 text-[10px] font-bold tracking-widest uppercase rounded border border-blue-500/30 mb-4 inline-block backdrop-blur-md">
                    Featured {featuredTopic.category}
                    </span>
                    <h3 className="text-4xl md:text-6xl font-bold tracking-tighter group-hover:translate-x-4 transition-transform duration-700">
                    {featuredTopic.title}
                    </h3>
                </div>
                </div>
            </Link>
          </div>
        )}
      </section>

      {/* NEW: CTA Section - Transition to Topics */}
      <section className="py-40 md:py-60 px-6 md:px-24 flex flex-col items-center justify-center border-t border-white/5 relative overflow-hidden">
        {/* Subtle background highlight */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center relative z-10"
        >
          <span className="text-blue-500 font-bold tracking-[0.5em] text-[10px] uppercase mb-10 block">Next Chapter</span>
          <h2 className="text-4xl md:text-7xl font-bold tracking-tighter mb-16 leading-none">
            Exploring the<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-800">Whole Landscape.</span>
          </h2>
          
          <Link to="/topics" className="group relative inline-flex items-center space-x-10 px-12 py-6 border border-white/10 rounded-full hover:border-blue-500 transition-all duration-700 bg-white/5 backdrop-blur-2xl">
             <span className="text-sm font-bold tracking-[0.4em] uppercase">To Topics</span>
             <div className="w-12 h-px bg-blue-500 group-hover:w-20 transition-all duration-700"></div>
             
             {/* Hover ripple effect */}
             <div className="absolute inset-0 rounded-full bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors duration-700"></div>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
