const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs').promises;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.')); // Serve static files (HTML, CSS, JS)

// Ensure submissions directory exists
const submissionsDir = path.join(__dirname, 'submissions');
fs.mkdir(submissionsDir, { recursive: true }).catch(console.error);

// Email configuration (optional - only if EMAIL_ENABLED=true in .env)
let transporter = null;
if (process.env.EMAIL_ENABLED === 'true') {
    const nodemailer = require('nodemailer');
    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
}

// Helper function to save submission to file
async function saveSubmission(type, data) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${type}_${timestamp}.json`;
    const filepath = path.join(submissionsDir, filename);
    
    const submission = {
        type: type,
        timestamp: new Date().toISOString(),
        data: data
    };
    
    await fs.writeFile(filepath, JSON.stringify(submission, null, 2), 'utf8');
    return filepath;
}

// Helper function to send email (optional)
async function sendEmail(subject, htmlContent, textContent) {
    if (!transporter || !process.env.RECIPIENT_EMAIL) {
        console.log('Email not configured, skipping email send');
        return;
    }
    
    try {
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.RECIPIENT_EMAIL,
            subject: subject,
            text: textContent,
            html: htmlContent
        });
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

// API Routes

// Contact form submission
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({ 
                success: false, 
                error: 'Name, Email und Nachricht sind erforderlich' 
            });
        }
        
        // Save to file
        await saveSubmission('contact', { name, email, subject, message });
        
        // Send email notification (if enabled)
        const emailSubject = `Neue Kontaktanfrage: ${subject || 'Kein Betreff'}`;
        const emailHtml = `
            <h2>Neue Kontaktanfrage</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Betreff:</strong> ${subject || 'Kein Betreff'}</p>
            <p><strong>Nachricht:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
        `;
        const emailText = `
Neue Kontaktanfrage
Name: ${name}
Email: ${email}
Betreff: ${subject || 'Kein Betreff'}
Nachricht: ${message}
        `;
        
        await sendEmail(emailSubject, emailHtml, emailText);
        
        res.json({ 
            success: true, 
            message: 'Ihre Nachricht wurde erfolgreich gesendet!' 
        });
    } catch (error) {
        console.error('Error processing contact form:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Fehler beim Senden der Nachricht' 
        });
    }
});

// Application form (Anmeldung) submission
app.post('/api/application', async (req, res) => {
    try {
        const formData = req.body;
        
        // Save to file
        await saveSubmission('application', formData);
        
        // Send email notification
        const emailSubject = 'Neue Anmeldung - IGS Simex';
        const emailHtml = `
            <h2>Neue Anmeldung erhalten</h2>
            <pre>${JSON.stringify(formData, null, 2)}</pre>
        `;
        const emailText = `Neue Anmeldung erhalten:\n\n${JSON.stringify(formData, null, 2)}`;
        
        await sendEmail(emailSubject, emailHtml, emailText);
        
        res.json({ 
            success: true, 
            message: 'Anmeldung wurde erfolgreich übermittelt!' 
        });
    } catch (error) {
        console.error('Error processing application:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Fehler beim Übermitteln der Anmeldung' 
        });
    }
});

// Leave request (Beurlaubung) submission
app.post('/api/leave-request', async (req, res) => {
    try {
        const formData = req.body;
        
        await saveSubmission('leave-request', formData);
        
        const emailSubject = 'Neuer Beurlaubungsantrag';
        const emailHtml = `
            <h2>Neuer Beurlaubungsantrag</h2>
            <pre>${JSON.stringify(formData, null, 2)}</pre>
        `;
        const emailText = `Neuer Beurlaubungsantrag:\n\n${JSON.stringify(formData, null, 2)}`;
        
        await sendEmail(emailSubject, emailHtml, emailText);
        
        res.json({ 
            success: true, 
            message: 'Beurlaubungsantrag wurde erfolgreich übermittelt!' 
        });
    } catch (error) {
        console.error('Error processing leave request:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Fehler beim Übermitteln des Antrags' 
        });
    }
});

// Lunch registration (Mittagessen-Anmeldung)
app.post('/api/lunch-registration', async (req, res) => {
    try {
        const formData = req.body;
        
        await saveSubmission('lunch-registration', formData);
        
        const emailSubject = 'Neue Mittagessen-Anmeldung';
        const emailHtml = `
            <h2>Neue Mittagessen-Anmeldung</h2>
            <pre>${JSON.stringify(formData, null, 2)}</pre>
        `;
        const emailText = `Neue Mittagessen-Anmeldung:\n\n${JSON.stringify(formData, null, 2)}`;
        
        await sendEmail(emailSubject, emailHtml, emailText);
        
        res.json({ 
            success: true, 
            message: 'Mittagessen-Anmeldung wurde erfolgreich übermittelt!' 
        });
    } catch (error) {
        console.error('Error processing lunch registration:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Fehler beim Übermitteln der Anmeldung' 
        });
    }
});

// Generic form submission endpoint
app.post('/api/submit-form', async (req, res) => {
    try {
        const { formType, formData } = req.body;
        
        if (!formType) {
            return res.status(400).json({ 
                success: false, 
                error: 'Formulartyp ist erforderlich' 
            });
        }
        
        await saveSubmission(formType, formData);
        
        const emailSubject = `Neue Formular-Einsendung: ${formType}`;
        const emailHtml = `
            <h2>Neue Formular-Einsendung: ${formType}</h2>
            <pre>${JSON.stringify(formData, null, 2)}</pre>
        `;
        const emailText = `Neue Formular-Einsendung: ${formType}\n\n${JSON.stringify(formData, null, 2)}`;
        
        await sendEmail(emailSubject, emailHtml, emailText);
        
        res.json({ 
            success: true, 
            message: 'Formular wurde erfolgreich übermittelt!' 
        });
    } catch (error) {
        console.error('Error processing form submission:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Fehler beim Übermitteln des Formulars' 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString() 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
    console.log(`📁 Einsendungen werden gespeichert in: ${submissionsDir}`);
    if (transporter) {
        console.log(`📧 Email-Versand ist aktiviert`);
    } else {
        console.log(`📧 Email-Versand ist deaktiviert (siehe .env)`);
    }
});
