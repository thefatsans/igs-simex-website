const handler = async (req, res) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name, Email und Nachricht sind erforderlich' 
      });
    }
    
    // TODO: Save to database or send email
    // For now, just return success
    
    // Email notification (optional - requires email service)
    // You can integrate with SendGrid, Resend, or similar here
    
    return res.status(200).json({ 
      success: true, 
      message: 'Ihre Nachricht wurde erfolgreich gesendet!' 
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Fehler beim Senden der Nachricht' 
    });
  }
};

module.exports = handler;
