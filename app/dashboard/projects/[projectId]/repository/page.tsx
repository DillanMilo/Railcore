'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Layout } from '@/components/ui/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileUploader } from '@/components/ui/file-uploader';
import { getProject, getFilesByProject, searchFiles, createFileMeta } from '@/lib/db';
import { getUser } from '@/lib/supabase';
import { Upload, Search, Download, Tag, MapPin, Filter, Image, Video, FileText, File, Calendar, User, Grid, List } from 'lucide-react';
import { format } from 'date-fns';
import type { Project, FileMeta } from '@/types/models';

export default function RepositoryPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [files, setFiles] = useState<FileMeta[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadTags, setUploadTags] = useState<string[]>([]);
  const [uploadLocation, setUploadLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        const user = await getUser();
        if (!user) return;

        const projectData = await getProject(projectId);
        if (!projectData) return;

        setProject(projectData);
        const filesData = await getFilesByProject(projectId);
        setFiles(filesData);
        setFilteredFiles(filesData);
      } catch (error) {
        console.error('Error loading repository:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [projectId]);

  // Filter and sort files whenever filters change
  useEffect(() => {
    let filtered = [...files];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(file => 
        file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(file => {
        switch (filterType) {
          case 'images': return file.mime_type.startsWith('image/');
          case 'videos': return file.mime_type.startsWith('video/');
          case 'documents': return file.mime_type.includes('pdf') || file.mime_type.includes('doc') || file.mime_type.includes('xls');
          default: return true;
        }
      });
    }

    // Apply tag filter
    if (filterTag !== 'all') {
      filtered = filtered.filter(file => file.tags.includes(filterTag));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest': return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'name': return a.name.localeCompare(b.name);
        case 'size': return b.size_bytes - a.size_bytes;
        default: return 0;
      }
    });

    setFilteredFiles(filtered);
  }, [files, searchQuery, filterType, filterTag, sortBy]);

  const handleSearch = async () => {
    // Search is now handled by useEffect above
  };

  const handleUpload = async () => {
    if (uploadFiles.length === 0) return;
    
    setIsUploading(true);
    
    try {
      const user = await getUser();
      if (!user) throw new Error('User not authenticated');

      for (const file of uploadFiles) {
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = `${projectId}/${fileName}`;

        // Mock file upload for development
        console.log('📤 Mock upload:', fileName);

        // Save metadata to database
        await createFileMeta({
          project_id: projectId,
          name: file.name,
          path: filePath,
          mime_type: file.type,
          size_bytes: file.size,
          tags: uploadTags,
          lat: uploadLocation?.lat,
          lng: uploadLocation?.lng,
          uploaded_by: user.id,
        });
      }

      // Refresh files list
      const filesData = await getFilesByProject(projectId);
      setFiles(filesData);
      
      // Reset form
      setUploadFiles([]);
      setUploadTags([]);
      setUploadLocation(null);
      setIsUploadOpen(false);
      
      alert('Files uploaded successfully!');
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Failed to upload files. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const downloadFile = async (file: FileMeta) => {
    try {
      // Mock download for development
      console.log('📁 Would download file:', file.name);
      alert(`Mock download: ${file.name}`);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  const getFileIcon = (file: FileMeta) => {
    if (file.mime_type.startsWith('image/')) return <Image className="h-5 w-5 text-blue-500" />;
    if (file.mime_type.startsWith('video/')) return <Video className="h-5 w-5 text-purple-500" />;
    if (file.mime_type.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getAllTags = () => {
    const allTags = new Set<string>();
    files.forEach(file => file.tags.forEach(tag => allTags.add(tag)));
    return Array.from(allTags).sort();
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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Repository</h1>
            <p className="mt-1 text-sm text-gray-500">
              Project: {project?.name}
            </p>
          </div>
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Files
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Upload Files</DialogTitle>
                <DialogDescription>
                  Upload documents, photos, or other project files with optional tagging and location.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <FileUploader
                  onFilesSelected={setUploadFiles}
                  onTagsChange={setUploadTags}
                  onLocationChange={setUploadLocation}
                  allowMultiple={true}
                  maxSize={10}
                />
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpload} disabled={isUploading || uploadFiles.length === 0}>
                    {isUploading ? 'Uploading...' : 'Upload Files'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
            <Input
              placeholder="🔍 Search photos, videos, documents by name or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="images">Images</SelectItem>
                <SelectItem value="videos">Videos</SelectItem>
                <SelectItem value="documents">Documents</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select value={filterTag} onValueChange={setFilterTag}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {getAllTags().map(tag => (
                <SelectItem key={tag} value={tag}>{tag}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="size">Size</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-sm text-gray-500">
            {filteredFiles.length} of {files.length} files
          </div>
        </div>

        {/* Files Grid */}
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
        }>
          {filteredFiles.length === 0 ? (
            <div className="col-span-full text-center py-12">
              {files.length === 0 ? (
                <>
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No files yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Upload your first project file to get started.
                  </p>
                </>
              ) : (
                <>
                  <Search className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No files match your filters</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search or filter criteria.
                  </p>
                </>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            filteredFiles.map((file) => (
              <Card key={file.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2 flex-1">
                      {getFileIcon(file)}
                      <CardTitle className="text-lg truncate">{file.name}</CardTitle>
                    </div>
                  </div>
                  <CardDescription>
                    {format(new Date(file.created_at), 'PPP')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{formatFileSize(file.size_bytes)}</span>
                      <span className="capitalize">{file.mime_type.split('/')[0]}</span>
                    </div>
                    
                    {file.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {file.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {file.lat && file.lng && (
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="mr-1 h-4 w-4" />
                        {file.lat.toFixed(6)}, {file.lng.toFixed(6)}
                      </div>
                    )}
                    
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => downloadFile(file)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            filteredFiles.map((file) => (
              <Card key={file.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      {getFileIcon(file)}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{file.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span>{formatFileSize(file.size_bytes)}</span>
                          <span>{format(new Date(file.created_at), 'MMM d, yyyy')}</span>
                          {file.lat && file.lng && (
                            <div className="flex items-center">
                              <MapPin className="mr-1 h-3 w-3" />
                              <span>GPS</span>
                            </div>
                          )}
                        </div>
                        {file.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {file.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => downloadFile(file)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Quick Stats */}
        {files.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Repository Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {files.filter(f => f.mime_type.startsWith('image/')).length}
                  </div>
                  <div className="text-sm text-gray-500">Images</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {files.filter(f => f.mime_type.startsWith('video/')).length}
                  </div>
                  <div className="text-sm text-gray-500">Videos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {files.filter(f => f.mime_type.includes('pdf') || f.mime_type.includes('doc')).length}
                  </div>
                  <div className="text-sm text-gray-500">Documents</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(files.reduce((acc, f) => acc + f.size_bytes, 0) / (1024 * 1024))} MB
                  </div>
                  <div className="text-sm text-gray-500">Total Size</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}