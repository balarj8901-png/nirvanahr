import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, FileUp } from 'lucide-react';
import JobCard from '../components/JobCard';
import { initialJobs } from '../data/jobsData';

export default function Vacancies({ onOpenApply, onOpenSubmitCv }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [category, setCategory] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.jobs?.length > 0) {
          setJobs(data.jobs);
        }
      })
      .catch(() => {});
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    setCategory(selectedCat);
  };

  const filteredJobs = jobs.filter(job => {
    const matchCat = category === 'all' || job.category === category;
    const matchKey = !keyword || 
      job.title?.toLowerCase().includes(keyword.toLowerCase()) ||
      job.tags?.some(t => t.toLowerCase().includes(keyword.toLowerCase())) ||
      job.company?.toLowerCase().includes(keyword.toLowerCase());
    const matchLoc = !location || job.location?.toLowerCase().includes(location.toLowerCase());
    return matchCat && matchKey && matchLoc;
  });

  return (
    <div>
      {/* Banner */}
      <section style={{ padding: '4.5rem 0 3rem 0', background: 'var(--primary-gradient)', color: '#fff' }}>
        <div className="container">
          <div className="section-tag light">Live Job Board</div>
          <h1 style={{ color: '#fff', marginBottom: '0.8rem' }}>Discover Your Next Career Move</h1>
          <p style={{ maxWidth: '650px', color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', marginBottom: '2rem' }}>
            Browse verified positions with leading corporate partners across BFSI, IT, Sales, and Corporate Leadership.
          </p>

          <div className="search-job-card" style={{ marginBottom: 0 }}>
            <form onSubmit={handleFilter}>
              <div className="search-job-grid">
                <div className="search-input-wrap">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Job title, skill, or keyword..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
                <div className="search-input-wrap">
                  <MapPin size={16} />
                  <input
                    type="text"
                    placeholder="City or state..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="search-input-wrap">
                  <Briefcase size={16} />
                  <select
                    value={selectedCat}
                    onChange={(e) => setSelectedCat(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="bfsi">BFSI & Banking</option>
                    <option value="it">IT & Tech</option>
                    <option value="sales">Sales & BD</option>
                    <option value="finance">Finance & Accounts</option>
                    <option value="hr">Human Resources</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-gold">
                  <Search size={16} /> Filter
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Vacancies Grid */}
      <section className="jobs-section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>
              Showing {filteredJobs.length} of {jobs.length} opportunities
            </div>

            <div className="jobs-filter-tabs" style={{ marginBottom: 0 }}>
              {['all', 'bfsi', 'it', 'sales', 'finance', 'hr'].map((cat) => (
                <button
                  key={cat}
                  className={`filter-pill ${category === cat ? 'active' : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat === 'all' ? 'All' : cat === 'it' ? 'IT' : cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {filteredJobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)' }}>
              <Search size={36} style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }} />
              <h4>No Matching Vacancies Found</h4>
              <p style={{ color: 'var(--text-muted)', margin: '0.5rem auto 1.5rem auto', maxWidth: '400px' }}>
                We could not find any openings matching your search criteria. Submit your CV directly to our talent pool!
              </p>
              <button className="btn btn-primary btn-sm" onClick={onOpenSubmitCv}>
                <FileUp size={15} /> Drop Your Resume
              </button>
            </div>
          ) : (
            <div className="jobs-grid">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} onApply={onOpenApply} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Resume Drop Bottom */}
      <section style={{ background: 'var(--bg-subtle)', padding: '4rem 0', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
        <div className="container">
          <h3 style={{ marginBottom: '0.8rem' }}>Don't See the Role You're Looking For?</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '550px', margin: '0 auto 1.8rem auto' }}>
            Our executive recruiters constantly receive confidential mandates that are never published publicly. Submit your resume to be considered for exclusive openings.
          </p>
          <button className="btn btn-gold btn-lg" onClick={onOpenSubmitCv}>
            <FileUp size={18} /> Drop Your Resume Here
          </button>
        </div>
      </section>
    </div>
  );
}
