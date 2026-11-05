import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const isLogout = new URLSearchParams(location.search).get('logout');
  const isExpired = new URLSearchParams(location.search).get('expired');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const user = await login(email, password);
      showToast(`Welcome back, ${user.fullName || user.email}!`, 'success');
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else if (user.role === 'AGENT') {
        navigate('/agent');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      showToast(err.response?.data?.error || err.message || 'Invalid email or password', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] bg-[#f5f8fc]">
      {/* Left Information Column */}
      <div className="relative hidden lg:flex flex-col justify-between p-16 bg-gradient-to-br from-[#0f2f50] via-[#123f68] to-[#1769aa] text-white overflow-hidden">
        <div>
          <Link to="/" className="inline-flex items-center gap-3 text-white hover:no-underline mb-16">
            <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/20 text-white font-extrabold text-sm tracking-wider">
              IT
            </span>
            <span className="text-xl font-bold tracking-tight">Helpdesk</span>
          </Link>

          <p className="text-[#9ed3ff] text-xs font-extrabold tracking-widest uppercase mb-3">
            Support Management
          </p>
          <h1 className="text-3xl xl:text-4xl font-extrabold leading-tight">
            Keep every technical issue visible and accountable.
          </h1>
          <p className="text-white/80 text-base mt-4 leading-relaxed max-w-md">
            A single unified workspace for employees, support agents, and administrators to report and resolve IT requests.
          </p>

          <div className="space-y-3 mt-10 text-sm">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#16856b] text-white text-xs font-bold">✓</span>
              <span>Track requests from creation to resolution</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#16856b] text-white text-xs font-bold">✓</span>
              <span>Monitor priority-based SLA deadlines</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#16856b] text-white text-xs font-bold">✓</span>
              <span>Collaborative comments & audited status history</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-white/60">
          Deskelp Full-Stack System &copy; {new Date().getFullYear()}
        </div>
      </div>

      {/* Right Login Form Column */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[440px] bg-white border border-[#dce5ef] rounded-xl p-8 sm:p-10 shadow-lg shadow-[#12355b]/5">
          <Link to="/" className="inline-block text-[#1769aa] text-xs font-semibold hover:underline mb-6">
            &larr; Return to home
          </Link>

          <p className="text-[#1769aa] text-xs font-extrabold tracking-widest uppercase mb-1">
            Secure Access
          </p>
          <h2 className="text-[#173b5f] text-2xl font-bold mb-1">
            Welcome back
          </h2>
          <p className="text-[#718193] text-sm mb-6">
            Sign in to continue to the IT Helpdesk system.
          </p>

          {isLogout && (
            <div className="mb-5 p-3 rounded-md bg-[#edf9f2] border border-[#a6d9bc] text-[#207343] text-sm">
              You have logged out successfully.
            </div>
          )}

          {isExpired && (
            <div className="mb-5 p-3 rounded-md bg-[#fff4d8] border border-[#f0d080] text-[#8b6400] text-sm">
              Your session has expired. Please log in again.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#263c53] uppercase mb-1.5" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 border border-[#b8c4d1] rounded-md text-sm text-[#1f2937] focus:outline-none focus:border-[#1769aa] focus:ring-2 focus:ring-[#1769aa]/15"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#263c53] uppercase mb-1.5" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-3.5 py-2.5 border border-[#b8c4d1] rounded-md text-sm text-[#1f2937] focus:outline-none focus:border-[#1769aa] focus:ring-2 focus:ring-[#1769aa]/15"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 mt-2 bg-[#1769aa] text-white font-bold text-sm rounded-md hover:bg-[#0d4f87] transition-colors disabled:opacity-50"
            >
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Credential Helper for Demo/Evaluation */}
          <div className="mt-6 p-3 bg-[#f8fafc] border border-[#e0e7ef] rounded-md text-xs text-[#526477]">
            <strong className="block text-[#173b5f] mb-1">Demo Credentials:</strong>
            <div className="flex justify-between">
              <span>Admin: <code>admin@helpdesk.com</code> / <code>admin123</code></span>
            </div>
            <div className="flex justify-between mt-0.5">
              <span>Agent: <code>agent@helpdesk.com</code> / <code>agent123</code></span>
            </div>
          </div>

          <p className="text-center text-xs text-[#718193] mt-6">
            Don't have an employee account?{' '}
            <Link to="/register" className="text-[#1769aa] font-bold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
