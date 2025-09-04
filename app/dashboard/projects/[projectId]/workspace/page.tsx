'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Layout } from '@/components/ui/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getProject, getProjectNotes, getProjectMedia, createProjectNote, createProjectMedia, updateProjectStatus } from '@/lib/db';
import { getUser } from '@/lib/supabase';
import { 
  Plus, 
  FileText, 
  Camera, 
  MapPin, 
  Calendar, 
  User, 
  CheckCircle, 
  Archive,
  ArrowLeft,
  Upload,
  StickyNote,
  Image,
  Video,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';
import { CameraCapture } from '@/components/ui/camera-capture';
import type { Project, ProjectNote, ProjectMedia } from '@/types/models';

export default function ProjectWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [notes, setNotes] = useState<ProjectNote[]>([]);
  const [media, setMedia] = useState<ProjectMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [isMediaDialogOpen, setIsMediaDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Note form state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteType, setNoteType] = useState<ProjectNote['type']>('note');
  const [weatherConditions, setWeatherConditions] = useState('');
  const [temperature, setTemperature] = useState<number | ''>('');
  
  // Media form state
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaCaption, setMediaCaption] = useState('');
  const [mediaLocation, setMediaLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mediaTimestamp, setMediaTimestamp] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));

  useEffect(() => {
    const initialize = async () => {
      try {
        const user = await getUser();
        if (!user) return;

        const projectData = await getProject(projectId);
        if (!projectData) return;

        setProject(projectData);
        const notesData = await getProjectNotes(projectId);
        setNotes(notesData);
        const mediaData = await getProjectMedia(projectId);
        setMedia(mediaData);
      } catch (error) {
        console.error('Error loading project workspace:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [projectId]);

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const user = await getUser();
      if (!user) throw new Error('User not authenticated');

      const note = await createProjectNote({
        project_id: projectId,
        title: noteTitle.trim(),
        content: noteContent.trim(),
        type: noteType,
        weather_conditions: weatherConditions.trim() || undefined,
        temperature: typeof temperature === 'number' ? temperature : undefined,
        created_by: user.id,
      });

      setNotes([note, ...notes]);
      
      // Reset form
      setNoteTitle('');
      setNoteContent('');
      setNoteType('note');
      setWeatherConditions('');
      setTemperature('');
      setIsNoteDialogOpen(false);
    } catch (error) {
      console.error('Error creating note:', error);
      alert('Failed to create note. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mediaFiles.length === 0) return;
    
    setIsSubmitting(true);
    
    try {
      const user = await getUser();
      if (!user) throw new Error('User not authenticated');

      for (const file of mediaFiles) {
        const mediaItem = await createProjectMedia({
          project_id: projectId,
          file_name: file.name,
          file_path: `projects/${projectId}/media/${Date.now()}-${file.name}`,
          file_type: file.type,
          file_size: file.size,
          caption: mediaCaption.trim() || undefined,
          location: mediaLocation,
          timestamp: mediaTimestamp,
          created_by: user.id,
        });
        
        setMedia(prev => [mediaItem, ...prev]);
      }
      
      // Reset form
      setMediaFiles([]);
      setMediaCaption('');
      setMediaLocation(null);
      setMediaTimestamp(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
      setIsMediaDialogOpen(false);
    } catch (error) {
      console.error('Error uploading media:', error);
      alert('Failed to upload media. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteProject = async () => {
    if (!project) return;
    
    const confirmed = confirm('Are you sure you want to mark this project as completed? This will send it to the repository.');
    if (!confirmed) return;
    
    try {
      await updateProjectStatus(projectId, 'completed');
      setProject({ ...project, status: 'completed' });
      alert('Project marked as completed and sent to repository!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error completing project:', error);
      alert('Failed to complete project. Please try again.');
    }
  };

  const getNoteTypeIcon = (type: ProjectNote['type']) => {
    switch (type) {
      case 'note': return <StickyNote className="h-4 w-4 text-blue-500" />;
      case 'observation': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'issue': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'progress': return <CheckCircle className="h-4 w-4 text-purple-500" />;
      default: return <StickyNote className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNoteTypeColor = (type: ProjectNote['type']) => {
    switch (type) {
      case 'note': return 'default';
      case 'observation': return 'secondary';
      case 'issue': return 'destructive';
      case 'progress': return 'outline';
      default: return 'default';
    }
  };

  const getMediaIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="h-5 w-5 text-blue-500" />;
    if (fileType.startsWith('video/')) return <Video className="h-5 w-5 text-purple-500" />;
    return <FileText className="h-5 w-5 text-gray-500" />;
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{project?.name}</h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant={project?.status === 'active' ? 'default' : 'secondary'}>
                  {project?.status?.charAt(0).toUpperCase() + project?.status?.slice(1)}
                </Badge>
                <p className="text-sm text-gray-500">
                  Project Workspace
                </p>
              </div>
            </div>
          </div>
          {project?.status === 'active' && (
            <Button onClick={handleCompleteProject} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="mr-2 h-4 w-4" />
              Complete & Send to Repository
            </Button>
          )}
        </div>

        {/* Project Description */}
        {project?.description && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-700">{project.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="notes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notes">Notes & Observations</TabsTrigger>
            <TabsTrigger value="media">Media & Files</TabsTrigger>
          </TabsList>

          {/* Notes Tab */}
          <TabsContent value="notes" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Project Notes</h2>
              <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Note
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Project Note</DialogTitle>
                    <DialogDescription>
                      Add a note, observation, issue, or progress update to this project.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateNote} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                        placeholder="Daily progress update"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <Select value={noteType} onValueChange={(value: ProjectNote['type']) => setNoteType(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="note">General Note</SelectItem>
                          <SelectItem value="observation">Observation</SelectItem>
                          <SelectItem value="issue">Issue/Problem</SelectItem>
                          <SelectItem value="progress">Progress Update</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Content <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        placeholder="Detailed note content..."
                        rows={4}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Weather Conditions
                        </label>
                        <Input
                          value={weatherConditions}
                          onChange={(e) => setWeatherConditions(e.target.value)}
                          placeholder="Sunny, cloudy, rainy..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Temperature (°F)
                        </label>
                        <Input
                          type="number"
                          value={temperature}
                          onChange={(e) => setTemperature(e.target.value ? parseFloat(e.target.value) : '')}
                          placeholder="72"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsNoteDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Adding...' : 'Add Note'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {notes.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <StickyNote className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No notes yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Add your first note to track project details.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                notes.map((note) => (
                  <Card key={note.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {getNoteTypeIcon(note.type)}
                          <CardTitle className="text-lg">{note.title}</CardTitle>
                          <Badge variant={getNoteTypeColor(note.type)}>
                            {note.type.charAt(0).toUpperCase() + note.type.slice(1)}
                          </Badge>
                        </div>
                        <CardDescription>
                          {format(new Date(note.created_at), 'PPP')}
                         {note.created_at !== note.updated_at && note.updated_at && (
                           <span className="text-xs text-gray-400 ml-2">
                             (Updated {format(new Date(note.updated_at), 'PPP')})
                           </span>
                         )}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
                     {(note.weather_conditions || note.temperature) && (
                       <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                         <div className="flex items-center space-x-4 text-sm text-blue-800">
                           {note.weather_conditions && (
                             <span>Weather: {note.weather_conditions}</span>
                           )}
                           {note.temperature && (
                             <span>Temperature: {note.temperature}°F</span>
                           )}
                         </div>
                       </div>
                     )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Project Media</h2>
              <Dialog open={isMediaDialogOpen} onOpenChange={setIsMediaDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Media
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Media</DialogTitle>
                    <DialogDescription>
                      Upload photos, videos, or documents to this project.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleUploadMedia} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Files <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="file"
                        multiple
                        accept="image/*,video/*,.pdf,.doc,.docx"
                        onChange={(e) => setMediaFiles(Array.from(e.target.files || []))}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Caption
                      </label>
                      <Input
                        value={mediaCaption}
                        onChange={(e) => setMediaCaption(e.target.value)}
                        placeholder="Optional caption or description"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Timestamp
                      </label>
                      <Input
                        type="datetime-local"
                        value={mediaTimestamp}
                        onChange={(e) => setMediaTimestamp(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsMediaDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting || mediaFiles.length === 0}>
                        {isSubmitting ? 'Uploading...' : 'Upload Media'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {media.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Camera className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No media yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Upload photos, videos, or documents to this project.
                  </p>
                </div>
              ) : (
                media.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        {getMediaIcon(item.file_type)}
                        <CardTitle className="text-sm truncate">{item.file_name}</CardTitle>
                      </div>
                      <CardDescription>
                        {format(new Date(item.created_at), 'PPP')}
                       {item.timestamp && item.timestamp !== item.created_at && (
                         <span className="text-xs text-gray-400 block">
                           Taken: {format(new Date(item.timestamp), 'PPP p')}
                         </span>
                       )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {item.caption && (
                          <p className="text-sm text-gray-700">{item.caption}</p>
                        )}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{(item.file_size / 1024).toFixed(1)} KB</span>
                          {item.location && (
                            <div className="flex items-center">
                              <MapPin className="mr-1 h-3 w-3" />
                              GPS
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}