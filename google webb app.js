function doPost(e) {
  try {
    const data = e.parameter;

    // Use recipients from form data or fallback to hardcoded
    const recipients = [
      data.to || "Dariusm.adi@gmail.com",
      "calebkennedy747@gmail.com"
    ];
    
    // Use the subject from form data or create a dynamic one
    const subject = data.subject || `New Contact Request from ${data.name || 'Website Form'}`;
    
    // Use the formatted body from form data if available, otherwise create one
    let body;
    if (data.body) {
      body = data.body;
    } else {
      body = `
New Contact Request from Fresh Start Driving Website

Name: ${data.name || 'N/A'}
Email: ${data.email || 'N/A'}
Phone: ${data.phone || 'N/A'}
Service Interested In: ${data.service || 'N/A'}

Message:
${data.message || 'N/A'}

---
This message was sent from the Fresh Start Driving Academy contact form.
      `.trim();
    }

    // Send email to all recipients
    recipients.forEach(recipient => {
      MailApp.sendEmail(recipient, subject, body);
    });
    
    return ContentService.createTextOutput("Email sent successfully!")
      .setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService.createTextOutput("Error: " + err.message)
      .setMimeType(ContentService.MimeType.TEXT);
  }
}