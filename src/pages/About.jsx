import React from 'react';
import { Target, UserCheck, HeartHandshake, Award } from 'lucide-react';

export default function About({ onOpenSubmitCv, onOpenHireTalent }) {
  return (
    <div>
      {/* Page Banner */}
      <section style={{ padding: '5rem 0 3.5rem 0', background: 'var(--primary-gradient)', color: '#fff', textAlign: 'center' }}>
        <div className="container">
          <div className="section-tag light">Who We Are</div>
          <h1 style={{ color: '#fff', marginBottom: '1rem' }}>Empowering Growth Through Exceptional Talent</h1>
          <p style={{ maxWidth: '650px', margin: '0 auto', color: 'rgba(255,255,255,0.85)', fontSize: '1.15rem' }}>
            At Nirvana HR Solutions, our mission is simple: bridging the gap between extraordinary professionals and forward-thinking enterprises.
          </p>
        </div>
      </section>

      {/* Story & Vision */}
      <section style={{ padding: '5rem 0', background: '#fff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div className="section-tag">Our Legacy</div>
              <h2>Building Futures, One Placement at a Time</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                Founded with a vision to redefine talent acquisition in India, <strong>Nirvana HR Solutions</strong> has grown into a multi-sector human capital advisory powerhouse.
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '2rem', lineHeight: 1.7 }}>
                We believe organizations do not just hire resumes; they invest in human potential. Our proprietary multi-tier vetting process ensures that every candidate placed brings both technical excellence and cultural harmony.
              </p>

              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-gold-dark)' }}>15,000+</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Lives Impacted</div>
                </div>
                <div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>450+</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Partner Companies</div>
                </div>
                <div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-gold-dark)' }}>98.4%</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Retention Rate</div>
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius-xl)', padding: '3rem', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Our Guiding Principles</h3>

              <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Target size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>Precision & Quality First</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>We never send bulk, unqualified resumes. Every profile sent to our clients is thoroughly interviewed and vetted.</p>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <UserCheck size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>Absolute Confidentiality</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>We treat client strategic mandates and candidate career journeys with the highest degree of ethical discretion.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <HeartHandshake size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>Candidate-Centric Care</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>100% free guidance, mock interview coaching, and transparent salary negotiation for all job seekers.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--dark-bg)', color: '#fff', padding: '4.5rem 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Ready to Partner with Nirvana HR Solutions?</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto 2rem auto', fontSize: '1.05rem' }}>
            Whether you are expanding your corporate workforce or seeking your next leadership role, our specialist advisors are ready.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
            <button className="btn btn-gold btn-lg" onClick={onOpenHireTalent}>Hire Top Talent</button>
            <button className="btn btn-outline-white btn-lg" onClick={onOpenSubmitCv}>Drop Your Resume</button>
          </div>
        </div>
      </section>
    </div>
  );
}
