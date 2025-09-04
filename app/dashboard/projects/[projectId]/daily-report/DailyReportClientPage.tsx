'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/ui/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getDailyReportsByProject, createDailyReport } from '@/lib/db';
import { getUser } from '@/lib/supabase';
import { FileText, Send, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import type { Project, DailyReport } from '@/types/models';

interface DailyReportClientPageProps {
  project: Project;
  projectId: string;
}

export default function DailyReportClientPage({ project, projectId }: DailyReportClientPageProps) {
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [reportDate, setReportDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [crew, setCrew] = useState('');
  const [activities, setActivities] = useState('');
  const [quantities, setQuantities] = useState('');
  const [blockers, setBlockers] = useState('');

  useEffect(() => {
    const initialize = async () => {
      try {
        const reportsData = await getDailyReportsByProject(projectId);
        setReports(reportsData);
      } catch (error) {
        console.error('Error loading daily reports:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crew.trim() || !activities.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const user = await getUser();
      if (!user) throw new Error('User not authenticated');

      const report = await createDailyReport({
        project_id: projectId,
        report_date: reportDate,
        crew: crew.trim(),
        activities: activities.trim(),
        quantities: quantities.trim() || undefined,
        blockers: blockers.trim() || undefined,
        photos: [], // TODO: Implement photo upload
        created_by: user.id,
      });

      // Generate and send PDF
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          reportId: report.id,
          projectName: project?.name 
        }),
      });

      if (response.ok) {
        const { pdfUrl } = await response.json();
        
        // Send email
        await fetch('/api/reports/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            projectId,
            pdfUrl,
            reportDate: format(new Date(reportDate), 'PPP'),
            crew: crew.trim()
          }),
        });
      }

      // Refresh reports list
      const reportsData = await getDailyReportsByProject(projectId);
      setReports(reportsData);
      
      // Reset form
      setCrew('');
      setActivities('');
      setQuantities('');
      setBlockers('');
      setReportDate(format(new Date(), 'yyyy-MM-dd'));
      
      alert('Daily report submitted and sent successfully!');
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daily Reports</h1>
          <p className="mt-1 text-sm text-gray-500">
            Project: {project?.name}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* New Report Form */}
          <Card>
            <CardHeader>
              <CardTitle>Create Daily Report</CardTitle>
              <CardDescription>
                Submit today's construction activities and progress.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Report Date
                  </label>
                  <Input
                    type="date"
                    value={reportDate}
                    onChange={(e) => setReportDate(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Crew
                  </label>
                  <Input
                    value={crew}
                    onChange={(e) => setCrew(e.target.value)}
                    placeholder="John Smith, Mike Johnson, Sarah Davis"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Activities <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={activities}
                    onChange={(e) => setActivities(e.target.value)}
                    placeholder="Describe today's construction activities..."
                    rows={4}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantities (Optional)
                  </label>
                  <Textarea
                    value={quantities}
                    onChange={(e) => setQuantities(e.target.value)}
                    placeholder="Track materials, labor hours, or other quantities..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Blockers/Issues (Optional)
                  </label>
                  <Textarea
                    value={blockers}
                    onChange={(e) => setBlockers(e.target.value)}
                    placeholder="Any issues, delays, or concerns..."
                    rows={3}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit & Send Report
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>
                Previously submitted daily reports for this project.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reports.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No reports yet</p>
                  </div>
                ) : (
                  reports.slice(0, 10).map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {format(new Date(report.report_date), 'MMM d, yyyy')}
                        </p>
                        <p className="text-sm text-gray-500">
                          Crew: {report.crew}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {report.pdf_url && (
                          <Button size="sm" variant="outline">
                            <FileText className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}