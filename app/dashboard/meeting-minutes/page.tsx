'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/ui/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { getUser } from '@/lib/supabase';
import { Plus, Search, Calendar, Users, MapPin, Clock, Edit, Trash2, Eye, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface MeetingMinute {
  id: string;
  date: string;
  title: string;
  attendees: string[];
  location?: string;
  agenda: string;
  notes: string;
  actionItems: string[];
  nextMeeting?: string;
  createdBy: string;
  createdAt: string;
}

export default function MeetingMinutesPage() {
  const [meetings, setMeetings] = useState<MeetingMinute[]>([
    {
      id: '1',
      date: '2024-09-22T06:00:00',
      title: 'Weekly Project Review',
      attendees: ['K-Five', 'Project Manager', 'Site Supervisor'],
      location: 'Project Office',
      agenda: 'Review weekly progress, discuss upcoming milestones, address safety concerns',
      notes: 'Project is on schedule. Discussed material delivery delays and weather contingencies.',
      actionItems: ['Order additional materials', 'Schedule safety training', 'Update timeline'],
      nextMeeting: '2024-09-29T06:00:00',
      createdBy: 'Project Manager',
      createdAt: '2024-09-22T06:00:00'
    },
    {
      id: '2',
      date: '2024-08-25T06:00:00',
      title: 'Safety Committee Meeting',
      attendees: ['K-Five', 'Safety Officer', 'Crew Leaders'],
      location: 'Conference Room A',
      agenda: 'Monthly safety review, incident analysis, training updates',
      notes: 'Reviewed recent safety incidents. Implemented new safety protocols for equipment operation.',
      actionItems: ['Update safety manual', 'Schedule equipment inspection', 'Conduct safety drill'],
      createdBy: 'Safety Officer',
      createdAt: '2024-08-25T06:00:00'
    },
    {
      id: '3',
      date: '2024-02-01T07:25:00',
      title: 'Client Progress Review',
      attendees: ['Client Representative', 'Project Manager', 'Engineering Team'],
      location: 'Client Office',
      agenda: 'Present project progress, discuss change orders, review timeline',
      notes: 'Client satisfied with progress. Approved change order for additional work scope.',
      actionItems: ['Process change order', 'Update project schedule', 'Prepare next progress report'],
      createdBy: 'Project Manager',
      createdAt: '2024-02-01T07:25:00'
    },
    {
      id: '4',
      date: '2024-10-19T04:31:00',
      title: 'Technical Review Meeting',
      attendees: ['Engineering Team', 'Quality Control', 'Site Supervisor'],
      location: 'Engineering Office',
      agenda: 'Review technical specifications, discuss quality standards, address technical issues',
      notes: 'Reviewed latest engineering drawings. Discussed quality control procedures and testing requirements.',
      actionItems: ['Update technical drawings', 'Schedule quality tests', 'Review specifications'],
      createdBy: 'Engineering Lead',
      createdAt: '2024-10-19T04:31:00'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMeetings, setFilteredMeetings] = useState<MeetingMinute[]>(meetings);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingMinute | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [attendees, setAttendees] = useState('');
  const [agenda, setAgenda] = useState('');
  const [notes, setNotes] = useState('');
  const [actionItems, setActionItems] = useState('');

  useEffect(() => {
    const filtered = meetings.filter(meeting =>
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.attendees.some(attendee => attendee.toLowerCase().includes(searchQuery.toLowerCase())) ||
      meeting.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMeetings(filtered);
  }, [searchQuery, meetings]);

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    try {
      const user = await getUser();
      if (!user) throw new Error('User not authenticated');

      const newMeeting: MeetingMinute = {
        id: Date.now().toString(),
        date,
        title: title.trim(),
        attendees: attendees.split(',').map(a => a.trim()).filter(a => a),
        location: location.trim() || undefined,
        agenda: agenda.trim(),
        notes: notes.trim(),
        actionItems: actionItems.split('\n').map(a => a.trim()).filter(a => a),
        createdBy: user.email || 'Unknown',
        createdAt: new Date().toISOString()
      };

      setMeetings([newMeeting, ...meetings]);
      
      // Reset form
      setTitle('');
      setDate('');
      setLocation('');
      setAttendees('');
      setAgenda('');
      setNotes('');
      setActionItems('');
      setIsCreateOpen(false);
    } catch (error) {
      console.error('Error creating meeting:', error);
      alert('Failed to create meeting. Please try again.');
    }
  };

  const openMeetingDetails = (meeting: MeetingMinute) => {
    setSelectedMeeting(meeting);
    setIsDetailsOpen(true);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meeting Minutes</h1>
            <p className="mt-1 text-sm text-gray-500">
              Track project meetings, decisions, and action items
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Project Details
            </Button>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="railcore-add-btn">
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Meeting Minutes</DialogTitle>
                  <DialogDescription>
                    Record details from a project meeting.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateMeeting} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meeting Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Weekly Project Review"
                      required
                    />
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
                        placeholder="Project Office"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Attendees (comma-separated)
                    </label>
                    <Input
                      value={attendees}
                      onChange={(e) => setAttendees(e.target.value)}
                      placeholder="Project Manager, Site Supervisor, Safety Officer"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Agenda
                    </label>
                    <Textarea
                      value={agenda}
                      onChange={(e) => setAgenda(e.target.value)}
                      placeholder="Meeting agenda and topics to discuss..."
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meeting Notes
                    </label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Key discussion points and decisions made..."
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Action Items (one per line)
                    </label>
                    <Textarea
                      value={actionItems}
                      onChange={(e) => setActionItems(e.target.value)}
                      placeholder="Action item 1&#10;Action item 2&#10;Action item 3"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="railcore-add-btn">
                      Create Meeting Minutes
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
            placeholder="Search Meeting Minutes"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="railcore-search-bar pl-10"
          />
        </div>

        {/* Meetings List */}
        <div className="space-y-4">
          {filteredMeetings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No meeting minutes found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchQuery ? 'Try adjusting your search terms.' : 'Create your first meeting minutes to get started.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredMeetings.map((meeting) => (
              <Card key={meeting.id} className="railcore-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{meeting.title}</CardTitle>
                      <CardDescription className="mt-1">
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-4 w-4" />
                            {format(new Date(meeting.date), 'PPP p')}
                          </div>
                          {meeting.location && (
                            <div className="flex items-center">
                              <MapPin className="mr-1 h-4 w-4" />
                              {meeting.location}
                            </div>
                          )}
                          <div className="flex items-center">
                            <Users className="mr-1 h-4 w-4" />
                            {meeting.attendees.length} attendees
                          </div>
                        </div>
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openMeetingDetails(meeting)}
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
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {meeting.agenda && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Agenda:</h4>
                        <p className="text-sm text-gray-600">{meeting.agenda}</p>
                      </div>
                    )}
                    
                    {meeting.attendees.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Attendees:</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {meeting.attendees.map((attendee, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {attendee}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {meeting.actionItems.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Action Items:</h4>
                        <ul className="text-sm text-gray-600 list-disc list-inside mt-1">
                          {meeting.actionItems.slice(0, 3).map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                          {meeting.actionItems.length > 3 && (
                            <li className="text-gray-400">+{meeting.actionItems.length - 3} more...</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Meeting Details Modal */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedMeeting?.title}</DialogTitle>
              <DialogDescription>
                {selectedMeeting && format(new Date(selectedMeeting.date), 'PPP p')}
              </DialogDescription>
            </DialogHeader>
            {selectedMeeting && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Meeting Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                        {format(new Date(selectedMeeting.date), 'PPP p')}
                      </div>
                      {selectedMeeting.location && (
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                          {selectedMeeting.location}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4 text-gray-400" />
                        {selectedMeeting.attendees.length} attendees
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Attendees</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedMeeting.attendees.map((attendee, index) => (
                        <Badge key={index} variant="secondary">
                          {attendee}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                {selectedMeeting.agenda && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Agenda</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedMeeting.agenda}</p>
                  </div>
                )}
                
                {selectedMeeting.notes && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Meeting Notes</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedMeeting.notes}</p>
                  </div>
                )}
                
                {selectedMeeting.actionItems.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Action Items</h4>
                    <ul className="space-y-1">
                      {selectedMeeting.actionItems.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-orange-500 mr-2">•</span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}