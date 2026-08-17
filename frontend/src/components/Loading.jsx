import React from 'react';

export default function Loading({ message = 'Loading complaints...' }) {
  return (
    <div className="loading-container">
      <div className="spinner" />
      <p style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>
        {message}
      </p>
    </div>
  );
}
