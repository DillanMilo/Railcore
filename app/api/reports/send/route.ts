import { NextRequest, NextResponse } from 'next/server';
// import { createServerClient } from '@/lib/supabase';
import { sendEmail, generateDailyReportEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { projectId, pdfUrl, reportDate, crew } = await request.json();
    
    if (!projectId || !pdfUrl || !reportDate || !crew) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Mock project for development
    const project = {
      name: 'Demo Project',
      distribution_list: ['manager@railroad.com', 'inspector@dot.gov']
    };

    if (project.distribution_list.length === 0) {
      return NextResponse.json(
        { error: 'No distribution list configured' },
        { status: 400 }
      );
    }

    // Mock PDF buffer for development
    const pdfBuffer = Buffer.from('Mock PDF content');

    // Send email
    const emailHtml = generateDailyReportEmail(project.name, reportDate, crew);
    
    const emailSent = await sendEmail({
      to: project.distribution_list,
      subject: `Daily Report - ${project.name} - ${reportDate}`,
      html: emailHtml,
      attachments: [
        {
          filename: `daily-report-${reportDate}.pdf`,
          content: Buffer.from(pdfBuffer),
        },
      ],
    });

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error sending report email:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}