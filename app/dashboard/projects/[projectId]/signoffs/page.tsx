'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Layout } from '@/components/ui/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { getProject, getJobSignoffsByProject, createJobSignoff, updateJobSignoff } from '@/lib/db';
import { getUser } from '@/lib/supabase';
import { Plus, PenTool, CheckCircle, XCircle, Clock, Camera, FileText, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import type { Project, JobSignoff } from '@/types/models';

export default function JobSignoffsPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [project, setProject] = useState<Project | null>(null);
  const [signoffs, setSignoffs] = useState<JobSignoff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSigningOpen, setIsSigningOpen] = useState(false);
  const [selectedSignoff, setSelectedSignoff] = useState<JobSignoff | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [signatureData, setSignatureData] = useState<string>('');

  useEffect(() => {
    const initialize = async () => {
      try {
        const user = await getUser();
        if (!user) return;

        const projectData = await getProject(projectId);
        if (!projectData) return;

        setProject(projectData);
        const signoffsData = await getJobSignoffsByProject(projectId);
        setSignoffs(signoffsData);
      } catch (error) {
        console.error('Error loading job signoffs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [projectId]);

  const handleCreateSignoff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const user = await getUser();
      if (!user) throw new Error('User not authenticated');

      const signoff = await createJobSignoff({
        project_id: projectId,
        title: title.trim(),
        description: description.trim() || undefined,
        status: 'pending',
        photos: [], // TODO: Handle photo uploads
        notes: notes.trim() || undefined,
        created_by: user.id,
      });

      setSignoffs([signoff, ...signoffs]);
      
      // Reset form
      setTitle('');
      setDescription('');
      setNotes('');
      setPhotos([]);
      setIsCreateOpen(false);
    } catch (error) {
      console.error('Error creating signoff:', error);
      alert('Failed to create signoff. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Save signature as base64
    const dataURL = canvas.toDataURL();
    setSignatureData(dataURL);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureData('');
  };

  const handleSignoff = async (signoffId: string, status: 'approved' | 'rejected') => {
    if (status === 'approved' && !signatureData) {
      alert('Please provide a signature to approve this job.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const user = await getUser();
      if (!user) throw new Error('User not authenticated');

      const updates: Partial<JobSignoff> = {
        status,
        signed_by: user.id,
        signed_at: new Date().toISOString(),
      };

      if (status === 'approved' && signatureData) {
        updates.signature_data = signatureData;
      }

      const updatedSignoff = await updateJobSignoff(signoffId, updates);
      
      setSignoffs(signoffs.map(s => s.id === signoffId ? updatedSignoff : s));
      setIsSigningOpen(false);
      setSelectedSignoff(null);
      setSignatureData('');
      clearSignature();
    } catch (error) {
      console.error('Error signing off job:', error);
      alert('Failed to sign off job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openSigningDialog = (signoff: JobSignoff) => {
    setSelectedSignoff(signoff);
    setIsSigningOpen(true);
  };

  const getStatusColor = (status: JobSignoff['status']) => {
    switch (status) {
      case 'pending': return 'default';
      case 'approved': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: JobSignoff['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Job Sign-offs</h1>
            <p className="mt-1 text-sm text-gray-500">
              Project: {project?.name}
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Sign-off Request
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Sign-off Request</DialogTitle>
                <DialogDescription>
                  Create a new job or milestone that requires approval and sign-off.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateSignoff} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job/Milestone Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Track Section 4A-4B Completion"
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
                    placeholder="Detailed description of work completed..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional notes or requirements..."
                    rows={2}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create Sign-off Request'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Sign-offs List */}
        <div className="space-y-4">
          {signoffs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <PenTool className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No sign-offs yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Create your first job sign-off request to track approvals.
                </p>
              </CardContent>
            </Card>
          ) : (
            signoffs.map((signoff) => (
              <Card key={signoff.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <CardTitle className="text-lg">{signoff.title}</CardTitle>
                        <Badge variant={getStatusColor(signoff.status)} className="flex items-center space-x-1">
                          {getStatusIcon(signoff.status)}
                          <span className="capitalize">{signoff.status}</span>
                        </Badge>
                      </div>
                      <CardDescription>
                        Created {format(new Date(signoff.created_at), 'PPP')}
                      </CardDescription>
                    </div>
                    {signoff.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => openSigningDialog(signoff)}
                      >
                        <PenTool className="mr-2 h-4 w-4" />
                        Sign Off
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {signoff.description && (
                      <p className="text-gray-700">{signoff.description}</p>
                    )}
                    
                    {signoff.notes && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-sm text-amber-800">{signoff.notes}</p>
                      </div>
                    )}
                    
                    {signoff.signed_by && signoff.signed_at && (
                      <div className="flex items-center justify-between text-sm text-gray-600 pt-3 border-t">
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          Signed by: {signoff.signed_by}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4" />
                          {format(new Date(signoff.signed_at), 'PPP')}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Digital Signature Dialog */}
        <Dialog open={isSigningOpen} onOpenChange={setIsSigningOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Sign Off Job</DialogTitle>
              <DialogDescription>
                {selectedSignoff?.title}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Digital Signature <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={200}
                    className="border border-gray-200 rounded cursor-crosshair w-full"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    style={{ touchAction: 'none' }}
                  />
                  <div className="flex justify-between mt-2">
                    <p className="text-xs text-gray-500">Sign above to approve this job</p>
                    <Button type="button" variant="outline" size="sm" onClick={clearSignature}>
                      Clear
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => selectedSignoff && handleSignoff(selectedSignoff.id, 'rejected')}
                  disabled={isSubmitting}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button
                  type="button"
                  onClick={() => selectedSignoff && handleSignoff(selectedSignoff.id, 'approved')}
                  disabled={isSubmitting || !signatureData}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Signing...' : 'Approve & Sign'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}