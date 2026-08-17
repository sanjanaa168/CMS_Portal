import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Search,
  RefreshCw,
  AlertCircle,
  FileQuestion,
  Layers,
  Clock,
  UserCheck,
  PlayCircle,
  CheckCircle2,
} from 'lucide-react';
import { complaintService } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ComplaintCard from '../components/ComplaintCard';
import Loading from '../components/Loading';
import ConfirmModal from '../components/ConfirmModal';

export default function UserDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchComplaints = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await complaintService.getMyComplaints();
      setComplaints(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to load your complaints. Please check if the backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleDeleteClick = (id) => {
    setSelectedComplaintId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedComplaintId) return;

    try {
      await complaintService.deleteComplaint(selectedComplaintId);
      setDeleteModalOpen(false);
      setSelectedComplaintId(null);
      setActionSuccess('Complaint deleted successfully.');
      setTimeout(() => setActionSuccess(''), 4000);
      fetchComplaints();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete complaint.');
      setDeleteModalOpen(false);
    }
  };

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
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ||
      String(c.status).toLowerCase() === statusFilter.toLowerCase();

    const matchesCategory =
      categoryFilter === 'ALL' ||
      String(c.category).toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />

      <div className="main-content-wrapper">
        <Navbar
          title="User Dashboard"
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="main-content">
          {actionSuccess && (
            <div className="alert alert-success">
              <CheckCircle2 size={18} />
              <span>{actionSuccess}</span>
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Statistics Overview */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-info-group">
                <span className="stat-label">Total Complaints</span>
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
            <h2 className="section-title">My Complaints</h2>

            <div className="controls-bar">
              <div className="search-input-wrap">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by title or description..."
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
                title="Refresh complaints"
                style={{ padding: '0.6rem 0.9rem' }}
              >
                <RefreshCw size={16} />
              </button>

              <Link to="/complaints/create" className="btn btn-primary">
                <PlusCircle size={17} />
                <span>New Complaint</span>
              </Link>
            </div>
          </div>

          {/* Main Complaints List / States */}
          {loading ? (
            <Loading message="Fetching your complaints from database..." />
          ) : filteredComplaints.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon-wrap">
                <FileQuestion size={32} />
              </div>
              <h3 className="empty-title">No Complaints Found</h3>
              <p className="empty-subtitle">
                {complaints.length === 0
                  ? "You haven't filed any complaints yet. Need assistance with electricity, water, or WiFi?"
                  : 'No complaints matched your active search or filter criteria.'}
              </p>
              {complaints.length === 0 && (
                <Link to="/complaints/create" className="btn btn-primary">
                  <PlusCircle size={18} />
                  <span>Submit Your First Complaint</span>
                </Link>
              )}
            </div>
          ) : (
            <div className="complaints-grid">
              {filteredComplaints.map((complaint) => (
                <ComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Complaint"
        message="Are you sure you want to delete this complaint? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}
