const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serves HTML, CSS, JS from the folder

// Email Transporter Setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'sofsofsusu2@gmail.com',
        pass: process.env.EMAIL_PASS
    }
});

// Contact Route
app.post('/api/contact', async (req, res) => {
    const { name, phone, email, requirementType, message } = req.body;

    if (!name || !phone || !email) {
        return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
    }

    const mailOptions = {
        from: `"${name}" <${process.env.EMAIL_USER || 'sofsofsusu2@gmail.com'}>`,
        to: process.env.ADMIN_RECEIVER || 'sofsofsusu2@gmail.com',
        subject: `New Lead [${(requirementType || 'General').toUpperCase()}]: ${name}`,
        html: `
            <h2>New Consultation Request</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Objective:</strong> ${requirementType || 'N/A'}</p>
            <p><strong>Message:</strong><br>${message || 'No message provided.'}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Inquiry sent successfully.' });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ success: false, message: 'Failed to send inquiry.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});