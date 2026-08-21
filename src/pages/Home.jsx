import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, CheckCircle, Sparkles, Gem, Bolt, Users, TrendingUp, Award, ArrowRight, FileUp } from 'lucide-react';
import JobCard from '../components/JobCard';
import HRCalculator from '../components/HRCalculator';
import { initialJobs } from '../data/jobsData';

export default function Home({ onOpenApply, onOpenSubmitCv, onOpenHireTalent, onToast }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [category, setCategory] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeFaq, setActiveFaq] = useState(0);

  // Fetch from live backend API
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCategory(selectedCategory);
    const element = document.getElementById('vacancies-hub');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
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

  const faqs = [
    {
      q: "How quickly can Nirvana HR Solutions source candidates?",
      a: "For standard roles across BFSI, IT, Sales, and Operations, we typically present a vetted shortlist within 48 to 72 hours of receiving the calibrated requirement."
    },
    {
      q: "What is your replacement warranty for permanent hires?",
      a: "We provide an industry-leading 90-day replacement warranty. In the rare event a placed candidate leaves within 90 days, we source a replacement at zero additional placement fee."
    },
    {
      q: "Do you charge job seekers or candidates any registration fee?",
      a: "No, absolutely not. Nirvana HR Solutions never charges any fees, deposits, or application charges from candidates. Our recruitment services are 100% free for job seekers."
    },
    {
      q: "Can you manage full payroll compliance for temporary workers?",
      a: "Yes. Our staffing solutions include complete third-party payroll management, ESIC/PF registrations, professional tax deductions, bonus management, and monthly statutory labor filings."
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="section-tag">
                <Sparkles size={14} /> Strategic Human Capital Advisors
              </div>
              <h1>
                Connecting <span className="highlight-emerald">Talent</span>.<br />
                Building <span className="highlight-gold">Futures</span>.
              </h1>
              <p className="hero-subtitle">
                We partner with visionary enterprises and ambitious professionals to build world-class teams across BFSI, Technology, Healthcare, and Corporate Leadership.
              </p>

              {/* Search Bar */}
              <div className="search-job-card">
                <form onSubmit={handleSearchSubmit}>
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
                        placeholder="City or location..."
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                    <div className="search-input-wrap">
                      <Briefcase size={16} />
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        <option value="all">All Domains</option>
                        <option value="bfsi">BFSI & Banking</option>
                        <option value="it">IT & Software</option>
                        <option value="sales">Sales & BD</option>
                        <option value="finance">Finance & Accounts</option>
                        <option value="hr">HR & Operations</option>
                      </select>
                    </div>
                    <button type="submit" className="btn btn-gold">
                      <ArrowRight size={16} /> Search
                    </button>
                  </div>
                </form>
              </div>

              {/* Trust Badges */}
              <div className="hero-trust-bar">
                <div className="trust-item">
                  <CheckCircle size={16} /> 48-Hour Talent Shortlist
                </div>
                <div className="trust-item">
                  <CheckCircle size={16} /> 90-Day Free Replacement
                </div>
                <div className="trust-item">
                  <CheckCircle size={16} /> Strict NDA & Compliance
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="hero-visual">
              <div className="hero-main-card">
                <div className="hero-card-header">
                  <span className="hero-card-badge">ENTERPRISE TALENT SUITE</span>
                  <Gem size={20} style={{ color: 'var(--accent-gold-light)' }} />
                </div>
                <div className="hero-feature-list">
                  <div className="hero-feature-item">
                    <div className="hero-feature-icon"><Bolt size={18} /></div>
                    <div>
                      <h5>Rapid Executive Search</h5>
                      <p>C-Suite and specialized leadership recruitment tailored to your corporate DNA.</p>
                    </div>
                  </div>
                  <div className="hero-feature-item">
                    <div className="hero-feature-icon"><Users size={18} /></div>
                    <div>
                      <h5>Flexible Staffing & Payroll</h5>
                      <p>Zero-friction on-demand workforce with end-to-end statutory compliance.</p>
                    </div>
                  </div>
                  <div className="hero-feature-item">
                    <div className="hero-feature-icon"><TrendingUp size={18} /></div>
                    <div>
                      <h5>HR Consulting & Analytics</h5>
                      <p>Data-driven org restructuring, compensation benchmarking, and talent retention.</p>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn btn-gold btn-sm" onClick={onOpenHireTalent}>
                    Request Consultation
                  </button>
                  <Link to="/about" className="btn btn-outline-white btn-sm">
                    Explore Story
                  </Link>
                </div>
              </div>

              <div className="hero-floating-stat">
                <div className="stat-icon-gold"><Award size={20} /></div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>98.4%</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Client Retention Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">15,000+</div>
              <div className="stat-label">Successful Placements</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">450+</div>
              <div className="stat-label">Corporate Enterprise Clients</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">50+</div>
              <div className="stat-label">Cities Covered Pan-India</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">98.4%</div>
              <div className="stat-label">Placement Retention Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <div className="section-title-wrap">
            <div className="section-tag">Strategic Capabilities</div>
            <h2>Comprehensive HR & Talent Solutions</h2>
            <p>From high-velocity specialized hiring to complex organizational transformation, we architect talent ecosystems that fuel sustainable growth.</p>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon-box"><i className="fas fa-chess-king"></i></div>
              <h3>Executive Search & CXO</h3>
              <p>Discreet, bespoke headhunting for board-level, C-suite, and senior executive leaders who drive strategic impact.</p>
              <ul className="service-features-list">
                <li><CheckCircle size={14} /> Confidential leadership mapping</li>
                <li><CheckCircle size={14} /> Cultural alignment vetting</li>
                <li><CheckCircle size={14} /> High-touch onboarding support</li>
              </ul>
              <Link to="/services" className="service-link">Learn More <ArrowRight size={14} /></Link>
            </div>

            <div className="service-card">
              <div className="service-icon-box"><i className="fas fa-user-check"></i></div>
              <h3>Permanent Recruitment</h3>
              <p>End-to-end talent sourcing across BFSI, IT, Sales, and Corporate functions with precision skill matching.</p>
              <ul className="service-features-list">
                <li><CheckCircle size={14} /> Multi-stage technical screening</li>
                <li><CheckCircle size={14} /> 48-hour shortlist turnaround</li>
                <li><CheckCircle size={14} /> 90-day replacement warranty</li>
              </ul>
              <Link to="/services" className="service-link">Learn More <ArrowRight size={14} /></Link>
            </div>

            <div className="service-card">
              <div className="service-icon-box"><i className="fas fa-briefcase"></i></div>
              <h3>Contract & Flexi-Staffing</h3>
              <p>Agile workforce solutions for project-based expansions, seasonal surges, and specialized tech consulting.</p>
              <ul className="service-features-list">
                <li><CheckCircle size={14} /> On-demand resource deployment</li>
                <li><CheckCircle size={14} /> Risk-free employment model</li>
                <li><CheckCircle size={14} /> Seamless transition options</li>
              </ul>
              <Link to="/services" className="service-link">Learn More <ArrowRight size={14} /></Link>
            </div>

            <div className="service-card">
              <div className="service-icon-box"><i className="fas fa-file-invoice-dollar"></i></div>
              <h3>Payroll & Compliance</h3>
              <p>Accurate, automated monthly payroll management, PF/ESIC, professional tax, and statutory labor filings.</p>
              <ul className="service-features-list">
                <li><CheckCircle size={14} /> 100% statutory legal compliance</li>
                <li><CheckCircle size={14} /> Automated pay slips & tax forms</li>
                <li><CheckCircle size={14} /> Error-free disbursement</li>
              </ul>
              <Link to="/services" className="service-link">Learn More <ArrowRight size={14} /></Link>
            </div>

            <div className="service-card">
              <div className="service-icon-box"><i className="fas fa-globe"></i></div>
              <h3>Offshore & GCC Staffing</h3>
              <p>Establishing and scaling Global Capability Centers (GCCs) in India with elite English-speaking professionals.</p>
              <ul className="service-features-list">
                <li><CheckCircle size={14} /> Turnkey team building</li>
                <li><CheckCircle size={14} /> Dedicated offshore talent</li>
                <li><CheckCircle size={14} /> 60%+ operational cost efficiency</li>
              </ul>
              <Link to="/services" className="service-link">Learn More <ArrowRight size={14} /></Link>
            </div>

            <div className="service-card">
              <div className="service-icon-box"><i className="fas fa-handshake"></i></div>
              <h3>HR Advisory & RPO</h3>
              <p>Recruitment Process Outsourcing (RPO) and strategic HR consulting to optimize talent pipelines and reduce hiring costs.</p>
              <ul className="service-features-list">
                <li><CheckCircle size={14} /> Embedded talent acquisition teams</li>
                <li><CheckCircle size={14} /> ATS & HRMS integration</li>
                <li><CheckCircle size={14} /> Employer branding strategies</li>
              </ul>
              <Link to="/services" className="service-link">Learn More <ArrowRight size={14} /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Vacancies Hub */}
      <section className="jobs-section" id="vacancies-hub">
        <div className="container">
          <div className="section-title-wrap">
            <div className="section-tag">Featured Openings</div>
            <h2>Explore Career Opportunities</h2>
            <p>Showing {filteredJobs.length} of {jobs.length} available opportunities</p>
          </div>

          <div className="jobs-filter-tabs">
            {['all', 'bfsi', 'it', 'sales', 'finance', 'hr'].map((cat) => (
              <button
                key={cat}
                className={`filter-pill ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat === 'all' ? 'All Jobs' : cat === 'it' ? 'IT & Tech' : cat.toUpperCase()}
              </button>
            ))}
          </div>

          {filteredJobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)' }}>
              <Search size={36} style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }} />
              <h4>No Matching Vacancies Found</h4>
              <p style={{ color: 'var(--text-muted)', margin: '0.5rem auto 1.5rem auto', maxWidth: '400px' }}>
                We could not find any openings matching your search criteria. Submit your CV to our talent pool!
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

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link to="/vacancies" className="btn btn-outline-gold btn-lg">
              View All 150+ Vacancies <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* HR Calculator */}
      <HRCalculator />

      {/* Industries */}
      <section className="industries-section">
        <div className="container">
          <div className="section-title-wrap">
            <div className="section-tag">Industry Expertise</div>
            <h2>Sectors We Specialize In</h2>
            <p>Deep domain recruiters specialized in the unique talent dynamics of India's leading industries.</p>
          </div>

          <div className="industries-grid">
            <div className="industry-card">
              <div className="industry-icon"><i className="fas fa-landmark"></i></div>
              <h5>BFSI & Fintech</h5>
            </div>
            <div className="industry-card">
              <div className="industry-icon"><i className="fas fa-laptop-code"></i></div>
              <h5>IT & SaaS</h5>
            </div>
            <div className="industry-card">
              <div className="industry-icon"><i className="fas fa-heartbeat"></i></div>
              <h5>Healthcare & Pharma</h5>
            </div>
            <div className="industry-card">
              <div className="industry-icon"><i className="fas fa-industry"></i></div>
              <h5>Manufacturing</h5>
            </div>
            <div className="industry-card">
              <div className="industry-icon"><i className="fas fa-shopping-bag"></i></div>
              <h5>FMCG & Retail</h5>
            </div>
            <div className="industry-card">
              <div className="industry-icon"><i className="fas fa-shipping-fast"></i></div>
              <h5>Logistics & Supply</h5>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-title-wrap">
            <div className="section-tag">Client Feedback</div>
            <h2>Trusted by Leaders & High Performers</h2>
            <p>See why top corporations and professionals rely on Nirvana HR Solutions.</p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">
                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
              </div>
              <p className="testimonial-quote">
                "Nirvana HR Solutions filled our senior banking leadership positions within 10 days. Their candidate screening and understanding of BFSI compliance is unparalleled."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">VK</div>
                <div className="author-info">
                  <h5>Vikram Kulkarni</h5>
                  <p>Head of HR, Private Financial Institution</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">
                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
              </div>
              <p className="testimonial-quote">
                "We transitioned our entire sales staffing to Nirvana HR Solutions. Their payroll accuracy, quick onboarding, and prompt communication have taken immense load off our internal teams."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">PS</div>
                <div className="author-info">
                  <h5>Pooja Sharma</h5>
                  <p>VP - People Operations, Tech Retail Enterprise</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">
                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
              </div>
              <p className="testimonial-quote">
                "I landed my dream role as an Engineering Manager through Nirvana HR. The recruiter guided me at every interview step and negotiated a fantastic package."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">AP</div>
                <div className="author-info">
                  <h5>Ankit Patel</h5>
                  <p>Engineering Manager, Placed Candidate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Candidate CTA Banner */}
      <section className="candidate-cta-section">
        <div className="container">
          <div className="candidate-cta-box">
            <div className="candidate-cta-text">
              <h2>Ready to Take the Next Leap in Your Career?</h2>
              <p>Join our confidential talent network. Get discovered by India's top employers without your current company knowing.</p>
            </div>
            <div className="candidate-cta-actions">
              <button className="btn btn-gold btn-lg" onClick={onOpenSubmitCv}>
                <FileUp size={18} /> Drop Your Resume
              </button>
              <Link to="/vacancies" className="btn btn-outline-white btn-lg">
                View All Jobs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <div className="section-title-wrap">
            <div className="section-tag">Got Questions?</div>
            <h2>Frequently Asked Questions</h2>
            <p>Find answers to common questions about our recruitment and staffing services.</p>
          </div>

          <div className="faq-wrap">
            {faqs.map((faq, idx) => (
              <div key={idx} className={`faq-item ${activeFaq === idx ? 'active' : ''}`}>
                <div className="faq-header" onClick={() => setActiveFaq(activeFaq === idx ? -1 : idx)}>
                  <h4>{faq.q}</h4>
                  <i className="fas fa-chevron-down faq-icon"></i>
                </div>
                <div className="faq-body">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
