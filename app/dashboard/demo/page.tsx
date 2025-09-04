'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/ui/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createOrg, createProject, createDailyReport, createPunchItem, createChecklistTemplate } from '@/lib/db';
import { getUser } from '@/lib/supabase';
import { Database, Loader2, CheckCircle, Play } from 'lucide-react';

export default function DemoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [progress, setProgress] = useState<string[]>([]);
  const router = useRouter();

  const addProgress = (step: string) => {
    setProgress(prev => [...prev, step]);
  };

  const seedDemoData = async () => {
    setIsLoading(true);
    setProgress([]);
    
    try {
      const user = await getUser();
      if (!user) throw new Error('User not authenticated');

      // Create demo organization
      addProgress('Creating demo organization...');
      const org = await createOrg('Demo Railroad Company');
      
      // Create demo project
      addProgress('Creating demo project...');
      const project = await createProject({
        org_id: org.id,
        name: 'Main Line Extension Phase 2',
        description: 'Extension of main rail line from Station A to Station B, including bridges and signal installations.',
        distribution_list: [
          'project.manager@railroad.com',
          'safety.officer@railroad.com',
          'inspector@dot.gov'
        ],
        created_by: user.id,
      });

      // Create demo daily report
      addProgress('Adding sample daily report...');
      await createDailyReport({
        project_id: project.id,
        report_date: new Date().toISOString().split('T')[0],
        crew: 'John Smith (Foreman), Mike Johnson (Operator), Sarah Davis (Laborer)',
        activities: 'Completed track laying for section 4A-4B (500 linear feet)\nInstalled 12 concrete ties\nTested rail alignment and grade\nConducted safety briefing at 7:00 AM\nBegan excavation for signal foundation at mile marker 15.2',
        quantities: 'Track: 500 linear feet\nConcrete ties: 12 units\nBallast: 45 tons\nLabor hours: 24 man-hours',
        blockers: 'Weather delay expected tomorrow due to forecasted rain\nWaiting for delivery of signal equipment (delayed by vendor)',
        photos: [],
        created_by: user.id,
      });

      // Create demo punch items
      addProgress('Creating sample punch list items...');
      await createPunchItem({
        project_id: project.id,
        title: 'Fix handrail installation at Bridge 12',
        description: 'Handrail height does not meet AREMA standards. Needs to be raised by 4 inches.',
        assignee: 'Mike Johnson',
        status: 'open',
        photos: [],
        created_by: user.id,
      });

      await createPunchItem({
        project_id: project.id,
        title: 'Repair concrete crack in platform',
        description: 'Small crack discovered in platform concrete at Station B. Requires patching.',
        assignee: 'Sarah Davis',
        status: 'in_progress',
        photos: [],
        created_by: user.id,
      });

      await createPunchItem({
        project_id: project.id,
        title: 'Install missing warning signage',
        description: 'Safety signage missing at crossing near mile marker 14.8.',
        assignee: 'John Smith',
        status: 'done',
        photos: [],
        created_by: user.id,
      });

      // Create demo checklist template
      addProgress('Setting up quality checklist template...');
      await createChecklistTemplate({
        org_id: org.id,
        name: 'Daily Safety Checklist',
        fields: [
          { key: 'inspector', label: 'Inspector Name', type: 'text', required: true },
          { key: 'safety_briefing', label: 'Safety briefing completed', type: 'boolean', required: true },
          { key: 'ppe_check', label: 'All crew wearing proper PPE', type: 'boolean', required: true },
          { key: 'equipment_inspection', label: 'Equipment pre-use inspection completed', type: 'boolean', required: true },
          { key: 'weather_conditions', label: 'Weather conditions', type: 'text', required: true },
          { key: 'temperature', label: 'Temperature (°F)', type: 'number', required: false },
          { key: 'hazards_identified', label: 'Any hazards identified and mitigated', type: 'boolean', required: true },
          { key: 'notes', label: 'Additional safety notes', type: 'text', required: false },
        ],
        created_by: user.id,
      });

      addProgress('Demo data created successfully!');
      setCompleted(true);
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating demo data:', error);
      alert('Failed to create demo data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Demo Setup</h1>
          <p className="mt-2 text-gray-600">
            Create sample data to explore RailCore's features
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5 text-blue-600" />
              Generate Demo Data
            </CardTitle>
            <CardDescription>
              This will create a sample organization, project, daily reports, punch list items, 
              and checklist templates to demonstrate the platform's capabilities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!completed ? (
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-medium text-amber-800 mb-2">What will be created:</h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Demo Railroad Company organization</li>
                    <li>• Main Line Extension Phase 2 project</li>
                    <li>• Sample daily report with crew activities</li>
                    <li>• Three punch list items with different statuses</li>
                    <li>• Daily Safety Checklist template</li>
                    <li>• Distribution list with sample stakeholder emails</li>
                  </ul>
                </div>

                {progress.length > 0 && (
                  <div className="space-y-2">
                    {progress.map((step, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                        {step}
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  onClick={seedDemoData}
                  disabled={isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Setting up demo data...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-5 w-5" />
                      Create Demo Data
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Demo Data Created Successfully!
                </h3>
                <p className="text-gray-600 mb-4">
                  Redirecting to your dashboard...
                </p>
                <Button onClick={() => router.push('/dashboard')}>
                  Go to Dashboard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Feature Overview */}
        <Card>
          <CardHeader>
            <CardTitle>What you can explore:</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">📁 Repository</h4>
                <p className="text-gray-600">Upload and organize project files with tags and GPS coordinates.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">📋 Daily Reports</h4>
                <p className="text-gray-600">Generate professional PDF reports and email distribution.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">✅ Punch Lists</h4>
                <p className="text-gray-600">Track and manage project defects with status updates.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">📝 Quality Checklists</h4>
                <p className="text-gray-600">Create custom inspection forms and digital submissions.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}