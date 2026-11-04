import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login?logout=true');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    if (user.role === 'ADMIN') return '/admin';
    if (user.role === 'AGENT') return '/agent';
    return '/dashboard';
  };

  const getRoleLabel = () => {
    if (!user) return '';
    if (user.role === 'ADMIN') return 'Administrator';
    if (user.role === 'AGENT') return 'Support Agent';
    return 'Employee Account';
  };

  return (
    <header className="bg-white border-b border-[#dce5ef]">
      <div className="w-[92%] max-w-[1200px] mx-auto py-4 flex items-center justify-between">
        <Link to={getDashboardPath()} className="flex items-center gap-2.5 text-[#12355b] text-xl font-bold hover:no-underline">
          <span className="flex items-center justify-center w-[42px] height-[42px] h-[42px] rounded-[9px] bg-[#1769aa] text-white text-xs font-bold tracking-widest">
            IT
          </span>
          <span className="text-[#12355b]">Helpdesk</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <strong className="text-[#263547] text-sm leading-tight">
                {user.fullName || user.email}
              </strong>
              <span className="text-[#718193] text-xs">
                {getRoleLabel()}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 border border-[#b8c8d8] rounded-md text-[#38546e] text-xs font-semibold hover:bg-[#f0f5fa] hover:text-[#12355b] transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-[#28445f] text-sm font-semibold hover:text-[#1769aa]"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-[#1769aa] text-white text-sm font-semibold rounded-md hover:bg-[#0d4f87] transition-colors"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

