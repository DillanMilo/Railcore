'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/ui/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getUser } from '@/lib/supabase';
import { Plus, Search, FileText, Calendar, User, Download, Eye, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface DailyReportSummary {
  id: string;
  date: string;
  project: string;
  crew: string;
  activitiesSummary: string;
  status: 'draft' | 'submitted' | 'approved';
  submittedBy: string;
  submittedAt: string;
  pdfUrl?: string;
}

export default function DailyReportsPage() {
  const [reports, setReports] = useState<DailyReportSummary[]>([
    {
      id: '1',
      date: '2024-01-25',
      project: 'Main Line Extension Phase 2',
      crew: 'John Smith (Foreman), Mike Johnson, Sarah Davis',
      activitiesSummary: 'Completed track laying for section 4A-4B, installed concrete ties, tested alignment',
      status: 'approved',
      submittedBy: 'John Smith',
      submittedAt: '2024-01-25T17:30:00Z',
      pdfUrl: 'mock-url'
    },
    {
      id: '2',
      date: '2024-01-24',
      project: 'Main Line Extension Phase 2',
      crew: 'John Smith (Foreman), Tom Wilson, Alex Brown',
      activitiesSummary: 'Excavation for signal foundation, ballast placement, safety briefing',
      status: 'submitted',
      submittedBy: 'John Smith',
      submittedAt: '2024-01-24T16:45:00Z',
      pdfUrl: 'mock-url'
    },
    {
      id: '3',
      date: '2024-01-23',
      project: 'Bridge Construction',
      crew: 'Lisa Chen (Supervisor), Mark Taylor, Jennifer Lee',
      activitiesSummary: 'Bridge deck preparation, rebar installation, concrete pour preparation',
      status: 'approved',
      submittedBy: 'Lisa Chen',
      submittedAt: '2024-01-23T18:00:00Z',
      pdfUrl: 'mock-url'
    },
    {
      id: '4',
      date: '2024-01-22',
      project: 'Signal Installation',
      crew: 'David Kim (Technician), Robert Johnson',
      activitiesSummary: 'Signal cabinet installation, cable routing, system testing',
      status: 'draft',
      submittedBy: 'David Kim',
      submittedAt: '2024-01-22T15:20:00Z'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredReports, setFilteredReports] = useState<DailyReportSummary[]>(reports);

  useEffect(() => {
    const filtered = reports.filter(report =>
      report.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.crew.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.activitiesSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.submittedBy.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredReports(filtered);
  }, [searchQuery, reports]);

  const getStatusColor = (status: DailyReportSummary['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'submitted': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Daily Reports</h1>
            <p className="mt-1 text-sm text-gray-500">
              Submit and manage daily construction reports
            </p>
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search Daily Reports"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Reports Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Crew
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted By
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                          <div className="text-sm font-medium text-gray-900">
                            {format(new Date(report.date), 'MMM d, yyyy')}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {report.project}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {report.crew}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4 text-gray-400" />
                          <div className="text-sm text-gray-900">
                            {report.submittedBy}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {report.pdfUrl && (
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No daily reports found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? 'Try adjusting your search terms.' : 'Create your first daily report to get started.'}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}