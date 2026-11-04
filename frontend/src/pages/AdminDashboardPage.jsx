import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../api/client';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { PriorityBadge, StatusBadge, SlaBadge } from '../components/Badge';

export const AdminDashboardPage = () => {
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [assigningId, setAssigningId] = useState(null);
  const [selectedAgents, setSelectedAgents] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getTicketsAndAgents();
      if (res.data?.success) {
        setTickets(res.data.data.tickets || []);
        setAgents(res.data.data.agents || []);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleAgentSelect = (ticketId, agentId) => {
    setSelectedAgents((prev) => ({
      ...prev,
      [ticketId]: agentId,
    }));
  };

  const handleAssign = async (ticketId) => {
    const agentId = selectedAgents[ticketId];
    if (!agentId) {
      setError('Please select an agent to assign');
      return;
    }

    setAssigningId(ticketId);
    setError('');
    setMessage('');

    try {
      const res = await adminApi.assignTicket(ticketId, agentId);
      if (res.data?.success) {
        setMessage(`Ticket #${ticketId} assigned successfully`);
        fetchData();
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Assignment failed');
    } finally {
      setAssigningId(null);
    }
  };

  // Metrics
  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => t.status === 'OPEN').length;
  const inProgressTickets = tickets.filter((t) => t.status === 'IN_PROGRESS' || t.status === 'ASSIGNED').length;
  const resolvedTickets = tickets.filter((t) => t.status === 'RESOLVED' || t.status === 'CLOSED').length;

  const filteredTickets = tickets.filter((t) => {
    if (filter === 'ALL') return true;
    return t.status === filter;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f7fb]">
      <Navbar />

      <main className="w-[92%] max-w-[1240px] mx-auto py-10 flex-1">
        <div className="mb-6">
          <p className="text-[#1769aa] text-xs font-bold tracking-widest uppercase">
            ADMINISTRATION CONSOLE
          </p>
          <h1 className="text-3xl font-extrabold text-[#12355b] mt-1">
            Global Ticket Management
          </h1>
          <p className="text-sm text-[#718193]">
            Assign incoming requests, monitor resolution SLA compliance, and oversee team workload.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-[#dce5ef] rounded-xl p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase text-[#718193] block mb-2">Total Tickets</span>
            <strong className="text-3xl font-extrabold text-[#173b5f]">{totalTickets}</strong>
          </div>
          <div className="bg-white border border-[#dce5ef] rounded-xl p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase text-[#245da6] block mb-2">Pending Assignment</span>
            <strong className="text-3xl font-extrabold text-[#245da6]">{openTickets}</strong>
          </div>
          <div className="bg-white border border-[#dce5ef] rounded-xl p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase text-[#8b6100] block mb-2">In Progress</span>
            <strong className="text-3xl font-extrabold text-[#8b6100]">{inProgressTickets}</strong>
          </div>
          <div className="bg-white border border-[#dce5ef] rounded-xl p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase text-[#257047] block mb-2">Resolved & Closed</span>
            <strong className="text-3xl font-extrabold text-[#257047]">{resolvedTickets}</strong>
          </div>
        </div>

        {message && (
          <div className="mb-6 p-4 rounded-lg bg-[#edf9f2] border border-[#a6d9bc] text-[#207343] text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-[#fff1f1] border border-[#efb4b4] text-[#a62c2c] text-sm">
            {error}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
          {['ALL', 'OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${
                filter === s
                  ? 'bg-[#12355b] text-white'
                  : 'bg-white border border-[#dce5ef] text-[#526477] hover:bg-[#f8fafc]'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Tickets Table Panel */}
        <div className="bg-white border border-[#dce5ef] rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-sm text-[#718193]">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1769aa] mb-3"></div>
              <p>Loading all system tickets...</p>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-base font-bold text-[#173b5f] mb-1">No tickets match this filter</p>
              <p className="text-xs text-[#718193]">All systems running smoothly.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#12355b] text-white font-bold uppercase text-[11px] tracking-wider">
                    <th className="py-3.5 px-4">ID</th>
                    <th className="py-3.5 px-4">Title</th>
                    <th className="py-3.5 px-4">Requester</th>
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">SLA Deadline</th>
                    <th className="py-3.5 px-4">Assigned Agent / Action</th>
                    <th className="py-3.5 px-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e1e8ef] text-[#3e5368]">
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.ticketId} className="hover:bg-[#eef6fc] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#173b5f]">
                        #{ticket.ticketId}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#1f2937] max-w-xs truncate">
                        <Link
                          to={`/tickets/${ticket.ticketId}`}
                          className="text-[#1769aa] hover:underline"
                        >
                          {ticket.title}
                        </Link>
                        <span className="block text-[11px] text-[#718193] font-normal">
                          {ticket.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#263547]">
                        {ticket.createdByName || `User #${ticket.createdBy}`}
                      </td>
                      <td className="py-3.5 px-4">
                        <PriorityBadge priority={ticket.priority} />
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={ticket.status} />
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <SlaBadge dueAt={ticket.dueAt} status={ticket.status} />
                      </td>
                      <td className="py-3.5 px-4">
                        {ticket.status === 'OPEN' ? (
                          <div className="flex items-center gap-2">
                            <select
                              value={selectedAgents[ticket.ticketId] || ''}
                              onChange={(e) => handleAgentSelect(ticket.ticketId, e.target.value)}
                              className="px-2.5 py-1.5 border border-[#b8c4d1] rounded text-xs bg-white text-[#1f2937] focus:outline-none focus:border-[#1769aa]"
                            >
                              <option value="">Select Agent...</option>
                              {agents.map((ag) => (
                                <option key={ag.userId} value={ag.userId}>
                                  {ag.fullName}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleAssign(ticket.ticketId)}
                              disabled={assigningId === ticket.ticketId}
                              className="px-3 py-1.5 bg-[#1769aa] text-white text-[11px] font-bold uppercase rounded hover:bg-[#0d4f87] transition-colors disabled:opacity-50"
                            >
                              {assigningId === ticket.ticketId ? '...' : 'Assign'}
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#16856b]"></span>
                            <span className="font-semibold text-[#173b5f]">
                              {ticket.assignedToName || `Agent #${ticket.assignedTo}`}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/tickets/${ticket.ticketId}`}
                          className="px-3 py-1.5 border border-[#b8c8d8] rounded text-[11px] font-bold text-[#1769aa] hover:bg-[#edf7ff]"
                        >
                          View &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer portalName="Administrator Portal" />
    </div>
  );
};

