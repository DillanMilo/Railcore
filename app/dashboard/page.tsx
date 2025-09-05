"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/ui/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getUser } from "@/lib/supabase";
import { getOrgs, createOrg, getProjectsByOrg, createProject } from "@/lib/db";
import { format } from "date-fns";
import {
  Plus,
  Building2,
  FolderOpen,
  Users,
  Upload,
  FileText,
  Calendar,
  MapPin,
} from "lucide-react";
import { GoogleMap } from "@/components/ui/google-map";
import type { Org, Project } from "@/types/models";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Org | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOrgOpen, setIsCreateOrgOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [distributionEmails, setDistributionEmails] = useState("");
  const router = useRouter();

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const currentUser = await getUser();
        if (!currentUser) {
          router.push("/login");
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
        console.error("Error initializing:", error);
        router.push("/login");
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
      setNewOrgName("");
      setIsCreateOrgOpen(false);
    } catch (error) {
      console.error("Error creating org:", error);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim() || !selectedOrg || !user) return;

    try {
      const distributionList = distributionEmails
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email.length > 0);

      const project = await createProject({
        org_id: selectedOrg.id,
        name: newProjectName.trim(),
        description: newProjectDescription.trim(),
        distribution_list: distributionList,
        created_by: user.id,
      });

      setProjects([project, ...projects]);
      setNewProjectName("");
      setNewProjectDescription("");
      setDistributionEmails("");
      setIsCreateProjectOpen(false);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleOrgChange = async (org: Org) => {
    setSelectedOrg(org);
    try {
      const projectData = await getProjectsByOrg(org.id);
      setProjects(projectData);
    } catch (error) {
      console.error("Error loading projects:", error);
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
      <div className="flex gap-6 h-[calc(100vh-140px)]">
        {/* Left Panel - Projects List */}
        <div className="w-1/2 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Projects</h1>
              <p className="text-sm text-gray-500">
                {projects.length} project{projects.length !== 1 ? "s" : ""}
              </p>
            </div>
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => setIsCreateProjectOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>

          {/* Organization Selector */}
          {orgs.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {orgs.map((org) => (
                <Button
                  key={org.id}
                  size="sm"
                  variant={selectedOrg?.id === org.id ? "default" : "outline"}
                  onClick={() => handleOrgChange(org)}
                  className={
                    selectedOrg?.id === org.id
                      ? "bg-orange-500 hover:bg-orange-600"
                      : ""
                  }
                >
                  <Building2 className="mr-2 h-3 w-3" />
                  {org.name}
                </Button>
              ))}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsCreateOrgOpen(true)}
              >
                <Plus className="mr-2 h-3 w-3" />
                New Org
              </Button>
            </div>
          )}

          {/* Projects List */}
          <div className="flex-1 overflow-y-auto bg-white rounded-lg border border-gray-200">
            {projects.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="p-6 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4">
                  <FolderOpen className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No projects yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Get started by creating your first project.
                </p>
                <Button
                  onClick={() => setIsCreateProjectOpen(true)}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Project
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedProject?.id === project.id
                        ? "bg-orange-50 border-r-4 border-orange-500"
                        : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {project.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {project.description || "No description"}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Users className="mr-1 h-3 w-3" />
                            {project.distribution_list.length} contacts
                          </div>
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            {format(
                              new Date(project.created_at),
                              "MMM d, yyyy"
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/dashboard/projects/${project.id}/workspace`
                            );
                          }}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/dashboard/projects/${project.id}/repository`
                            );
                          }}
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Project Details */}
        <div className="w-1/2 flex flex-col">
          {selectedProject ? (
            <div className="bg-white rounded-lg border border-gray-200 h-full overflow-y-auto">
              {/* Project Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedProject.name}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedProject.description || "No description"}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        router.push(
                          `/dashboard/projects/${selectedProject.id}/workspace`
                        )
                      }
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Workspace
                    </Button>
                    <Button
                      size="sm"
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                      onClick={() =>
                        router.push(
                          `/dashboard/projects/${selectedProject.id}/repository`
                        )
                      }
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Repository
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Client:</span>
                    <p className="font-medium">{selectedOrg?.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Created:</span>
                    <p className="font-medium">
                      {format(
                        new Date(selectedProject.created_at),
                        "MMM d, yyyy"
                      )}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <p className="font-medium capitalize">
                      {selectedProject.status || "Active"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Distribution:</span>
                    <p className="font-medium">
                      {selectedProject.distribution_list.length} contacts
                    </p>
                  </div>
                </div>

                {/* Project Location Map */}
                {selectedProject.location && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-orange-500" />
                      Project Location
                    </h4>
                    <GoogleMap
                      center={selectedProject.location}
                      markers={[
                        {
                          position: selectedProject.location,
                          title: selectedProject.name,
                          info: selectedProject.description,
                        },
                      ]}
                      height="200px"
                    />
                  </div>
                )}
              </div>

              {/* Related Sections */}
              <div className="p-6 space-y-6">
                {/* Related Daily Reports */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Related Daily Reports
                    </h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      3
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">Jan 25, 2024</p>
                        <p className="text-xs text-gray-500">
                          Track laying section 4A-4B
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push("/dashboard/daily-reports")}
                      >
                        View
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">Jan 24, 2024</p>
                        <p className="text-xs text-gray-500">
                          Signal foundation work
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push("/dashboard/daily-reports")}
                      >
                        View
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full text-orange-600"
                      onClick={() => router.push("/dashboard/daily-reports")}
                    >
                      View all reports →
                    </Button>
                  </div>
                </div>

                {/* Related Change Orders */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Related Change Orders
                    </h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      2
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">CO-2024-001</p>
                        <p className="text-xs text-gray-500">
                          Additional track extension
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push("/dashboard/change-orders")}
                      >
                        View
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full text-orange-600"
                      onClick={() => router.push("/dashboard/change-orders")}
                    >
                      View all change orders →
                    </Button>
                  </div>
                </div>

                {/* Related Inspections */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Related Inspections
                    </h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      1
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">
                          Geometry Inspection
                        </p>
                        <p className="text-xs text-gray-500">
                          Scheduled for next week
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push("/dashboard/inspections")}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Related Tasks */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Related Tasks
                    </h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      5
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">
                          Review safety reports
                        </p>
                        <p className="text-xs text-gray-500">Due tomorrow</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push("/dashboard/tasks")}
                      >
                        View
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full text-orange-600"
                      onClick={() => router.push("/dashboard/tasks")}
                    >
                      View all tasks →
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 h-full flex items-center justify-center">
              <div className="text-center p-8">
                <div className="p-6 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4">
                  <FolderOpen className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Select a project
                </h3>
                <p className="text-gray-500">
                  Choose a project from the list to view details and related
                  information.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Create Organization Dialog */}
        <Dialog open={isCreateOrgOpen} onOpenChange={setIsCreateOrgOpen}>
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
                <Button
                  variant="outline"
                  onClick={() => setIsCreateOrgOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateOrg}>Create Organization</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Create Project Dialog */}
        {selectedOrg && (
          <Dialog
            open={isCreateProjectOpen}
            onOpenChange={setIsCreateProjectOpen}
          >
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
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateProjectOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateProject}>Create Project</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  );
}
