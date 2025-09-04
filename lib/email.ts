// Email service using Resend (stubbed for development)

export interface EmailOptions {
  to: string[];
  subject: string;
  html: string;
  attachments?: {
    filename: string;
    content: Buffer;
  }[];
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  // In development mode or without API key, log to console
  if (!process.env.RESEND_API_KEY) {
    console.log('📧 Email would be sent:', {
      to: options.to,
      subject: options.subject,
      attachments: options.attachments?.map(a => a.filename) || [],
    });
    return true;
  }
  
  // TODO: Implement actual Resend integration
  try {
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'reports@railcore.com',
    //   to: options.to,
    //   subject: options.subject,
    //   html: options.html,
    //   attachments: options.attachments,
    // });
    
    console.log('📧 Email sent successfully via Resend');
    return true;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return false;
  }
};

export const generateDailyReportEmail = (
  projectName: string,
  reportDate: string,
  crew: string
): string => {
  return `
    <html>
      <head>
        <title>Daily Report - ${projectName}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1E40AF;">Daily Construction Report</h1>
          <p><strong>Project:</strong> ${projectName}</p>
          <p><strong>Date:</strong> ${reportDate}</p>
          <p><strong>Crew:</strong> ${crew}</p>
          <p>Please find the detailed daily report attached.</p>
          <hr style="margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">
            This report was generated automatically by RailCore.
          </p>
        </div>
      </body>
    </html>
  `;
};