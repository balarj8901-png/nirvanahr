const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const DB_PATH = path.join(PUBLIC_DIR, 'data', 'database.json');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads', 'resumes');

// Ensure upload and data folders exist
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Helper: Read Database
function readDB() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database:', err);
    return { admin: { username: 'admin', password: 'nirvana@2026' }, jobs: [], applications: [], candidates: [], employer_leads: [], contacts: [] };
  }
}

// Helper: Write Database
function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing database:', err);
    return false;
  }
}

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

// Helper: Parse JSON Body
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 20 * 1024 * 1024) { // 20MB limit
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        if (!body) resolve({});
        else resolve(JSON.parse(body));
      } catch (e) {
        // Fallback for form-urlencoded
        const params = new URLSearchParams(body);
        const obj = {};
        for (const [k, v] of params) obj[k] = v;
        resolve(obj);
      }
    });
    req.on('error', err => reject(err));
  });
}

// Helper: Send JSON Response
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  // Global CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // =========================================================================
  // API ROUTING
  // =========================================================================

  // 1. Public: Get Jobs List
  if (req.method === 'GET' && pathname === '/api/jobs') {
    const db = readDB();
    return sendJson(res, 200, { success: true, jobs: db.jobs || [] });
  }

  // 2. Public: Apply for Job
  if (req.method === 'POST' && pathname === '/api/jobs/apply') {
    try {
      const body = await parseJsonBody(req);
      const db = readDB();

      let resumeFilename = `resume_${Date.now()}_applicant.pdf`;
      if (body.resumeBase64) {
        try {
          const buffer = Buffer.from(body.resumeBase64.split(',')[1] || body.resumeBase64, 'base64');
          resumeFilename = `resume_${Date.now()}_${(body.fullName || 'applicant').replace(/[^a-z0-9]/gi, '_')}.pdf`;
          fs.writeFileSync(path.join(UPLOADS_DIR, resumeFilename), buffer);
        } catch (e) {
          console.error('File save error:', e);
        }
      } else {
        // Create standard confirmation placeholder
        fs.writeFileSync(path.join(UPLOADS_DIR, resumeFilename), `Application Profile for ${body.fullName || 'Candidate'}\nPhone: ${body.phone}\nEmail: ${body.email}\nNotice: ${body.noticePeriod}\nCTC: ${body.currentCTC}`);
      }

      const newApp = {
        id: `app-${Date.now()}`,
        jobTitle: body.jobTitle || body.job_title || 'General Application',
        fullName: body.fullName || body.name || 'Candidate',
        email: body.email || '',
        phone: body.phone || '',
        currentCTC: body.currentCTC || body.ctc || 'Not specified',
        noticePeriod: body.noticePeriod || 'Immediate',
        linkedin: body.linkedin || '',
        resumeFilename: resumeFilename,
        status: 'New',
        submittedAt: new Date().toISOString()
      };

      db.applications = db.applications || [];
      db.applications.unshift(newApp);
      writeDB(db);

      return sendJson(res, 201, { success: true, message: 'Application submitted successfully', applicationId: newApp.id });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 3. Public: Submit CV / Drop Resume
  if (req.method === 'POST' && pathname === '/api/candidates/submit-cv') {
    try {
      const body = await parseJsonBody(req);
      const db = readDB();

      let resumeFilename = `cv_${Date.now()}_candidate.pdf`;
      if (body.resumeBase64) {
        try {
          const buffer = Buffer.from(body.resumeBase64.split(',')[1] || body.resumeBase64, 'base64');
          resumeFilename = `cv_${Date.now()}_${(body.fullName || 'candidate').replace(/[^a-z0-9]/gi, '_')}.pdf`;
          fs.writeFileSync(path.join(UPLOADS_DIR, resumeFilename), buffer);
        } catch (e) {
          console.error('File save error:', e);
        }
      } else {
        fs.writeFileSync(path.join(UPLOADS_DIR, resumeFilename), `Candidate CV Profile for ${body.fullName}\nPhone: ${body.phone}\nEmail: ${body.email}\nDomain: ${body.domain}\nExperience: ${body.experience}\nCity: ${body.city}`);
      }

      const newCand = {
        id: `cand-${Date.now()}`,
        fullName: body.fullName || body.name || 'Candidate',
        phone: body.phone || '',
        email: body.email || '',
        city: body.city || '',
        domain: body.domain || 'general',
        experience: body.experience || '1-3',
        currentCTC: body.currentCTC || '',
        expectedCTC: body.expectedCTC || '',
        resumeFilename: resumeFilename,
        status: 'New',
        submittedAt: new Date().toISOString()
      };

      db.candidates = db.candidates || [];
      db.candidates.unshift(newCand);
      writeDB(db);

      return sendJson(res, 201, { success: true, message: 'Resume added to talent pool successfully', candidateId: newCand.id });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 4. Public: Employer Hire Talent Mandate
  if (req.method === 'POST' && pathname === '/api/employers/hire-talent') {
    try {
      const body = await parseJsonBody(req);
      const db = readDB();

      const newLead = {
        id: `emp-${Date.now()}`,
        contactName: body.contactName || body.name || 'Employer Lead',
        designation: body.designation || 'HR / Manager',
        companyName: body.companyName || body.company || 'Enterprise Partner',
        email: body.email || '',
        phone: body.phone || '',
        location: body.location || 'India',
        serviceType: body.serviceType || 'Permanent Recruitment',
        openCount: body.openCount || body.count || '1',
        roleDetails: body.roleDetails || body.details || '',
        status: 'New',
        submittedAt: new Date().toISOString()
      };

      db.employer_leads = db.employer_leads || [];
      db.employer_leads.unshift(newLead);
      writeDB(db);

      return sendJson(res, 201, { success: true, message: 'Recruitment mandate received successfully', leadId: newLead.id });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 5. Public: General Contact Form
  if (req.method === 'POST' && pathname === '/api/contact') {
    try {
      const body = await parseJsonBody(req);
      const db = readDB();

      const newContact = {
        id: `cnt-${Date.now()}`,
        name: body.name || 'Visitor',
        phone: body.phone || '',
        email: body.email || '',
        subject: body.subject || 'General Inquiry',
        message: body.message || '',
        submittedAt: new Date().toISOString(),
        status: 'New'
      };

      db.contacts = db.contacts || [];
      db.contacts.unshift(newContact);
      writeDB(db);

      return sendJson(res, 201, { success: true, message: 'Message sent successfully' });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // =========================================================================
  // ADMIN AUTH & DASHBOARD APIS
  // =========================================================================

  // Admin Login
  if (req.method === 'POST' && pathname === '/api/admin/login') {
    try {
      const body = await parseJsonBody(req);
      const db = readDB();

      if (body.username === db.admin.username && body.password === db.admin.password) {
        const token = `nirvana_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        return sendJson(res, 200, {
          success: true,
          token: token,
          admin: { username: db.admin.username, name: db.admin.name || 'Administrator' }
        });
      } else {
        return sendJson(res, 401, { success: false, error: 'Invalid username or password' });
      }
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // Admin Stats & Overview
  if (req.method === 'GET' && pathname === '/api/admin/stats') {
    const db = readDB();
    return sendJson(res, 200, {
      success: true,
      stats: {
        totalApplications: (db.applications || []).length,
        totalCandidates: (db.candidates || []).length,
        totalEmployerLeads: (db.employer_leads || []).length,
        totalContacts: (db.contacts || []).length,
        activeJobs: (db.jobs || []).length,
        newApplications: (db.applications || []).filter(a => a.status === 'New').length,
        newLeads: (db.employer_leads || []).filter(l => l.status === 'New').length
      }
    });
  }

  // Admin: Get All Applications
  if (req.method === 'GET' && pathname === '/api/admin/applications') {
    const db = readDB();
    return sendJson(res, 200, { success: true, applications: db.applications || [] });
  }

  // Admin: Get All Candidates Pool
  if (req.method === 'GET' && pathname === '/api/admin/candidates') {
    const db = readDB();
    return sendJson(res, 200, { success: true, candidates: db.candidates || [] });
  }

  // Admin: Get All Employer Mandates
  if (req.method === 'GET' && pathname === '/api/admin/employer-leads') {
    const db = readDB();
    return sendJson(res, 200, { success: true, leads: db.employer_leads || [] });
  }

  // Admin: Get All Contacts
  if (req.method === 'GET' && pathname === '/api/admin/contacts') {
    const db = readDB();
    return sendJson(res, 200, { success: true, contacts: db.contacts || [] });
  }

  // Admin: Update Status of item (application, lead, candidate, contact)
  if (req.method === 'PUT' && pathname === '/api/admin/status') {
    try {
      const body = await parseJsonBody(req);
      const db = readDB();
      const { type, id, status } = body;

      if (type === 'application' && db.applications) {
        const item = db.applications.find(a => a.id === id);
        if (item) item.status = status;
      } else if (type === 'candidate' && db.candidates) {
        const item = db.candidates.find(c => c.id === id);
        if (item) item.status = status;
      } else if (type === 'employer' && db.employer_leads) {
        const item = db.employer_leads.find(e => e.id === id);
        if (item) item.status = status;
      } else if (type === 'contact' && db.contacts) {
        const item = db.contacts.find(c => c.id === id);
        if (item) item.status = status;
      }

      writeDB(db);
      return sendJson(res, 200, { success: true, message: 'Status updated' });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // Admin: Create Job Vacancy
  if (req.method === 'POST' && pathname === '/api/admin/jobs') {
    try {
      const body = await parseJsonBody(req);
      const db = readDB();

      const newJob = {
        id: `nhr-${Date.now().toString().slice(-4)}`,
        title: body.title || 'New Position',
        company: body.company || 'Confidential Client',
        category: body.category || 'bfsi',
        type: body.type || 'Full Time',
        experience: body.experience || '2 - 5 Years',
        location: body.location || 'Ahmedabad, Gujarat',
        salary: body.salary || 'Best in Industry',
        tags: body.tags ? body.tags.split(',').map(t => t.trim()) : ['Hiring', 'Full-time'],
        posted: 'Just now',
        description: body.description || '',
        createdAt: new Date().toISOString()
      };

      db.jobs = db.jobs || [];
      db.jobs.unshift(newJob);
      writeDB(db);

      return sendJson(res, 201, { success: true, message: 'Job created successfully', job: newJob });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // Admin: Delete Job Vacancy
  if (req.method === 'DELETE' && pathname.startsWith('/api/admin/jobs/')) {
    try {
      const jobId = pathname.split('/')[4];
      const db = readDB();
      db.jobs = (db.jobs || []).filter(j => j.id !== jobId);
      writeDB(db);
      return sendJson(res, 200, { success: true, message: 'Job deleted successfully' });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // Admin: Change Password
  if (req.method === 'POST' && pathname === '/api/admin/change-password') {
    try {
      const body = await parseJsonBody(req);
      const db = readDB();

      if (body.oldPassword !== db.admin.password) {
        return sendJson(res, 400, { success: false, error: 'Current password is incorrect' });
      }
      if (!body.newPassword || body.newPassword.length < 6) {
        return sendJson(res, 400, { success: false, error: 'New password must be at least 6 characters' });
      }

      db.admin.password = body.newPassword;
      writeDB(db);
      return sendJson(res, 200, { success: true, message: 'Password updated successfully' });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // Admin: Download / View Resume File
  if (req.method === 'GET' && pathname.startsWith('/uploads/resumes/')) {
    const filename = path.basename(pathname);
    const filePath = path.join(UPLOADS_DIR, filename);

    if (fs.existsSync(filePath)) {
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`
      });
      return fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Resume file not found');
    }
  }

  // =========================================================================
  // STATIC ASSET SERVING
  // =========================================================================
  let reqPath = pathname;
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  if (!path.extname(reqPath) && fs.existsSync(path.join(PUBLIC_DIR, reqPath + '.html'))) {
    reqPath += '.html';
  }

  const filePath = path.join(PUBLIC_DIR, reqPath);
  const resolvedPath = path.resolve(filePath);

  if (!resolvedPath.startsWith(path.resolve(PUBLIC_DIR))) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Forbidden');
  }

  fs.stat(resolvedPath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
      return res.end(`
        <!DOCTYPE html>
        <html lang="en">
        <head><title>404 Not Found</title><link rel="stylesheet" href="/assets/css/style.css"></head>
        <body style="display:flex;align-items:center;justify-content:center;height:100vh;text-align:center;">
          <div>
            <h1 style="color:#0a3628;">404 - Page Not Found</h1>
            <p style="margin-bottom:2rem;color:#5d6f68;">The requested resource was not found.</p>
            <a href="/index.html" class="btn btn-primary">Go to Home</a>
          </div>
        </body>
        </html>
      `);
    }

    const ext = path.extname(resolvedPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'Content-Length': stats.size
    });

    fs.createReadStream(resolvedPath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Nirvana HR Solutions Fullstack Server Live!`);
  console.log(`👉 Public Site:     http://localhost:${PORT}`);
  console.log(`👉 Admin Dashboard: http://localhost:${PORT}/admin.html`);
  console.log(`👉 Default Login:   admin / nirvana@2026`);
  console.log(`=======================================================`);
});
