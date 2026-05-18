import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Fingerprint, CheckCircle, XCircle } from 'lucide-react';
import NeuralBackground from '../components/NeuralBackground';
import gsap from 'gsap';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('idle'); 
  const { login } = useAuth();
  const navigate = useNavigate();
  const formRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      formRef.current.children,
      { x: 30, opacity: 0 },
      { x: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power3.out' }
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    const success = await login(email, password);
    if (success) {
      setStatus('success');
      setTimeout(() => navigate('/'), 800);
    } else {
      setStatus('error');
      gsap.fromTo(formRef.current, 
        { x: 0 }, 
        { x: [0, 10, -10, 10, 0], duration: 0.4, ease: 'power2.inOut' }
      );
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-void flex overflow-hidden">
      {/* Left Panel */}
      <div className="w-[60%] relative hidden lg:flex flex-col justify-center items-center overflow-hidden border-r border-white/5">
        <NeuralBackground />
        <div className="relative z-10 text-center pointer-events-none mt-[-100px]">
          <h1 className="text-6xl font-light text-cyan drop-shadow-[0_0_15px_rgba(0,212,255,0.5)] mb-4">
            Perform<span className="font-semibold text-white">AI</span>
          </h1>
          <p className="text-slate-400 text-xl font-light tracking-wide">Intelligence-grade HR analytics</p>
        </div>
        
        <div className="absolute bottom-12 left-0 w-full flex justify-center gap-12 z-10">
          <div className="text-center">
            <p className="font-mono text-cyan text-2xl font-bold">2,847</p>
            <p className="text-slate-500 text-sm uppercase tracking-widest mt-1">Analyzed</p>
          </div>
          <div className="text-center">
            <p className="font-mono text-violet text-2xl font-bold">99.2%</p>
            <p className="text-slate-500 text-sm uppercase tracking-widest mt-1">Accuracy</p>
          </div>
          <div className="text-center">
            <p className="font-mono text-emerald text-2xl font-bold">12ms</p>
            <p className="text-slate-500 text-sm uppercase tracking-widest mt-1">Response</p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-[40%] flex items-center justify-center bg-[#020408] relative z-10">
        <div className="w-full max-w-md px-12 py-16" ref={formRef}>
          
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 relative mb-6">
              {status === 'idle' && (
                <>
                  <Fingerprint className="w-full h-full text-cyan absolute inset-0 opacity-80" strokeWidth={1} />
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan shadow-[0_0_10px_#00d4ff] animate-[float_2s_ease-in-out_infinite]"></div>
                </>
              )}
              {status === 'loading' && <Fingerprint className="w-full h-full text-violet animate-pulse" strokeWidth={1} />}
              {status === 'success' && <CheckCircle className="w-full h-full text-emerald" strokeWidth={1} />}
              {status === 'error' && <XCircle className="w-full h-full text-rose" strokeWidth={1} />}
            </div>
            <h2 className="text-3xl font-light text-white mb-2">Welcome back</h2>
            <p className="text-slate-500 text-sm tracking-wide">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <Mail className="absolute left-0 top-3 text-slate-500 group-focus-within:text-cyan transition-colors" size={20} />
              <input
                type="email"
                required
                className="w-full bg-transparent border-b border-white/20 px-8 py-3 text-white outline-none focus:border-cyan focus:shadow-[0_2px_0_0_rgba(0,212,255,0.5)] transition-all peer"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label className="absolute left-8 top-3 text-slate-500 transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-cyan peer-valid:-top-4 peer-valid:text-xs pointer-events-none">
                Email Address
              </label>
            </div>

            <div className="relative group mt-8">
              <Lock className="absolute left-0 top-3 text-slate-500 group-focus-within:text-cyan transition-colors" size={20} />
              <input
                type="password"
                required
                className="w-full bg-transparent border-b border-white/20 px-8 py-3 text-white outline-none focus:border-cyan focus:shadow-[0_2px_0_0_rgba(0,212,255,0.5)] transition-all peer"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label className="absolute left-8 top-3 text-slate-500 transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-cyan peer-valid:-top-4 peer-valid:text-xs pointer-events-none">
                Password
              </label>
            </div>

            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="w-full mt-8 h-12 bg-gradient-to-r from-cyan to-violet text-white font-medium tracking-wide flex items-center justify-center relative overflow-hidden group hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-shimmer"></div>
              {status === 'loading' ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : status === 'success' ? (
                'SIGNED IN'
              ) : (
                'SIGN IN'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-500 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-cyan hover:text-white transition-colors uppercase tracking-widest text-xs">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
