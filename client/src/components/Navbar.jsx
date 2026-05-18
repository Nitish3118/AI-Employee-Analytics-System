import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="glass-panel border-b border-white/5 sticky top-0 z-10 ml-64 h-16">
      <div className="flex items-center justify-between px-8 h-full">
        <div className="flex items-center gap-4">
          <div className="h-6 w-[1px] bg-white/10"></div>
          <span className="font-mono text-cyan text-sm opacity-80 tracking-widest">
            {time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })} LOCAL
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-cyan font-bold font-mono shadow-[0_0_10px_rgba(0,212,255,0.1)]">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold leading-tight">Admin</span>
              <span className="font-medium text-sm text-slate-200">{user?.name}</span>
            </div>
          </div>
          <div className="h-6 w-[1px] bg-white/10"></div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-slate-500 hover:text-rose transition-colors group"
          >
            <LogOut size={18} className="group-hover:drop-shadow-[0_0_5px_#f43f5e]" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
