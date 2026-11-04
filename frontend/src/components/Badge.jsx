import React from 'react';

export const PriorityBadge = ({ priority }) => {
  const p = (priority || '').toUpperCase();
  switch (p) {
    case 'CRITICAL':
      return <span className="inline-block px-2 py-1 rounded text-[11px] font-bold tracking-wide uppercase bg-[#ffe0e0] text-[#b42323]">Critical</span>;
    case 'HIGH':
      return <span className="inline-block px-2 py-1 rounded text-[11px] font-bold tracking-wide uppercase bg-[#ffe8d5] text-[#a44b00]">High</span>;
    case 'MEDIUM':
      return <span className="inline-block px-2 py-1 rounded text-[11px] font-bold tracking-wide uppercase bg-[#fff4d8] text-[#8b6400]">Medium</span>;
    case 'LOW':
    default:
      return <span className="inline-block px-2 py-1 rounded text-[11px] font-bold tracking-wide uppercase bg-[#e7f5ec] text-[#247044]">Low</span>;
  }
};

export const StatusBadge = ({ status }) => {
  const s = (status || '').toUpperCase();
  switch (s) {
    case 'OPEN':
      return <span className="inline-block px-2.5 py-1 rounded text-[11px] font-bold tracking-wide uppercase bg-[#e7f1ff] text-[#245da6]">Open</span>;
    case 'ASSIGNED':
      return <span className="inline-block px-2.5 py-1 rounded text-[11px] font-bold tracking-wide uppercase bg-[#eee9ff] text-[#6343ad]">Assigned</span>;
    case 'IN_PROGRESS':
      return <span className="inline-block px-2.5 py-1 rounded text-[11px] font-bold tracking-wide uppercase bg-[#fff0cf] text-[#8b6100]">In Progress</span>;
    case 'RESOLVED':
      return <span className="inline-block px-2.5 py-1 rounded text-[11px] font-bold tracking-wide uppercase bg-[#ddf5e6] text-[#257047]">Resolved</span>;
    case 'CLOSED':
    default:
      return <span className="inline-block px-2.5 py-1 rounded text-[11px] font-bold tracking-wide uppercase bg-[#e8edf2] text-[#4f6070]">Closed</span>;
  }
};

export const SlaBadge = ({ dueAt, status }) => {
  if (status === 'RESOLVED' || status === 'CLOSED') {
    return <span className="inline-block px-2 py-1 rounded text-[11px] font-bold uppercase bg-[#ddf5e6] text-[#257047]">Completed</span>;
  }
  const isOverdue = dueAt && new Date(dueAt).getTime() < Date.now();
  if (isOverdue) {
    return <span className="inline-block px-2 py-1 rounded text-[11px] font-bold uppercase bg-[#ffe0e0] text-[#b42323]">Overdue</span>;
  }
  return <span className="inline-block px-2 py-1 rounded text-[11px] font-bold uppercase bg-[#e7f1ff] text-[#245da6]">Within SLA</span>;
};

