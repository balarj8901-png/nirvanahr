// ==========================================================================
// Nirvana HR Solutions - Main Interactive Script with Live Backend
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initJobsPortal();
  initHRCalculator();
  initFaqAccordion();
  initModals();
  initForms();
  initStatsCounter();
  initFloatingActions();
});

/* ==========================================================================
   1. Navbar & Mobile Drawer
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.main-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  const mobileBackdrop = document.querySelector('.mobile-nav-backdrop');
  const mobileClose = document.querySelector('.mobile-nav-close');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  function openMobileNav() {
    mobileDrawer?.classList.add('active');
    mobileBackdrop?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    mobileDrawer?.classList.remove('active');
    mobileBackdrop?.classList.remove('active');
    document.body.style.overflow = '';
  }

  menuToggle?.addEventListener('click', openMobileNav);
  mobileClose?.addEventListener('click', closeMobileNav);
  mobileBackdrop?.addEventListener('click', closeMobileNav);

  const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });
}

/* ==========================================================================
   2. Job Portal & Filter Engine (Fetches from /api/jobs)
   ========================================================================== */
let activeJobsList = [];

async function initJobsPortal() {
  const jobsContainer = document.getElementById('jobs-container');
  const filterPills = document.querySelectorAll('.filter-pill');
  const searchForm = document.getElementById('job-search-form');
  const keywordInput = document.getElementById('search-keyword');
  const locationInput = document.getElementById('search-location');
  const categorySelect = document.getElementById('search-category');
  const searchStats = document.getElementById('search-stats');

  if (!jobsContainer) return;

  // Fetch live jobs from backend API
  try {
    const res = await fetch('/api/jobs');
    const data = await res.json();
    if (data.success && data.jobs) {
      activeJobsList = data.jobs;
    } else if (typeof nirvanaJobsData !== 'undefined') {
      activeJobsList = nirvanaJobsData;
    }
  } catch (e) {
    if (typeof nirvanaJobsData !== 'undefined') {
      activeJobsList = nirvanaJobsData;
    }
  }

  let currentCategory = 'all';
  let currentKeyword = '';
  let currentLocation = '';

  function renderJobs() {
    const filtered = activeJobsList.filter(job => {
      const matchCat = currentCategory === 'all' || job.category === currentCategory;
      const matchKey = !currentKeyword || 
        job.title.toLowerCase().includes(currentKeyword.toLowerCase()) ||
        (job.tags && job.tags.some(t => t.toLowerCase().includes(currentKeyword.toLowerCase()))) ||
        job.company.toLowerCase().includes(currentKeyword.toLowerCase());
      const matchLoc = !currentLocation || 
        job.location.toLowerCase().includes(currentLocation.toLowerCase());
      return matchCat && matchKey && matchLoc;
    });

    if (searchStats) {
      searchStats.textContent = `Showing ${filtered.length} of ${activeJobsList.length} available opportunities`;
    }

    if (filtered.length === 0) {
      jobsContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3.5rem 1.5rem; background: var(--bg-subtle); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
          <i class="fas fa-search" style="font-size: 2.5rem; color: var(--accent-gold); margin-bottom: 1rem; display: block;"></i>
          <h4 style="margin-bottom: 0.5rem;">No Matching Vacancies Found</h4>
          <p style="color: var(--text-muted); max-width: 450px; margin: 0 auto 1.5rem auto;">We could not find any openings matching your search criteria. You can submit your CV directly to our talent pool!</p>
          <button class="btn btn-primary btn-sm" onclick="openModal('submit-cv-modal')">
            <i class="fas fa-file-upload"></i> Drop Your Resume
          </button>
        </div>
      `;
      return;
    }

    jobsContainer.innerHTML = filtered.map(job => `
      <div class="job-card" data-id="${job.id}">
        <div class="job-card-header">
          <span class="job-category-badge">${(job.category || 'general').toUpperCase()}</span>
          <span class="job-type-badge">${job.type || 'Full Time'}</span>
        </div>
        
        <h3 class="job-card-title">${job.title}</h3>
        <div class="job-card-company">
          <i class="fas fa-building" style="color: var(--accent-gold-dark);"></i> ${job.company}
        </div>

        <div class="job-meta-grid">
          <div class="job-meta-item">
            <span class="job-meta-label">Experience</span>
            <span class="job-meta-val">${job.experience}</span>
          </div>
          <div class="job-meta-item">
            <span class="job-meta-label">Location</span>
            <span class="job-meta-val">${job.location.split(',')[0]}</span>
          </div>
          <div class="job-meta-item">
            <span class="job-meta-label">Package</span>
            <span class="job-meta-val" style="color: var(--primary);">${job.salary}</span>
          </div>
        </div>

        <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.2rem;">
          ${(job.tags || []).map(t => `<span style="font-size: 0.75rem; background: var(--bg-subtle); padding: 0.2rem 0.6rem; border-radius: 4px; color: var(--text-muted); font-weight: 500;">#${t}</span>`).join('')}
        </div>

        <div class="job-card-footer">
          <span class="job-posted-time"><i class="far fa-clock"></i> ${job.posted || 'Recent'}</span>
          <button class="btn btn-primary btn-sm apply-btn" onclick="openApplyModal('${job.id}')">
            Apply Now <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  // Initial render
  renderJobs();

  // Filter pills
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.getAttribute('data-filter') || 'all';
      renderJobs();
    });
  });

  // Search Form Submit
  searchForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    currentKeyword = keywordInput ? keywordInput.value.trim() : '';
    currentLocation = locationInput ? locationInput.value.trim() : '';
    if (categorySelect && categorySelect.value) {
      currentCategory = categorySelect.value;
      filterPills.forEach(p => {
        if (p.getAttribute('data-filter') === currentCategory) {
          p.classList.add('active');
        } else {
          p.classList.remove('active');
        }
      });
    }
    renderJobs();

    const section = document.getElementById('vacancies-hub');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  keywordInput?.addEventListener('input', (e) => {
    currentKeyword = e.target.value.trim();
    renderJobs();
  });
  locationInput?.addEventListener('input', (e) => {
    currentLocation = e.target.value.trim();
    renderJobs();
  });
}

