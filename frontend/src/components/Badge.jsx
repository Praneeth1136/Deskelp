import React, { useState, useEffect } from 'react';

export const PriorityBadge = ({ priority }) => {
  const p = (priority || '').toUpperCase();
  switch (p) {
    case 'CRITICAL':
      return <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase bg-[#ffe0e0] text-[#b42323]">Critical</span>;
    case 'HIGH':
      return <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase bg-[#ffe8d5] text-[#a44b00]">High</span>;
    case 'MEDIUM':
      return <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase bg-[#fff4d8] text-[#8b6400]">Medium</span>;
    case 'LOW':
    default:
      return <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase bg-[#e7f5ec] text-[#247044]">Low</span>;
  }
};

export const StatusBadge = ({ status }) => {
  const s = (status || '').toUpperCase();
  switch (s) {
    case 'OPEN':
      return <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase bg-[#e7f1ff] text-[#245da6]">Open</span>;
    case 'ASSIGNED':
      return <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase bg-[#eee9ff] text-[#6343ad]">Assigned</span>;
    case 'IN_PROGRESS':
      return <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase bg-[#fff0cf] text-[#8b6100]">In Progress</span>;
    case 'RESOLVED':
      return <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase bg-[#ddf5e6] text-[#257047]">Resolved</span>;
    case 'CLOSED':
    default:
      return <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase bg-[#e8edf2] text-[#4f6070]">Closed</span>;
  }
};

export const SlaBadge = ({ dueAt, status }) => {
  if (status === 'RESOLVED' || status === 'CLOSED') {
    return <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-[#ddf5e6] text-[#257047]">Completed</span>;
  }
  const isOverdue = dueAt && new Date(dueAt).getTime() < Date.now();
  if (isOverdue) {
    return <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-[#ffe0e0] text-[#b42323]">Overdue</span>;
  }
  return <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-[#e7f1ff] text-[#245da6]">Within SLA</span>;
};

/**
 * Live SLA Countdown component showing human-readable remaining time
 * or overdue amount, with real-time updates.
 */
export const SlaCountdown = ({ dueAt, status }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    // Update every minute
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  if (status === 'RESOLVED' || status === 'CLOSED') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#257047]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#257047]"></span>
        Completed
      </span>
    );
  }

  if (!dueAt) return <span className="text-[11px] text-[#718193]">-</span>;

  const dueTime = new Date(dueAt).getTime();
  const diffMs = dueTime - now;
  const isOverdue = diffMs < 0;
  const absDiff = Math.abs(diffMs);

  const hours = Math.floor(absDiff / (1000 * 60 * 60));
  const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));

  let formatted = '';
  if (hours > 0) {
    formatted = `${hours}h ${minutes}m`;
  } else {
    formatted = `${minutes}m`;
  }

  if (isOverdue) {
    return (
      <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#b42323]">
        <span className="w-2 h-2 rounded-full bg-[#b42323] animate-ping"></span>
        <span>Overdue by {formatted}</span>
      </div>
    );
  }

  // Warning when less than 2 hours left
  const isWarning = diffMs < 2 * 60 * 60 * 1000;

  return (
    <div className={`inline-flex items-center gap-1.5 text-[11px] font-semibold ${isWarning ? 'text-[#b45309]' : 'text-[#245da6]'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isWarning ? 'bg-[#b45309]' : 'bg-[#245da6]'}`}></span>
      <span>{formatted} left</span>
    </div>
  );
};
