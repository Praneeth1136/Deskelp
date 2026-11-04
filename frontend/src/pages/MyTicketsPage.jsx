import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ticketApi } from '../api/client';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { PriorityBadge, StatusBadge, SlaBadge } from '../components/Badge';

export const MyTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');

  const location = useLocation();
  const isCreated = new URLSearchParams(location.search).get('created');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await ticketApi.getMyTickets();
      if (res.data?.success) {
        setTickets(res.data.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    if (filter === 'ALL') return true;
    return t.status === filter;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f7fb]">
      <Navbar />

      <main className="w-[92%] max-w-[1200px] mx-auto py-10 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <Link to="/dashboard" className="text-xs text-[#1769aa] font-semibold hover:underline">
              &larr; Back to Dashboard
            </Link>
            <h1 className="text-3xl font-extrabold text-[#12355b] mt-1">
              My Support Tickets
            </h1>
            <p className="text-sm text-[#718193]">
              Review all technical requests created under your employee account.
            </p>
          </div>

          <Link
            to="/create-ticket"
            className="self-start sm:self-auto px-5 py-2.5 bg-[#1769aa] text-white text-xs font-bold uppercase tracking-wider rounded-md hover:bg-[#0d4f87] transition-colors shadow-sm"
          >
            + Create New Ticket
          </Link>
        </div>

        {isCreated && (
          <div className="mb-6 p-4 rounded-lg bg-[#edf9f2] border border-[#a6d9bc] text-[#207343] text-sm flex items-center justify-between">
            <span>Ticket created successfully! Our support team will review and assign it shortly.</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-[#fff1f1] border border-[#efb4b4] text-[#a62c2c] text-sm">
            {error}
          </div>
        )}

        {/* Filter bar */}
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
              <p>Loading your tickets...</p>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-base font-bold text-[#173b5f] mb-1">No tickets found</p>
              <p className="text-xs text-[#718193] mb-5">
                {filter === 'ALL'
                  ? "You haven't submitted any support requests yet."
                  : `No tickets with status "${filter}".`}
              </p>
              <Link
                to="/create-ticket"
                className="px-4 py-2 bg-[#1769aa] text-white text-xs font-bold rounded-md hover:bg-[#0d4f87]"
              >
                Create your first ticket
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#12355b] text-white font-bold uppercase text-[11px] tracking-wider">
                    <th className="py-3.5 px-4">ID</th>
                    <th className="py-3.5 px-4">Title</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Assigned Agent</th>
                    <th className="py-3.5 px-4">Created Date</th>
                    <th className="py-3.5 px-4">SLA Deadline</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
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
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-[#526477]">
                          {ticket.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <PriorityBadge priority={ticket.priority} />
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={ticket.status} />
                      </td>
                      <td className="py-3.5 px-4">
                        {ticket.assignedToName ? (
                          <span className="font-semibold text-[#173b5f]">{ticket.assignedToName}</span>
                        ) : (
                          <span className="text-[#a0aec0] italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-[#718193]">
                        {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <SlaBadge dueAt={ticket.dueAt} status={ticket.status} />
                          <span className="text-[10px] text-[#718193]">
                            {ticket.dueAt ? new Date(ticket.dueAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/tickets/${ticket.ticketId}`}
                          className="px-3 py-1.5 border border-[#b8c8d8] rounded text-[11px] font-bold text-[#1769aa] hover:bg-[#edf7ff]"
                        >
                          Details &rarr;
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

      <Footer portalName="My Tickets Portal" />
    </div>
  );
};