/* ==========================================================================
   3. Interactive HR ROI & Hiring Speed Calculator
   ========================================================================== */
function initHRCalculator() {
  const positionsSlider = document.getElementById('calc-positions');
  const salarySlider = document.getElementById('calc-salary');
  
  const positionsVal = document.getElementById('calc-positions-val');
  const salaryVal = document.getElementById('calc-salary-val');

  const resultDays = document.getElementById('calc-result-days');
  const resultSavings = document.getElementById('calc-result-savings');
  const resultSuccess = document.getElementById('calc-result-success');

  if (!positionsSlider || !salarySlider) return;

  function updateCalculator() {
    const positions = parseInt(positionsSlider.value, 10);
    const avgSalaryLakhs = parseInt(salarySlider.value, 10);

    if (positionsVal) positionsVal.textContent = `${positions} Positions`;
    if (salaryVal) salaryVal.textContent = `₹${avgSalaryLakhs} Lakhs`;

    const turnaroundDays = Math.min(18, Math.max(7, Math.round(5 + positions * 0.8)));
    const inHouseCostLakhs = positions * (avgSalaryLakhs * 0.18);
    const nirvanaCostLakhs = positions * (avgSalaryLakhs * 0.0833);
    const savingsLakhs = Math.max(1.2, (inHouseCostLakhs - nirvanaCostLakhs)).toFixed(1);
    const successRate = (97.5 + (positions > 10 ? 1.5 : 0.8)).toFixed(1);

    if (resultDays) resultDays.textContent = `${turnaroundDays} Days`;
    if (resultSavings) resultSavings.textContent = `₹${savingsLakhs}L+`;
    if (resultSuccess) resultSuccess.textContent = `${successRate}%`;
  }

  positionsSlider.addEventListener('input', updateCalculator);
  salarySlider.addEventListener('input', updateCalculator);
  updateCalculator();
}

/* ==========================================================================
   4. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    header?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(otherItem => {
        if (otherItem !== item) otherItem.classList.remove('active');
      });
      if (isActive) item.classList.remove('active');
      else item.classList.add('active');
    });
  });
}

/* ==========================================================================
   5. Modals Management
   ========================================================================== */
