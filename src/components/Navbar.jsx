import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Phone, Mail, Shield, Menu, X, FileUp, UserPlus } from 'lucide-react';

export default function Navbar({ onOpenSubmitCv, onOpenHireTalent }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) setScrolled(true);
      else setScrolled(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container">
          <div className="top-bar-inner">
            <div className="top-bar-contacts">
              <a href="tel:+919876543210"><Phone size={14} /> +91 98765 43210</a>
              <a href="mailto:contact@nirvanahrsolutions.com"><Mail size={14} /> contact@nirvanahrsolutions.com</a>
            </div>
            <div className="top-bar-badge">
              <Shield size={14} /> ISO Certified Human Resource Partner
            </div>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className={`main-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <nav className="navbar">
            <Link to="/" className="brand-logo">
              <img src="/assets/images/logo.jpg" alt="Nirvana HR Solutions" />
              <div className="brand-text">
                <span className="brand-title">NIRVANA</span>
                <span className="brand-subtitle">HR SOLUTIONS</span>
              </div>
            </Link>

            <ul className="nav-menu">
              <li><NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Home</NavLink></li>
              <li><NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>About Us</NavLink></li>
              <li><NavLink to="/services" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Services</NavLink></li>
              <li><NavLink to="/vacancies" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Vacancies</NavLink></li>
              <li><NavLink to="/hire-talent" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>For Employers</NavLink></li>
              <li><NavLink to="/submit-cv" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>For Candidates</NavLink></li>
              <li><NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Contact</NavLink></li>
            </ul>

            <div className="header-actions">
              <button className="btn btn-outline-gold btn-sm" onClick={onOpenSubmitCv}>
                <FileUp size={15} /> Submit CV
              </button>
              <button className="btn btn-primary btn-sm" onClick={onOpenHireTalent}>
                <UserPlus size={15} /> Hire Talent
              </button>
              <button className="menu-toggle" onClick={() => setMobileOpen(true)} aria-label="Toggle Menu">
                <Menu size={24} />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      <div 
        className={`mobile-nav-backdrop ${mobileOpen ? 'active' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Drawer */}
      <div className={`mobile-nav-drawer ${mobileOpen ? 'active' : ''}`}>
        <div className="mobile-nav-header">
          <div className="brand-text">
            <span className="brand-title">NIRVANA</span>
            <span className="brand-subtitle">HR SOLUTIONS</span>
          </div>
          <button className="mobile-nav-close" onClick={() => setMobileOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <div className="mobile-nav-links">
          <NavLink to="/" className="nav-link">Home</NavLink>
          <NavLink to="/about" className="nav-link">About Us</NavLink>
          <NavLink to="/services" className="nav-link">Services</NavLink>
          <NavLink to="/vacancies" className="nav-link">Vacancies</NavLink>
          <NavLink to="/hire-talent" className="nav-link">For Employers</NavLink>
          <NavLink to="/submit-cv" className="nav-link">For Candidates</NavLink>
          <NavLink to="/contact" className="nav-link">Contact</NavLink>
        </div>
        <div className="mobile-nav-footer">
          <button className="btn btn-outline-gold" onClick={() => { setMobileOpen(false); onOpenSubmitCv(); }}>
            <FileUp size={16} /> Submit CV
          </button>
          <button className="btn btn-primary" onClick={() => { setMobileOpen(false); onOpenHireTalent(); }}>
            <UserPlus size={16} /> Hire Talent
          </button>
        </div>
      </div>
    </>
  );
}
