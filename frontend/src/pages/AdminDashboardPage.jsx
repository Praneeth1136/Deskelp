import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../api/client';
import { useToast } from '../context/ToastContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { PriorityBadge, StatusBadge, SlaBadge, SlaCountdown } from '../components/Badge';
import { TicketFilters } from '../components/TicketFilters';

export const AdminDashboardPage = () => {
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState(null);
  const [selectedAgents, setSelectedAgents] = useState({});

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const { showToast } = useToast();

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
      showToast(err.response?.data?.error || err.message || 'Failed to fetch admin data', 'error');
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
      showToast('Please select a support agent from the dropdown first', 'warning');
      return;
    }

    setAssigningId(ticketId);

    try {
      const res = await adminApi.assignTicket(ticketId, agentId);
      if (res.data?.success) {
        const assignedAgent = agents.find((a) => a.userId.toString() === agentId.toString());
        showToast(`Ticket #${ticketId} assigned to ${assignedAgent?.fullName || 'agent'}!`, 'success');
        fetchData();
      }
    } catch (err) {
      showToast(err.response?.data?.error || err.message || 'Assignment failed', 'error');
    } finally {
      setAssigningId(null);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setCategoryFilter('ALL');
    setPriorityFilter('ALL');
  };

  // Metrics
  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => t.status === 'OPEN').length;
  const inProgressTickets = tickets.filter((t) => t.status === 'IN_PROGRESS' || t.status === 'ASSIGNED').length;
  const resolvedTickets = tickets.filter((t) => t.status === 'RESOLVED' || t.status === 'CLOSED').length;

  const filteredTickets = tickets.filter((t) => {
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    if (categoryFilter !== 'ALL' && t.category !== categoryFilter) return false;
    if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) return false;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().replace('#', '').trim();
      const idMatch = t.ticketId.toString().includes(q);
      const titleMatch = (t.title || '').toLowerCase().includes(q);
      const reqMatch = (t.createdByName || '').toLowerCase().includes(q);
      const agentMatch = (t.assignedToName || '').toLowerCase().includes(q);
      if (!idMatch && !titleMatch && !reqMatch && !agentMatch) return false;
    }

    return true;
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
            Assign incoming requests, monitor resolution SLA compliance, and oversee specialist workload.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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

        {/* Tickets Table Panel */}
        <div className="bg-white border border-[#dce5ef] rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-sm text-[#718193]">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1769aa] mb-3"></div>
              <p>Loading global ticket directory...</p>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-base font-bold text-[#173b5f] mb-1">No tickets match the selected filters</p>
              <p className="text-xs text-[#718193] mb-4">Try clearing your filters or search keywords.</p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 border border-[#b8c8d8] text-[#1769aa] text-xs font-bold rounded-md hover:bg-slate-50"
              >
                Clear All Filters
              </button>
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
                    <th className="py-3.5 px-4">Live SLA Countdown</th>
                    <th className="py-3.5 px-4">Assigned Specialist / Action</th>
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
                        <span className="block text-[10px] text-[#718193] font-normal">
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
                        <div className="flex flex-col gap-1">
                          <SlaCountdown dueAt={ticket.dueAt} status={ticket.status} />
                          <SlaBadge dueAt={ticket.dueAt} status={ticket.status} />
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {ticket.status === 'OPEN' ? (
                          <div className="flex items-center gap-2">
                            <select
                              value={selectedAgents[ticket.ticketId] || ''}
                              onChange={(e) => handleAgentSelect(ticket.ticketId, e.target.value)}
                              className="px-2.5 py-1.5 border border-[#b8c4d1] rounded text-xs bg-white text-[#1f2937] focus:outline-none focus:border-[#1769aa]"
                            >
                              <option value="">Select Specialist...</option>
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
