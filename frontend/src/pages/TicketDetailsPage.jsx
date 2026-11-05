import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ticketApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { PriorityBadge, StatusBadge, SlaBadge, SlaCountdown } from '../components/Badge';

export const TicketDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [closingTicket, setClosingTicket] = useState(false);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await ticketApi.getDetails(id);
      if (res.data?.success) {
        setData(res.data.data);
      }
    } catch (err) {
      showToast(err.response?.data?.error || err.message || 'Failed to load ticket details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);

    try {
      const res = await ticketApi.addComment(id, commentText.trim());
      if (res.data?.success) {
        setCommentText('');
        showToast('Comment posted successfully!', 'success');
        fetchDetails();
      }
    } catch (err) {
      showToast(err.response?.data?.error || err.message || 'Failed to add comment', 'error');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!window.confirm('Are you sure you want to confirm resolution and close this ticket?')) return;

    setClosingTicket(true);

    try {
      const res = await ticketApi.close(id);
      if (res.data?.success) {
        showToast('Ticket closed successfully! Thank you for confirming resolution.', 'success');
        fetchDetails();
      }
    } catch (err) {
      showToast(err.response?.data?.error || err.message || 'Failed to close ticket', 'error');
    } finally {
      setClosingTicket(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f4f7fb]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1769aa]"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f4f7fb]">
        <Navbar />
        <div className="w-[92%] max-w-[800px] mx-auto py-16 text-center">
          <div className="p-8 bg-white border border-[#efb4b4] rounded-xl shadow-sm">
            <h2 className="text-xl font-bold text-[#a62c2c] mb-2">Ticket Not Found or Access Denied</h2>
            <p className="text-sm text-[#718193] mb-5">
              You may not have permission to view this ticket or it does not exist.
            </p>
            <Link
              to="/dashboard"
              className="px-5 py-2.5 bg-[#1769aa] text-white text-xs font-bold rounded-md hover:bg-[#0d4f87]"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const ticket = data?.ticket;
  const comments = data?.comments || [];
  const history = data?.history || [];

  const isCreator = user?.userId === ticket?.createdBy;
  const canClose = isCreator && ticket?.status === 'RESOLVED';

  const getBackPath = () => {
    if (user?.role === 'ADMIN') return '/admin';
    if (user?.role === 'AGENT') return '/agent';
    return '/my-tickets';
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f7fb]">
      <Navbar />

      <main className="w-[92%] max-w-[1100px] mx-auto py-10 flex-1">
        <div className="mb-6 flex items-center justify-between">
          <Link to={getBackPath()} className="text-xs text-[#1769aa] font-semibold hover:underline">
            &larr; Back to Tickets List
          </Link>
          <span className="text-xs text-[#718193] font-mono">ID: #{ticket?.ticketId}</span>
        </div>

        {/* Ticket Header Card */}
        <div className="bg-white border border-[#dce5ef] rounded-xl p-8 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#e0e7ef]">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-[#718193]">
                  TICKET #{ticket?.ticketId}
                </span>
                <span className="text-[#cbd5e1]">&bull;</span>
                <span className="text-xs font-semibold text-[#526477]">
                  {ticket?.category}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#173b5f]">
                {ticket?.title}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <PriorityBadge priority={ticket?.priority} />
              <StatusBadge status={ticket?.status} />
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-[#e0e7ef] text-xs">
            <div>
              <span className="text-[#778799] block mb-1">Created By</span>
              <strong className="text-[#263f58] font-semibold">
                {ticket?.createdByName || `User #${ticket?.createdBy}`}
              </strong>
            </div>

            <div>
              <span className="text-[#778799] block mb-1">Assigned Specialist</span>
              <strong className="text-[#263f58] font-semibold">
                {ticket?.assignedToName ? ticket.assignedToName : <span className="text-[#a0aec0] italic">Unassigned</span>}
              </strong>
            </div>

            <div>
              <span className="text-[#778799] block mb-1">Created Date</span>
              <strong className="text-[#263f58] font-semibold">
                {ticket?.createdAt ? new Date(ticket.createdAt).toLocaleString() : '-'}
              </strong>
            </div>

            <div>
              <span className="text-[#778799] block mb-1">Live SLA Target</span>
              <div className="flex flex-col gap-0.5">
                <SlaCountdown dueAt={ticket?.dueAt} status={ticket?.status} />
                <SlaBadge dueAt={ticket?.dueAt} status={ticket?.status} />
              </div>
            </div>
          </div>

          {/* Ticket Description */}
          <div className="pt-6">
            <h3 className="text-xs font-bold uppercase text-[#778799] tracking-wider mb-2">
              Description
            </h3>
            <p className="text-sm text-[#263547] leading-relaxed whitespace-pre-wrap bg-[#f8fafc] p-4 rounded-lg border border-[#e1e8ef]">
              {ticket?.description}
            </p>
          </div>

          {/* Close Ticket Button (For Creator when RESOLVED) */}
          {canClose && (
            <div className="mt-6 p-4 rounded-lg bg-[#edf9f2] border border-[#a6d9bc] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <strong className="text-[#207343] text-sm block">Issue has been marked Resolved</strong>
                <span className="text-xs text-[#526477]">Please test the solution. If resolved to your satisfaction, click below to close this ticket.</span>
              </div>
              <button
                onClick={handleCloseTicket}
                disabled={closingTicket}
                className="px-5 py-2.5 bg-[#24824f] text-white text-xs font-bold uppercase rounded-md hover:bg-[#17683c] transition-colors whitespace-nowrap shadow-sm disabled:opacity-50"
              >
                {closingTicket ? 'Closing...' : 'Confirm & Close Ticket'}
              </button>
            </div>
          )}
        </div>

        {/* Dual Column: Comments & Status Audit History */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
          {/* Left Column: Comments */}
          <div className="bg-white border border-[#dce5ef] rounded-xl p-7 shadow-sm">
            <h3 className="text-lg font-bold text-[#173b5f] mb-4">
              Discussion & Updates ({comments.length})
            </h3>

            {comments.length === 0 ? (
              <p className="text-xs text-[#718193] italic py-6 text-center border border-dashed border-[#dce5ef] rounded-lg">
                No comments posted yet.
              </p>
            ) : (
              <div className="space-y-4 mb-6">
                {comments.map((c) => (
                  <div key={c.commentId} className="p-4 rounded-lg bg-[#f8fafc] border border-[#e1e8ef] text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <strong className="text-[#173b5f] font-bold">{c.userName}</strong>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#e8edf2] text-[#4f6070]">
                          {c.userRole}
                        </span>
                      </div>
                      <span className="text-[#718193] text-[11px]">
                        {c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}
                      </span>
                    </div>
                    <p className="text-[#334d66] whitespace-pre-wrap leading-relaxed">
                      {c.message}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Post Comment Form */}
            {ticket?.status !== 'CLOSED' ? (
              <form onSubmit={handleAddComment} className="pt-4 border-t border-[#e0e7ef]">
                <label className="block text-xs font-bold uppercase text-[#263c53] mb-2" htmlFor="comment">
                  Add Comment
                </label>
                <textarea
                  id="comment"
                  rows={3}
                  required
                  maxLength={1000}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Type your message or troubleshooting update here..."
                  className="w-full px-3.5 py-2.5 border border-[#b8c4d1] rounded-md text-xs text-[#1f2937] focus:outline-none focus:border-[#1769aa] focus:ring-2 focus:ring-[#1769aa]/15"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px] text-[#718193]">
                    {commentText.length}/1000 characters
                  </span>
                  <button
                    type="submit"
                    disabled={submittingComment || !commentText.trim()}
                    className="px-4 py-2 bg-[#1769aa] text-white text-xs font-bold rounded-md hover:bg-[#0d4f87] transition-colors disabled:opacity-50"
                  >
                    {submittingComment ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-3 text-center text-xs text-[#718193] bg-[#f8fafc] rounded border border-[#e1e8ef]">
                This ticket is CLOSED. Further comments are disabled.
              </div>
            )}
          </div>

          {/* Right Column: Status Audit Trail */}
          <div className="bg-white border border-[#dce5ef] rounded-xl p-7 shadow-sm h-fit">
            <h3 className="text-lg font-bold text-[#173b5f] mb-4">
              Status Audit History
            </h3>

            {history.length === 0 ? (
              <p className="text-xs text-[#718193] italic py-4 text-center">
                Initial state: OPEN
              </p>
            ) : (
              <div className="relative border-l-2 border-[#dce5ef] ml-3 pl-4 space-y-5 text-xs">
                {history.map((h) => (
                  <div key={h.historyId} className="relative">
                    <span className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-[#1769aa] border-2 border-white"></span>
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      <span className="text-[#718193]">{h.oldStatus}</span>
                      <span className="text-[#1769aa]">&rarr;</span>
                      <span className="text-[#12355b]">{h.newStatus}</span>
                    </div>
                    <div className="text-[11px] text-[#718193]">
                      Changed by <strong className="text-[#263f58]">{h.changedByName || `User #${h.changedBy}`}</strong>
                    </div>
                    <div className="text-[10px] text-[#94a3b8] mt-0.5">
                      {h.changedAt ? new Date(h.changedAt).toLocaleString() : ''}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer portalName="Ticket Details" />
    </div>
  );
};
