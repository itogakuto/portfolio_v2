
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCMS } from '../../store/CMSContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { login } = useCMS();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(false);
    
    const success = await login(email, password);
    if (success) {
      navigate('/admin');
    } else {
      setError(true);
    }
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-slate-900 border border-white/5 p-12 rounded-3xl shadow-2xl">
        <h1 className="text-3xl font-bold tracking-tighter mb-2 uppercase">Gakuto Ito <span className="text-blue-500 font-light lowercase">CMS</span></h1>
        <p className="text-slate-500 text-xs tracking-widest uppercase mb-12">Authorized Personnel Only</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-2">Email Address</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="admin@nexus-labs.design"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-2">Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-white/5 border rounded-lg px-4 py-3 focus:outline-none transition-colors ${error ? 'border-red-500' : 'border-white/10 focus:border-blue-500'}`}
              placeholder="••••••••"
              required
            />
            {error && <p className="text-red-500 text-[10px] mt-2 tracking-widest uppercase">Authentication Failed</p>}
          </div>
          
          <button 
            type="submit"
            disabled={isProcessing}
            className={`w-full py-4 bg-slate-100 hover:bg-white text-slate-950 font-bold tracking-widest uppercase rounded-lg transition-all ${isProcessing ? 'opacity-50 cursor-wait' : ''}`}
          >
            {isProcessing ? 'Verifying...' : 'Authenticate'}
          </button>

          <p className="text-center text-[10px] text-slate-600 tracking-widest leading-relaxed">
              Environment check: <span className={email ? 'text-green-500' : 'text-amber-500'}>
                {email ? 'Live Connection' : 'Enter Credentials'}
              </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
