import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const EmployeeDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f7fb]">
      <Navbar />

      <main className="w-[92%] max-w-[1200px] mx-auto py-10 flex-1">
        {/* Welcome Banner */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 md:p-10 rounded-2xl bg-gradient-to-br from-[#12355b] to-[#1769aa] text-white shadow-xl shadow-[#12355b]/20">
          <div>
            <p className="text-[#9ed3ff] text-xs font-bold tracking-widest uppercase mb-2">
              EMPLOYEE DASHBOARD
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Welcome, {user?.fullName || 'Employee'}
            </h1>
            <p className="text-[#dceeff] text-sm sm:text-base mt-2 max-w-xl leading-relaxed">
              Create support requests, track their real-time progress, and collaborate directly with IT support specialists.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/create-ticket"
              className="px-5 py-3 bg-white text-[#1769aa] font-bold text-xs uppercase tracking-wider rounded-lg shadow hover:bg-[#edf7ff] transition-all"
            >
              Create Ticket
            </Link>
            <Link
              to="/my-tickets"
              className="px-5 py-3 border border-white/50 text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-white/10 transition-all"
            >
              My Tickets
            </Link>
          </div>
        </section>

        {/* Support Actions */}
        <section className="mt-12">
          <div className="mb-6">
            <h2 className="text-[#173b5f] text-2xl font-bold">Support Actions</h2>
            <p className="text-[#718193] text-sm">Select what you would like to do.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#dce5ef] rounded-xl p-7 shadow-sm hover:border-[#9ac7e7] hover:-translate-y-0.5 transition-all">
              <span className="inline-block px-2.5 py-1 rounded bg-[#eaf4fd] text-[#1769aa] text-xs font-bold mb-4">
                01
              </span>
              <h3 className="text-[#1b4367] text-xl font-bold mb-2">Create Support Ticket</h3>
              <p className="text-[#6a7b8d] text-sm min-h-[45px] mb-5 leading-relaxed">
                Report hardware malfunction, software bugs, network disruption, or account-access problems.
              </p>
              <Link
                to="/create-ticket"
                className="inline-block px-4 py-2.5 bg-[#1769aa] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#0d4f87] transition-colors"
              >
                Create New Ticket &rarr;
              </Link>
            </div>

            <div className="bg-white border border-[#dce5ef] rounded-xl p-7 shadow-sm hover:border-[#9ac7e7] hover:-translate-y-0.5 transition-all">
              <span className="inline-block px-2.5 py-1 rounded bg-[#eaf4fd] text-[#1769aa] text-xs font-bold mb-4">
                02
              </span>
              <h3 className="text-[#1b4367] text-xl font-bold mb-2">View My Tickets</h3>
              <p className="text-[#6a7b8d] text-sm min-h-[45px] mb-5 leading-relaxed">
                Monitor live ticket status, view resolution comments, and verify priority-based SLA deadlines.
              </p>
              <Link
                to="/my-tickets"
                className="inline-block px-4 py-2.5 bg-[#1769aa] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#0d4f87] transition-colors"
              >
                View Ticket History &rarr;
              </Link>
            </div>
          </div>

          {/* Workflow & SLA Information */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6 mt-6">
            <div className="bg-white border border-[#dce5ef] rounded-xl p-7">
              <h3 className="text-[#1b4367] text-lg font-bold mb-4">Ticket Lifecycle</h3>
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                <span className="px-3 py-2 bg-[#edf5fc] text-[#234e70] rounded-md">OPEN</span>
                <span className="text-[#8ea3b7]">&rarr;</span>
                <span className="px-3 py-2 bg-[#edf5fc] text-[#234e70] rounded-md">ASSIGNED</span>
                <span className="text-[#8ea3b7]">&rarr;</span>
                <span className="px-3 py-2 bg-[#edf5fc] text-[#234e70] rounded-md">IN PROGRESS</span>
                <span className="text-[#8ea3b7]">&rarr;</span>
                <span className="px-3 py-2 bg-[#edf5fc] text-[#234e70] rounded-md">RESOLVED</span>
                <span className="text-[#8ea3b7]">&rarr;</span>
                <span className="px-3 py-2 bg-[#edf5fc] text-[#234e70] rounded-md">CLOSED</span>
              </div>
              <p className="text-xs text-[#718193] mt-4 leading-relaxed">
                Admins assign open tickets to support specialists. Specialists advance work to In Progress and Resolved. You confirm resolution by closing the ticket.
              </p>
            </div>

            <div className="bg-white border border-[#dce5ef] rounded-xl p-7">
              <h3 className="text-[#1b4367] text-lg font-bold mb-4">Response SLA Targets</h3>
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="flex justify-between p-2.5 bg-[#f5f8fb] rounded text-[#53677b]">
                  <span>Critical</span>
                  <strong className="text-[#b42323]">4 hours</strong>
                </div>
                <div className="flex justify-between p-2.5 bg-[#f5f8fb] rounded text-[#53677b]">
                  <span>High</span>
                  <strong className="text-[#a44b00]">8 hours</strong>
                </div>
                <div className="flex justify-between p-2.5 bg-[#f5f8fb] rounded text-[#53677b]">
                  <span>Medium</span>
                  <strong className="text-[#8b6400]">24 hours</strong>
                </div>
                <div className="flex justify-between p-2.5 bg-[#f5f8fb] rounded text-[#53677b]">
                  <span>Low</span>
                  <strong className="text-[#247044]">48 hours</strong>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer portalName="Employee Portal" />
    </div>
  );
};

