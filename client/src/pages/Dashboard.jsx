import { useState, useEffect } from 'react';
import { Users, TrendingUp, Building2, Trophy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import api from '../api/axios';
import StatCard from '../components/StatCard';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    avgPerformance: 0,
    topDepartment: '-',
    topPerformer: null
  });
  const [chartData, setChartData] = useState([]);
  const [topEmployees, setTopEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await api.get('/employees?limit=100');
        const employees = data.employees;
        
        if (employees.length > 0) {
          const total = employees.length;
          const avgScore = employees.reduce((acc, emp) => acc + emp.performanceScore, 0) / total;
          
          const deptCount = {};
          const deptScores = {};
          employees.forEach(emp => {
            deptCount[emp.department] = (deptCount[emp.department] || 0) + 1;
            deptScores[emp.department] = (deptScores[emp.department] || 0) + emp.performanceScore;
          });
          
          let topDept = '-';
          let maxCount = 0;
          for (const dept in deptCount) {
            if (deptCount[dept] > maxCount) {
              maxCount = deptCount[dept];
              topDept = dept;
            }
          }

          const sortedEmployees = [...employees].sort((a, b) => b.performanceScore - a.performanceScore);
          const topEmployee = sortedEmployees[0];

          setStats({
            totalEmployees: total,
            avgPerformance: Math.round(avgScore),
            topDepartment: topDept,
            topPerformer: topEmployee
          });

          const chart = Object.keys(deptScores).map(dept => ({
            name: dept,
            avgScore: Math.round(deptScores[dept] / deptCount[dept])
          }));
          setChartData(chart);
          setTopEmployees(sortedEmployees.slice(0, 5));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

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
    <div className="p-8 relative z-0">
      <div className="mb-10">
        <h1 className="text-3xl font-light text-white tracking-wide">Dashboard <span className="font-semibold text-cyan">Overview</span></h1>
        <p className="text-slate-500 font-mono text-sm mt-2 uppercase tracking-widest">Real-time Analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Employees" value={stats.totalEmployees} icon={Users} trend={{ value: '+12%', label: 'vs last cycle', isPositive: true }} />
        <StatCard title="Global Efficiency" value={stats.avgPerformance} icon={TrendingUp} trend={{value: '+4.2%', label: 'vs last cycle', isPositive: true}} />
        <StatCard title="Optimal Sector" value={stats.topDepartment} icon={Building2} />
        <StatCard title="Prime Asset" value={stats.topPerformer?.name?.split(' ')[0] || '-'} icon={Trophy} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 glass-card p-8">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-8">Efficiency Distribution by Sector</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontFamily: 'JetBrains Mono'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontFamily: 'JetBrains Mono'}} domain={[0, 100]} />
                <Tooltip 
                  cursor={{fill: 'rgba(0,212,255,0.05)'}}
                  contentStyle={{backgroundColor: 'rgba(10,15,30,0.9)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '8px', color: '#fff', fontFamily: 'JetBrains Mono', fontSize: '12px', backdropFilter: 'blur(10px)'}}
                  itemStyle={{color: '#00d4ff'}}
                />
                <Bar dataKey="avgScore" radius={[4, 4, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#00d4ff' : '#7c3aed'} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Prime Assets (Top 5)</h3>
            <Link to="/employees" className="text-cyan text-xs font-mono hover:text-white uppercase tracking-widest transition-colors">View Directory</Link>
          </div>
          <div className="space-y-5">
            {topEmployees.map((emp, index) => (
              <div key={emp._id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 cursor-default group">
                <div className={`w-8 h-8 rounded bg-white/5 border flex items-center justify-center font-mono text-sm font-bold shadow-lg ${index === 0 ? 'border-amber text-amber shadow-amber/20' : index === 1 ? 'border-slate-300 text-slate-300 shadow-slate-300/20' : index === 2 ? 'border-orange-700 text-orange-700 shadow-orange-700/20' : 'border-white/10 text-slate-500'}`}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-200 truncate group-hover:text-cyan transition-colors">{emp.name}</h4>
                  <p className="text-[10px] text-slate-500 font-mono uppercase truncate">{emp.department}</p>
                </div>
                <div className="text-emerald font-mono font-bold bg-emerald/10 border border-emerald/20 px-2 py-1 rounded text-xs shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                  {emp.performanceScore}
                </div>
              </div>
            ))}
            {topEmployees.length === 0 && <p className="text-slate-500 text-sm font-mono text-center py-8">NO DATA FOUND</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
