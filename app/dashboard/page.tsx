'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/ui/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getUser } from '@/lib/supabase';
import { getOrgs, createOrg, getProjectsByOrg, createProject } from '@/lib/db';
import { format } from 'date-fns';
import { Plus, Building2, FolderOpen, Users, Upload, FileText } from 'lucide-react';
import type { Org, Project } from '@/types/models';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Org | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOrgOpen, setIsCreateOrgOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [distributionEmails, setDistributionEmails] = useState('');
  const router = useRouter();

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const currentUser = await getUser();
        if (!currentUser) {
          router.push('/login');
          return;
        }
        
        setUser(currentUser);
        const orgData = await getOrgs();
        setOrgs(orgData);
        
        if (orgData.length > 0) {
          setSelectedOrg(orgData[0]);
          const projectData = await getProjectsByOrg(orgData[0].id);
          setProjects(projectData);
        }
      } catch (error) {
        console.error('Error initializing:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, [router]);

  const handleCreateOrg = async () => {
    if (!newOrgName.trim()) return;
    
    try {
      const org = await createOrg(newOrgName.trim());
      setOrgs([org, ...orgs]);
      setSelectedOrg(org);
      setNewOrgName('');
      setIsCreateOrgOpen(false);
    } catch (error) {
      console.error('Error creating org:', error);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim() || !selectedOrg || !user) return;
    
    try {
      const distributionList = distributionEmails
        .split(',')
        .map(email => email.trim())
        .filter(email => email.length > 0);

      const project = await createProject({
        org_id: selectedOrg.id,
        name: newProjectName.trim(),
        description: newProjectDescription.trim(),
        distribution_list: distributionList,
        created_by: user.id,
      });

      setProjects([project, ...projects]);
      setNewProjectName('');
      setNewProjectDescription('');
      setDistributionEmails('');
      setIsCreateProjectOpen(false);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleOrgChange = async (org: Org) => {
    setSelectedOrg(org);
    try {
      const projectData = await getProjectsByOrg(org.id);
      setProjects(projectData);
    } catch (error) {
      console.error('Error loading projects:', error);
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
            <h1 className="text-2xl font-bold text-gray-900">Projects Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your rail construction projects and reports
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2">
            <Dialog open={isCreateOrgOpen} onOpenChange={setIsCreateOrgOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Building2 className="mr-2 h-4 w-4" />
                  New Organization
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Organization</DialogTitle>
                  <DialogDescription>
                    Create a new organization to manage projects.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Organization Name
                    </label>
                    <Input
                      value={newOrgName}
                      onChange={(e) => setNewOrgName(e.target.value)}
                      placeholder="ABC Railroad Construction"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreateOrgOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateOrg}>
                      Create Organization
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {selectedOrg && (
              <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Project
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Project</DialogTitle>
                    <DialogDescription>
                      Create a new project in {selectedOrg.name}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project Name
                      </label>
                      <Input
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        placeholder="Main Line Extension Phase 2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <Input
                        value={newProjectDescription}
                        onChange={(e) => setNewProjectDescription(e.target.value)}
                        placeholder="Optional project description"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Distribution List (comma-separated emails)
                      </label>
                      <Input
                        value={distributionEmails}
                        onChange={(e) => setDistributionEmails(e.target.value)}
                        placeholder="manager@company.com, inspector@agency.gov"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsCreateProjectOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateProject}>
                        Create Project
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Organization Selector */}
        {orgs.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {orgs.map((org) => (
              <Button
                key={org.id}
                variant={selectedOrg?.id === org.id ? 'default' : 'outline'}
                onClick={() => handleOrgChange(org)}
              >
                <Building2 className="mr-2 h-4 w-4" />
                {org.name}
              </Button>
            ))}
          </div>
        )}

        {/* Projects Grid */}
        {selectedOrg ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="p-6 bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6">
                  <FolderOpen className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
                <p className="text-gray-500 mb-6">
                  Get started by creating your first project.
                </p>
                <Button onClick={() => setIsCreateProjectOpen(true)} size="lg">
                  <Plus className="mr-2 h-5 w-5" />
                  Create Your First Project
                </Button>
              </div>
            ) : (
              projects.map((project) => (
                <Card key={project.id} className="card-hover cursor-pointer border-0 shadow-lg bg-gradient-to-br from-white to-blue-50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl font-bold text-gray-900 mb-2">{project.name}</CardTitle>
                        <CardDescription className="text-gray-600">{project.description || 'No description'}</CardDescription>
                      </div>
                      <div className="p-2 primary-gradient rounded-lg">
                        <FolderOpen className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="mr-2 h-4 w-4" />
                        {project.distribution_list.length} contacts
                      </div>
                      <p className="text-xs text-gray-500">
                        Created {format(new Date(project.created_at), 'MMM d, yyyy')}
                      </p>
                      <div className="flex flex-col space-y-2">
                        <Button
                          size="sm"
                          className="w-full primary-gradient text-white"
                          onClick={() => router.push(`/dashboard/projects/${project.id}/workspace`)}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Enter Project
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                          onClick={() => router.push(`/dashboard/projects/${project.id}/repository`)}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Repository
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="p-6 bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6">
              <Building2 className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No organizations yet</h3>
            <p className="text-gray-500 mb-6">
              Create your first organization to get started.
            </p>
            <Button onClick={() => setIsCreateOrgOpen(true)} size="lg">
              <Building2 className="mr-2 h-5 w-5" />
              Create Your First Organization
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}