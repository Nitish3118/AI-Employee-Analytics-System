import { useEffect, useState } from 'react';

const StatCard = ({ title, value, icon: Icon, trend }) => {
  const [count, setCount] = useState(0);
  const isNumeric = typeof value === 'number';
  const displayValue = isNumeric ? count : value;
  
  useEffect(() => {
    if (!isNumeric) return;
    let start = 0;
    const end = value;
    const duration = 1500;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value, isNumeric]);

  return (
    <div className="glass-card p-6 relative overflow-hidden group">
      {/* Decorative background grid */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
      
      {/* Cyan glow on hover */}
      <div className="absolute -inset-2 bg-cyan opacity-0 group-hover:opacity-5 blur-2xl transition-opacity duration-500 rounded-3xl pointer-events-none"></div>

      <div className="relative z-10 flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2 truncate">{title}</p>
          <h3 className="text-4xl font-mono font-bold text-white tracking-tight drop-shadow-md truncate">
            {isNumeric && count !== value && typeof value === 'number' && String(value).includes('%') ? `${displayValue}%` : displayValue}
          </h3>
        </div>
        <div className="p-3 bg-white/5 border border-white/10 text-cyan rounded-xl group-hover:scale-110 transition-transform group-hover:shadow-[0_0_15px_rgba(0,212,255,0.3)] shrink-0">
          <Icon size={24} />
        </div>
      </div>
      
      {trend && (
        <div className="relative z-10 mt-5 flex items-center gap-2 text-xs font-mono uppercase tracking-widest">
          <span className={trend.isPositive ? 'text-emerald drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'text-rose drop-shadow-[0_0_5px_rgba(244,63,94,0.5)]'}>
            {trend.value}
          </span>
          <span className="text-slate-500">{trend.label}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
