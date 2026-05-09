const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

const pages = ['', 'skills', 'experience', 'projects', 'education', 'certifications', 'contact', 'thank-you'];
pages.forEach(p => {
  app.get(`/${p}`, (req, res) => {
    const file = p === '' ? 'index' : p;
    res.sendFile(path.join(__dirname, '..', 'public', `${file}.html`));
  });
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

app.post('/submit-form', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send('All fields are required.');
  }

  try {
    await transporter.sendMail({
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
    });
  } catch (err) {
    console.error('Email error:', err);
    return res.status(500).send('Failed to send message. Please try again.');
  }

  res.redirect('/thank-you');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
