import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Trash2,
  Calendar,
  AlertCircle,
  Hash,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';
import { complaintService } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import CategoryBadge from '../components/CategoryBadge';
import Loading from '../components/Loading';
import ConfirmModal from '../components/ConfirmModal';

export default function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchComplaint = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await complaintService.getComplaintById(id);
        setComplaint(data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError(`Complaint #${id} could not be found or does not belong to your account.`);
        } else {
          setError(err.response?.data?.message || 'Failed to load complaint details.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  const handleDelete = async () => {
    try {
      await complaintService.deleteComplaint(id);
      setDeleteModalOpen(false);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete complaint.');
      setDeleteModalOpen(false);
    }
  };

  const formattedDate = complaint?.createdAt
    ? new Date(complaint.createdAt).toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'medium',
      })
    : 'N/A';

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />

      <div className="main-content-wrapper">
        <Navbar
          title={`Complaint #${id}`}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="main-content">
          <div style={{ maxWidth: '850px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <Link to="/dashboard" className="btn btn-secondary btn-sm">
                <ArrowLeft size={16} />
                <span>Back to Complaints</span>
              </Link>

              {complaint && (
                <button
                  onClick={() => setDeleteModalOpen(true)}
                  className="btn btn-danger btn-sm"
                >
                  <Trash2 size={16} />
                  <span>Delete Complaint</span>
                </button>
              )}
            </div>

            {loading ? (
              <Loading message="Loading complaint details..." />
            ) : error ? (
              <div className="alert alert-error">
                <AlertCircle size={20} style={{ flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontWeight: 700 }}>Error</h4>
                  <p>{error}</p>
                </div>
              </div>
            ) : complaint ? (
              <div className="details-card">
                <div className="details-header">
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-600)', marginBottom: '0.25rem', display: 'block' }}>
                      Ticket #{complaint.id}
                    </span>
                    <h2 className="details-title">{complaint.title}</h2>
                  </div>
                  <StatusBadge status={complaint.status} />
                </div>

                <div className="details-meta-grid">
                  <div>
                    <div className="meta-field-label">Category</div>
                    <div className="meta-field-value">
                      <CategoryBadge category={complaint.category} />
                    </div>
                  </div>

                  <div>
                    <div className="meta-field-label">Current Status</div>
                    <div className="meta-field-value">
                      <StatusBadge status={complaint.status} />
                    </div>
                  </div>

                  <div>
                    <div className="meta-field-label">Filed At</div>
                    <div className="meta-field-value" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
                      <Calendar size={14} color="var(--text-muted)" />
                      <span>{formattedDate}</span>
                    </div>
                  </div>
                </div>

                <div className="details-body">
                  <h3 className="details-description-title">Issue Description</h3>
                  <div className="details-description-text">{complaint.description}</div>

                  {complaint.imageUrl && (
                    <div style={{ marginTop: '2rem' }}>
                      <h3 className="details-description-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <ImageIcon size={18} color="var(--primary-600)" />
                        <span>Attached Image Evidence</span>
                      </h3>
                      <div className="details-image-preview">
                        <img src={complaint.imageUrl} alt="Complaint attachment" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </main>
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Complaint"
        message="Are you sure you want to delete this complaint? This action is permanent."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isDanger={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}
