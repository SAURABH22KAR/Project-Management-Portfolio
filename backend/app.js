const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const path = require('path');
const dotenv = require('dotenv');
const { check, validationResult } = require('express-validator');

// Load environment variables from .env file in the backend folder
dotenv.config({ path: path.join(__dirname, '.env') });

// Create Express app
const app = express();

// Connect to MongoDB using MONGO_URI from .env
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, 
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files (e.g., CSS, JS, images) from the public folder, assuming it is outside the backend folder
app.use(express.static(path.join(__dirname, '..', 'public')));

// Routes for multiple pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));  // Home page
});

app.get('/skills', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'skills.html'));  // Skills page
});

app.get('/experience', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'experience.html'));  // Experience page
});

app.get('/projects', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'projects.html'));  // Projects page
});

app.get('/education', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'education.html'));  // Education page
});

app.get('/certifications', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'certifications.html'));  // Certifications page
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'contact.html'));  // Contact page
});

app.get('/thank-you', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'thank-you.html'));  // Thank you page
});

// Define Mongoose schema and model for form data
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  date: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// Nodemailer transporter (Gmail SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// POST route to handle form submission with validation
app.post('/submit-form', [
  check('name', 'Name is required').notEmpty(),
  check('email', 'Email is invalid').isEmail(),
  check('message', 'Message is required').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, message } = req.body;

  // Save to MongoDB
  const newContact = new Contact({ name, email, message });
  try {
    await newContact.save();
  } catch (err) {
    console.error('Error saving message:', err);
    return res.status(500).send('An error occurred. Please try again.');
  }

  // Send notification email
  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    replyTo: email,
    subject: `New message from ${name} — Portfolio`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0d0d1a;color:#f1f5f9;border-radius:12px;padding:32px;border:1px solid rgba(129,140,248,0.2)">
        <h2 style="margin:0 0 4px;color:#818cf8">New Contact Form Submission</h2>
        <p style="margin:0 0 24px;color:#94a3b8;font-size:14px">Someone reached out via your portfolio</p>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:10px 0;color:#94a3b8;width:80px;vertical-align:top">Name</td><td style="padding:10px 0;font-weight:600">${name}</td></tr>
          <tr><td style="padding:10px 0;color:#94a3b8;vertical-align:top">Email</td><td style="padding:10px 0"><a href="mailto:${email}" style="color:#38bdf8">${email}</a></td></tr>
          <tr><td style="padding:10px 0;color:#94a3b8;vertical-align:top">Message</td><td style="padding:10px 0;white-space:pre-wrap">${message}</td></tr>
        </table>
        <p style="margin:24px 0 0;font-size:12px;color:#64748b">Hit Reply to respond directly to ${name}.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Error sending email:', err);
    // Still redirect — message is saved; email failure is non-fatal
  }

  res.redirect('/thank-you');
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
