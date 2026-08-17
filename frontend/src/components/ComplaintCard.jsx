import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Eye, Trash2, Image as ImageIcon } from 'lucide-react';
import StatusBadge from './StatusBadge';
import CategoryBadge from './CategoryBadge';

export default function ComplaintCard({ complaint, onDelete }) {
  const formattedDate = complaint.createdAt
    ? new Date(complaint.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A';

  return (
    <div className="complaint-card">
      <div>
        <div className="card-top">
          <span className="card-id-tag">#{complaint.id}</span>
          <StatusBadge status={complaint.status} />
        </div>

        <h3 className="card-title">{complaint.title}</h3>
        <p className="card-desc">{complaint.description}</p>
      </div>

      <div>
        <div className="card-meta">
          <CategoryBadge category={complaint.category} />
          <div className="card-meta-item">
            <Calendar size={13} />
            <span>{formattedDate}</span>
          </div>
          {complaint.imageUrl && (
            <div className="card-meta-item" title="Attachment included">
              <ImageIcon size={13} color="var(--primary-600)" />
            </div>
          )}
        </div>

        <div className="card-actions">
          <Link
            to={`/complaints/${complaint.id}`}
            className="btn btn-secondary btn-sm"
            style={{ flex: 1 }}
          >
            <Eye size={14} />
            <span>View Details</span>
          </Link>

          {onDelete && (
            <button
              onClick={() => onDelete(complaint.id)}
              className="btn btn-sm"
              style={{
                background: '#FEF2F2',
                color: '#DC2626',
                border: '1px solid #FECACA',
              }}
              title="Delete complaint"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
