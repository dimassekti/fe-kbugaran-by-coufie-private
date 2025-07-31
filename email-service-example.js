// Example backend email service implementation
// This would go in your backend (Node.js/Express) server

// First, install required packages:
// npm install nodemailer dotenv

const nodemailer = require("nodemailer");
require("dotenv").config();

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: "gmail", // or your email service
    auth: {
      user: process.env.EMAIL_USER, // your email
      pass: process.env.EMAIL_PASSWORD, // your app password
    },
  });
};

// API endpoint for sending emails
// Place this in your Express.js server
app.post("/api/send-email", async (req, res) => {
  try {
    const { to, subject, html } = req.body;

    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: html,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send email",
    });
  }
});

// Environment variables to add to your .env file:
// EMAIL_USER=your-email@gmail.com
// EMAIL_PASSWORD=your-app-password

// Alternative: Using EmailJS (Frontend-only solution)
// 1. Go to https://www.emailjs.com/
// 2. Create an account and get your service ID, template ID, and public key
// 3. Install EmailJS: npm install @emailjs/browser
// 4. Replace the sendEmailToYourEmail function in AboutPage.jsx with:

/*
import emailjs from '@emailjs/browser';

const sendEmailToYourEmail = async (data) => {
  try {
    const templateParams = {
      from_name: data.name,
      from_email: data.email,
      to_email: 'your-email@example.com',
      message: data.message
    };

    const result = await emailjs.send(
      'YOUR_SERVICE_ID',
      'YOUR_TEMPLATE_ID', 
      templateParams,
      'YOUR_PUBLIC_KEY'
    );

    return { success: true };
  } catch (error) {
    console.error('EmailJS error:', error);
    return { success: false, error: error.message };
  }
};
*/

module.exports = { createTransporter };
