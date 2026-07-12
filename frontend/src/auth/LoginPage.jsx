import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Eye, EyeOff } from 'lucide-react';
import { useAuth } from './useAuth';
import Button from '../common/components/Button';
import Input from '../common/components/Input';
import { DEMO_USERS, DEFAULT_PASSWORD } from '../config/constants';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('fleet@transitops.com');
  const [password, setPassword] = useState(DEFAULT_PASSWORD);
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword(DEFAULT_PASSWORD);
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-600 to-brand-700 p-12 flex-col justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl"><Truck size={28} /></div>
          <div>
            <h1 className="text-2xl font-bold">TransitOps</h1>
            <p className="text-brand-100 text-sm">Smart Transport Operations Platform</p>
          </div>
        </div>
        <div>
          <h2 className="text-4xl font-bold leading-tight">Digitize your fleet operations</h2>
          <p className="mt-4 text-brand-100 text-lg">Manage vehicles, drivers, trips, maintenance, and expenses — all in one place.</p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {['Fleet Management', 'Trip Dispatch', 'Compliance', 'Analytics'].map((f) => (
              <div key={f} className="bg-white/10 rounded-lg p-3 text-sm">{f}</div>
            ))}
          </div>
        </div>
        <p className="text-brand-200 text-sm">Hackathon Demo · TransitOps v1.0</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Truck className="text-brand-600" size={28} />
            <span className="text-xl font-bold">TransitOps</span>
          </div>
          <h2 className="text-2xl font-bold">Sign in</h2>
          <p className="text-slate-500 mt-1">Select a role to explore the platform</p>

          <div className="grid grid-cols-2 gap-2 mt-6">
            {DEMO_USERS.map((u) => (
              <button
                key={u.email}
                type="button"
                onClick={() => quickLogin(u.email)}
                className={`p-3 rounded-lg border text-left text-sm transition-colors ${email === u.email ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-brand-300'}`}
              >
                <span className="font-medium block">{u.label}</span>
                <span className="text-xs text-slate-400">{u.email}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <div className="relative">
              <Input label="Password" type={showPwd ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-9 text-slate-400">
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <p className="text-center text-xs text-slate-400 mt-4">Demo password: {DEFAULT_PASSWORD}</p>
        </div>
      </div>
    </div>
  );
}
