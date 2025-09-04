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
import { Plus, Calendar as CalendarIcon, Clock, MapPin, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  location?: string;
  attendees?: string[];
  type: 'meeting' | 'inspection' | 'deadline' | 'maintenance';
  project?: string;
  created_at: string;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Safety Inspection',
      description: 'Monthly safety inspection of track section 4A-4B',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      location: 'Mile Marker 15.2',
      attendees: ['John Smith', 'Safety Inspector'],
      type: 'inspection',
      project: 'Main Line Extension Phase 2',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Project Review Meeting',
      description: 'Weekly project status review with stakeholders',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time: '14:00',
      location: 'Project Office',
      attendees: ['Project Manager', 'Site Supervisor', 'Client Rep'],
      type: 'meeting',
      project: 'Main Line Extension Phase 2',
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Equipment Maintenance',
      description: 'Scheduled maintenance for track laying equipment',
      date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
      time: '08:00',
      location: 'Equipment Yard',
      attendees: ['Mike Johnson', 'Maintenance Crew'],
      type: 'maintenance',
      project: 'Main Line Extension Phase 2',
      created_at: new Date().toISOString()
    },
    {
      id: '4',
      title: 'Permit Deadline',
      description: 'Environmental permit renewal deadline',
      date: new Date(Date.now() + 604800000).toISOString().split('T')[0],
      type: 'deadline',
      project: 'Main Line Extension Phase 2',
      created_at: new Date().toISOString()
    }
  ]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [attendees, setAttendees] = useState('');
  const [type, setType] = useState<CalendarEvent['type']>('meeting');
  const [project, setProject] = useState('');

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim() || undefined,
      date,
      time: time || undefined,
      location: location.trim() || undefined,
      attendees: attendees.trim() ? attendees.split(',').map(a => a.trim()) : undefined,
      type,
      project: project.trim() || undefined,
      created_at: new Date().toISOString()
    };

    setEvents([newEvent, ...events]);
    
    // Reset form
    setTitle('');
    setDescription('');
    setDate('');
    setTime('');
    setLocation('');
    setAttendees('');
    setType('meeting');
    setProject('');
    setIsCreateOpen(false);
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter(event => event.date === dateStr);
  };

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'inspection': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'deadline': return 'bg-red-100 text-red-800 border-red-200';
      case 'maintenance': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventTypeLabel = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'meeting': return 'Meeting';
      case 'inspection': return 'Inspection';
      case 'deadline': return 'Deadline';
      case 'maintenance': return 'Maintenance';
      default: return type;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
            <p className="mt-1 text-sm text-gray-500">
              Schedule and track project events, meetings, and deadlines
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2">
            <Select value={viewMode} onValueChange={(value: 'month' | 'week' | 'day') => setViewMode(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="day">Day</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Event
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                  <DialogDescription>
                    Schedule a new event, meeting, or deadline.
                  </DialogDescription>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto pr-2">
                  <form onSubmit={handleCreateEvent} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Safety Inspection"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Event description..."
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Time
                        </label>
                        <Input
                          type="time"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <Select value={type} onValueChange={(value: CalendarEvent['type']) => setType(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="meeting">Meeting</SelectItem>
                          <SelectItem value="inspection">Inspection</SelectItem>
                          <SelectItem value="deadline">Deadline</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Mile Marker 15.2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Attendees (comma-separated)
                      </label>
                      <Input
                        value={attendees}
                        onChange={(e) => setAttendees(e.target.value)}
                        placeholder="John Smith, Safety Inspector"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project
                      </label>
                      <Input
                        value={project}
                        onChange={(e) => setProject(e.target.value)}
                        placeholder="Main Line Extension Phase 2"
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        Create Event
                      </Button>
                    </div>
                  </form>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold text-gray-900">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
        </div>

        {/* Calendar Grid */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-7 gap-0 text-xs sm:text-sm">
              {/* Day headers */}
              {[
                { short: 'S', full: 'Sun' },
                { short: 'M', full: 'Mon' },
                { short: 'T', full: 'Tue' },
                { short: 'W', full: 'Wed' },
                { short: 'T', full: 'Thu' },
                { short: 'F', full: 'Fri' },
                { short: 'S', full: 'Sat' }
              ].map((day, index) => (
                <div key={index} className="p-2 sm:p-4 text-center font-medium text-gray-500 border-b bg-gray-50">
                  <span className="sm:hidden">{day.short}</span>
                  <span className="hidden sm:inline">{day.full}</span>
                </div>
              ))}
              
              {/* Calendar days */}
              {calendarDays.map((day) => {
                const dayEvents = getEventsForDate(day);
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isCurrentDay = isToday(day);
                
                return (
                  <div
                    key={day.toISOString()}
                    className={`min-h-[80px] sm:min-h-[120px] p-1 sm:p-2 border-b border-r cursor-pointer hover:bg-blue-50 transition-colors ${
                      !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
                    } ${isCurrentDay ? 'bg-blue-100 border-blue-300' : ''}`}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className={`text-xs sm:text-sm font-medium mb-1 ${
                      isCurrentDay ? 'text-blue-700 font-bold' : ''
                    }`}>
                      {format(day, 'd')}
                    </div>
                    <div className="space-y-0.5 sm:space-y-1">
                      {dayEvents.slice(0, window.innerWidth < 640 ? 1 : 2).map((event) => (
                        <div
                          key={event.id}
                          className={`text-xs p-0.5 sm:p-1 rounded border ${getEventTypeColor(event.type)} truncate leading-tight`}
                        >
                          <span className="hidden sm:inline">
                            {event.time && <span className="font-medium">{event.time}</span>} {event.title}
                          </span>
                          <span className="sm:hidden font-medium">
                            {event.title.length > 8 ? event.title.substring(0, 8) + '...' : event.title}
                          </span>
                        </div>
                      ))}
                      {dayEvents.length > (window.innerWidth < 640 ? 1 : 2) && (
                        <div className="text-xs text-gray-500 font-medium">
                          +{dayEvents.length - (window.innerWidth < 640 ? 1 : 2)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="p-2 secondary-gradient rounded-lg mr-3">
                <CalendarIcon className="h-5 w-5 text-white" />
              </div>
              Upcoming Events
            </CardTitle>
            <CardDescription>
              Next 7 days of scheduled events and deadlines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events
                .filter(event => {
                  const eventDate = new Date(event.date);
                  const today = new Date();
                  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                  return eventDate >= today && eventDate <= nextWeek;
                })
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 5)
                .map((event) => (
                  <div key={event.id} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-200">
                    <div className="flex-shrink-0">
                      <div className="p-2 primary-gradient rounded-lg">
                        <CalendarIcon className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                          {event.title}
                        </h4>
                        <Badge className={`${getEventTypeColor(event.type)} font-medium`}>
                          {getEventTypeLabel(event.type)}
                        </Badge>
                      </div>
                      {event.description && (
                        <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                      )}
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                        <div className="flex items-center">
                          <CalendarIcon className="mr-1 h-3 w-3" />
                          {format(new Date(event.date), 'MMM d, yyyy')}
                          {event.time && ` at ${event.time}`}
                        </div>
                        {event.location && (
                          <div className="flex items-center">
                            <MapPin className="mr-1 h-3 w-3" />
                            {event.location}
                          </div>
                        )}
                        {event.attendees && (
                          <div className="flex items-center">
                            <Users className="mr-1 h-3 w-3" />
                            {event.attendees.length} attendees
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              
              {events.filter(event => {
                const eventDate = new Date(event.date);
                const today = new Date();
                const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                return eventDate >= today && eventDate <= nextWeek;
              }).length === 0 && (
                <div className="text-center py-12">
                  <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4">
                    <CalendarIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">No upcoming events</h3>
                  <p className="text-sm text-gray-500">Create your first event to get started</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}