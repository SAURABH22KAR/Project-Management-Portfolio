const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const { check, validationResult } = require('express-validator');

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();

// Connect to MongoDB using MONGO_URI from .env
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, 
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files (e.g., HTML, CSS)
app.use(express.static('public'));

// Root route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// POST route to handle form submission with validation
app.post('/submit-form', [
  check('name', 'Name is required').notEmpty(),
  check('email', 'Email is invalid').isEmail(),
  check('message', 'Message is required').notEmpty()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, message } = req.body;

  const newContact = new Contact({ name, email, message });

  newContact.save()
    .then(() => res.redirect('/thank-you.html'))
    .catch(err => {
      console.error('Error saving message:', err);
      res.status(500).send('An error occurred. Please try again.');
    });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
