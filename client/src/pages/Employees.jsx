import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Plus, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import EmployeeCard from '../components/EmployeeCard';
import AIRecommendationModal from '../components/AIRecommendationModal';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [sortBy, setSortBy] = useState('performanceScore');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAIEmployee, setSelectedAIEmployee] = useState(null);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/employees', {
        params: { search, department, sortBy, order, page, limit: 12 }
      });
      setEmployees(data.employees);
      setTotalPages(Math.ceil(data.total / data.limit));
    } catch (error) {
      toast.error('Failed to fetch node data');
    } finally {
      setLoading(false);
    }
  }, [search, department, sortBy, order, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployees();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchEmployees]);

  const handleDelete = async (id) => {
    if (window.confirm('WARNING: Irreversible action. Delete employee from database?')) {
      try {
        await api.delete(`/employees/${id}`);
        toast.success('Employee deleted');
        fetchEmployees();
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  return (
    <div className="p-8 relative z-0 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-light text-white tracking-wide">Employees <span className="font-semibold text-violet">Directory</span></h1>
          <p className="text-slate-500 font-mono text-sm mt-2 uppercase tracking-widest">Manage your team</p>
        </div>
        <Link 
          to="/employees/add" 
          className="flex items-center gap-2 bg-white/5 hover:bg-violet/20 border border-violet/30 hover:border-violet text-white px-5 py-2.5 rounded-xl font-mono text-sm uppercase tracking-widest shadow-[0_0_10px_rgba(124,58,237,0.1)] transition-all"
        >
          <Plus size={18} className="text-violet" /> Add Employee
        </Link>
      </div>

      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 mb-10">
        <div className="flex-1 relative group">
          <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan opacity-70" size={18} />
          <input 
            type="text" 
            placeholder="Search employees..." 
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/20 border border-white/10 focus:border-cyan focus:shadow-[0_0_10px_rgba(0,212,255,0.2)] outline-none transition-all text-white font-mono text-sm placeholder:text-slate-600"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-violet opacity-70" size={16} />
            <select 
              className="pl-12 pr-10 py-3 rounded-xl bg-black/20 border border-white/10 focus:border-violet focus:shadow-[0_0_10px_rgba(124,58,237,0.2)] outline-none appearance-none text-white font-mono text-sm uppercase tracking-widest"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="" className="bg-slate-900 text-slate-200">All Sectors</option>
              {['Engineering','HR','Marketing','Sales','Finance','Design','Operations'].map(d => (
                <option key={d} value={d} className="bg-slate-900 text-slate-200">{d}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={() => setOrder(order === 'desc' ? 'asc' : 'desc')}
            className="px-5 py-3 border border-white/10 bg-white/5 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition-colors font-mono text-sm uppercase tracking-widest flex items-center gap-2"
          >
            Sort <span className="text-cyan">{order === 'desc' ? '▼' : '▲'}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(n => (
            <div key={n} className="glass-card p-6 h-[260px] animate-pulse">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-white/5"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-white/10 rounded w-24"></div>
                  <div className="h-2 bg-white/5 rounded w-16"></div>
                </div>
              </div>
              <div className="space-y-3 mb-8">
                <div className="h-2 bg-white/5 rounded w-full"></div>
                <div className="h-2 bg-white/5 rounded w-3/4"></div>
              </div>
              <div className="flex gap-3">
                <div className="h-8 bg-white/5 rounded flex-1"></div>
                <div className="h-8 bg-white/5 rounded flex-1"></div>
              </div>
            </div>
          ))}
        </div>
      ) : employees.length === 0 ? (
        <div className="text-center py-24 glass-panel rounded-2xl">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10 mb-6">
            <Search className="text-slate-500 w-10 h-10" />
          </div>
          <h3 className="text-xl font-light text-white tracking-wide mb-2">NO RECORDS FOUND</h3>
          <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">Adjust query parameters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mb-10">
            {employees.map(employee => (
              <EmployeeCard 
                key={employee._id} 
                employee={employee} 
                onDelete={handleDelete}
                onAIRecommend={setSelectedAIEmployee}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-5 py-2.5 border border-white/10 bg-black/20 rounded-xl text-xs font-mono uppercase tracking-widest disabled:opacity-30 hover:bg-white/10 hover:text-white transition-colors text-slate-300"
              >
                Previous
              </button>
              <span className="text-cyan font-mono text-sm">PAGE {page}/{totalPages}</span>
              <button 
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-5 py-2.5 border border-white/10 bg-black/20 rounded-xl text-xs font-mono uppercase tracking-widest disabled:opacity-30 hover:bg-white/10 hover:text-white transition-colors text-slate-300"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {selectedAIEmployee && (
        <AIRecommendationModal 
          employee={selectedAIEmployee} 
          onClose={() => setSelectedAIEmployee(null)} 
        />
      )}
    </div>
  );
};

export default Employees;
