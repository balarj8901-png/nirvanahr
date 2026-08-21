import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function FloatingWidgets() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) setShowTop(true);
      else setShowTop(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="floating-actions">
      <a
        href="https://wa.me/919876543210?text=Hello%20Nirvana%20HR%20Solutions,%20I%20would%20like%20to%20inquire%20about%20recruitment%20services."
        target="_blank"
        rel="noreferrer"
        className="float-btn float-whatsapp"
        title="Chat on WhatsApp"
      >
        <i className="fab fa-whatsapp"></i>
      </a>

      {showTop && (
        <button
          className="float-btn float-top"
          onClick={scrollToTop}
          title="Back to Top"
        >
          <ChevronUp size={22} />
        </button>
      )}
    </div>
  );
}
