'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/ui/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { getUser } from '@/lib/supabase';
import { Plus, Search, AlertTriangle, Calendar, Edit, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface SafetyIncident {
  id: string;
  date: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved';
  reportedBy: string;
  location?: string;
}

export default function SafetyIncidentsPage() {
  const [incidents, setIncidents] = useState<SafetyIncident[]>([
    {
      id: '1',
      date: '2024-09-14T06:00:00',
      description: 'Employee slipped on wet floor in the break room. Minor bruising reported.',
      severity: 'low',
      status: 'resolved',
      reportedBy: 'Safety Officer',
      location: 'Break Room'
    },
    {
      id: '2',
      date: '2024-11-06T14:00:00',
      description: 'Machine malfunction caused a minor cut to employee\'s hand. First aid administered.',
      severity: 'medium',
      status: 'investigating',
      reportedBy: 'Supervisor',
      location: 'Production Floor'
    },
    {
      id: '3',
      date: '2021-04-28T07:24:00',
      description: 'Employee reported back pain after lifting heavy boxes. Worker\'s compensation claim filed.',
      severity: 'medium',
      status: 'resolved',
      reportedBy: 'HR Department',
      location: 'Warehouse'
    },
    {
      id: '4',
      date: '2023-05-05T09:12:00',
      description: 'Chemical spill in the lab. Area cleaned and sanitized. No injuries reported.',
      severity: 'high',
      status: 'resolved',
      reportedBy: 'Lab Technician',
      location: 'Laboratory'
    },
    {
      id: '5',
      date: '2023-04-27T03:18:00',
      description: 'Employee maintenance got irritation due to dust particles. Safety glasses provided.',
      severity: 'low',
      status: 'resolved',
      reportedBy: 'Maintenance Team',
      location: 'Maintenance Shop'
    },
    {
      id: '6',
      date: '2023-07-21T02:27:00',
      description: 'Forklift accident in the warehouse. Minor damage to equipment. No injuries reported.',
      severity: 'medium',
      status: 'resolved',
      reportedBy: 'Warehouse Manager',
      location: 'Warehouse'
    },
    {
      id: '7',
      date: '2023-04-19T01:58:00',
      description: 'Employee injured due to a loose cable. Minor ankle sprain reported.',
      severity: 'medium',
      status: 'resolved',
      reportedBy: 'Site Supervisor',
      location: 'Construction Site'
    },
    {
      id: '8',
      date: '2023-03-06T08:06:00',
      description: 'Loud noise exposure caused temporary hearing loss. Ear protection provided.',
      severity: 'medium',
      status: 'resolved',
      reportedBy: 'Safety Inspector',
      location: 'Factory Floor'
    },
    {
      id: '9',
      date: '2023-10-18T05:00:00',
      description: 'Employee burned hand on hot machinery. First aid administered.',
      severity: 'high',
      status: 'open',
      reportedBy: 'Machine Operator',
      location: 'Production Line'
    },
    {
      id: '10',
      date: '2023-05-29T04:07:00',
      description: 'Employee fainted due to heat exhaustion. Hydration and rest provided.',
      severity: 'medium',
      status: 'resolved',
      reportedBy: 'First Aid Officer',
      location: 'Outdoor Work Area'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredIncidents, setFilteredIncidents] = useState<SafetyIncident[]>(incidents);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    const filtered = incidents.filter(incident =>
      incident.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.reportedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredIncidents(filtered);
  }, [searchQuery, incidents]);

  const getSeverityColor = (severity: SafetyIncident['severity']) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: SafetyIncident['status']) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Safety Incidents</h1>
            <p className="mt-1 text-sm text-gray-500">
              Track and manage workplace safety incidents and reports
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="railcore-add-btn">
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Report Safety Incident</DialogTitle>
                <DialogDescription>
                  Report a new safety incident or near-miss event.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date & Time
                  </label>
                  <Input type="datetime-local" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <Input placeholder="Describe the incident..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <Input placeholder="Where did this occur?" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Severity
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="railcore-add-btn">
                    Report Incident
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search Safety Incidents"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="railcore-search-bar pl-10"
          />
        </div>

        {/* Incidents Table */}
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
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Severity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reported By
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredIncidents.map((incident) => (
                    <tr key={incident.id} className="railcore-table-row">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {format(new Date(incident.date), 'M/d/yyyy')}
                            </div>
                            <div className="text-sm text-gray-500">
                              {format(new Date(incident.date), 'h:mm:ss a')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {incident.description}
                        </div>
                        {incident.location && (
                          <div className="text-sm text-gray-500 mt-1">
                            📍 {incident.location}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(incident.severity)}`}>
                          {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(incident.status)}`}>
                          {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {incident.reportedBy}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="railcore-action-btn">
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button className="railcore-action-btn">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="railcore-action-btn">
                            <Eye className="h-4 w-4" />
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

        {filteredIncidents.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No safety incidents found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? 'Try adjusting your search terms.' : 'No safety incidents have been reported yet.'}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}