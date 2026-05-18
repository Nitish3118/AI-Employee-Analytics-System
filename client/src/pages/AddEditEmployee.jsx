import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const AddEditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Engineering',
    skills: '',
    performanceScore: 50,
    experience: 0,
    role: 'Employee'
  });
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchEmployee = async () => {
        try {
          const { data } = await api.get(`/employees/${id}`);
          setFormData({
            ...data,
            skills: data.skills.join(', ')
          });
        } catch (error) {
          toast.error('Failed to fetch employee details');
          navigate('/employees');
        } finally {
          setLoading(false);
        }
      };
      fetchEmployee();
    }
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        performanceScore: Number(formData.performanceScore),
        experience: Number(formData.experience)
      };

      if (isEditMode) {
        await api.put(`/employees/${id}`, payload);
        toast.success('Employee updated successfully');
      } else {
        await api.post('/employees', payload);
        toast.success('Employee added successfully');
      }
      navigate('/employees');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save employee');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-white/10 border-t-cyan rounded-full animate-spin"></div>
          <p className="font-mono text-cyan text-sm uppercase tracking-widest animate-pulse">Initializing Data Core...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto relative z-10">
      <div className="mb-8 flex items-center gap-4">
        <Link to="/employees" className="p-3 bg-white/5 hover:bg-cyan/20 border border-white/10 hover:border-cyan text-cyan rounded-xl transition-all shadow-[0_0_10px_rgba(0,212,255,0.1)]">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-light text-white tracking-wide">
            {isEditMode ? 'Edit' : 'Add'} <span className="font-semibold text-cyan">Employee</span>
          </h1>
          <p className="text-slate-500 font-mono text-sm mt-2 uppercase tracking-widest">
            {isEditMode ? 'Update employee metrics' : 'Add new employee details'}
          </p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-cyan to-violet"></div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-slate-500 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:border-cyan focus:shadow-[0_0_10px_rgba(0,212,255,0.2)] outline-none transition-all text-white font-mono text-sm"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-slate-500 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:border-cyan focus:shadow-[0_0_10px_rgba(0,212,255,0.2)] outline-none transition-all text-white font-mono text-sm"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-slate-500 mb-2">Sector</label>
              <select
                name="department"
                required
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:border-cyan focus:shadow-[0_0_10px_rgba(0,212,255,0.2)] outline-none transition-all text-white font-mono text-sm appearance-none"
                value={formData.department}
                onChange={handleChange}
              >
                {['Engineering','HR','Marketing','Sales','Finance','Design','Operations'].map(d => (
                  <option key={d} value={d} className="bg-slate-900 text-slate-200">{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-slate-500 mb-2">Role/Title</label>
              <input
                type="text"
                name="role"
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:border-cyan focus:shadow-[0_0_10px_rgba(0,212,255,0.2)] outline-none transition-all text-white font-mono text-sm"
                value={formData.role}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-slate-500 mb-2">Core Competencies (CSV)</label>
            <input
              type="text"
              name="skills"
              placeholder="e.g. React, Node.js, Systems Architecture"
              className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:border-cyan focus:shadow-[0_0_10px_rgba(0,212,255,0.2)] outline-none transition-all text-white font-mono text-sm placeholder:text-slate-600"
              value={formData.skills}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-slate-500 mb-2 flex justify-between">
                <span>Efficiency Metric</span>
                <span className="text-cyan">{formData.performanceScore}</span>
              </label>
              <div className="py-2">
                <input
                  type="range"
                  name="performanceScore"
                  min="0"
                  max="100"
                  className="w-full accent-cyan"
                  value={formData.performanceScore}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-slate-500 mb-2">Cycles of Experience</label>
              <input
                type="number"
                name="experience"
                min="0"
                max="50"
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:border-cyan focus:shadow-[0_0_10px_rgba(0,212,255,0.2)] outline-none transition-all text-white font-mono text-sm"
                value={formData.experience}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/5 flex justify-end gap-4">
              <Link 
              to="/employees"
              className="px-6 py-3 rounded-xl font-mono text-sm uppercase tracking-widest text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-sm uppercase tracking-widest text-white bg-gradient-to-r from-cyan to-violet hover:opacity-90 shadow-[0_0_15px_rgba(0,212,255,0.3)] transition-all disabled:opacity-50"
            >
              <Save size={18} /> {saving ? 'Saving...' : (isEditMode ? 'Update Employee' : 'Add Employee')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditEmployee;
