import React from 'react';

export const GestureCard = ({ item, compact = false }: { item: any, compact?: boolean }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-teal-500/50 hover:bg-slate-800 transition-all duration-300 relative group shadow-lg hover:shadow-2xl flex flex-col h-full transform hover:-translate-y-1">
    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    <div 
      style={{
        width: '100%',
        height: compact ? '128px' : '192px',
        backgroundColor: 'rgba(0,0,0,0.6)',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
        borderBottom: '1px solid rgba(30, 41, 59, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <img 
        src={item.img} 
        alt={item.gesture} 
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          padding: '20px'
        }} 
      />
      <div className="absolute inset-0 ring-1 ring-inset ring-white/5 rounded-t-2xl pointer-events-none" />
    </div>
    <div className="p-6 flex flex-col flex-1 relative z-10">
      <div className="flex justify-between items-start mb-4 gap-3">
        <h3 className={`font-bold text-white ${compact ? 'text-sm' : 'text-lg'}`}>{item.title}</h3>
        <span className="text-[10px] px-3 py-1 bg-teal-500/10 text-teal-400 rounded-full uppercase font-extrabold tracking-widest shrink-0 border border-teal-500/20 shadow-inner">
          {item.gesture}
        </span>
      </div>
      <p className="text-sm text-slate-400 leading-relaxed mt-auto font-medium">{item.desc}</p>
    </div>
  </div>
);
