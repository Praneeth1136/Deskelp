import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ticketApi } from '../api/client';
import { useToast } from '../context/ToastContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { PriorityBadge, StatusBadge, SlaBadge, SlaCountdown } from '../components/Badge';
import { TicketFilters } from '../components/TicketFilters';

export const MyTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const { showToast } = useToast();
  const location = useLocation();

  useEffect(() => {
    const isCreated = new URLSearchParams(location.search).get('created');
    if (isCreated) {
      showToast('Ticket created successfully! IT team will review it shortly.', 'success');
    }
    fetchTickets();
  }, [location.search]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await ticketApi.getMyTickets();
      if (res.data?.success) {
        setTickets(res.data.data || []);
      }
    } catch (err) {
      showToast(err.response?.data?.error || err.message || 'Failed to fetch tickets', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setCategoryFilter('ALL');
    setPriorityFilter('ALL');
  };

  const filteredTickets = tickets.filter((t) => {
    // Status check
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;

    // Category check
    if (categoryFilter !== 'ALL' && t.category !== categoryFilter) return false;

    // Priority check
    if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) return false;

    // Search query check (ID, title, description, category)
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().replace('#', '').trim();
      const idMatch = t.ticketId.toString().includes(q);
      const titleMatch = (t.title || '').toLowerCase().includes(q);
      const catMatch = (t.category || '').toLowerCase().includes(q);
      if (!idMatch && !titleMatch && !catMatch) return false;
    }

    return true;
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
              Review and track all technical requests created under your employee account.
            </p>
          </div>

          <Link
            to="/create-ticket"
            className="self-start sm:self-auto px-5 py-2.5 bg-[#1769aa] text-white text-xs font-bold uppercase tracking-wider rounded-md hover:bg-[#0d4f87] transition-colors shadow-sm"
          >
            + Create New Ticket
          </Link>
        </div>

        {/* Live Search and Filters */}
        <TicketFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
          onReset={handleResetFilters}
          totalCount={tickets.length}
          filteredCount={filteredTickets.length}
        />

        {/* Tickets Table Panel */}
        <div className="bg-white border border-[#dce5ef] rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-sm text-[#718193]">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1769aa] mb-3"></div>
              <p>Loading your tickets...</p>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-base font-bold text-[#173b5f] mb-1">No matching tickets found</p>
              <p className="text-xs text-[#718193] mb-5">
                {tickets.length === 0
                  ? "You haven't submitted any support requests yet."
                  : 'Try clearing your filters or adjusting your search term.'}
              </p>
              {tickets.length === 0 ? (
                <Link
                  to="/create-ticket"
                  className="px-4 py-2 bg-[#1769aa] text-white text-xs font-bold rounded-md hover:bg-[#0d4f87]"
                >
                  Create your first ticket
                </Link>
              ) : (
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 border border-[#b8c8d8] text-[#1769aa] text-xs font-bold rounded-md hover:bg-slate-50"
                >
                  Clear All Filters
                </button>
              )}
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
                    <th className="py-3.5 px-4">Assigned Specialist</th>
                    <th className="py-3.5 px-4">Live SLA Countdown</th>
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
                        <span className="block text-[10px] text-[#718193] font-normal">
                          Created {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : '-'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#526477]">
                        {ticket.category}
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
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <SlaCountdown dueAt={ticket.dueAt} status={ticket.status} />
                          <SlaBadge dueAt={ticket.dueAt} status={ticket.status} />
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
