'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/ui/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { getUser } from '@/lib/supabase';
import { Plus, Search, ClipboardCheck, Calendar, User, MapPin, Edit, Trash2, Eye, FileText, Mail } from 'lucide-react';
import { format } from 'date-fns';

interface Inspection {
  id: string;
  date: string;
  type: string;
  inspector: string;
  location?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'failed';
  findings?: string;
  recommendations?: string;
  nextInspection?: string;
  project?: string;
  createdBy: string;
  createdAt: string;
}

interface Inspector {
  id: string;
  name: string;
  email: string;
  role: string;
  certifications?: string[];
}

export default function InspectionsPage() {
  const [inspections, setInspections] = useState<Inspection[]>([
    {
      id: '1',
      date: '2023-05-17T01:37:00',
      type: 'Geometry',
      inspector: 'Kobe Ankundung',
      location: 'Track Section A',
      status: 'completed',
      findings: 'Track alignment within acceptable tolerances. Minor gauge variations noted.',
      recommendations: 'Monitor gauge variations and schedule maintenance if needed.',
      nextInspection: '2023-08-17T01:37:00',
      project: 'Main Line Extension',
      createdBy: 'Quality Control',
      createdAt: '2023-05-17T01:37:00'
    },
    {
      id: '2',
      date: '2021-08-12T11:05:00',
      type: 'Crossties',
      inspector: 'Paul Bartley',
      location: 'Bridge Section',
      status: 'completed',
      findings: 'Several crossties showing signs of wear. Replacement recommended for 12 ties.',
      recommendations: 'Replace worn crossties within 30 days. Schedule follow-up inspection.',
      project: 'Bridge Maintenance',
      createdBy: 'Track Inspector',
      createdAt: '2021-08-12T11:05:00'
    },
    {
      id: '3',
      date: '2022-04-04T01:43:00',
      type: 'Gage',
      inspector: 'Rosalind McDermott',
      location: 'Curve Section B',
      status: 'completed',
      findings: 'Gauge measurements within FRA standards. No defects found.',
      recommendations: 'Continue regular monitoring schedule.',
      nextInspection: '2022-07-04T01:43:00',
      project: 'Curve Maintenance',
      createdBy: 'Track Supervisor',
      createdAt: '2022-04-04T01:43:00'
    },
    {
      id: '4',
      date: '2021-03-15T10:50:00',
      type: 'FRA Part 213',
      inspector: 'Jaron Kunze',
      location: 'Mile Post 15-20',
      status: 'completed',
      findings: 'Full compliance with FRA Part 213 regulations. All safety standards met.',
      recommendations: 'Maintain current maintenance schedule.',
      nextInspection: '2021-06-15T10:50:00',
      project: 'Regulatory Compliance',
      createdBy: 'FRA Inspector',
      createdAt: '2021-03-15T10:50:00'
    },
    {
      id: '5',
      date: '2022-10-23T02:52:00',
      type: 'Geometry',
      inspector: 'Kobe Ankundung',
      location: 'Junction Area',
      status: 'in_progress',
      findings: 'Inspection in progress. Preliminary findings show good condition.',
      project: 'Junction Upgrade',
      createdBy: 'Project Manager',
      createdAt: '2022-10-23T02:52:00'
    },
    {
      id: '6',
      date: '2023-04-01T08:52:00',
      type: 'Crossties',
      inspector: 'Rosalind McDermott',
      location: 'Station Platform',
      status: 'scheduled',
      project: 'Platform Renovation',
      createdBy: 'Station Manager',
      createdAt: '2023-04-01T08:52:00'
    },
    {
      id: '7',
      date: '2021-04-04T03:45:00',
      type: 'Gage',
      inspector: 'Paul Bartley',
      location: 'Yard Tracks',
      status: 'completed',
      findings: 'Minor gauge deviations found in tracks 3 and 5.',
      recommendations: 'Adjust gauge on tracks 3 and 5. Re-inspect within 2 weeks.',
      project: 'Yard Maintenance',
      createdBy: 'Yard Master',
      createdAt: '2021-04-04T03:45:00'
    },
    {
      id: '8',
      date: '2023-10-07T02:42:00',
      type: 'FRA Part 213',
      inspector: 'Jaron Kunze',
      location: 'Main Line Mile 25',
      status: 'failed',
      findings: 'Surface defects exceed FRA limits. Immediate corrective action required.',
      recommendations: 'Repair surface defects immediately. Restrict speed until repairs complete.',
      project: 'Emergency Repairs',
      createdBy: 'Safety Officer',
      createdAt: '2023-10-07T02:42:00'
    },
    {
      id: '9',
      date: '2022-06-10T06:32:00',
      type: 'Geometry',
      inspector: 'Kobe Ankundung',
      location: 'Tunnel Section',
      status: 'completed',
      findings: 'Geometry within acceptable parameters. Clearance verified.',
      recommendations: 'Continue regular inspection schedule.',
      nextInspection: '2022-09-10T06:32:00',
      project: 'Tunnel Maintenance',
      createdBy: 'Tunnel Inspector',
      createdAt: '2022-06-10T06:32:00'
    },
    {
      id: '10',
      date: '2020-03-17T07:53:00',
      type: 'Crossties',
      inspector: 'Rosalind McDermott',
      location: 'Approach Track',
      status: 'completed',
      findings: 'Crossties in good condition. No replacement needed.',
      recommendations: 'Continue monitoring. Next inspection in 6 months.',
      nextInspection: '2020-09-17T07:53:00',
      project: 'Approach Maintenance',
      createdBy: 'Track Foreman',
      createdAt: '2020-03-17T07:53:00'
    },
    {
      id: '11',
      date: '2025-08-20T04:06:00',
      type: 'Crossties',
      inspector: 'Paul Bartley',
      location: 'Switch Area',
      status: 'scheduled',
      project: 'Switch Upgrade',
      createdBy: 'Signal Maintainer',
      createdAt: '2025-08-20T04:06:00'
    }
  ]);

  const [inspectors] = useState<Inspector[]>([
    {
      id: '1',
      name: 'Kobe Ankundung',
      email: 'kobe_ankundung@example.com',
      role: 'Project Manager',
      certifications: ['FRA Part 213', 'Track Geometry', 'Safety Inspector']
    },
    {
      id: '2',
      name: 'Paul Bartley',
      email: 'paul.bartley@example.com',
      role: 'Senior Inspector',
      certifications: ['Track Inspector', 'Crossties Specialist']
    },
    {
      id: '3',
      name: 'Rosalind McDermott',
      email: 'rosalind.mcdermott@example.com',
      role: 'Track Supervisor',
      certifications: ['Track Geometry', 'Gauge Inspector']
    },
    {
      id: '4',
      name: 'Jaron Kunze',
      email: 'jaron.kunze@example.com',
      role: 'FRA Inspector',
      certifications: ['FRA Part 213', 'Federal Inspector']
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredInspections, setFilteredInspections] = useState<Inspection[]>(inspections);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [selectedInspector, setSelectedInspector] = useState<Inspector | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  // Form state
  const [type, setType] = useState('');
  const [inspector, setInspector] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [project, setProject] = useState('');
  const [findings, setFindings] = useState('');
  const [recommendations, setRecommendations] = useState('');

  useEffect(() => {
    const filtered = inspections.filter(inspection =>
      inspection.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inspection.inspector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inspection.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inspection.project?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredInspections(filtered);
  }, [searchQuery, inspections]);

  const handleCreateInspection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type.trim() || !inspector.trim() || !date) return;

    try {
      const user = await getUser();
      if (!user) throw new Error('User not authenticated');

      const newInspection: Inspection = {
        id: Date.now().toString(),
        date,
        type: type.trim(),
        inspector: inspector.trim(),
        location: location.trim() || undefined,
        status: 'scheduled',
        findings: findings.trim() || undefined,
        recommendations: recommendations.trim() || undefined,
        project: project.trim() || undefined,
        createdBy: user.email || 'Unknown',
        createdAt: new Date().toISOString()
      };

      setInspections([newInspection, ...inspections]);
      
      // Reset form
      setType('');
      setInspector('');
      setDate('');
      setLocation('');
      setProject('');
      setFindings('');
      setRecommendations('');
      setIsCreateOpen(false);
    } catch (error) {
      console.error('Error creating inspection:', error);
      alert('Failed to create inspection. Please try again.');
    }
  };

  const openInspectionDetails = (inspection: Inspection) => {
    setSelectedInspection(inspection);
    setIsDetailsOpen(true);
  };

  const openInspectorProfile = (inspectorName: string) => {
    const inspector = inspectors.find(i => i.name === inspectorName);
    if (inspector) {
      setSelectedInspector(inspector);
      setIsInspectorOpen(true);
    }
  };

  const getStatusColor = (status: Inspection['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Inspection['status']) => {
    switch (status) {
      case 'scheduled': return 'Scheduled';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'failed': return 'Failed';
      default: return status;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inspections</h1>
            <p className="mt-1 text-sm text-gray-500">
              Track quality control inspections and compliance checks
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <Button variant="outline" onClick={() => openInspectorProfile('Kobe Ankundung')}>
              <User className="mr-2 h-4 w-4" />
              Kobe Ankundung
            </Button>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="railcore-add-btn">
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Schedule Inspection</DialogTitle>
                  <DialogDescription>
                    Schedule a new quality control inspection.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateInspection} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Inspection Type <span className="text-red-500">*</span>
                      </label>
                      <Select value={type} onValueChange={setType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Geometry">Geometry</SelectItem>
                          <SelectItem value="Crossties">Crossties</SelectItem>
                          <SelectItem value="Gage">Gage</SelectItem>
                          <SelectItem value="FRA Part 213">FRA Part 213</SelectItem>
                          <SelectItem value="Surface">Surface</SelectItem>
                          <SelectItem value="Alignment">Alignment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Inspector <span className="text-red-500">*</span>
                      </label>
                      <Select value={inspector} onValueChange={setInspector}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select inspector" />
                        </SelectTrigger>
                        <SelectContent>
                          {inspectors.map((insp) => (
                            <SelectItem key={insp.id} value={insp.name}>
                              {insp.name} - {insp.role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date & Time <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="datetime-local"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Track Section A"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project
                    </label>
                    <Input
                      value={project}
                      onChange={(e) => setProject(e.target.value)}
                      placeholder="Main Line Extension"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Initial Findings (if any)
                    </label>
                    <Textarea
                      value={findings}
                      onChange={(e) => setFindings(e.target.value)}
                      placeholder="Preliminary inspection findings..."
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recommendations
                    </label>
                    <Textarea
                      value={recommendations}
                      onChange={(e) => setRecommendations(e.target.value)}
                      placeholder="Recommended actions..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="railcore-add-btn">
                      Schedule Inspection
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search Inspections"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="railcore-search-bar pl-10"
          />
        </div>

        {/* Inspections Table */}
        <Card className="railcore-card">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Inspector
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInspections.map((inspection) => (
                    <tr key={inspection.id} className="railcore-table-row">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {format(new Date(inspection.date), 'M/d/yyyy')}
                            </div>
                            <div className="text-sm text-gray-500">
                              {format(new Date(inspection.date), 'h:mm:ss a')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <ClipboardCheck className="mr-2 h-4 w-4 text-orange-500" />
                          <div className="text-sm font-medium text-gray-900">
                            {inspection.type}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => openInspectorProfile(inspection.inspector)}
                          className="text-sm text-orange-600 hover:text-orange-800 underline"
                        >
                          {inspection.inspector}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(inspection.status)}`}>
                          {getStatusLabel(inspection.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {inspection.location || 'Not specified'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openInspectionDetails(inspection)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <button className="railcore-action-btn">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="railcore-action-btn">
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

        {filteredInspections.length === 0 && (
          <div className="text-center py-12">
            <ClipboardCheck className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No inspections found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? 'Try adjusting your search terms.' : 'Schedule your first inspection to get started.'}
            </p>
          </div>
        )}

        {/* Inspection Details Modal */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedInspection?.type} Inspection</DialogTitle>
              <DialogDescription>
                {selectedInspection && format(new Date(selectedInspection.date), 'PPP p')}
              </DialogDescription>
            </DialogHeader>
            {selectedInspection && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Inspector</h4>
                    <p className="text-gray-700">{selectedInspection.inspector}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Status</h4>
                    <Badge className={getStatusColor(selectedInspection.status)}>
                      {getStatusLabel(selectedInspection.status)}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Location</h4>
                    <p className="text-gray-700">{selectedInspection.location || 'Not specified'}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Project</h4>
                    <p className="text-gray-700">{selectedInspection.project || 'Not specified'}</p>
                  </div>
                </div>
                
                {selectedInspection.findings && (
                  <div>
                    <h4 className="font-medium text-gray-900">Findings</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedInspection.findings}</p>
                  </div>
                )}
                
                {selectedInspection.recommendations && (
                  <div>
                    <h4 className="font-medium text-gray-900">Recommendations</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedInspection.recommendations}</p>
                  </div>
                )}
                
                {selectedInspection.nextInspection && (
                  <div>
                    <h4 className="font-medium text-gray-900">Next Inspection</h4>
                    <p className="text-gray-700">
                      {format(new Date(selectedInspection.nextInspection), 'PPP p')}
                    </p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Inspector Profile Modal */}
        <Dialog open={isInspectorOpen} onOpenChange={setIsInspectorOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedInspector?.name}</DialogTitle>
              <DialogDescription>Inspector Profile</DialogDescription>
            </DialogHeader>
            {selectedInspector && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Name</h4>
                    <p className="text-gray-700">{selectedInspector.name}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Email</h4>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-700">{selectedInspector.email}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Role</h4>
                    <p className="text-gray-700">{selectedInspector.role}</p>
                  </div>
                  {selectedInspector.certifications && (
                    <div>
                      <h4 className="font-medium text-gray-900">Certifications</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedInspector.certifications.map((cert, index) => (
                          <Badge key={index} variant="secondary">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Related Sections */}
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Related Sections</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 bg-gray-50 rounded">
                      <h5 className="font-medium">Related Projects</h5>
                      <p className="text-gray-600">0 projects</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <h5 className="font-medium">Related Inspections</h5>
                      <p className="text-gray-600">
                        {inspections.filter(i => i.inspector === selectedInspector.name).length} inspections
                      </p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <h5 className="font-medium">Related Change Orders</h5>
                      <p className="text-gray-600">0 orders</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <h5 className="font-medium">Related Daily Reports</h5>
                      <p className="text-gray-600">0 reports</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <h5 className="font-medium">Related Tasks</h5>
                      <p className="text-gray-600">0 tasks</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}