import { Edit, Trash2, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const EmployeeCard = ({ employee, onDelete, onAIRecommend }) => {
  const [offset, setOffset] = useState(100);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(100 - employee.performanceScore);
    }, 100);
    return () => clearTimeout(timer);
  }, [employee.performanceScore]);

  const getScoreColor = (score) => {
    if (score >= 80) return { text: 'text-emerald', stroke: '#10b981' };
    if (score >= 60) return { text: 'text-amber', stroke: '#f59e0b' };
    return { text: 'text-rose', stroke: '#f43f5e' };
  };

  const colors = getScoreColor(employee.performanceScore);

  return (
    <div className="glass-card relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-cyan to-violet"></div>
      
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

      <div className="absolute -inset-2 bg-cyan opacity-0 group-hover:opacity-[0.03] blur-2xl transition-opacity duration-500 rounded-3xl pointer-events-none"></div>

      <div className="p-6 relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center font-mono font-bold text-white shadow-inner">
              {employee.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-medium text-white tracking-wide truncate max-w-[120px] sm:max-w-[150px]">{employee.name}</h3>
              <p className="text-[10px] font-mono text-cyan uppercase tracking-widest">{employee.department}</p>
            </div>
          </div>
          
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
              <path
                className="text-white/10"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="transition-all duration-1000 ease-out drop-shadow-[0_0_4px_currentColor]"
                strokeWidth="3"
                strokeDasharray="100, 100"
                strokeDashoffset={offset}
                strokeLinecap="round"
                stroke={colors.stroke}
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className={`absolute font-mono text-[10px] font-bold ${colors.text}`}>
              {employee.performanceScore}
            </span>
          </div>
        </div>
        
        <div className="mb-6 h-[50px]">
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-3">Core Competencies</p>
          <div className="flex flex-wrap gap-2">
            {employee.skills.slice(0, 3).map((skill, index) => (
              <span key={index} className="px-2.5 py-1 bg-white/5 border border-white/10 text-slate-300 text-[10px] rounded font-mono tracking-wide">
                {skill}
              </span>
            ))}
            {employee.skills.length > 3 && (
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-slate-400 text-[10px] rounded font-mono">
                +{employee.skills.length - 3}
              </span>
            )}
            {employee.skills.length === 0 && (
              <span className="text-slate-500 text-[10px] font-mono italic">NO DATA</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-5 border-t border-white/5">
          <Link 
            to={`/employees/edit/${employee._id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] uppercase tracking-widest font-semibold text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10"
          >
            <Edit size={14} /> Edit
          </Link>
          <button 
            onClick={() => onDelete(employee._id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] uppercase tracking-widest font-semibold text-slate-400 hover:text-rose hover:bg-rose/10 rounded-lg transition-colors border border-transparent hover:border-rose/20"
          >
            <Trash2 size={14} /> Purge
          </button>
        </div>

        <button 
          onClick={() => onAIRecommend(employee)}
          className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 text-[11px] uppercase tracking-widest font-bold text-white bg-white/5 hover:bg-cyan/20 border border-cyan/30 hover:border-cyan rounded-lg shadow-[0_0_10px_rgba(0,212,255,0.1)] hover:shadow-[0_0_15px_rgba(0,212,255,0.3)] transition-all relative overflow-hidden group/btn"
        >
          <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover/btn:animate-shimmer"></div>
          <Cpu size={14} className="text-cyan group-hover/btn:animate-pulse" /> Initialize AI
        </button>
      </div>
    </div>
  );
};

export default EmployeeCard;
