import { NextRequest, NextResponse } from 'next/server';
// import { createServerClient } from '@/lib/supabase';
import { generatePunchListPDF } from '@/lib/pdf';
import type { PunchItem } from '@/types/models';

export async function POST(request: NextRequest) {
  try {
    const { projectId } = await request.json();
    
    if (!projectId) {
      return NextResponse.json(
        { error: 'Missing project ID' },
        { status: 400 }
      );
    }

    // Mock data for development
    const project = { name: 'Demo Project' };
    const punchItems: PunchItem[] = [
      {
        id: 'punch-1',
        project_id: projectId,
        title: 'Fix handrail installation',
        description: 'Handrail height does not meet standards',
        assignee: 'John Smith',
        status: 'open',
        photos: [],
        created_by: 'demo-user',
        created_at: new Date().toISOString()
      }
    ];

    // Generate PDF
    const pdfBytes = await generatePunchListPDF(punchItems as PunchItem[], project.name);

    // Return PDF as blob
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${project.name}-punch-list.pdf"`,
      },
    });

  } catch (error) {
    console.error('Error exporting punch list:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}