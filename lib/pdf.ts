import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import type { DailyReport, PunchItem, ChecklistSubmission, ChecklistTemplate } from '@/types/models';
import { format } from 'date-fns';

export const generateDailyReportPDF = async (
  report: DailyReport,
  projectName: string
): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // Letter size
  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const { width, height } = page.getSize();
  const margin = 50;
  
  let yPosition = height - margin;
  
  // Header
  page.drawText('Daily Construction Report', {
    x: margin,
    y: yPosition,
    size: 20,
    font: boldFont,
    color: rgb(0.118, 0.251, 0.686), // Primary blue
  });
  
  yPosition -= 40;
  
  // Project and Date
  page.drawText(`Project: ${projectName}`, {
    x: margin,
    y: yPosition,
    size: 14,
    font: boldFont,
  });
  
  page.drawText(`Date: ${format(new Date(report.report_date), 'PPP')}`, {
    x: width - margin - 150,
    y: yPosition,
    size: 14,
    font: boldFont,
  });
  
  yPosition -= 30;
  
  // Crew
  page.drawText('Crew:', {
    x: margin,
    y: yPosition,
    size: 12,
    font: boldFont,
  });
  
  page.drawText(report.crew, {
    x: margin + 40,
    y: yPosition,
    size: 12,
    font,
  });
  
  yPosition -= 30;
  
  // Activities
  page.drawText('Activities:', {
    x: margin,
    y: yPosition,
    size: 12,
    font: boldFont,
  });
  
  yPosition -= 20;
  
  const activityLines = report.activities.split('\n');
  for (const line of activityLines) {
    if (yPosition < margin + 50) break;
    page.drawText(line, {
      x: margin,
      y: yPosition,
      size: 10,
      font,
    });
    yPosition -= 15;
  }
  
  yPosition -= 20;
  
  // Quantities (if provided)
  if (report.quantities) {
    page.drawText('Quantities:', {
      x: margin,
      y: yPosition,
      size: 12,
      font: boldFont,
    });
    
    yPosition -= 20;
    
    const quantityLines = report.quantities.split('\n');
    for (const line of quantityLines) {
      if (yPosition < margin + 50) break;
      page.drawText(line, {
        x: margin,
        y: yPosition,
        size: 10,
        font,
      });
      yPosition -= 15;
    }
    
    yPosition -= 20;
  }
  
  // Blockers (if any)
  if (report.blockers) {
    page.drawText('Blockers/Issues:', {
      x: margin,
      y: yPosition,
      size: 12,
      font: boldFont,
    });
    
    yPosition -= 20;
    
    const blockerLines = report.blockers.split('\n');
    for (const line of blockerLines) {
      if (yPosition < margin + 50) break;
      page.drawText(line, {
        x: margin,
        y: yPosition,
        size: 10,
        font,
      });
      yPosition -= 15;
    }
  }
  
  // Footer
  page.drawText(`Generated on ${format(new Date(), 'PPP')}`, {
    x: margin,
    y: 30,
    size: 8,
    font,
    color: rgb(0.5, 0.5, 0.5),
  });
  
  return await pdfDoc.save();
};

export const generatePunchListPDF = async (
  items: PunchItem[],
  projectName: string
): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]);
  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const { width, height } = page.getSize();
  const margin = 50;
  
  let yPosition = height - margin;
  
  // Header
  page.drawText('Punch List Report', {
    x: margin,
    y: yPosition,
    size: 20,
    font: boldFont,
    color: rgb(0.118, 0.251, 0.686),
  });
  
  yPosition -= 30;
  
  page.drawText(`Project: ${projectName}`, {
    x: margin,
    y: yPosition,
    size: 14,
    font: boldFont,
  });
  
  yPosition -= 40;
  
  // Items
  for (const item of items) {
    if (yPosition < margin + 100) {
      // Add new page if needed
      const newPage = pdfDoc.addPage([612, 792]);
      yPosition = height - margin;
    }
    
    page.drawText(`${item.title}`, {
      x: margin,
      y: yPosition,
      size: 12,
      font: boldFont,
    });
    
    page.drawText(`Status: ${item.status.replace('_', ' ').toUpperCase()}`, {
      x: width - margin - 120,
      y: yPosition,
      size: 10,
      font,
    });
    
    yPosition -= 20;
    
    if (item.description) {
      page.drawText(item.description, {
        x: margin,
        y: yPosition,
        size: 10,
        font,
      });
      yPosition -= 15;
    }
    
    if (item.assignee) {
      page.drawText(`Assignee: ${item.assignee}`, {
        x: margin,
        y: yPosition,
        size: 10,
        font,
        color: rgb(0.5, 0.5, 0.5),
      });
      yPosition -= 15;
    }
    
    yPosition -= 10;
  }
  
  return await pdfDoc.save();
};

export const generateChecklistPDF = async (
  submission: ChecklistSubmission,
  template: ChecklistTemplate,
  projectName: string
): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]);
  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const { width, height } = page.getSize();
  const margin = 50;
  
  let yPosition = height - margin;
  
  // Header
  page.drawText('Checklist Report', {
    x: margin,
    y: yPosition,
    size: 20,
    font: boldFont,
    color: rgb(0.118, 0.251, 0.686),
  });
  
  yPosition -= 30;
  
  page.drawText(`Project: ${projectName}`, {
    x: margin,
    y: yPosition,
    size: 14,
    font: boldFont,
  });
  
  yPosition -= 20;
  
  page.drawText(`Checklist: ${template.name}`, {
    x: margin,
    y: yPosition,
    size: 14,
    font: boldFont,
  });
  
  yPosition -= 40;
  
  // Fields and Values
  for (const field of template.fields) {
    if (yPosition < margin + 50) break;
    
    const value = submission.values[field.key];
    const displayValue = field.type === 'boolean' 
      ? (value ? '✓ Yes' : '✗ No')
      : String(value || 'N/A');
    
    page.drawText(`${field.label}:`, {
      x: margin,
      y: yPosition,
      size: 12,
      font: boldFont,
    });
    
    page.drawText(displayValue, {
      x: margin + 150,
      y: yPosition,
      size: 12,
      font,
    });
    
    yPosition -= 25;
  }
  
  return await pdfDoc.save();
};