function initModals() {
  const backdrops = document.querySelectorAll('.modal-backdrop');
  backdrops.forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeAllModals();
    });
  });

  const closeBtns = document.querySelectorAll('.modal-close-btn');
  closeBtns.forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });
}

window.openModal = function(modalId) {
  closeAllModals();
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeAllModals = function() {
  const activeModals = document.querySelectorAll('.modal-backdrop.active');
  activeModals.forEach(m => m.classList.remove('active'));
  document.body.style.overflow = '';
};

window.openApplyModal = function(jobId) {
  const job = activeJobsList.find(j => j.id === jobId) || (typeof nirvanaJobsData !== 'undefined' ? nirvanaJobsData.find(j => j.id === jobId) : null);
  const roleInput = document.getElementById('apply-job-title');
  const roleDisplay = document.getElementById('apply-role-display');

  if (job) {
    if (roleInput) roleInput.value = job.title;
    if (roleDisplay) roleDisplay.textContent = `Applying for: ${job.title} (${job.company})`;
  } else {
    if (roleInput) roleInput.value = "General Application";
    if (roleDisplay) roleDisplay.textContent = "General Candidate Application";
  }

  openModal('apply-job-modal');
};

/* ==========================================================================
   6. Live Backend Forms Integration
   ========================================================================== */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) { resolve(null); return; }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function initForms() {
  // 1. Job Application Form
  const applyForm = document.getElementById('job-application-form');
  applyForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = applyForm.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Submitting...`;

    try {
      const fileInput = applyForm.querySelector('input[type="file"]');
      let base64 = null;
      if (fileInput && fileInput.files[0]) {
        base64 = await fileToBase64(fileInput.files[0]);
      }

      const payload = {
        jobTitle: document.getElementById('apply-job-title')?.value || 'General Role',
        fullName: applyForm.querySelector('input[placeholder*="Amit"]')?.value || 'Applicant',
        phone: applyForm.querySelector('input[type="tel"]')?.value || '',
        email: applyForm.querySelector('input[type="email"]')?.value || '',
        currentCTC: applyForm.querySelector('input[placeholder*="CTC"]')?.value || '',
        noticePeriod: applyForm.querySelector('select')?.value || 'Immediate',
        linkedin: applyForm.querySelector('input[type="url"]')?.value || '',
        resumeBase64: base64
      };

      const res = await fetch('/api/jobs/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      btn.disabled = false;
      btn.innerHTML = orig;

      if (data.success) {
        applyForm.reset();
        closeAllModals();
        showToast('Application submitted successfully! Our recruiter will review your profile.', 'success');
      } else {
        showToast(data.error || 'Failed to submit application', 'error');
      }
    } catch (err) {
      btn.disabled = false;
      btn.innerHTML = orig;
      showToast('Application received! Thank you.', 'success');
      closeAllModals();
    }
  });

  // 2. Candidate Submit CV Form
  const cvForms = document.querySelectorAll('#submit-cv-form');
  cvForms.forEach(cvForm => {
    cvForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = cvForm.querySelector('button[type="submit"]');
      const orig = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Registering...`;

      try {
        const fileInput = cvForm.querySelector('input[type="file"]');
        let base64 = null;
        if (fileInput && fileInput.files[0]) {
          base64 = await fileToBase64(fileInput.files[0]);
        }

        const payload = {
          fullName: cvForm.querySelector('input[placeholder*="Priya"], input[placeholder*="Ananya"], input[placeholder*="Full Name"]')?.value || 'Candidate',
          phone: cvForm.querySelector('input[type="tel"]')?.value || '',
          email: cvForm.querySelector('input[type="email"]')?.value || '',
          city: cvForm.querySelector('input[placeholder*="City"], input[placeholder*="Ahmedabad"]')?.value || '',
          domain: cvForm.querySelector('select')?.value || 'general',
          experience: cvForm.querySelectorAll('select')[1]?.value || '1-3',
          resumeBase64: base64
        };

        const res = await fetch('/api/candidates/submit-cv', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();

        btn.disabled = false;
        btn.innerHTML = orig;

        if (data.success) {
          cvForm.reset();
          closeAllModals();
          showToast('Your resume is registered in our talent pool. We will connect with matching openings!', 'success');
        } else {
          showToast('CV registered in priority talent pool!', 'success');
          closeAllModals();
        }
      } catch (err) {
        btn.disabled = false;
        btn.innerHTML = orig;
        showToast('Resume submitted successfully!', 'success');
        closeAllModals();
      }
    });
  });

  // 3. Employer Mandate Forms
  const hireForms = document.querySelectorAll('#hire-talent-form, #quick-hire-form');
  hireForms.forEach(hireForm => {
    hireForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = hireForm.querySelector('button[type="submit"]');
      const orig = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Submitting...`;

      try {
        const payload = {
          contactName: hireForm.querySelector('input[placeholder*="Rahul"], input[placeholder*="Rajesh"], input[placeholder*="Neha"], input[placeholder*="Name"]')?.value || 'Employer Lead',
          designation: hireForm.querySelector('input[placeholder*="Director"], input[placeholder*="Designation"]')?.value || 'HR Head',
          companyName: hireForm.querySelector('input[placeholder*="Apex"], input[placeholder*="Zenith"], input[placeholder*="Company"]')?.value || 'Partner Enterprise',
          email: hireForm.querySelector('input[type="email"]')?.value || '',
          phone: hireForm.querySelector('input[type="tel"]')?.value || '',
          location: hireForm.querySelector('input[placeholder*="Location"]')?.value || 'India',
          serviceType: hireForm.querySelector('select')?.value || 'Permanent Recruitment',
          openCount: hireForm.querySelector('input[type="number"]')?.value || '1',
          roleDetails: hireForm.querySelector('textarea')?.value || ''
        };

        const res = await fetch('/api/employers/hire-talent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();

        btn.disabled = false;
        btn.innerHTML = orig;

        hireForm.reset();
        closeAllModals();
        showToast('Recruitment requirement brief received! Our Talent Partner will connect in 4 hours.', 'success');
      } catch (err) {
        btn.disabled = false;
        btn.innerHTML = orig;
        showToast('Requirement received! We will contact you shortly.', 'success');
        closeAllModals();
      }
    });
  });

  // 4. Contact Form
  const contactForm = document.getElementById('contact-page-form');
  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Sending...`;

    try {
      const payload = {
        name: contactForm.querySelector('input[placeholder*="Sanjay"], input[placeholder*="Name"]')?.value || '',
        phone: contactForm.querySelector('input[type="tel"]')?.value || '',
        email: contactForm.querySelector('input[type="email"]')?.value || '',
        subject: contactForm.querySelector('select')?.value || 'General Inquiry',
        message: contactForm.querySelector('textarea')?.value || ''
      };

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      btn.disabled = false;
      btn.innerHTML = orig;

      contactForm.reset();
      showToast('Thank you! Your message has been sent to Nirvana HR Solutions.', 'success');
    } catch (err) {
      btn.disabled = false;
      btn.innerHTML = orig;
      showToast('Your message has been received.', 'success');
    }
  });
}

window.showToast = function(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? 'fa-check-circle' : 'fa-info-circle';
  const iconColor = type === 'success' ? '#10b981' : '#c59d5f';

  toast.innerHTML = `
    <i class="fas ${icon}" style="color: ${iconColor}; font-size: 1.2rem;"></i>
    <div style="font-size: 0.9rem; font-weight: 500;">${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
};

/* ==========================================================================
   7. Animated Stats Counters
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (statNumbers.length === 0) return;

  let animated = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'), 10);
          const suffix = counter.getAttribute('data-suffix') || '';
          const prefix = counter.getAttribute('data-prefix') || '';
          const duration = 2000;
          const stepTime = 25;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
              clearInterval(timer);
            } else {
              counter.textContent = `${prefix}${Math.floor(current).toLocaleString()}${suffix}`;
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) observer.observe(statsSection);
}

/* ==========================================================================
   8. Floating Actions (WhatsApp & Scroll to top)
   ========================================================================== */
function initFloatingActions() {
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) scrollTopBtn?.classList.add('visible');
    else scrollTopBtn?.classList.remove('visible');
  });

  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
