import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-64 glass-panel text-slate-200 min-h-screen flex flex-col fixed left-0 top-0 border-r border-white/5 z-20">
      <div className="p-8 flex items-center gap-3">
        <div className="w-8 h-8 relative flex items-center justify-center group">
          <div className="absolute inset-0 border-2 border-cyan rounded-lg rotate-45 group-hover:rotate-90 transition-transform duration-500"></div>
          <div className="w-2 h-2 bg-violet rounded-full z-10 animate-pulse shadow-[0_0_8px_#7c3aed]"></div>
        </div>
        <h2 className="text-xl font-light tracking-wide text-white">
          Perform<span className="font-semibold text-cyan drop-shadow-[0_0_8px_rgba(0,212,255,0.5)]">AI</span>
        </h2>
      </div>
      
      <nav className="flex-1 px-4 space-y-3 mt-4">
        <NavLink 
          to="/" 
          className={({ isActive }) => `flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-300 relative group ${isActive ? 'bg-white/5 text-cyan' : 'text-slate-400 hover:text-white'}`}
          end
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan rounded-r-md shadow-[0_0_10px_#00d4ff]"></div>}
              <LayoutDashboard size={20} className="group-hover:scale-110 transition-transform" />
              <span className="font-medium tracking-wide text-sm uppercase">Overview</span>
            </>
          )}
        </NavLink>
        <NavLink 
          to="/employees" 
          className={({ isActive }) => `flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-300 relative group ${isActive ? 'bg-white/5 text-violet' : 'text-slate-400 hover:text-white'}`}
          end
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-violet rounded-r-md shadow-[0_0_10px_#7c3aed]"></div>}
              <Users size={20} className="group-hover:scale-110 transition-transform" />
              <span className="font-medium tracking-wide text-sm uppercase">Employees</span>
            </>
          )}
        </NavLink>
        <NavLink 
          to="/employees/add" 
          className={({ isActive }) => `flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-300 relative group ${isActive ? 'bg-white/5 text-emerald' : 'text-slate-400 hover:text-white'}`}
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-emerald rounded-r-md shadow-[0_0_10px_#10b981]"></div>}
              <UserPlus size={20} className="group-hover:scale-110 transition-transform" />
              <span className="font-medium tracking-wide text-sm uppercase">Add Employee</span>
            </>
          )}
        </NavLink>
      </nav>
      
      <div className="p-6 border-t border-white/5">
        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald shadow-[0_0_8px_#10b981] animate-pulse"></div>
            <span className="text-sm font-mono text-emerald">ONLINE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
