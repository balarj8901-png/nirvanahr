import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PieChart, Users, Building, Briefcase, Mail, Settings, 
  Download, Trash2, PlusCircle, RefreshCw, Key, ExternalLink, Power, UserCheck, CheckCircle
} from 'lucide-react';

export default function AdminDashboard({ onToast }) {
  const [token, setToken] = useState(localStorage.getItem('nirvana_admin_token') || null);
  const [currentTab, setCurrentTab] = useState('overview');
  
  // Login State
  const [loginForm, setLoginForm] = useState({ username: 'admin', password: 'nirvana@2026' });
  const [loginError, setLoginError] = useState('');

  // Dashboard Data State
  const [stats, setStats] = useState({
    totalApplications: 0,
    totalCandidates: 0,
    totalEmployerLeads: 0,
    activeJobs: 0
  });
  const [applications, setApplications] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [leads, setLeads] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [contacts, setContacts] = useState([]);

  // Filter States
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('all');
  const [candSearch, setCandSearch] = useState('');
  const [leadSearch, setLeadSearch] = useState('');

  // Add Job Form State
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    category: 'bfsi',
    type: 'Full Time',
    experience: '2 - 5 Years',
    salary: '',
    location: '',
    tags: '',
    description: ''
  });

  // Password Change State
  const [passData, setPassData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

  // Fetch all admin data
  const loadDashboardData = async () => {
    try {
      // 1. Stats
      const sRes = await fetch('/api/admin/stats');
      const sData = await sRes.json();
      if (sData.success) setStats(sData.stats);

      // 2. Applications
      const aRes = await fetch('/api/admin/applications');
      const aData = await aRes.json();
      if (aData.success) setApplications(aData.applications || []);

      // 3. Candidates
      const cRes = await fetch('/api/admin/candidates');
      const cData = await cRes.json();
      if (cData.success) setCandidates(cData.candidates || []);

      // 4. Leads
      const lRes = await fetch('/api/admin/employer-leads');
      const lData = await lRes.json();
      if (lData.success) setLeads(lData.leads || []);

      // 5. Jobs
      const jRes = await fetch('/api/jobs');
      const jData = await jRes.json();
      if (jData.success) setJobs(jData.jobs || []);

      // 6. Contacts
      const cntRes = await fetch('/api/admin/contacts');
      const cntData = await cntRes.json();
      if (cntData.success) setContacts(cntData.contacts || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  useEffect(() => {
    if (token) {
      loadDashboardData();
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();

      if (data.success) {
        setToken(data.token);
        localStorage.setItem('nirvana_admin_token', data.token);
        onToast('Welcome to Nirvana HR Admin Portal!', 'success');
      } else {
        setLoginError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setLoginError('Server connection error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('nirvana_admin_token');
    setToken(null);
    onToast('Logged out successfully', 'info');
  };

  const updateItemStatus = async (type, id, status) => {
    try {
      const res = await fetch('/api/admin/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id, status })
      });
      const data = await res.json();
      if (data.success) {
        onToast(`Status updated to "${status}"`, 'success');
        loadDashboardData();
      }
    } catch (e) {
      onToast('Error updating status', 'error');
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob)
      });
      const data = await res.json();
      if (data.success) {
        onToast('New Job Vacancy Published Live!', 'success');
        setNewJob({
          title: '',
          company: '',
          category: 'bfsi',
          type: 'Full Time',
          experience: '2 - 5 Years',
          salary: '',
          location: '',
          tags: '',
          description: ''
        });
        loadDashboardData();
      }
    } catch (e) {
      onToast('Failed to create job vacancy', 'error');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to remove this job from the website?')) return;
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        onToast('Job removed successfully', 'success');
        loadDashboardData();
      }
    } catch (e) {
      onToast('Failed to delete job', 'error');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
      onToast('New passwords do not match!', 'error');
      return;
    }

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPassword: passData.oldPassword,
          newPassword: passData.newPassword
        })
      });
      const data = await res.json();
      if (data.success) {
        onToast('Admin password updated successfully!', 'success');
        setPassData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        onToast(data.error || 'Failed to update password', 'error');
      }
    } catch (e) {
      onToast('Server error changing password', 'error');
    }
  };

  // If not logged in, show Login view
  if (!token) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at top right, rgba(197, 157, 95, 0.15) 0%, transparent 60%), radial-gradient(circle at bottom left, rgba(10, 54, 40, 0.15) 0%, transparent 60%), var(--dark-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}>
        <div style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          maxWidth: '440px',
          width: '100%',
          padding: '3rem 2.5rem',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
          textAlign: 'center'
        }}>
          <img src="/assets/images/logo.jpg" alt="Logo" style={{ width: '70px', height: '70px', margin: '0 auto 1.2rem auto', borderRadius: 'var(--radius-sm)' }} />
          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.3rem' }}>Admin Portal</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>Nirvana HR Solutions Management Suite</p>

          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ textAlign: 'left' }}>
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ textAlign: 'left' }}>
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
              />
            </div>

            {loginError && (
              <div style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {loginError}
              </div>
            )}

            <button type="submit" className="btn btn-gold btn-lg" style={{ width: '100%' }}>
              Login to Dashboard
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Default: <strong>admin</strong> / <strong>nirvana@2026</strong>
          </div>
        </div>
      </div>
    );
  }

  // Filtered Applications
  const filteredApps = applications.filter(a => {
    const matchStatus = appStatusFilter === 'all' || a.status === appStatusFilter;
    const matchQuery = !appSearch || 
      a.fullName?.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.jobTitle?.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.email?.toLowerCase().includes(appSearch.toLowerCase());
    return matchStatus && matchQuery;
  });

  // Filtered Candidates
  const filteredCands = candidates.filter(c => {
    return !candSearch ||
      c.fullName?.toLowerCase().includes(candSearch.toLowerCase()) ||
      c.city?.toLowerCase().includes(candSearch.toLowerCase()) ||
      c.domain?.toLowerCase().includes(candSearch.toLowerCase());
  });

  // Filtered Leads
  const filteredLeads = leads.filter(l => {
    return !leadSearch ||
      l.companyName?.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.contactName?.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.roleDetails?.toLowerCase().includes(leadSearch.toLowerCase());
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '100vh', background: '#f4f7f6' }}>
      
      {/* Sidebar */}
      <aside style={{
        background: 'var(--dark-bg)',
        color: '#fff',
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto'
      }}>
        <Link to="/" target="_blank" className="brand-logo" style={{ marginBottom: '2rem', padding: '0 0.5rem' }}>
          <img src="/assets/images/logo.jpg" alt="Logo" />
          <div className="brand-text">
            <span className="brand-title" style={{ color: '#fff' }}>NIRVANA</span>
            <span className="brand-subtitle" style={{ color: 'var(--accent-gold-light)' }}>ADMIN PANEL</span>
          </div>
        </Link>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flexGrow: 1 }}>
          {[
            { id: 'overview', label: 'Overview', icon: <PieChart size={18} /> },
            { id: 'applications', label: 'Job Applications', icon: <Users size={18} />, badge: applications.length },
            { id: 'candidates', label: 'Candidate Pool', icon: <UserCheck size={18} />, badge: candidates.length },
            { id: 'leads', label: 'Employer Mandates', icon: <Building size={18} />, badge: leads.length },
            { id: 'jobs', label: 'Job Openings', icon: <Briefcase size={18} />, badge: jobs.length },
            { id: 'contacts', label: 'Inquiries', icon: <Mail size={18} />, badge: contacts.length },
            { id: 'settings', label: 'Settings & Security', icon: <Settings size={18} /> }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                padding: '0.8rem 1rem',
                borderRadius: 'var(--radius-sm)',
                color: currentTab === item.id ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                background: currentTab === item.id ? 'var(--primary)' : 'transparent',
                fontWeight: 500,
                fontSize: '0.95rem',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span style={{ color: 'var(--accent-gold-light)' }}>{item.icon}</span>
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span style={{
                  marginLeft: 'auto',
                  background: 'var(--accent-gold)',
                  color: '#1a150c',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.55rem',
                  borderRadius: 'var(--radius-full)'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Link to="/" target="_blank" className="btn btn-outline-white btn-sm" style={{ width: '100%', marginBottom: '0.8rem' }}>
            <ExternalLink size={14} /> Public Website
          </Link>
          <button className="btn btn-gold btn-sm" style={{ width: '100%' }} onClick={handleLogout}>
            <Power size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ padding: '2rem 2.5rem', overflowY: 'auto' }}>
        
        {/* Header Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          paddingBottom: '1.2rem',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div>
            <h2 style={{ fontSize: '1.8rem' }}>
              {currentTab === 'overview' && 'Dashboard Overview'}
              {currentTab === 'applications' && 'Job Applications Manager'}
              {currentTab === 'candidates' && 'Candidate Resume Talent Pool'}
              {currentTab === 'leads' && 'Employer Hiring Mandates'}
              {currentTab === 'jobs' && 'Job Vacancies Manager'}
              {currentTab === 'contacts' && 'Customer Inquiries & Messages'}
              {currentTab === 'settings' && 'Admin Settings & Security'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Real-time applicant flow & employer leads</p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button className="btn btn-outline-gold btn-sm" onClick={loadDashboardData}>
              <RefreshCw size={14} /> Refresh Data
            </button>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: '#fff',
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Administrator</span>
            </div>
          </div>
        </div>

        {/* Tab 1: Overview */}
        {currentTab === 'overview' && (
          <div>
            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div style={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>{stats.totalApplications}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Job Applications</p>
                </div>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={24} />
                </div>
              </div>

              <div style={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>{stats.totalCandidates}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Talent Pool CVs</p>
                </div>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserCheck size={24} />
                </div>
              </div>

              <div style={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>{stats.totalEmployerLeads}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Employer Mandates</p>
                </div>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building size={24} />
                </div>
              </div>

              <div style={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>{jobs.length}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Live Job Openings</p>
                </div>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Briefcase size={24} />
                </div>
              </div>
            </div>

            {/* Recent Applications */}
            <div style={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '2rem', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Recent Job Applications</h3>
                <button className="btn btn-primary btn-sm" onClick={() => setCurrentTab('applications')}>
                  View All &rarr;
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-subtle)', textAlign: 'left' }}>
                      <th style={{ padding: '0.9rem 1rem' }}>Candidate</th>
                      <th style={{ padding: '0.9rem 1rem' }}>Target Position</th>
                      <th style={{ padding: '0.9rem 1rem' }}>Phone</th>
                      <th style={{ padding: '0.9rem 1rem' }}>CTC / Notice</th>
                      <th style={{ padding: '0.9rem 1rem' }}>Status</th>
                      <th style={{ padding: '0.9rem 1rem' }}>Resume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.slice(0, 5).map(a => (
                      <tr key={a.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '1rem' }}><strong>{a.fullName}</strong></td>
                        <td style={{ padding: '1rem' }}>{a.jobTitle}</td>
                        <td style={{ padding: '1rem' }}><a href={`tel:${a.phone}`}>{a.phone}</a></td>
                        <td style={{ padding: '1rem' }}>{a.currentCTC} / {a.noticePeriod}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            background: a.status === 'Shortlisted' ? '#dcfce7' : '#dbeafe',
                            color: a.status === 'Shortlisted' ? '#166534' : '#1e40af'
                          }}>
                            {a.status}
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <a href={`/uploads/resumes/${a.resumeFilename}`} download className="btn btn-outline-gold btn-sm">
                            <Download size={13} /> CV
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Applications */}
        {currentTab === 'applications' && (
          <div style={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h3>All Job Applications ({filteredApps.length})</h3>
              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <input
                  type="text"
                  placeholder="Search candidate, role, email..."
                  className="form-control"
                  style={{ width: '250px' }}
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                />
                <select
                  className="form-control"
                  style={{ width: '150px' }}
                  value={appStatusFilter}
                  onChange={(e) => setAppStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="New">New</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview">Interview</option>
                  <option value="Hired">Hired</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-subtle)', textAlign: 'left' }}>
                    <th style={{ padding: '0.9rem 1rem' }}>Candidate</th>
                    <th style={{ padding: '0.9rem 1rem' }}>Role</th>
                    <th style={{ padding: '0.9rem 1rem' }}>Contact Info</th>
                    <th style={{ padding: '0.9rem 1rem' }}>Current CTC</th>
                    <th style={{ padding: '0.9rem 1rem' }}>Notice</th>
                    <th style={{ padding: '0.9rem 1rem' }}>Resume</th>
                    <th style={{ padding: '0.9rem 1rem' }}>Change Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApps.map(a => (
                    <tr key={a.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem' }}>
                        <strong>{a.fullName}</strong>
                        {a.linkedin && (
                          <div>
                            <a href={a.linkedin} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#0284c7' }}>
                              LinkedIn Profile &rarr;
                            </a>
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '1rem' }}><span style={{ fontWeight: 600, color: 'var(--primary)' }}>{a.jobTitle}</span></td>
                      <td style={{ padding: '1rem' }}>{a.email}<br /><a href={`tel:${a.phone}`}>{a.phone}</a></td>
                      <td style={{ padding: '1rem' }}>{a.currentCTC}</td>
                      <td style={{ padding: '1rem' }}>{a.noticePeriod}</td>
                      <td style={{ padding: '1rem' }}>
                        <a href={`/uploads/resumes/${a.resumeFilename}`} download className="btn btn-outline-gold btn-sm">
                          <Download size={14} /> Download
                        </a>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <select
                          className="form-control"
                          style={{ fontSize: '0.8rem', padding: '0.3rem 0.5rem' }}
                          value={a.status}
                          onChange={(e) => updateItemStatus('application', a.id, e.target.value)}
                        >
                          <option value="New">New</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interview">Interview</option>
                          <option value="Hired">Hired</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Candidates Pool */}
        {currentTab === 'candidates' && (
          <div style={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3>Candidate Talent Pool ({filteredCands.length})</h3>
              <input
                type="text"
                placeholder="Search candidate by name, city, domain..."
                className="form-control"
                style={{ width: '280px' }}
                value={candSearch}
                onChange={(e) => setCandSearch(e.target.value)}
              />
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-subtle)', textAlign: 'left' }}>
                    <th style={{ padding: '0.9rem 1rem' }}>Full Name</th>
                    <th style={{ padding: '0.9rem 1rem' }}>Domain</th>
                    <th style={{ padding: '0.9rem 1rem' }}>Experience</th>
                    <th style={{ padding: '0.9rem 1rem' }}>City</th>
                    <th style={{ padding: '0.9rem 1rem' }}>Current & Expected CTC</th>
                    <th style={{ padding: '0.9rem 1rem' }}>Contact</th>
                    <th style={{ padding: '0.9rem 1rem' }}>Resume</th>
                    <th style={{ padding: '0.9rem 1rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCands.map(c => (
                    <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem' }}><strong>{c.fullName}</strong></td>
                      <td style={{ padding: '1rem' }}><span className="job-category-badge">{c.domain?.toUpperCase()}</span></td>
                      <td style={{ padding: '1rem' }}>{c.experience} Yrs</td>
                      <td style={{ padding: '1rem' }}>{c.city}</td>
                      <td style={{ padding: '1rem' }}>{c.currentCTC || 'N/A'} &rarr; <strong style={{ color: 'var(--primary)' }}>{c.expectedCTC || 'N/A'}</strong></td>
                      <td style={{ padding: '1rem' }}>{c.email}<br /><a href={`tel:${c.phone}`}>{c.phone}</a></td>
                      <td style={{ padding: '1rem' }}>
                        <a href={`/uploads/resumes/${c.resumeFilename}`} download className="btn btn-outline-gold btn-sm">
                          <Download size={14} /> CV
                        </a>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <select
                          className="form-control"
                          style={{ fontSize: '0.8rem', padding: '0.3rem 0.5rem' }}
                          value={c.status || 'New'}
                          onChange={(e) => updateItemStatus('candidate', c.id, e.target.value)}
                        >
                          <option value="New">New</option>
                          <option value="Screened">Screened</option>
                          <option value="Matched">Matched</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Employer Leads */}
        {currentTab === 'leads' && (
          <div style={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3>Employer Hiring Mandates ({filteredLeads.length})</h3>
              <input
                type="text"
                placeholder="Search by company or contact..."
                className="form-control"
                style={{ width: '280px' }}
                value={leadSearch}
                onChange={(e) => setLeadSearch(e.target.value)}
              />
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-subtle)', textAlign: 'left' }}>
                    <th style={{ padding: '0.9rem 1rem' }}>Company</th>
                    <th style={{ padding: '0.9rem 1rem' }}>Contact Person</th>
                    <th style={{ padding: '0.9rem 1rem' }}>Service Type</th>
                    <th style={{ padding: '0.9rem 1rem' }}>Open Count</th>
                    <th style={{ padding: '0.9rem 1rem' }}>Role Scope</th>
                    <th style={{ padding: '0.9rem 1rem' }}>Connect</th>
                    <th style={{ padding: '0.9rem 1rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map(l => (
                    <tr key={l.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem' }}><strong>{l.companyName}</strong></td>
                      <td style={{ padding: '1rem' }}>{l.contactName}<br /><small style={{ color: 'var(--text-muted)' }}>{l.designation}</small></td>
                      <td style={{ padding: '1rem' }}><span className="job-type-badge">{l.serviceType}</span></td>
                      <td style={{ padding: '1rem' }}><strong>{l.openCount}</strong></td>
                      <td style={{ padding: '1rem', maxWidth: '250px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{l.roleDetails}</td>
                      <td style={{ padding: '1rem' }}>
                        <a
                          href={`https://wa.me/${l.phone?.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm"
                          style={{ background: '#25d366', color: '#fff' }}
                        >
                          <i className="fab fa-whatsapp"></i> Chat
                        </a>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <select
                          className="form-control"
                          style={{ fontSize: '0.8rem', padding: '0.3rem 0.5rem' }}
                          value={l.status || 'New'}
                          onChange={(e) => updateItemStatus('employer', l.id, e.target.value)}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Job Openings CRUD */}
        {currentTab === 'jobs' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '2rem' }}>
            {/* Create Form */}
            <div style={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.2rem' }}>Post New Job Opening</h3>
              <form onSubmit={handleCreateJob}>
                <div className="form-group">
                  <label className="form-label">Job Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Senior Wealth Manager"
                    required
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Client / Company Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Private Banking Enterprise"
                    required
                    value={newJob.company}
                    onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select
                      className="form-control"
                      required
                      value={newJob.category}
                      onChange={(e) => setNewJob({ ...newJob, category: e.target.value })}
                    >
                      <option value="bfsi">BFSI & Banking</option>
                      <option value="it">IT & Software</option>
                      <option value="sales">Sales & BD</option>
                      <option value="finance">Finance & Accounts</option>
                      <option value="hr">Human Resources</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Job Type *</label>
                    <select
                      className="form-control"
                      required
                      value={newJob.type}
                      onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                    >
                      <option value="Full Time">Full Time</option>
                      <option value="Hybrid / Full Time">Hybrid / Full Time</option>
                      <option value="Remote">Remote</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Experience Range *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 2 - 5 Years"
                      required
                      value={newJob.experience}
                      onChange={(e) => setNewJob({ ...newJob, experience: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Salary Package *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. ₹6 - 10 LPA"
                      required
                      value={newJob.salary}
                      onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Ahmedabad, Gujarat"
                    required
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tags (comma separated)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Banking, HNI, Wealth Management"
                    value={newJob.tags}
                    onChange={(e) => setNewJob({ ...newJob, tags: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description & Responsibilities</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Brief job scope..."
                    value={newJob.description}
                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                  <PlusCircle size={18} /> Publish Vacancy Live
                </button>
              </form>
            </div>

            {/* List */}
            <div style={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.2rem' }}>Live Job Vacancies ({jobs.length})</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-subtle)', textAlign: 'left' }}>
                      <th style={{ padding: '0.9rem 1rem' }}>Role Title</th>
                      <th style={{ padding: '0.9rem 1rem' }}>Category</th>
                      <th style={{ padding: '0.9rem 1rem' }}>Package</th>
                      <th style={{ padding: '0.9rem 1rem' }}>Location</th>
                      <th style={{ padding: '0.9rem 1rem' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map(j => (
                      <tr key={j.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '1rem' }}><strong>{j.title}</strong><br /><small style={{ color: 'var(--text-muted)' }}>{j.company}</small></td>
                        <td style={{ padding: '1rem' }}><span className="job-category-badge">{j.category?.toUpperCase()}</span></td>
                        <td style={{ padding: '1rem' }}>{j.salary}</td>
                        <td style={{ padding: '1rem' }}>{j.location}</td>
                        <td style={{ padding: '1rem' }}>
                          <button
                            className="btn btn-sm"
                            style={{ background: '#fee2e2', color: '#b91c1c', border: 'none', cursor: 'pointer' }}
                            onClick={() => handleDeleteJob(j.id)}
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Contacts */}
        {currentTab === 'contacts' && (
          <div style={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.2rem' }}>General Inquiries ({contacts.length})</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-subtle)', textAlign: 'left' }}>
                    <th style={{ padding: '0.9rem 1rem' }}>Sender</th>
                    <th style={{ padding: '0.9rem 1rem' }}>Contact</th>
                    <th style={{ padding: '0.9rem 1rem' }}>Subject</th>
                    <th style={{ padding: '0.9rem 1rem' }}>Message</th>
                    <th style={{ padding: '0.9rem 1rem' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map(c => (
                    <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem' }}><strong>{c.name}</strong></td>
                      <td style={{ padding: '1rem' }}>{c.email}<br /><a href={`tel:${c.phone}`}>{c.phone}</a></td>
                      <td style={{ padding: '1rem' }}><span className="filter-pill" style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}>{c.subject}</span></td>
                      <td style={{ padding: '1rem', maxWidth: '300px', fontSize: '0.85rem' }}>{c.message}</td>
                      <td style={{ padding: '1rem' }}>{new Date(c.submittedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 7: Settings */}
        {currentTab === 'settings' && (
          <div style={{ maxWidth: '500px', background: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.2rem' }}>Change Admin Password</h3>
            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label className="form-label">Current Password *</label>
                <input
                  type="password"
                  className="form-control"
                  required
                  value={passData.oldPassword}
                  onChange={(e) => setPassData({ ...passData, oldPassword: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">New Password (Min 6 characters) *</label>
                <input
                  type="password"
                  className="form-control"
                  required
                  value={passData.newPassword}
                  onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password *</label>
                <input
                  type="password"
                  className="form-control"
                  required
                  value={passData.confirmPassword}
                  onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-gold btn-lg" style={{ width: '100%' }}>
                <Key size={16} /> Update Password
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}
