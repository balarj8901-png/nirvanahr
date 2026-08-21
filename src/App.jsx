import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWidgets from './components/FloatingWidgets';
import ApplyModal from './components/ApplyModal';
import SubmitCvModal from './components/SubmitCvModal';
import HireTalentModal from './components/HireTalentModal';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Vacancies from './pages/Vacancies';
import HireTalent from './pages/HireTalent';
import SubmitCv from './pages/SubmitCv';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  // Modals state
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [submitCvOpen, setSubmitCvOpen] = useState(false);
  const [hireTalentOpen, setHireTalentOpen] = useState(false);

  // Toast state
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleOpenApply = (job) => {
    setSelectedJob(job);
    setApplyModalOpen(true);
  };

  return (
    <div className="app-layout">
      {/* Navbar on public routes */}
      {!isAdmin && (
        <Navbar
          onOpenSubmitCv={() => setSubmitCvOpen(true)}
          onOpenHireTalent={() => setHireTalentOpen(true)}
        />
      )}

      {/* Main Page Routing */}
      <Routes>
        <Route
          path="/"
          element={
            <Home
              onOpenApply={handleOpenApply}
              onOpenSubmitCv={() => setSubmitCvOpen(true)}
              onOpenHireTalent={() => setHireTalentOpen(true)}
              onToast={showToast}
            />
          }
        />
        <Route
          path="/about"
          element={
            <About
              onOpenSubmitCv={() => setSubmitCvOpen(true)}
              onOpenHireTalent={() => setHireTalentOpen(true)}
            />
          }
        />
        <Route
          path="/services"
          element={
            <Services onOpenHireTalent={() => setHireTalentOpen(true)} />
          }
        />
        <Route
          path="/vacancies"
          element={
            <Vacancies
              onOpenApply={handleOpenApply}
              onOpenSubmitCv={() => setSubmitCvOpen(true)}
            />
          }
        />
        <Route
          path="/hire-talent"
          element={<HireTalent onToast={showToast} />}
        />
        <Route
          path="/submit-cv"
          element={<SubmitCv onToast={showToast} />}
        />
        <Route
          path="/contact"
          element={<Contact onToast={showToast} />}
        />
        <Route
          path="/admin"
          element={<AdminDashboard onToast={showToast} />}
        />
      </Routes>

      {/* Footer & Floating Widgets on public routes */}
      {!isAdmin && <Footer />}
      {!isAdmin && <FloatingWidgets />}

      {/* Global Modals */}
      <ApplyModal
        job={selectedJob}
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        onToast={showToast}
      />

      <SubmitCvModal
        isOpen={submitCvOpen}
        onClose={() => setSubmitCvOpen(false)}
        onToast={showToast}
      />

      <HireTalentModal
        isOpen={hireTalentOpen}
        onClose={() => setHireTalentOpen(false)}
        onToast={showToast}
      />

      {/* Toast Notification Popups */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            <i
              className={`fas ${
                t.type === 'success'
                  ? 'fa-check-circle'
                  : t.type === 'error'
                  ? 'fa-exclamation-circle'
                  : 'fa-info-circle'
              }`}
              style={{
                color:
                  t.type === 'success'
                    ? '#10b981'
                    : t.type === 'error'
                    ? '#ef4444'
                    : '#c59d5f',
                fontSize: '1.2rem',
              }}
            ></i>
            <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>
              {t.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
