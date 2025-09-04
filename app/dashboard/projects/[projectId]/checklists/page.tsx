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
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { getProject, getChecklistTemplatesByOrg, getChecklistSubmissionsByProject, createChecklistTemplate, createChecklistSubmission } from '@/lib/db';
import { getUser } from '@/lib/supabase';
import { Plus, FileText, CheckSquare, Download, X } from 'lucide-react';
import { format } from 'date-fns';
import type { Project, ChecklistTemplate, ChecklistSubmission, ChecklistField } from '@/types/models';

export default function ChecklistsPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [templates, setTemplates] = useState<ChecklistTemplate[]>([]);
  const [submissions, setSubmissions] = useState<ChecklistSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateTemplateOpen, setIsCreateTemplateOpen] = useState(false);
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ChecklistTemplate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Template form state
  const [templateName, setTemplateName] = useState('');
  const [templateFields, setTemplateFields] = useState<ChecklistField[]>([
    { key: 'inspector', label: 'Inspector Name', type: 'text', required: true },
  ]);
  
  // Submission form state
  const [submissionValues, setSubmissionValues] = useState<Record<string, string | number | boolean>>({});

  useEffect(() => {
    const initialize = async () => {
      try {
        const user = await getUser();
        if (!user) return;

        const projectData = await getProject(projectId);
        if (!projectData) return;

        setProject(projectData);
        const templatesData = await getChecklistTemplatesByOrg(projectData.org_id);
        setTemplates(templatesData);
        
        const submissionsData = await getChecklistSubmissionsByProject(projectId);
        setSubmissions(submissionsData);
      } catch (error) {
        console.error('Error loading checklists:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [projectId]);

  const addField = () => {
    const newField: ChecklistField = {
      key: `field_${Date.now()}`,
      label: '',
      type: 'text',
      required: false,
    };
    setTemplateFields([...templateFields, newField]);
  };

  const removeField = (index: number) => {
    setTemplateFields(templateFields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, updates: Partial<ChecklistField>) => {
    const updatedFields = templateFields.map((field, i) => 
      i === index ? { ...field, ...updates } : field
    );
    setTemplateFields(updatedFields);
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName.trim() || !project) return;
    
    setIsSubmitting(true);
    
    try {
      const user = await getUser();
      if (!user) throw new Error('User not authenticated');

      const validFields = templateFields.filter(f => f.label.trim());
      
      const template = await createChecklistTemplate({
        org_id: project.org_id,
        name: templateName.trim(),
        fields: validFields,
        created_by: user.id,
      });

      setTemplates([template, ...templates]);
      
      // Reset form
      setTemplateName('');
      setTemplateFields([{ key: 'inspector', label: 'Inspector Name', type: 'text', required: true }]);
      setIsCreateTemplateOpen(false);
    } catch (error) {
      console.error('Error creating template:', error);
      alert('Failed to create template. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate) return;
    
    setIsSubmitting(true);
    
    try {
      const user = await getUser();
      if (!user) throw new Error('User not authenticated');

      const submission = await createChecklistSubmission({
        project_id: projectId,
        template_id: selectedTemplate.id,
        values: submissionValues,
        created_by: user.id,
      });

      // Generate PDF
      const response = await fetch('/api/checklists/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          submissionId: submission.id,
          projectName: project?.name 
        }),
      });

      // Refresh submissions
      const submissionsData = await getChecklistSubmissionsByProject(projectId);
      setSubmissions(submissionsData);
      
      // Reset form
      setSubmissionValues({});
      setIsSubmissionOpen(false);
      setSelectedTemplate(null);
      
      alert('Checklist submitted successfully!');
    } catch (error) {
      console.error('Error submitting checklist:', error);
      alert('Failed to submit checklist. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openSubmissionDialog = (template: ChecklistTemplate) => {
    setSelectedTemplate(template);
    const initialValues: Record<string, string | number | boolean> = {};
    template.fields.forEach(field => {
      initialValues[field.key] = field.type === 'boolean' ? false : '';
    });
    setSubmissionValues(initialValues);
    setIsSubmissionOpen(true);
  };

  const updateSubmissionValue = (key: string, value: string | number | boolean) => {
    setSubmissionValues(prev => ({ ...prev, [key]: value }));
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
            <h1 className="text-2xl font-bold text-gray-900">Checklists</h1>
            <p className="mt-1 text-sm text-gray-500">
              Project: {project?.name}
            </p>
          </div>
          <Dialog open={isCreateTemplateOpen} onOpenChange={setIsCreateTemplateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Checklist Template</DialogTitle>
                <DialogDescription>
                  Create a reusable checklist template for your organization.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateTemplate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Daily Safety Checklist"
                    required
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Checklist Fields
                    </label>
                    <Button type="button" variant="outline" size="sm" onClick={addField}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {templateFields.map((field, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <Input
                            placeholder="Field label"
                            value={field.label}
                            onChange={(e) => updateField(index, { label: e.target.value })}
                            className="mb-2"
                          />
                          <div className="flex space-x-2">
                            <Select
                              value={field.type}
                              onValueChange={(value: 'text' | 'boolean' | 'number') => 
                                updateField(index, { type: value })
                              }
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="boolean">Yes/No</SelectItem>
                                <SelectItem value="number">Number</SelectItem>
                              </SelectContent>
                            </Select>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={field.required}
                                onCheckedChange={(checked) => 
                                  updateField(index, { required: !!checked })
                                }
                              />
                              <span className="text-xs">Required</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeField(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateTemplateOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create Template'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Checklist Templates</CardTitle>
              <CardDescription>
                Available checklist templates for this organization.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {templates.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckSquare className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No templates yet</p>
                    <p className="text-xs text-gray-400">Create your first checklist template</p>
                  </div>
                ) : (
                  templates.map((template) => (
                    <div
                      key={template.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{template.name}</p>
                        <p className="text-sm text-gray-500">
                          {template.fields.length} fields
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => openSubmissionDialog(template)}
                      >
                        Use Template
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Submissions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
              <CardDescription>
                Previously submitted checklists for this project.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {submissions.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No submissions yet</p>
                  </div>
                ) : (
                  submissions.slice(0, 10).map((submission) => {
                    const template = templates.find(t => t.id === submission.template_id);
                    return (
                      <div
                        key={submission.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {template?.name || 'Unknown Template'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(submission.created_at), 'PPP')}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">Complete</Badge>
                          {submission.pdf_url && (
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submission Dialog */}
        <Dialog open={isSubmissionOpen} onOpenChange={setIsSubmissionOpen}>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Complete Checklist</DialogTitle>
              <DialogDescription>
                {selectedTemplate?.name}
              </DialogDescription>
            </DialogHeader>
            {selectedTemplate && (
              <form onSubmit={handleSubmission} className="space-y-4">
                {selectedTemplate.fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    
                    {field.type === 'text' && (
                      <Input
                        value={submissionValues[field.key] as string || ''}
                        onChange={(e) => updateSubmissionValue(field.key, e.target.value)}
                        required={field.required}
                      />
                    )}
                    
                    {field.type === 'number' && (
                      <Input
                        type="number"
                        value={submissionValues[field.key] as number || ''}
                        onChange={(e) => updateSubmissionValue(field.key, parseFloat(e.target.value) || 0)}
                        required={field.required}
                      />
                    )}
                    
                    {field.type === 'boolean' && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={submissionValues[field.key] as boolean || false}
                          onCheckedChange={(checked) => 
                            updateSubmissionValue(field.key, !!checked)
                          }
                        />
                        <span className="text-sm">Yes</span>
                      </div>
                    )}
                  </div>
                ))}
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsSubmissionOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Checklist'}
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}