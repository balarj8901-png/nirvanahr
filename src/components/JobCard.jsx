import React from 'react';
import { Building, Clock, ArrowRight } from 'lucide-react';

export default function JobCard({ job, onApply }) {
  return (
    <div className="job-card">
      <div className="job-card-header">
        <span className="job-category-badge">{(job.category || 'general').toUpperCase()}</span>
        <span className="job-type-badge">{job.type || 'Full Time'}</span>
      </div>

      <h3 className="job-card-title">{job.title}</h3>
      <div className="job-card-company">
        <Building size={16} style={{ color: 'var(--accent-gold-dark)' }} />
        <span>{job.company}</span>
      </div>

      <div className="job-meta-grid">
        <div className="job-meta-item">
          <span className="job-meta-label">Experience</span>
          <span className="job-meta-val">{job.experience}</span>
        </div>
        <div className="job-meta-item">
          <span className="job-meta-label">Location</span>
          <span className="job-meta-val">{job.location?.split(',')[0]}</span>
        </div>
        <div className="job-meta-item">
          <span className="job-meta-label">Package</span>
          <span className="job-meta-val" style={{ color: 'var(--primary)' }}>{job.salary}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
        {(job.tags || []).map((t, idx) => (
          <span key={idx} style={{
            fontSize: '0.75rem',
            background: 'var(--bg-subtle)',
            padding: '0.2rem 0.6rem',
            borderRadius: '4px',
            color: 'var(--text-muted)',
            fontWeight: 500
          }}>
            #{t}
          </span>
        ))}
      </div>

      <div className="job-card-footer">
        <span className="job-posted-time">
          <Clock size={13} style={{ display: 'inline', marginRight: '4px' }} />
          {job.posted || 'Recent'}
        </span>
        <button className="btn btn-primary btn-sm" onClick={() => onApply(job)}>
          Apply Now <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
