import { NextRequest, NextResponse } from 'next/server';
// import { createServerClient, getUser } from '@/lib/supabase';
import { generateDailyReportPDF } from '@/lib/pdf';
import type { DailyReport } from '@/types/models';

export async function POST(request: NextRequest) {
  try {
    const { reportId, projectName } = await request.json();
    
    if (!reportId || !projectName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Mock report for development
    const report: DailyReport = {
      id: reportId,
      project_id: 'mock-project',
      report_date: new Date().toISOString().split('T')[0],
      crew: 'Demo Crew',
      activities: 'Mock activities for development',
      quantities: 'Mock quantities',
      blockers: 'No blockers',
      photos: [],
      created_by: 'demo-user',
      created_at: new Date().toISOString()
    };

    // Generate PDF
    const pdfBytes = await generateDailyReportPDF(report as DailyReport, projectName);
    
    // Mock PDF URL for development
    const mockPdfUrl = 'https://example.com/mock-daily-report.pdf';
    
    console.log('📄 PDF generated successfully (mock mode)');
    return NextResponse.json({ pdfUrl: mockPdfUrl });

  } catch (error) {
    console.error('Error generating report PDF:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}