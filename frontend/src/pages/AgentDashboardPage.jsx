import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { agentApi } from '../api/client';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { PriorityBadge, StatusBadge, SlaBadge } from '../components/Badge';

export const AgentDashboardPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await agentApi.getMyTickets();
      if (res.data?.success) {
        setTickets(res.data.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch agent tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (ticketId, newStatus) => {
    setUpdatingId(ticketId);
    setError('');
    setMessage('');

    try {
      const res = await agentApi.updateStatus(ticketId, newStatus);
      if (res.data?.success) {
        setMessage(`Ticket #${ticketId} updated to ${newStatus}`);
        fetchTickets();
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Status update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f7fb]">
      <Navbar />

      <main className="w-[92%] max-w-[1240px] mx-auto py-10 flex-1">
        <div className="mb-6">
          <p className="text-[#1769aa] text-xs font-bold tracking-widest uppercase">
            SUPPORT AGENT WORKSPACE
          </p>
          <h1 className="text-3xl font-extrabold text-[#12355b] mt-1">
            My Assigned Queue
          </h1>
          <p className="text-sm text-[#718193]">
            Tickets assigned to you, ordered automatically by priority (Critical & High first).
          </p>
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

        {/* Assigned Tickets Table */}
        <div className="bg-white border border-[#dce5ef] rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-sm text-[#718193]">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1769aa] mb-3"></div>
              <p>Loading your assigned queue...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-base font-bold text-[#173b5f] mb-1">Queue is empty!</p>
              <p className="text-xs text-[#718193]">You currently have no tickets assigned to work on.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#12355b] text-white font-bold uppercase text-[11px] tracking-wider">
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-4">ID</th>
                    <th className="py-3.5 px-4">Title</th>
                    <th className="py-3.5 px-4">Requester</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">SLA Deadline</th>
                    <th className="py-3.5 px-4">Action</th>
                    <th className="py-3.5 px-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e1e8ef] text-[#3e5368]">
                  {tickets.map((ticket) => (
                    <tr key={ticket.ticketId} className="hover:bg-[#eef6fc] transition-colors">
                      <td className="py-3.5 px-4">
                        <PriorityBadge priority={ticket.priority} />
                      </td>
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
                        <StatusBadge status={ticket.status} />
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <SlaBadge dueAt={ticket.dueAt} status={ticket.status} />
                      </td>
                      <td className="py-3.5 px-4">
                        {ticket.status === 'ASSIGNED' && (
                          <button
                            onClick={() => handleUpdateStatus(ticket.ticketId, 'IN_PROGRESS')}
                            disabled={updatingId === ticket.ticketId}
                            className="px-3 py-1.5 bg-[#1769aa] text-white text-[11px] font-bold uppercase rounded hover:bg-[#0d4f87] transition-colors disabled:opacity-50"
                          >
                            {updatingId === ticket.ticketId ? '...' : 'Start Work'}
                          </button>
                        )}

                        {ticket.status === 'IN_PROGRESS' && (
                          <button
                            onClick={() => handleUpdateStatus(ticket.ticketId, 'RESOLVED')}
                            disabled={updatingId === ticket.ticketId}
                            className="px-3 py-1.5 bg-[#24824f] text-white text-[11px] font-bold uppercase rounded hover:bg-[#17683c] transition-colors disabled:opacity-50"
                          >
                            {updatingId === ticket.ticketId ? '...' : 'Mark Resolved'}
                          </button>
                        )}

                        {(ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') && (
                          <span className="text-[#718193] text-[11px] italic">
                            {ticket.status === 'RESOLVED' ? 'Awaiting employee closure' : 'Closed'}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/tickets/${ticket.ticketId}`}
                          className="px-3 py-1.5 border border-[#b8c8d8] rounded text-[11px] font-bold text-[#1769aa] hover:bg-[#edf7ff]"
                        >
                          Work &rarr;
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

      <Footer portalName="Support Agent Portal" />
    </div>
  );
};

