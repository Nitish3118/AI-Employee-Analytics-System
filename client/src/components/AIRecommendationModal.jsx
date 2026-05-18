import { useState, useEffect, useRef } from 'react';
import { X, BrainCircuit, Activity, ChevronRight, AlertCircle, RefreshCw, Brain, Target, Compass, Download, ShieldAlert, CheckCircle } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import api from '../api/axios';
import gsap from 'gsap';

const AIRecommendationModal = ({ employee, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loadingStage, setLoadingStage] = useState(0);
  
  const modalRef = useRef(null);
  const contentRef = useRef(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    setLoadingStage(0);
    
    const stageTimer1 = setTimeout(() => setLoadingStage(1), 1500);
    const stageTimer2 = setTimeout(() => setLoadingStage(2), 3000);

    try {
      const response = await api.post('/ai/recommend', { employeeId: employee._id });
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Neural Link Severed');
    } finally {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
    
    gsap.fromTo(modalRef.current,
      { scale: 0.95, opacity: 0, y: 20 },
      { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
    );
  }, [employee._id]);

  useEffect(() => {
    if (contentRef.current && !loading && !error) {
      gsap.fromTo(contentRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [activeTab, loading, error]);

  const handleClose = () => {
    gsap.to(modalRef.current, {
      scale: 0.95, opacity: 0, y: 10, duration: 0.3, ease: 'power2.in',
      onComplete: onClose
    });
  };

  const getVerdictDetails = (rec) => {
    const text = rec.toUpperCase();
    if (text.includes('PROMOTE')) return { color: 'text-emerald', bg: 'bg-emerald/10', border: 'border-emerald/20', shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]', text: 'PROMOTE' };
    if (text.includes('HOLD') || text.includes('RETAIN')) return { color: 'text-amber', bg: 'bg-amber/10', border: 'border-amber/20', shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.2)]', text: 'HOLD' };
    return { color: 'text-cyan', bg: 'bg-cyan/10', border: 'border-cyan/20', shadow: 'shadow-[0_0_15px_rgba(0,212,255,0.2)]', text: 'DEVELOP' };
  };

  const handleExport = () => {
    if (!data) return;
    
    const content = `
EMPLOYEE DEVELOPMENT PLAN
----------------------------------------
Name: ${employee.name}
Department: ${employee.department}
Current Performance Score: ${employee.performanceScore}/100

EXECUTIVE SUMMARY:
${data.overallSummary}

PROMOTION VERDICT:
${data.promotionRecommendation}

IDENTIFIED SKILL GAPS:
${data.skillGaps.map(gap => `- ${gap}`).join('\n')}

RECOMMENDED TRAINING PATH:
${data.trainingRecommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${employee.name.replace(/\s+/g, '_')}_development_plan.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const radarData = data?.skillGaps ? [
    { subject: 'Technical', A: 80, B: 100, fullMark: 100 },
    { subject: 'Communication', A: 65, B: 85, fullMark: 100 },
    { subject: 'Leadership', A: 45, B: 90, fullMark: 100 },
    { subject: 'Problem Solving', A: 85, B: 95, fullMark: 100 },
    { subject: 'Teamwork', A: 75, B: 85, fullMark: 100 },
  ] : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm">
      <div 
        ref={modalRef}
        className="glass-panel w-full max-w-4xl max-h-[90vh] rounded-2xl border border-cyan/20 shadow-[0_0_50px_rgba(0,212,255,0.05)] flex flex-col overflow-hidden relative"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[200px] bg-cyan/10 blur-[100px] pointer-events-none rounded-full"></div>

        <div className="p-6 border-b border-white/5 flex items-center justify-between relative z-10 bg-black/20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded bg-white/5 border border-cyan/30 flex items-center justify-center">
              <BrainCircuit className="text-cyan drop-shadow-[0_0_8px_rgba(0,212,255,0.5)]" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-light text-white tracking-wide flex items-center gap-2">
                Neural Analysis <span className="text-slate-500 font-mono text-xs">// {employee._id.slice(-6).toUpperCase()}</span>
              </h2>
              <p className="text-cyan font-mono text-xs uppercase tracking-widest">{employee.name} • {employee.department}</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="text-slate-500 hover:text-white hover:bg-white/5 p-2 rounded-lg transition-all group"
          >
            <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto relative z-10 p-1">
          {loading ? (
            <div className="h-[500px] flex flex-col items-center justify-center p-12">
              <div className="relative w-32 h-32 mb-8">
                <Brain className="w-full h-full text-white/5 absolute inset-0" strokeWidth={1} />
                <Brain className="w-full h-full text-cyan absolute inset-0 animate-[pulse-ring_2s_infinite]" strokeWidth={1} />
                <div className="absolute inset-0 bg-gradient-to-t from-void to-transparent z-10 animate-[float_3s_ease-in-out_infinite]"></div>
              </div>
              
              <div className="w-64 space-y-4">
                <div className="flex justify-between text-xs font-mono uppercase tracking-widest text-slate-500 mb-2">
                  <span>Processing</span>
                  <span className="text-cyan">{loadingStage === 0 ? '33%' : loadingStage === 1 ? '66%' : '99%'}</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan shadow-[0_0_10px_#00d4ff] transition-all duration-1000 ease-out"
                    style={{ width: loadingStage === 0 ? '33%' : loadingStage === 1 ? '66%' : '99%' }}
                  ></div>
                </div>
                
                <div className="h-6 overflow-hidden relative text-center">
                  <div className={`text-xs font-mono tracking-widest transition-transform duration-300 ${loadingStage === 0 ? 'text-cyan shadow-cyan/50 drop-shadow-[0_0_2px_#00d4ff]' : 'text-slate-500'} absolute w-full`}>
                    Establishing Link...
                  </div>
                  <div className={`text-xs font-mono tracking-widest transition-transform duration-300 ${loadingStage === 1 ? 'text-cyan shadow-cyan/50 drop-shadow-[0_0_2px_#00d4ff] translate-y-0' : loadingStage < 1 ? 'translate-y-full text-slate-500' : '-translate-y-full text-slate-500'} absolute w-full`}>
                    Scanning Neural Patterns...
                  </div>
                  <div className={`text-xs font-mono tracking-widest transition-transform duration-300 ${loadingStage === 2 ? 'text-cyan shadow-cyan/50 drop-shadow-[0_0_2px_#00d4ff] translate-y-0' : 'translate-y-full text-slate-500'} absolute w-full`}>
                    Synthesizing Verdict...
                  </div>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="h-[400px] flex flex-col items-center justify-center p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-rose/10 flex items-center justify-center mb-6">
                <ShieldAlert className="text-rose animate-pulse" size={32} />
              </div>
              <h3 className="text-xl font-light text-rose mb-2">Analysis Failed</h3>
              <p className="text-slate-400 font-mono text-sm max-w-md mb-8 uppercase tracking-wide">{error}</p>
              <button 
                onClick={fetchInsights}
                className="px-6 py-3 bg-white/5 hover:bg-rose/20 border border-rose/30 hover:border-rose text-rose rounded-lg font-mono text-sm uppercase tracking-widest transition-colors flex items-center gap-2"
              >
                <RefreshCw size={16} /> Re-Initialize
              </button>
            </div>
          ) : data && (
            <div className="flex h-full min-h-[500px]">
              <div className="w-48 border-r border-white/5 bg-black/10 flex flex-col p-4 space-y-2">
                {[
                  { id: 'overview', icon: Activity, label: 'Overview' },
                  { id: 'promotion', icon: Target, label: 'Verdict' },
                  { id: 'skills', icon: Compass, label: 'Skill Gap' },
                  { id: 'training', icon: CheckCircle, label: 'Training' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all text-left group relative ${
                      activeTab === tab.id 
                        ? 'bg-white/5 text-cyan' 
                        : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    {activeTab === tab.id && <div className="absolute left-0 top-2 bottom-2 w-1 bg-cyan rounded-r shadow-[0_0_8px_#00d4ff]"></div>}
                    <tab.icon size={16} className={activeTab === tab.id ? 'text-cyan' : 'group-hover:text-slate-300'} />
                    <span className="font-mono text-xs uppercase tracking-widest">{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex-1 p-8 overflow-y-auto" ref={contentRef}>
                
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-cyan shadow-[0_0_15px_#00d4ff]"></div>
                      <h3 className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                        <Activity size={14} /> Executive Summary
                      </h3>
                      <p className="text-slate-200 text-lg font-light leading-relaxed">
                        "{data.overallSummary}"
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="glass-card p-5">
                        <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-4">Performance Index</p>
                        <div className="flex items-end gap-4">
                          <span className="text-5xl font-mono font-bold text-white tracking-tighter">{employee.performanceScore}</span>
                          <span className="text-sm font-mono text-cyan uppercase tracking-widest mb-1 pb-1 border-b border-cyan/30">/ 100</span>
                        </div>
                      </div>
                      <div className="glass-card p-5">
                        <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-4">Detailed Feedback</p>
                        <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">
                          {data.performanceFeedback}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'promotion' && (
                  <div className="space-y-8 h-full flex flex-col justify-center">
                    <div className="text-center">
                      <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-6">AI Promotion Verdict</p>
                      
                      {(() => {
                        const verdict = getVerdictDetails(data.promotionRecommendation);
                        return (
                          <div className="inline-block relative">
                            <div className={`absolute inset-0 ${verdict.bg} blur-xl rounded-full`}></div>
                            <div className={`relative px-12 py-6 rounded-2xl border ${verdict.border} ${verdict.bg} ${verdict.shadow}`}>
                              <h2 className={`text-5xl font-bold tracking-widest uppercase ${verdict.color}`}>
                                {verdict.text}
                              </h2>
                            </div>
                          </div>
                        );
                      })()}
                      
                      <div className="max-w-xl mx-auto mt-8 p-6 rounded-xl bg-white/5 border border-white/5">
                        <p className="text-slate-300 leading-relaxed">
                          {data.promotionRecommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'skills' && (
                  <div className="grid grid-cols-2 gap-8 items-center">
                    <div>
                      <h3 className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                        <AlertCircle size={14} /> Identified Gaps
                      </h3>
                      <div className="space-y-3">
                        {data.skillGaps.map((gap, i) => (
                          <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-rose/10 group hover:border-rose/30 transition-colors">
                            <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-rose shadow-[0_0_5px_#f43f5e] group-hover:animate-pulse"></div>
                            <span className="text-sm text-slate-300">{gap}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="h-[300px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan/5 to-transparent rounded-full flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="50%" margin={{ top: 10, right: 50, bottom: 10, left: 50 }} data={radarData}>
                          <PolarGrid stroke="rgba(255,255,255,0.1)" />
                          <PolarAngleAxis dataKey="subject" tick={{fill: '#94a3b8', fontSize: 10, fontFamily: 'JetBrains Mono'}} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                          <Radar name="Required" dataKey="B" stroke="rgba(255,255,255,0.2)" fill="rgba(255,255,255,0.05)" fillOpacity={1} />
                          <Radar name="Current" dataKey="A" stroke="#00d4ff" fill="#00d4ff" fillOpacity={0.3} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {activeTab === 'training' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-end mb-6">
                      <h3 className="text-xs font-mono uppercase tracking-widest text-slate-500 flex items-center gap-2">
                        <Compass size={14} /> Recommended Path
                      </h3>
                      <button 
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-cyan/20 border border-cyan/30 text-cyan rounded-lg text-[10px] font-mono uppercase tracking-widest transition-colors shadow-[0_0_10px_rgba(0,212,255,0.1)]"
                      >
                        <Download size={14} /> Export Plan
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {data.trainingRecommendations.map((rec, i) => (
                        <div key={i} className="flex gap-4 p-5 rounded-xl glass-card group hover:bg-white/5 transition-colors">
                          <div className="w-10 h-10 shrink-0 rounded-lg bg-emerald/10 border border-emerald/20 flex items-center justify-center text-emerald font-mono font-bold shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                            0{i+1}
                          </div>
                          <div>
                            <p className="text-slate-300 text-sm leading-relaxed group-hover:text-white transition-colors">{rec}</p>
                            <a 
                              href={`https://www.coursera.org/search?query=${encodeURIComponent(rec)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-3 inline-flex items-center gap-2 text-[10px] font-mono uppercase text-cyan hover:text-white tracking-widest opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                            >
                              Start Module <ChevronRight size={12} />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIRecommendationModal;
