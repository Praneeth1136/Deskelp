import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const LandingPage = () => {
  const { user } = useAuth();

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin';
    if (user.role === 'AGENT') return '/agent';
    return '/dashboard';
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f8fc]">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#f7fbff] via-[#edf5fc] to-[#e8f1fa] border-b border-[#dce5ef] py-16 lg:py-20">
        <div className="w-[92%] max-w-[1180px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[#1769aa] text-xs font-extrabold tracking-widest uppercase mb-3">
              IT Support Management
            </p>
            <h1 className="text-[#102f50] text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              Keep every technical issue visible and accountable.
            </h1>
            <p className="text-[#526477] text-lg sm:text-xl mt-5 leading-relaxed">
              A modern full-stack IT service desk built with Java Servlets, REST API, MySQL, and React. Separate workflows for employees, support agents, and administrators.
            </p>

            <div className="flex flex-wrap gap-3.5 mt-8">
              <Link
                to={user ? getDashboardPath() : '/register'}
                className="px-6 py-3.5 bg-[#1769aa] text-white font-bold rounded-lg shadow-lg shadow-[#1769aa]/20 hover:bg-[#0d4f87] transition-all transform hover:-translate-y-0.5"
              >
                {user ? 'Go to Dashboard' : 'Create Employee Account'}
              </Link>
              <Link
                to="/login"
                className="px-6 py-3.5 bg-white border border-[#9fb1c4] text-[#234e70] font-bold rounded-lg hover:bg-slate-50 transition-all"
              >
                Sign In to Portal
              </Link>
            </div>

            <div className="flex flex-wrap gap-5 mt-7 text-sm text-[#607286]">
              <span className="flex items-center gap-1.5"><span className="text-[#16856b] font-bold">✓</span> Employees report & track issues</span>
              <span className="flex items-center gap-1.5"><span className="text-[#16856b] font-bold">✓</span> Agents resolve & communicate</span>
              <span className="flex items-center gap-1.5"><span className="text-[#16856b] font-bold">✓</span> Admins oversee SLA deadlines</span>
            </div>
          </div>

          {/* Interactive Ticket Preview Card */}
          <div className="bg-white border border-[#d8e3ee] rounded-2xl p-7 shadow-2xl shadow-[#204464]/15">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#e0e7ef]">
              <div>
                <span className="text-[#1769aa] text-[11px] font-extrabold tracking-wider uppercase block mb-1">Live Ticket Preview</span>
                <h3 className="text-[#173b5f] text-xl font-bold">VPN connection drop during meetings</h3>
              </div>
              <span className="px-3 py-1 bg-[#e8f3ff] text-[#1769aa] text-xs font-extrabold rounded-full tracking-wider uppercase">
                IN PROGRESS
              </span>
            </div>

            <p className="text-[#617286] text-sm my-5 leading-relaxed">
              Unable to maintain remote connection to internal code repositories when high-bandwidth video conferencing is active.
            </p>

            <div className="grid grid-cols-3 border border-[#e0e7ef] rounded-lg bg-[#f8fafc] text-xs">
              <div className="p-3 border-r border-[#e0e7ef]">
                <span className="text-[#778799] block mb-1">Category</span>
                <strong className="text-[#263f58]">NETWORK</strong>
              </div>
              <div className="p-3 border-r border-[#e0e7ef]">
                <span className="text-[#778799] block mb-1">Priority</span>
                <strong className="text-[#a44b00]">HIGH (8h SLA)</strong>
              </div>
              <div className="p-3">
                <span className="text-[#778799] block mb-1">SLA Target</span>
                <strong className="text-[#16856b]">Within SLA</strong>
              </div>
            </div>

            {/* Workflow stepper */}
            <div className="flex items-center justify-between mt-6 pt-5 border-t border-[#e0e7ef] text-center">
              <div className="flex flex-col items-center flex-1">
                <span className="w-7 h-7 rounded-full bg-[#16856b] text-white text-xs font-bold flex items-center justify-center">✓</span>
                <span className="text-[10px] text-[#263f58] font-semibold mt-1">OPEN</span>
              </div>
              <div className="h-0.5 bg-[#16856b] flex-1 -mt-3"></div>
              <div className="flex flex-col items-center flex-1">
                <span className="w-7 h-7 rounded-full bg-[#16856b] text-white text-xs font-bold flex items-center justify-center">✓</span>
                <span className="text-[10px] text-[#263f58] font-semibold mt-1">ASSIGNED</span>
              </div>
              <div className="h-0.5 bg-[#1769aa] flex-1 -mt-3"></div>
              <div className="flex flex-col items-center flex-1">
                <span className="w-7 h-7 rounded-full bg-[#1769aa] text-white text-xs font-bold flex items-center justify-center">3</span>
                <span className="text-[10px] text-[#1769aa] font-bold mt-1">WORKING</span>
              </div>
              <div className="h-0.5 bg-[#d8e0e8] flex-1 -mt-3"></div>
              <div className="flex flex-col items-center flex-1">
                <span className="w-7 h-7 rounded-full border border-[#ccd6e0] bg-white text-[#7c8b9b] text-xs font-bold flex items-center justify-center">4</span>
                <span className="text-[10px] text-[#7c8b9b] mt-1">RESOLVED</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 w-[92%] max-w-[1180px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[#1769aa] text-xs font-extrabold tracking-widest uppercase block mb-2">Architecture & Highlights</span>
          <h2 className="text-[#12355b] text-3xl sm:text-4xl font-extrabold">Enterprise-Grade Helpdesk Workflow</h2>
          <p className="text-[#667789] text-base mt-3">Full lifecycle ticket management with strict role-based access control and audit tracking.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-[#dce5ef] rounded-xl p-7 shadow-sm hover:border-[#a9c7e2] hover:-translate-y-1 transition-all">
            <span className="inline-block px-2.5 py-1 bg-[#eaf4fd] text-[#1769aa] font-bold text-xs rounded mb-4">01</span>
            <h3 className="text-[#1b4367] text-xl font-bold mb-2">Automated SLA Calculator</h3>
            <p className="text-[#68798b] text-sm leading-relaxed">
              Calculates due timestamps instantly based on priority (Critical: 4h, High: 8h, Medium: 24h, Low: 48h) ensuring team accountability.
            </p>
          </div>

          <div className="bg-white border border-[#dce5ef] rounded-xl p-7 shadow-sm hover:border-[#a9c7e2] hover:-translate-y-1 transition-all">
            <span className="inline-block px-2.5 py-1 bg-[#eaf4fd] text-[#1769aa] font-bold text-xs rounded mb-4">02</span>
            <h3 className="text-[#1b4367] text-xl font-bold mb-2">Audited Status History</h3>
            <p className="text-[#68798b] text-sm leading-relaxed">
              Every assignment, status change, and comment is permanently recorded in the history audit trail with author and timestamps.
            </p>
          </div>

          <div className="bg-white border border-[#dce5ef] rounded-xl p-7 shadow-sm hover:border-[#a9c7e2] hover:-translate-y-1 transition-all">
            <span className="inline-block px-2.5 py-1 bg-[#eaf4fd] text-[#1769aa] font-bold text-xs rounded mb-4">03</span>
            <h3 className="text-[#1b4367] text-xl font-bold mb-2">JWT & BCrypt Security</h3>
            <p className="text-[#68798b] text-sm leading-relaxed">
              State-of-the-art stateless JWT authentication with salted BCrypt password protection and role authorization filters.
            </p>
          </div>
        </div>
      </section>

      {/* Role Summary */}
      <section className="bg-[#12355b] text-white py-14">
        <div className="w-[92%] max-w-[1180px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-[#7dc7ff] text-xs font-extrabold tracking-widest uppercase block mb-1">Ticket Lifecycle</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Full Status Progression</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className="px-3 py-2 bg-white/10 border border-white/25 rounded">OPEN</span>
            <span className="text-[#7dc7ff]">&rarr;</span>
            <span className="px-3 py-2 bg-white/10 border border-white/25 rounded">ASSIGNED</span>
            <span className="text-[#7dc7ff]">&rarr;</span>
            <span className="px-3 py-2 bg-white/10 border border-white/25 rounded">IN PROGRESS</span>
            <span className="text-[#7dc7ff]">&rarr;</span>
            <span className="px-3 py-2 bg-white/10 border border-white/25 rounded">RESOLVED</span>
            <span className="text-[#7dc7ff]">&rarr;</span>
            <span className="px-3 py-2 bg-white/10 border border-white/25 rounded">CLOSED</span>
          </div>
        </div>
      </section>

      <Footer portalName="Public Landing Page" />
    </div>
  );
};

