import { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function AuthLayout({ title, subtitle, children }: PropsWithChildren<{ title: string; subtitle: string }>) {
  return (
    <div className='grid min-h-screen p-6 place-items-center relative bg-byahero-navy'>
      {/* Dynamic Background Glows */}
      <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-byahero-yellow/10 rounded-full blur-[120px] pointer-events-none' />
      <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-byahero-blue/20 rounded-full blur-[120px] pointer-events-none' />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className='glass-card w-full max-w-[450px] rounded-[3rem] p-10 border border-white/20 shadow-2xl relative overflow-hidden backdrop-blur-3xl'
      >
        <div className='mb-10 relative z-10'>
          <Link to='/login' className='flex items-center gap-3 group'>
            <div className='bg-byahero-yellow p-2.5 rounded-2xl text-byahero-navy shadow-yellow group-hover:scale-110 transition-all duration-500'>
              <span className='font-brand text-2xl font-black leading-none'>B</span>
            </div>
            <span className='text-3xl font-brand font-black tracking-tighter text-white'>
              Bya<span className='text-byahero-yellow italic'>Hero</span>
            </span>
          </Link>
          
          <div className='mt-10 space-y-2'>
            <h1 className='font-brand text-4xl font-black text-white tracking-tighter leading-none italic'>
              {title}
            </h1>
            <p className='text-sm font-bold text-white/50 uppercase tracking-[0.2em]'>
              {subtitle}
            </p>
          </div>
        </div>

        <div className='relative z-10'>
          {children}
        </div>
      </motion.div>
      
      {/* Minimal Footer */}
      <div className='absolute bottom-8 text-[10px] font-black uppercase tracking-[0.5em] text-white/20'>
        Bawat commuter, bayani ng sariling byahe.
      </div>
    </div>
  );
}

