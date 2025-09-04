'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/ui/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getUser } from '@/lib/supabase';
import { Plus, Search, Image as ImageIcon, Calendar, MapPin, User } from 'lucide-react';
import { format } from 'date-fns';

interface Photo {
  id: string;
  title: string;
  caption: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  location?: string;
}

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([
    {
      id: '1',
      title: 'Milling asphalt pavement adjacent to Trk B',
      caption: 'Milling asphalt pavement adjacent to Trk B',
      url: 'https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg?auto=compress&cs=tinysrgb&w=400',
      uploadedBy: 'John Smith',
      uploadedAt: new Date().toISOString(),
      location: 'Track Section B'
    },
    {
      id: '2',
      title: 'Survey',
      caption: 'Survey',
      url: 'https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg?auto=compress&cs=tinysrgb&w=400',
      uploadedBy: 'Mike Johnson',
      uploadedAt: new Date(Date.now() - 86400000).toISOString(),
      location: 'Mile Marker 15.2'
    },
    {
      id: '3',
      title: 'TS Panels, T-clips',
      caption: 'TS Panels, T-clips',
      url: 'https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg?auto=compress&cs=tinysrgb&w=400',
      uploadedBy: 'Sarah Davis',
      uploadedAt: new Date(Date.now() - 172800000).toISOString(),
      location: 'Storage Yard'
    },
    {
      id: '4',
      title: 'Delivery Receipt',
      caption: 'Delivery Receipt',
      url: 'https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg?auto=compress&cs=tinysrgb&w=400',
      uploadedBy: 'Tom Wilson',
      uploadedAt: new Date(Date.now() - 259200000).toISOString(),
      location: 'Main Gate'
    },
    {
      id: '5',
      title: 'Steel Rails Installation',
      caption: 'Steel Rails Installation',
      url: 'https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg?auto=compress&cs=tinysrgb&w=400',
      uploadedBy: 'Alex Brown',
      uploadedAt: new Date(Date.now() - 345600000).toISOString(),
      location: 'Section 4A'
    },
    {
      id: '6',
      title: 'Track Inspection',
      caption: 'Track Inspection',
      url: 'https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg?auto=compress&cs=tinysrgb&w=400',
      uploadedBy: 'Lisa Chen',
      uploadedAt: new Date(Date.now() - 432000000).toISOString(),
      location: 'Bridge 12'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>(photos);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  useEffect(() => {
    const filtered = photos.filter(photo =>
      photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPhotos(filtered);
  }, [searchQuery, photos]);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Photos</h1>
            <p className="mt-1 text-sm text-gray-500">
              Project documentation and progress photos
            </p>
          </div>
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button className="railcore-add-btn">
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Photos</DialogTitle>
                <DialogDescription>
                  Upload new photos to document project progress.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Photos
                  </label>
                  <Input type="file" multiple accept="image/*" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Caption
                  </label>
                  <Input placeholder="Describe the photos..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <Input placeholder="Track Section, Mile Marker, etc." />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="railcore-add-btn">
                    Upload Photos
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
            placeholder="Search Photos"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="railcore-search-bar pl-10"
          />
        </div>

        {/* Photos Grid */}
        <div className="railcore-photo-grid">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="railcore-photo-item cursor-pointer"
              onClick={() => setSelectedPhoto(photo)}
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover"
              />
              <div className="railcore-photo-caption">
                <p className="font-medium truncate">{photo.caption}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredPhotos.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No photos found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? 'Try adjusting your search terms.' : 'Upload your first photo to get started.'}
            </p>
          </div>
        )}

        {/* Photo Detail Modal */}
        {selectedPhoto && (
          <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{selectedPhoto.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <User className="mr-2 h-4 w-4" />
                    {selectedPhoto.uploadedBy}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="mr-2 h-4 w-4" />
                    {format(new Date(selectedPhoto.uploadedAt), 'PPP')}
                  </div>
                  {selectedPhoto.location && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="mr-2 h-4 w-4" />
                      {selectedPhoto.location}
                    </div>
                  )}
                </div>
                <p className="text-gray-700">{selectedPhoto.caption}</p>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  );
}