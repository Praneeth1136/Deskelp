import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { agentApi } from '../api/client';
import { useToast } from '../context/ToastContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { PriorityBadge, StatusBadge, SlaBadge, SlaCountdown } from '../components/Badge';
import { TicketFilters } from '../components/TicketFilters';

export const AgentDashboardPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const { showToast } = useToast();

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
      showToast(err.response?.data?.error || err.message || 'Failed to fetch agent tickets', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (ticketId, newStatus) => {
    setUpdatingId(ticketId);

    try {
      const res = await agentApi.updateStatus(ticketId, newStatus);
      if (res.data?.success) {
        showToast(`Ticket #${ticketId} status updated to ${newStatus.replace('_', ' ')}!`, 'success');
        fetchTickets();
      }
    } catch (err) {
      showToast(err.response?.data?.error || err.message || 'Status update failed', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setCategoryFilter('ALL');
    setPriorityFilter('ALL');
  };

  const filteredTickets = tickets.filter((t) => {
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    if (categoryFilter !== 'ALL' && t.category !== categoryFilter) return false;
    if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) return false;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().replace('#', '').trim();
      const idMatch = t.ticketId.toString().includes(q);
      const titleMatch = (t.title || '').toLowerCase().includes(q);
      const reqMatch = (t.createdByName || '').toLowerCase().includes(q);
      if (!idMatch && !titleMatch && !reqMatch) return false;
    }

    return true;
  });

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
            Tickets assigned directly to you, auto-sorted by priority SLA (Critical & High at top).
          </p>
        </div>

        {/* Live Search & Filter Bar */}
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

        {/* Assigned Tickets Table */}
        <div className="bg-white border border-[#dce5ef] rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-sm text-[#718193]">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1769aa] mb-3"></div>
              <p>Loading your assigned queue...</p>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-base font-bold text-[#173b5f] mb-1">Queue is clear!</p>
              <p className="text-xs text-[#718193] mb-4">
                {tickets.length === 0
                  ? 'You currently have no tickets assigned to work on.'
                  : 'No tickets match the current search or filters.'}
              </p>
              {tickets.length > 0 && (
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
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-4">ID</th>
                    <th className="py-3.5 px-4">Title</th>
                    <th className="py-3.5 px-4">Requester</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Live SLA Countdown</th>
                    <th className="py-3.5 px-4">Action</th>
                    <th className="py-3.5 px-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e1e8ef] text-[#3e5368]">
                  {filteredTickets.map((ticket) => (
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
                        <span className="block text-[10px] text-[#718193] font-normal">
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
                        <div className="flex flex-col gap-1">
                          <SlaCountdown dueAt={ticket.dueAt} status={ticket.status} />
                          <SlaBadge dueAt={ticket.dueAt} status={ticket.status} />
                        </div>
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
