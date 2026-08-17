import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Send,
  AlertCircle,
  Zap,
  Droplets,
  Wifi,
  Armchair,
  Image as ImageIcon,
} from 'lucide-react';
import { complaintService, CATEGORIES } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function CreateComplaint() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(1);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please provide a complaint title.');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a detailed description of the issue.');
      return;
    }
    if (!category) {
      setError('Please choose an issue category.');
      return;
    }

    setLoading(true);
    try {
      await complaintService.createComplaint({
        title: title.trim(),
        description: description.trim(),
        category,
        imageUrl: imageUrl.trim() || null,
      });

      navigate('/dashboard', { replace: true });
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || 'Failed to submit complaint. Please check your inputs.');
      } else {
        setError('Cannot connect to backend server. Please verify the API is active.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />

      <div className="main-content-wrapper">
        <Navbar
          title="File a Complaint"
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="main-content">
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <Link to="/dashboard" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex' }}>
                <ArrowLeft size={16} />
                <span>Back to Dashboard</span>
              </Link>
            </div>

            <div
              style={{
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                padding: '2.25rem',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                Submit New Complaint
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
                Fill out the details below. Our support team will review and assign your complaint.
              </p>

              {error && (
                <div className="alert alert-error">
                  <AlertCircle size={18} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="title">
                    Complaint Title <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    className="form-input"
                    placeholder="e.g. WiFi connection dropping in Room 304"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={200}
                    required
                    autoFocus
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Max 200 characters
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="category">
                    Category <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <select
                    id="category"
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(Number(e.target.value))}
                    required
                  >
                    <option value={1}>⚡ Electricity (Power outages, wiring, switches)</option>
                    <option value={2}>💧 Water (Plumbing, leaks, tap issues)</option>
                    <option value={3}>📶 WiFi (Slow speeds, connectivity loss)</option>
                    <option value={4}>🪑 Furniture (Broken chairs, desks, beds)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="description">
                    Description <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <textarea
                    id="description"
                    className="form-textarea"
                    placeholder="Provide specific details about where and when the issue occurred..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={2000}
                    required
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Max 2000 characters
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="imageUrl">
                    Image URL (Optional)
                  </label>
                  <input
                    id="imageUrl"
                    type="url"
                    className="form-input"
                    placeholder="e.g. https://images.unsplash.com/photo-..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    maxLength={500}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Paste a direct image link if you want to attach visual evidence.
                  </span>
                </div>

                {imageUrl && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Image Preview:</p>
                    <div style={{ maxHeight: '200px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                      <img
                        src={imageUrl}
                        alt="Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                  <Link to="/dashboard" className="btn btn-secondary">
                    Cancel
                  </Link>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    <Send size={16} />
                    <span>{loading ? 'Submitting...' : 'Submit Complaint'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
