'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/ui/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { getUser } from '@/lib/supabase';
import { Plus, Search, Folder, FileText, Download, Upload, Calendar, User, Filter, Grid, List } from 'lucide-react';
import { format } from 'date-fns';

interface Document {
  id: string;
  name: string;
  type: string;
  category: 'contract' | 'specification' | 'drawing' | 'permit' | 'report' | 'correspondence' | 'other';
  size: number;
  version: string;
  status: 'draft' | 'review' | 'approved' | 'archived';
  uploadedBy: string;
  uploadedAt: string;
  project?: string;
  description?: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Project Specifications v2.1.pdf',
      type: 'PDF',
      category: 'specification',
      size: 2456789,
      version: '2.1',
      status: 'approved',
      uploadedBy: 'Engineering Team',
      uploadedAt: '2024-01-15T10:30:00Z',
      project: 'Main Line Extension',
      description: 'Technical specifications for track construction'
    },
    {
      id: '2',
      name: 'Environmental Permit.pdf',
      type: 'PDF',
      category: 'permit',
      size: 1234567,
      version: '1.0',
      status: 'approved',
      uploadedBy: 'Environmental Consultant',
      uploadedAt: '2024-01-10T14:20:00Z',
      project: 'Environmental Compliance',
      description: 'Environmental impact assessment and permits'
    },
    {
      id: '3',
      name: 'Track Layout Drawing.dwg',
      type: 'DWG',
      category: 'drawing',
      size: 5678901,
      version: '3.2',
      status: 'review',
      uploadedBy: 'CAD Designer',
      uploadedAt: '2024-01-20T09:15:00Z',
      project: 'Design Phase',
      description: 'Detailed track layout and alignment drawings'
    },
    {
      id: '4',
      name: 'Safety Manual 2024.pdf',
      type: 'PDF',
      category: 'other',
      size: 3456789,
      version: '1.0',
      status: 'approved',
      uploadedBy: 'Safety Officer',
      uploadedAt: '2024-01-05T08:00:00Z',
      description: 'Updated safety procedures and protocols'
    },
    {
      id: '5',
      name: 'Contract Amendment.docx',
      type: 'DOCX',
      category: 'contract',
      size: 987654,
      version: '1.1',
      status: 'draft',
      uploadedBy: 'Legal Team',
      uploadedAt: '2024-01-22T16:45:00Z',
      project: 'Contract Management',
      description: 'Contract modifications and amendments'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>(documents);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  useEffect(() => {
    let filtered = documents.filter(doc =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filterCategory !== 'all') {
      filtered = filtered.filter(doc => doc.category === filterCategory);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(doc => doc.status === filterStatus);
    }

    setFilteredDocuments(filtered);
  }, [searchQuery, documents, filterCategory, filterStatus]);

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: Document['category']) => {
    switch (category) {
      case 'contract': return 'bg-purple-100 text-purple-800';
      case 'specification': return 'bg-blue-100 text-blue-800';
      case 'drawing': return 'bg-green-100 text-green-800';
      case 'permit': return 'bg-orange-100 text-orange-800';
      case 'report': return 'bg-red-100 text-red-800';
      case 'correspondence': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
            <p className="mt-1 text-sm text-gray-500">
              Document repository and file management
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
                <DialogDescription>
                  Upload a new document to the repository.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select File
                  </label>
                  <Input type="file" accept=".pdf,.doc,.docx,.dwg,.xls,.xlsx" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="specification">Specification</SelectItem>
                      <SelectItem value="drawing">Drawing</SelectItem>
                      <SelectItem value="permit">Permit</SelectItem>
                      <SelectItem value="report">Report</SelectItem>
                      <SelectItem value="correspondence">Correspondence</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <Input placeholder="Document description..." />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    Upload Document
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search Documents"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="specification">Specification</SelectItem>
                <SelectItem value="drawing">Drawing</SelectItem>
                <SelectItem value="permit">Permit</SelectItem>
                <SelectItem value="report">Report</SelectItem>
                <SelectItem value="correspondence">Correspondence</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
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
        </div>

        {/* Documents Display */}
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
        }>
          {filteredDocuments.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Folder className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No documents found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery ? 'Try adjusting your search terms.' : 'Upload your first document to get started.'}
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            filteredDocuments.map((doc) => (
              <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2 flex-1">
                      <FileText className="h-5 w-5 text-orange-500" />
                      <CardTitle className="text-lg truncate">{doc.name}</CardTitle>
                    </div>
                  </div>
                  <CardDescription>
                    v{doc.version} • {format(new Date(doc.uploadedAt), 'MMM d, yyyy')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge className={getCategoryColor(doc.category)}>
                        {doc.category.charAt(0).toUpperCase() + doc.category.slice(1)}
                      </Badge>
                      <Badge className={getStatusColor(doc.status)}>
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      {formatFileSize(doc.size)} • {doc.type}
                    </div>
                    
                    {doc.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{doc.description}</p>
                    )}
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="mr-1 h-4 w-4" />
                      {doc.uploadedBy}
                    </div>
                    
                    <Button size="sm" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            filteredDocuments.map((doc) => (
              <Card key={doc.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <FileText className="h-6 w-6 text-orange-500" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{doc.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span>v{doc.version}</span>
                          <span>{formatFileSize(doc.size)}</span>
                          <span>{format(new Date(doc.uploadedAt), 'MMM d, yyyy')}</span>
                          <span>{doc.uploadedBy}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className={getCategoryColor(doc.category)}>
                            {doc.category.charAt(0).toUpperCase() + doc.category.slice(1)}
                          </Badge>
                          <Badge className={getStatusColor(doc.status)}>
                            {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Document Stats */}
        {documents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Document Repository Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {documents.filter(d => d.status === 'approved').length}
                  </div>
                  <div className="text-sm text-gray-500">Approved</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {documents.filter(d => d.status === 'review').length}
                  </div>
                  <div className="text-sm text-gray-500">In Review</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-600">
                    {documents.filter(d => d.status === 'draft').length}
                  </div>
                  <div className="text-sm text-gray-500">Draft</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(documents.reduce((acc, d) => acc + d.size, 0) / (1024 * 1024))} MB
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