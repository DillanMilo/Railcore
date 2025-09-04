'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/ui/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { searchProjectNotes, searchProjectMedia, getAllProjectNotes, getAllProjectMedia, getProject } from '@/lib/db';
import { getUser } from '@/lib/supabase';
import { Search, FileText, Image, Video, Calendar, MapPin, Thermometer, Cloud, StickyNote, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import type { ProjectNote, ProjectMedia, Project } from '@/types/models';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    notes: ProjectNote[];
    media: ProjectMedia[];
  }>({ notes: [], media: [] });
  const [allNotes, setAllNotes] = useState<ProjectNote[]>([]);
  const [allMedia, setAllMedia] = useState<ProjectMedia[]>([]);
  const [projects, setProjects] = useState<Record<string, Project>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        const user = await getUser();
        if (!user) return;

        const notesData = await getAllProjectNotes();
        const mediaData = await getAllProjectMedia();
        setAllNotes(notesData);
        setAllMedia(mediaData);

        // Load project details for each note/media item
        const projectIds = new Set([
          ...notesData.map(n => n.project_id),
          ...mediaData.map(m => m.project_id)
        ]);

        const projectsData: Record<string, Project> = {};
        for (const projectId of projectIds) {
          const project = await getProject(projectId);
          if (project) {
            projectsData[projectId] = project;
          }
        }
        setProjects(projectsData);
      } catch (error) {
        console.error('Error loading search data:', error);
      }
    };

    initialize();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults({ notes: allNotes, media: allMedia });
      setHasSearched(true);
      return;
    }

    setIsLoading(true);
    try {
      const [notesResults, mediaResults] = await Promise.all([
        searchProjectNotes(searchQuery),
        searchProjectMedia(searchQuery)
      ]);

      setSearchResults({
        notes: notesResults,
        media: mediaResults
      });
      setHasSearched(true);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
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

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Search Projects</h1>
          <p className="mt-1 text-sm text-gray-500">
            Search through all project notes, media, and documentation
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <Input
              placeholder="Search notes, media, weather conditions, or any project content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>

        {/* Search Results */}
        {hasSearched && (
          <Tabs defaultValue="notes" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="notes">
                Notes ({searchResults.notes.length})
              </TabsTrigger>
              <TabsTrigger value="media">
                Media ({searchResults.media.length})
              </TabsTrigger>
            </TabsList>

            {/* Notes Results */}
            <TabsContent value="notes" className="space-y-4">
              {searchResults.notes.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <StickyNote className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No notes found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchQuery ? 'Try adjusting your search terms.' : 'No notes available to search.'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                searchResults.notes.map((note) => {
                  const project = projects[note.project_id];
                  return (
                    <Card key={note.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            {getNoteTypeIcon(note.type)}
                            <CardTitle className="text-lg">{note.title}</CardTitle>
                            <Badge variant={getNoteTypeColor(note.type)}>
                              {note.type.charAt(0).toUpperCase() + note.type.slice(1)}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <CardDescription>
                              {format(new Date(note.created_at), 'PPP')}
                            </CardDescription>
                            {project && (
                              <p className="text-xs text-blue-600 font-medium">
                                {project.name}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 whitespace-pre-wrap mb-3">{note.content}</p>
                        
                        {(note.weather_conditions || note.temperature) && (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center space-x-4 text-sm text-blue-800">
                              {note.weather_conditions && (
                                <div className="flex items-center">
                                  <Cloud className="mr-1 h-4 w-4" />
                                  {note.weather_conditions}
                                </div>
                              )}
                              {note.temperature && (
                                <div className="flex items-center">
                                  <Thermometer className="mr-1 h-4 w-4" />
                                  {note.temperature}°F
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>

            {/* Media Results */}
            <TabsContent value="media" className="space-y-4">
              {searchResults.media.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Image className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No media found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchQuery ? 'Try adjusting your search terms.' : 'No media available to search.'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.media.map((item) => {
                    const project = projects[item.project_id];
                    return (
                      <Card key={item.id} className="hover:shadow-lg transition-shadow">
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
                            {project && (
                              <p className="text-xs text-blue-600 font-medium mt-1">
                                {project.name}
                              </p>
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
                                  GPS: {item.location.lat.toFixed(4)}, {item.location.lng.toFixed(4)}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        {/* Quick Stats */}
        {hasSearched && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Search Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {searchResults.notes.length}
                  </div>
                  <div className="text-sm text-gray-500">Notes Found</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {searchResults.media.length}
                  </div>
                  <div className="text-sm text-gray-500">Media Found</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {new Set([...searchResults.notes.map(n => n.project_id), ...searchResults.media.map(m => m.project_id)]).size}
                  </div>
                  <div className="text-sm text-gray-500">Projects</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {searchResults.notes.filter(n => n.weather_conditions).length}
                  </div>
                  <div className="text-sm text-gray-500">Weather Logs</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}