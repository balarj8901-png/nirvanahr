const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5001;
const PUBLIC_DIR = __dirname;
const DB_PATH = path.join(PUBLIC_DIR, 'data', 'database.json');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads', 'resumes');
const DIST_DIR = path.join(PUBLIC_DIR, 'dist');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function readDB() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return { admin: { username: 'admin', password: 'nirvana@2026' }, jobs: [], applications: [], candidates: [], employer_leads: [], contacts: [] };
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
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

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 20 * 1024 * 1024) reject(new Error('Payload too large'));
    });
    req.on('end', () => {
      try {
        if (!body) resolve({});
        else resolve(JSON.parse(body));
      } catch (e) {
        const params = new URLSearchParams(body);
        const obj = {};
        for (const [k, v] of params) obj[k] = v;
        resolve(obj);
      }
    });
    req.on('error', err => reject(err));
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
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

  // 1. Get Jobs List
  if (req.method === 'GET' && pathname === '/api/jobs') {
    const db = readDB();
    return sendJson(res, 200, { success: true, jobs: db.jobs || [] });
  }

  // 2. Apply for Job
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
        fs.writeFileSync(path.join(UPLOADS_DIR, resumeFilename), `Application Profile for ${body.fullName}\nPhone: ${body.phone}\nEmail: ${body.email}\nNotice: ${body.noticePeriod}\nCTC: ${body.currentCTC}`);
      }

      const newApp = {
        id: `app-${Date.now()}`,
        jobTitle: body.jobTitle || 'General Role',
        fullName: body.fullName || 'Candidate',
        email: body.email || '',
        phone: body.phone || '',
        currentCTC: body.currentCTC || '',
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

  // 3. Submit Candidate CV
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
        fullName: body.fullName || 'Candidate',
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

      return sendJson(res, 201, { success: true, message: 'Resume registered in talent pool successfully', candidateId: newCand.id });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 4. Employer Mandate
  if (req.method === 'POST' && pathname === '/api/employers/hire-talent') {
    try {
      const body = await parseJsonBody(req);
      const db = readDB();

      const newLead = {
        id: `emp-${Date.now()}`,
        contactName: body.contactName || 'Lead',
        designation: body.designation || 'HR Leader',
        companyName: body.companyName || 'Enterprise Client',
        email: body.email || '',
        phone: body.phone || '',
        location: body.location || 'India',
        serviceType: body.serviceType || 'Permanent Recruitment',
        openCount: body.openCount || '1',
        roleDetails: body.roleDetails || '',
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

  // 5. Contact Form
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
        submittedAt: new Date().toISOString()
      };

      db.contacts = db.contacts || [];
      db.contacts.unshift(newContact);
      writeDB(db);

      return sendJson(res, 201, { success: true, message: 'Message sent successfully' });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 6. Admin Login
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

  // 7. Admin Stats
  if (req.method === 'GET' && pathname === '/api/admin/stats') {
    const db = readDB();
    return sendJson(res, 200, {
      success: true,
      stats: {
        totalApplications: (db.applications || []).length,
        totalCandidates: (db.candidates || []).length,
        totalEmployerLeads: (db.employer_leads || []).length,
        activeJobs: (db.jobs || []).length
      }
    });
  }

  // 8. Admin Applications List
  if (req.method === 'GET' && pathname === '/api/admin/applications') {
    const db = readDB();
    return sendJson(res, 200, { success: true, applications: db.applications || [] });
  }

  // 9. Admin Candidates List
  if (req.method === 'GET' && pathname === '/api/admin/candidates') {
    const db = readDB();
    return sendJson(res, 200, { success: true, candidates: db.candidates || [] });
  }

  // 10. Admin Leads List
  if (req.method === 'GET' && pathname === '/api/admin/employer-leads') {
    const db = readDB();
    return sendJson(res, 200, { success: true, leads: db.employer_leads || [] });
  }

  // 11. Admin Contacts List
  if (req.method === 'GET' && pathname === '/api/admin/contacts') {
    const db = readDB();
    return sendJson(res, 200, { success: true, contacts: db.contacts || [] });
  }

  // 12. Admin Update Status
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
      }

      writeDB(db);
      return sendJson(res, 200, { success: true, message: 'Status updated' });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 13. Admin Create Job
  if (req.method === 'POST' && pathname === '/api/admin/jobs') {
    try {
      const body = await parseJsonBody(req);
      const db = readDB();

      const newJob = {
        id: `nhr-${Date.now().toString().slice(-4)}`,
        title: body.title || 'New Opportunity',
        company: body.company || 'Confidential Client',
        category: body.category || 'bfsi',
        type: body.type || 'Full Time',
        experience: body.experience || '2 - 5 Years',
        location: body.location || 'Ahmedabad, Gujarat',
        salary: body.salary || 'Best in Industry',
        tags: body.tags ? (typeof body.tags === 'string' ? body.tags.split(',').map(t => t.trim()) : body.tags) : ['Hiring'],
        posted: 'Just now',
        description: body.description || '',
        createdAt: new Date().toISOString()
      };

      db.jobs = db.jobs || [];
      db.jobs.unshift(newJob);
      writeDB(db);

      return sendJson(res, 201, { success: true, message: 'Job created', job: newJob });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 14. Admin Delete Job
  if (req.method === 'DELETE' && pathname.startsWith('/api/admin/jobs/')) {
    try {
      const jobId = pathname.split('/')[4];
      const db = readDB();
      db.jobs = (db.jobs || []).filter(j => j.id !== jobId);
      writeDB(db);
      return sendJson(res, 200, { success: true, message: 'Job deleted' });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 15. Admin Change Password
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

  // 16. Resume Download
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
      return res.end('File not found');
    }
  }

  // Serve static files from dist or public if available
  let staticPath = path.join(DIST_DIR, pathname);
  if (!fs.existsSync(staticPath) || !fs.statSync(staticPath).isFile()) {
    staticPath = path.join(PUBLIC_DIR, pathname);
  }

  if (fs.existsSync(staticPath) && fs.statSync(staticPath).isFile()) {
    const ext = path.extname(staticPath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    return fs.createReadStream(staticPath).pipe(res);
  }

  // SPA fallback to dist/index.html if built
  const spaIndex = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(spaIndex)) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
    return fs.createReadStream(spaIndex).pipe(res);
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`Backend API Server running on port ${PORT}`);
});
