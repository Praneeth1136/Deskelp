import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      showToast('Password must contain at least 6 characters', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const res = await register(fullName, email, password, confirmPassword);
      showToast(res.data?.message || 'Registration successful! You can now log in.', 'success');
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err) {
      showToast(err.response?.data?.error || err.message || 'Registration failed', 'error');
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
            Employee Portal
          </p>
          <h1 className="text-3xl xl:text-4xl font-extrabold leading-tight">
            Register your employee account.
          </h1>
          <p className="text-white/80 text-base mt-4 leading-relaxed max-w-md">
            Get immediate access to report technical incidents, hardware defects, network outages, and account permissions.
          </p>

          <div className="space-y-3 mt-10 text-sm">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#16856b] text-white text-xs font-bold">✓</span>
              <span>Fast 4-hour SLA response for critical issues</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#16856b] text-white text-xs font-bold">✓</span>
              <span>Direct communication with assigned IT specialists</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#16856b] text-white text-xs font-bold">✓</span>
              <span>Protected with salted BCrypt password security</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-white/60">
          Deskelp Full-Stack System &copy; {new Date().getFullYear()}
        </div>
      </div>

      {/* Right Registration Form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[440px] bg-white border border-[#dce5ef] rounded-xl p-8 sm:p-10 shadow-lg shadow-[#12355b]/5">
          <Link to="/" className="inline-block text-[#1769aa] text-xs font-semibold hover:underline mb-6">
            &larr; Return to home
          </Link>

          <p className="text-[#1769aa] text-xs font-extrabold tracking-widest uppercase mb-1">
            New Account
          </p>
          <h2 className="text-[#173b5f] text-2xl font-bold mb-1">
            Create an Account
          </h2>
          <p className="text-[#718193] text-sm mb-6">
            Enter your details to register as an employee.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#263c53] uppercase mb-1.5" htmlFor="fullName">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full px-3.5 py-2.5 border border-[#b8c4d1] rounded-md text-sm text-[#1f2937] focus:outline-none focus:border-[#1769aa] focus:ring-2 focus:ring-[#1769aa]/15"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#263c53] uppercase mb-1.5" htmlFor="email">
                Work Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full px-3.5 py-2.5 border border-[#b8c4d1] rounded-md text-sm text-[#1f2937] focus:outline-none focus:border-[#1769aa] focus:ring-2 focus:ring-[#1769aa]/15"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#263c53] uppercase mb-1.5" htmlFor="password">
                Password (min. 6 characters)
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a secure password"
                className="w-full px-3.5 py-2.5 border border-[#b8c4d1] rounded-md text-sm text-[#1f2937] focus:outline-none focus:border-[#1769aa] focus:ring-2 focus:ring-[#1769aa]/15"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#263c53] uppercase mb-1.5" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full px-3.5 py-2.5 border border-[#b8c4d1] rounded-md text-sm text-[#1f2937] focus:outline-none focus:border-[#1769aa] focus:ring-2 focus:ring-[#1769aa]/15"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 mt-2 bg-[#1769aa] text-white font-bold text-sm rounded-md hover:bg-[#0d4f87] transition-colors disabled:opacity-50"
            >
              {submitting ? 'Registering...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-xs text-[#718193] mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#1769aa] font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
