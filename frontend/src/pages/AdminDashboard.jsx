import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Clock,
  UserCheck,
  PlayCircle,
  CheckCircle2,
  Search,
  RefreshCw,
  Eye,
  Trash2,
  Edit3,
  AlertCircle,
  FileQuestion,
  User,
} from 'lucide-react';
import { adminService } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import CategoryBadge from '../components/CategoryBadge';
import Loading from '../components/Loading';
import ConfirmModal from '../components/ConfirmModal';

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Status Change Modal State
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusTargetComplaint, setStatusTargetComplaint] = useState(null);
  const [newStatusValue, setNewStatusValue] = useState(1);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const [notification, setNotification] = useState('');

  const fetchComplaints = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getAllComplaints();
      setComplaints(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to load complaints. Please check your admin privileges.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Compute Statistics
  const totalCount = complaints.length;
  const openCount = complaints.filter(
    (c) => String(c.status).toLowerCase() === 'open' || c.status === 1
  ).length;
  const assignedCount = complaints.filter(
    (c) => String(c.status).toLowerCase() === 'assigned' || c.status === 2
  ).length;
  const inProgressCount = complaints.filter(
    (c) => String(c.status).toLowerCase() === 'inprogress' || c.status === 3
  ).length;
  const resolvedCount = complaints.filter(
    (c) => String(c.status).toLowerCase() === 'resolved' || c.status === 4
  ).length;

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      c.title.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query) ||
      String(c.id).includes(query) ||
      String(c.userId).includes(query);

    const matchesStatus =
      statusFilter === 'ALL' ||
      String(c.status).toLowerCase() === statusFilter.toLowerCase();

    const matchesCategory =
      categoryFilter === 'ALL' ||
      String(c.category).toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Open Status Changer
  const handleOpenStatusModal = (complaint) => {
    setStatusTargetComplaint(complaint);
    const statusMap = { open: 1, assigned: 2, inprogress: 3, resolved: 4 };
    const currentVal =
      statusMap[String(complaint.status).toLowerCase()] || Number(complaint.status) || 1;
    setNewStatusValue(currentVal);
    setStatusModalOpen(true);
  };

  // Submit Status Change
  const handleSaveStatus = async () => {
    if (!statusTargetComplaint) return;
    setUpdatingStatus(true);
    try {
      await adminService.updateComplaintStatus(
        statusTargetComplaint.id,
        newStatusValue
      );
      setStatusModalOpen(false);
      setStatusTargetComplaint(null);
      setNotification(`Status for Complaint #${statusTargetComplaint.id} updated.`);
      setTimeout(() => setNotification(''), 4000);
      fetchComplaints();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update complaint status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Trigger Delete
  const handleDeleteClick = (id) => {
    setDeleteTargetId(id);
    setDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await adminService.deleteComplaint(deleteTargetId);
      setDeleteModalOpen(false);
      setDeleteTargetId(null);
      setNotification('Complaint deleted successfully.');
      setTimeout(() => setNotification(''), 4000);
      fetchComplaints();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete complaint.');
      setDeleteModalOpen(false);
    }
  };

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />

      <div className="main-content-wrapper">
        <Navbar
          title="Admin Control Center"
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="main-content">
          {notification && (
            <div className="alert alert-success">
              <CheckCircle2 size={18} />
              <span>{notification}</span>
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Admin Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-info-group">
                <span className="stat-label">System Complaints</span>
                <span className="stat-value">{totalCount}</span>
              </div>
              <div className="stat-icon-wrapper stat-icon-total">
                <Layers size={24} />
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-info-group">
                <span className="stat-label">Open</span>
                <span className="stat-value">{openCount}</span>
              </div>
              <div className="stat-icon-wrapper stat-icon-open">
                <Clock size={24} />
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-info-group">
                <span className="stat-label">Assigned</span>
                <span className="stat-value">{assignedCount}</span>
              </div>
              <div className="stat-icon-wrapper stat-icon-assigned">
                <UserCheck size={24} />
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-info-group">
                <span className="stat-label">In Progress</span>
                <span className="stat-value">{inProgressCount}</span>
              </div>
              <div className="stat-icon-wrapper stat-icon-inprogress">
                <PlayCircle size={24} />
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-info-group">
                <span className="stat-label">Resolved</span>
                <span className="stat-value">{resolvedCount}</span>
              </div>
              <div className="stat-icon-wrapper stat-icon-resolved">
                <CheckCircle2 size={24} />
              </div>
            </div>
          </div>

          {/* Section Header & Controls */}
          <div className="section-header">
            <h2 className="section-title">All System Complaints</h2>

            <div className="controls-bar">
              <div className="search-input-wrap">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by title, desc, ID, user..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                className="form-select"
                style={{ width: 'auto', minWidth: '130px', padding: '0.6rem 0.85rem' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="Open">Open</option>
                <option value="Assigned">Assigned</option>
                <option value="InProgress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>

              <select
                className="form-select"
                style={{ width: 'auto', minWidth: '140px', padding: '0.6rem 0.85rem' }}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="ALL">All Categories</option>
                <option value="Electricity">Electricity</option>
                <option value="Water">Water</option>
                <option value="WiFi">WiFi</option>
                <option value="Furniture">Furniture</option>
              </select>

              <button
                className="btn btn-secondary"
                onClick={fetchComplaints}
                title="Refresh complaints table"
                style={{ padding: '0.6rem 0.9rem' }}
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </div>

          {/* Admin Table View */}
          {loading ? (
            <Loading message="Fetching all user complaints from database..." />
          ) : filteredComplaints.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon-wrap">
                <FileQuestion size={32} />
              </div>
              <h3 className="empty-title">No Complaints Found</h3>
              <p className="empty-subtitle">
                {complaints.length === 0
                  ? 'No complaints have been submitted across the system yet.'
                  : 'No complaints match your active filter or search criteria.'}
              </p>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>User ID</th>
                    <th>Created Date</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.map((complaint) => {
                    const formattedDate = complaint.createdAt
                      ? new Date(complaint.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'N/A';

                    return (
                      <tr key={complaint.id}>
                        <td style={{ fontWeight: 800, color: 'var(--primary-600)' }}>
                          #{complaint.id}
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {complaint.title}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {complaint.description}
                          </div>
                        </td>
                        <td>
                          <CategoryBadge category={complaint.category} />
                        </td>
                        <td>
                          <StatusBadge status={complaint.status} />
                        </td>
                        <td>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#F1F5F9', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                            <User size={12} />
                            <span>User #{complaint.userId}</span>
                          </div>
                        </td>
                        <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {formattedDate}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                            <Link
                              to={`/admin/complaints/${complaint.id}`}
                              className="btn btn-secondary btn-sm"
                              title="View full complaint details"
                            >
                              <Eye size={14} />
                              <span>View</span>
                            </Link>

                            <button
                              onClick={() => handleOpenStatusModal(complaint)}
                              className="btn btn-sm"
                              style={{
                                background: 'var(--primary-50)',
                                color: 'var(--primary-700)',
                                border: '1px solid var(--primary-200)',
                              }}
                              title="Update complaint status"
                            >
                              <Edit3 size={14} />
                              <span>Status</span>
                            </button>

                            <button
                              onClick={() => handleDeleteClick(complaint.id)}
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
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* Change Status Modal */}
      {statusModalOpen && statusTargetComplaint && (
        <div className="modal-backdrop" onClick={() => setStatusModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Update Status for #{statusTargetComplaint.id}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Select the new lifecycle status for <strong>"{statusTargetComplaint.title}"</strong>:
            </p>

            <div className="form-group" style={{ marginBottom: '1.75rem' }}>
              <label className="form-label">New Status</label>
              <select
                className="form-select"
                value={newStatusValue}
                onChange={(e) => setNewStatusValue(Number(e.target.value))}
              >
                <option value={1}>Open (1)</option>
                <option value={2}>Assigned (2)</option>
                <option value={3}>In Progress (3)</option>
                <option value={4}>Resolved (4)</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setStatusModalOpen(false)}
                disabled={updatingStatus}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSaveStatus}
                disabled={updatingStatus}
              >
                {updatingStatus ? 'Updating...' : 'Save Status'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Complaint (Admin)"
        message="Are you sure you want to delete this complaint? It will be permanently removed from PostgreSQL."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}
