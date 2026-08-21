import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, MessageSquare } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="brand-logo">
              <img src="/assets/images/logo.jpg" alt="Nirvana HR Solutions" />
              <div className="brand-text">
                <span className="brand-title">NIRVANA</span>
                <span className="brand-subtitle" style={{ color: 'var(--accent-gold-light)' }}>HR SOLUTIONS</span>
              </div>
            </Link>
            <p>
              Connecting Talent | Building Futures. Your trusted partner for high-impact executive recruitment, agile staffing, and strategic HR consulting across India.
            </p>
            <div className="footer-socials">
              <a href="https://instagram.com/nirvanahrsolutions" target="_blank" rel="noreferrer" className="social-link">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://linkedin.com/company/nirvanahrsolutions" target="_blank" rel="noreferrer" className="social-link">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="social-link">
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h4>Quick Links</h4>
            <div className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/about">About Nirvana</Link>
              <Link to="/services">Services Catalog</Link>
              <Link to="/vacancies">Live Vacancies</Link>
              <Link to="/hire-talent">Hire Talent</Link>
              <Link to="/submit-cv">Submit Resume</Link>
              <Link to="/contact">Contact Us</Link>
            </div>
          </div>

          {/* Services */}
          <div className="footer-column">
            <h4>Our Services</h4>
            <div className="footer-links">
              <Link to="/services">Executive Search</Link>
              <Link to="/services">Permanent Recruitment</Link>
              <Link to="/services">Contract Staffing</Link>
              <Link to="/services">Payroll Management</Link>
              <Link to="/services">Offshore Talent Hub</Link>
              <Link to="/services">HR Compliance Audit</Link>
            </div>
          </div>

          {/* Contact */}
          <div className="footer-column">
            <h4>Connect With Us</h4>
            <div className="footer-contact-info">
              <div className="footer-contact-item">
                <MapPin size={18} />
                <span>Corporate Towers, S.G. Highway, Ahmedabad, Gujarat, India - 380054</span>
              </div>
              <div className="footer-contact-item">
                <Phone size={18} />
                <a href="tel:+919876543210">+91 98765 43210</a>
              </div>
              <div className="footer-contact-item">
                <Mail size={18} />
                <a href="mailto:contact@nirvanahrsolutions.com">contact@nirvanahrsolutions.com</a>
              </div>
              <div className="footer-contact-item">
                <MessageSquare size={18} />
                <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-gold-light)' }}>
                  Direct WhatsApp Assistance
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>&copy; {new Date().getFullYear()} Nirvana HR Solutions. All Rights Reserved.</div>
          <div className="footer-bottom-links">
            <Link to="/admin" style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>
              <i className="fas fa-lock" style={{ marginRight: '4px' }}></i> Admin Portal
            </Link>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
