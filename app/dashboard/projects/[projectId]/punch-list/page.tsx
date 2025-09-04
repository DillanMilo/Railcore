'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Layout } from '@/components/ui/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { getProject, getPunchItemsByProject, createPunchItem, updatePunchItem } from '@/lib/db';
import { getUser } from '@/lib/supabase';
import { Plus, CheckSquare, FileDown, User } from 'lucide-react';
import { format } from 'date-fns';
import type { Project, PunchItem } from '@/types/models';

export default function PunchListPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [punchItems, setPunchItems] = useState<PunchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('');

  useEffect(() => {
    const initialize = async () => {
      try {
        const user = await getUser();
        if (!user) return;

        const projectData = await getProject(projectId);
        if (!projectData) return;

        setProject(projectData);
        const itemsData = await getPunchItemsByProject(projectId);
        setPunchItems(itemsData);
      } catch (error) {
        console.error('Error loading punch list:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [projectId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const user = await getUser();
      if (!user) throw new Error('User not authenticated');

      const item = await createPunchItem({
        project_id: projectId,
        title: title.trim(),
        description: description.trim() || undefined,
        assignee: assignee.trim() || undefined,
        status: 'open',
        photos: [],
        created_by: user.id,
      });

      setPunchItems([item, ...punchItems]);
      
      // Reset form
      setTitle('');
      setDescription('');
      setAssignee('');
      setIsCreateOpen(false);
    } catch (error) {
      console.error('Error creating punch item:', error);
      alert('Failed to create punch item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (itemId: string, status: PunchItem['status']) => {
    try {
      const updatedItem = await updatePunchItem(itemId, { status });
      setPunchItems(items => 
        items.map(item => item.id === itemId ? { ...item, status } : item)
      );
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const handleExportPDF = async () => {
    try {
      const response = await fetch('/api/punch/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${project?.name}-punch-list.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error('Failed to generate PDF');
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  const getStatusColor = (status: PunchItem['status']) => {
    switch (status) {
      case 'open': return 'destructive';
      case 'in_progress': return 'default';
      case 'done': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: PunchItem['status']) => {
    switch (status) {
      case 'open': return 'Open';
      case 'in_progress': return 'In Progress';
      case 'done': return 'Complete';
      default: return status;
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
            <h1 className="text-2xl font-bold text-gray-900">Punch List</h1>
            <p className="mt-1 text-sm text-gray-500">
              Project: {project?.name}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleExportPDF}>
              <FileDown className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Punch Item</DialogTitle>
                  <DialogDescription>
                    Add a new item to the punch list.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Fix handrail installation"
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
                      placeholder="Detailed description of the work needed..."
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assignee
                    </label>
                    <Input
                      value={assignee}
                      onChange={(e) => setAssignee(e.target.value)}
                      placeholder="John Smith"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Creating...' : 'Create Item'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Punch Items List */}
        <div className="space-y-4">
          {punchItems.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <CheckSquare className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No punch items yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Create your first punch item to track issues and defects.
                </p>
              </CardContent>
            </Card>
          ) : (
            punchItems.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription className="mt-1">
                        Created {format(new Date(item.created_at), 'PPP')}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getStatusColor(item.status)}>
                        {getStatusLabel(item.status)}
                      </Badge>
                      <Select
                        value={item.status}
                        onValueChange={(value: PunchItem['status']) => 
                          handleStatusChange(item.id, value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="done">Complete</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                {(item.description || item.assignee) && (
                  <CardContent>
                    {item.description && (
                      <p className="text-gray-700 mb-3">{item.description}</p>
                    )}
                    {item.assignee && (
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="mr-2 h-4 w-4" />
                        Assigned to: {item.assignee}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}