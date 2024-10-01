const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();

// Connect to MongoDB using MONGO_URI from .env
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define Mongoose schema and model for form data
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  date: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// Serve static files (e.g., HTML, CSS)
app.use(express.static('public'));

// POST route to handle form submission
app.post('/submit-form', (req, res) => {
  const { name, email, message } = req.body;

  // Create new contact entry
  const newContact = new Contact({ name, email, message });

  // Save to MongoDB
  newContact.save()
    .then(() => res.redirect('/thank-you.html'))  // Redirect to the thank-you page after saving
    .catch(err => {
      console.error('Error saving message:', err);
      res.status(500).send('An error occurred. Please try again.'); // Handle error if saving fails
    });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
