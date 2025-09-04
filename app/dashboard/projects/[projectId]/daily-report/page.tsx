import { getProject } from '@/lib/db';
import { notFound } from 'next/navigation';
import DailyReportClientPage from './DailyReportClientPage';

interface DailyReportPageProps {
  params: {
    projectId: string;
  };
}

export default async function DailyReportPage({ params }: DailyReportPageProps) {
  const { projectId } = params;
  
  const project = await getProject(projectId);
  
  if (!project) {
    notFound();
  }

  return <DailyReportClientPage project={project} projectId={projectId} />;
}