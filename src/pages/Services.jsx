import React from 'react';
import { CheckCircle, Bolt, Shield, Filter } from 'lucide-react';

export default function Services({ onOpenHireTalent }) {
  return (
    <div>
      {/* Page Banner */}
      <section style={{ padding: '5rem 0 3.5rem 0', background: 'var(--primary-gradient)', color: '#fff', textAlign: 'center' }}>
        <div className="container">
          <div className="section-tag light">Strategic Capabilities</div>
          <h1 style={{ color: '#fff', marginBottom: '1rem' }}>End-to-End Workforce Solutions</h1>
          <p style={{ maxWidth: '650px', margin: '0 auto', color: 'rgba(255,255,255,0.85)', fontSize: '1.15rem' }}>
            From leadership headhunting to complete payroll outsourcing, we deliver customized HR capabilities engineered for scale.
          </p>
        </div>
      </section>

      {/* Services Breakdown */}
      <section style={{ padding: '5rem 0', background: '#fff' }}>
        <div className="container">

          {/* Service 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center', marginBottom: '5rem', paddingBottom: '4rem', borderBottom: '1px solid var(--border-color)' }}>
            <div>
              <div className="section-tag">01. Leadership Hiring</div>
              <h2>Executive Search & CXO Advisory</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Securing transformative leaders requires deep market intelligence, utmost discretion, and rigorous assessment. Our Executive Search practice specializes in placing CEOs, CTOs, CFOs, VPs, and Board Members.
              </p>
              <ul className="service-features-list" style={{ marginBottom: '2rem' }}>
                <li><CheckCircle size={14} /> Confidential target company mapping</li>
                <li><CheckCircle size={14} /> Competency & leadership style evaluation</li>
                <li><CheckCircle size={14} /> Comprehensive 360-degree reference checking</li>
              </ul>
              <button className="btn btn-primary" onClick={onOpenHireTalent}>Initiate Executive Search</button>
            </div>
            <div style={{ background: 'var(--bg-subtle)', padding: '2.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Key Roles Covered:</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="filter-pill">Chief Executive Officer (CEO)</span>
                <span className="filter-pill">Chief Financial Officer (CFO)</span>
                <span className="filter-pill">Chief Technology Officer (CTO)</span>
                <span className="filter-pill">VP - Human Resources</span>
                <span className="filter-pill">National Sales Head</span>
                <span className="filter-pill">Director of Engineering</span>
              </div>
            </div>
          </div>

          {/* Service 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center', marginBottom: '5rem', paddingBottom: '4rem', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ background: 'var(--primary-gradient)', color: '#fff', padding: '2.5rem', borderRadius: 'var(--radius-xl)' }}>
              <h4 style={{ color: 'var(--accent-gold-light)', marginBottom: '1rem' }}>The Nirvana Advantage:</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Bolt size={18} style={{ color: 'var(--accent-gold-light)' }} /> <strong>48-Hour Shortlist:</strong> Qualified profiles delivered rapidly.</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Shield size={18} style={{ color: 'var(--accent-gold-light)' }} /> <strong>90-Day Guarantee:</strong> Risk-free candidate replacement.</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Filter size={18} style={{ color: 'var(--accent-gold-light)' }} /> <strong>Rigorous Vetting:</strong> Skill, salary, and notice verification.</li>
              </ul>
            </div>
            <div>
              <div className="section-tag">02. Permanent Staffing</div>
              <h2>Mid-to-Senior Lateral Recruitment</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                We solve the talent crunch by connecting you with top-tier technical and managerial professionals. From single niche positions to rapid bulk expansions, our recruiters understand your exact technical requirements.
              </p>
              <button className="btn btn-gold" onClick={onOpenHireTalent}>Hire Lateral Talent</button>
            </div>
          </div>

          {/* Service 3 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div>
              <div className="section-tag">03. Compliance & Payroll</div>
              <h2>Contract Staffing & Third-Party Payroll</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Offload employment liabilities and statutory compliance while maintaining full operational agility. We manage salary disbursements, PF, ESIC, professional taxes, and labor law compliance with 100% audit readiness.
              </p>
              <ul className="service-features-list" style={{ marginBottom: '2rem' }}>
                <li><CheckCircle size={14} /> On-time error-free monthly salary credit</li>
                <li><CheckCircle size={14} /> Dedicated employee grievance desk</li>
                <li><CheckCircle size={14} /> Zero liability on company books</li>
              </ul>
              <button className="btn btn-primary" onClick={onOpenHireTalent}>Request Payroll Proposal</button>
            </div>
            <div style={{ background: 'var(--bg-subtle)', padding: '2.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Statutory Filings Covered:</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                <li><CheckCircle size={14} style={{ color: 'var(--accent-gold-dark)', display: 'inline', marginRight: '6px' }} /> EPF & MP Act 1952</li>
                <li><CheckCircle size={14} style={{ color: 'var(--accent-gold-dark)', display: 'inline', marginRight: '6px' }} /> ESIC Registration & Compliance</li>
                <li><CheckCircle size={14} style={{ color: 'var(--accent-gold-dark)', display: 'inline', marginRight: '6px' }} /> Professional Tax (PT) Deductions</li>
                <li><CheckCircle size={14} style={{ color: 'var(--accent-gold-dark)', display: 'inline', marginRight: '6px' }} /> Gratuity & Bonus Calculation</li>
                <li><CheckCircle size={14} style={{ color: 'var(--accent-gold-dark)', display: 'inline', marginRight: '6px' }} /> Form 16 & TDS Documentation</li>
              </ul>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
