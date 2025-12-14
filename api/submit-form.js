const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { formType, formData } = req.body;
    
    if (!formType) {
      return res.status(400).json({ 
        success: false, 
        error: 'Formulartyp ist erforderlich' 
      });
    }
    
    // TODO: Save formData to database or send email
    // For now, just return success
    
    return res.status(200).json({ 
      success: true, 
      message: 'Formular wurde erfolgreich übermittelt!' 
    });
  } catch (error) {
    console.error('Error processing form submission:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Fehler beim Übermitteln des Formulars' 
    });
  }
};

module.exports = handler;
