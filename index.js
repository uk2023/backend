const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());


mongoose.connect('mongodb+srv://user:password%40123@cluster0.ttgsxst.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const InternshipForm = mongoose.model('InternshipForm', {
  name: String,
  email: String,
  phone: String,
  institution: String,
  course: String,
  year: String,
  domain: String,
});

const EnquiryForm = mongoose.model('EnquiryForm', {
  name: String,
  email: String,
  phone: String,
  message: String,
  category: String,
});

const Message = mongoose.model('Message', {
  name: String,
  email: String,
  message: String,
});

app.post('/internship', async (req, res) => {
  try {
    const { name, email, phone, institution, course, year, domain } = req.body;
    const form = new InternshipForm({ name, email, phone, institution, course, year, domain });
    await form.save();
    res.status(200).json(form);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to handle enquiry form submissions
app.post('/enquiry', async (req, res) => {
  try {
    const { name, email, phone, message, category } = req.body;
    const enquiryForm = new EnquiryForm({ name, email, phone, message, category });
    await enquiryForm.save();
    res.status(200).json(enquiryForm);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to handle Message submissions
app.post('/message', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const Message = new EnquiryForm({ name, email, message });
    await Message.save();
    res.status(200).json(Message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
