import React from 'react';
import { Clock, UserCheck, PlayCircle, CheckCircle2 } from 'lucide-react';

export default function StatusBadge({ status }) {
  const normalized = String(status || '').toLowerCase();

  switch (normalized) {
    case 'open':
    case '1':
      return (
        <span className="badge badge-open">
          <Clock size={13} />
          Open
        </span>
      );
    case 'assigned':
    case '2':
      return (
        <span className="badge badge-assigned">
          <UserCheck size={13} />
          Assigned
        </span>
      );
    case 'inprogress':
    case '3':
      return (
        <span className="badge badge-inprogress">
          <PlayCircle size={13} />
          In Progress
        </span>
      );
    case 'resolved':
    case '4':
      return (
        <span className="badge badge-resolved">
          <CheckCircle2 size={13} />
          Resolved
        </span>
      );
    default:
      return <span className="badge">{status}</span>;
  }
}
