import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Trash2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  User,
  Image as ImageIcon,
  Save,
} from 'lucide-react';
import { adminService } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import CategoryBadge from '../components/CategoryBadge';
import Loading from '../components/Loading';
import ConfirmModal from '../components/ConfirmModal';

export default function AdminComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Status modification state
  const [selectedStatus, setSelectedStatus] = useState(1);
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const fetchComplaint = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getComplaintById(id);
      setComplaint(data);

      const statusMap = { open: 1, assigned: 2, inprogress: 3, resolved: 4 };
      const currentVal =
        statusMap[String(data.status).toLowerCase()] || Number(data.status) || 1;
      setSelectedStatus(currentVal);
    } catch (err) {
      if (err.response?.status === 404) {
        setError(`Complaint #${id} does not exist in the database.`);
      } else {
        setError(err.response?.data?.message || 'Failed to load complaint details.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setSuccessMessage('');
    try {
      const updated = await adminService.updateComplaintStatus(id, selectedStatus);
      setComplaint(updated);
      setSuccessMessage(`Status successfully updated to ${updated.status}.`);
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update complaint status.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      await adminService.deleteComplaint(id);
      setDeleteModalOpen(false);
      navigate('/admin', { replace: true });
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
          title={`Admin Review #${id}`}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="main-content">
          <div style={{ maxWidth: '850px', margin: '0 auto' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
              }}
            >
              <Link to="/admin" className="btn btn-secondary btn-sm">
                <ArrowLeft size={16} />
                <span>Back to Admin Portal</span>
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

            {successMessage && (
              <div className="alert alert-success">
                <CheckCircle2 size={18} />
                <span>{successMessage}</span>
              </div>
            )}

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
                    <span
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: 'var(--primary-600)',
                        marginBottom: '0.25rem',
                        display: 'block',
                      }}
                    >
                      Ticket #{complaint.id}
                    </span>
                    <h2 className="details-title">{complaint.title}</h2>
                  </div>
                  <StatusBadge status={complaint.status} />
                </div>

                {/* Status Updater Card for Admin */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, #EEF2FF, #F8FAFC)',
                    border: '1.5px solid var(--primary-200)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    marginBottom: '1.75rem',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      color: 'var(--primary-800)',
                      marginBottom: '0.75rem',
                    }}
                  >
                    Manage Complaint Status
                  </h4>
                  <form
                    onSubmit={handleUpdateStatus}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}
                  >
                    <select
                      className="form-select"
                      style={{ flex: 1, minWidth: '200px' }}
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(Number(e.target.value))}
                    >
                      <option value={1}>Open (1)</option>
                      <option value={2}>Assigned (2)</option>
                      <option value={3}>In Progress (3)</option>
                      <option value={4}>Resolved (4)</option>
                    </select>

                    <button type="submit" className="btn btn-primary" disabled={updating}>
                      <Save size={16} />
                      <span>{updating ? 'Saving...' : 'Update Status'}</span>
                    </button>
                  </form>
                </div>

                <div className="details-meta-grid">
                  <div>
                    <div className="meta-field-label">Category</div>
                    <div className="meta-field-value">
                      <CategoryBadge category={complaint.category} />
                    </div>
                  </div>

                  <div>
                    <div className="meta-field-label">Submitting User</div>
                    <div
                      className="meta-field-value"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <User size={15} color="var(--primary-600)" />
                      <span>User ID #{complaint.userId}</span>
                    </div>
                  </div>

                  <div>
                    <div className="meta-field-label">Created Date</div>
                    <div
                      className="meta-field-value"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}
                    >
                      <Calendar size={14} color="var(--text-muted)" />
                      <span>{formattedDate}</span>
                    </div>
                  </div>
                </div>

                <div className="details-body">
                  <h3 className="details-description-title">Full Description</h3>
                  <div className="details-description-text">{complaint.description}</div>

                  {complaint.imageUrl && (
                    <div style={{ marginTop: '2rem' }}>
                      <h3
                        className="details-description-title"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                      >
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
        title="Delete Complaint (Admin)"
        message="Are you sure you want to permanently delete this complaint from the system?"
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isDanger={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}
