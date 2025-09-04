import { NextRequest, NextResponse } from 'next/server';
// import { createServerClient } from '@/lib/supabase';
import { generateChecklistPDF } from '@/lib/pdf';
import type { ChecklistSubmission, ChecklistTemplate } from '@/types/models';

export async function POST(request: NextRequest) {
  try {
    const { submissionId, projectName } = await request.json();
    
    if (!submissionId || !projectName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Mock data for development
    const submission: ChecklistSubmission = {
      id: submissionId,
      project_id: 'mock-project',
      template_id: 'mock-template',
      values: { inspector: 'John Doe', safety_briefing: true },
      created_by: 'demo-user',
      created_at: new Date().toISOString()
    };

    const template: ChecklistTemplate = {
      id: 'mock-template',
      org_id: 'mock-org',
      name: 'Daily Safety Checklist',
      fields: [
        { key: 'inspector', label: 'Inspector Name', type: 'text' },
        { key: 'safety_briefing', label: 'Safety briefing completed', type: 'boolean' }
      ],
      created_at: new Date().toISOString()
    };

    // Generate PDF
    const pdfBytes = await generateChecklistPDF(
      submission as ChecklistSubmission,
      template as ChecklistTemplate,
      projectName
    );

    // Return PDF as blob for immediate download
    const fileName = `checklist-${template.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.pdf`;
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });

  } catch (error) {
    console.error('Error exporting checklist PDF:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}