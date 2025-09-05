// import { supabase, createServerClient } from './supabase';
import type { Org, Project, FileMeta, DailyReport, PunchItem, ChecklistTemplate, ChecklistSubmission } from '@/types/models';

// Mock data for development
const mockOrgs: Org[] = [
  { id: 'org-1', name: 'Demo Railroad Company', created_at: new Date().toISOString() }
];

const mockProjects: Project[] = [
  {
    id: 'project-1',
    org_id: 'org-1',
    name: 'Main Line Extension Phase 2',
    description: 'Extension of main rail line from Station A to Station B',
    distribution_list: ['manager@railroad.com', 'inspector@dot.gov'],
    location: { lat: 40.7128, lng: -74.0060 },
    status: 'active',
    created_by: 'demo-user',
    created_at: new Date().toISOString()
  }
];

const mockFiles: FileMeta[] = [
  {
    id: 'file-1',
    project_id: 'project-1',
    name: 'Track Section Photo.jpg',
    path: 'project-1/track-section.jpg',
    mime_type: 'image/jpeg',
    size_bytes: 2456789,
    tags: ['track', 'progress', 'section-4a'],
    lat: 40.7128,
    lng: -74.0060,
    uploaded_by: 'demo-user',
    created_at: new Date().toISOString()
  },
  {
    id: 'file-2',
    project_id: 'project-1',
    name: 'Bridge Foundation.jpg',
    path: 'project-1/bridge-foundation.jpg',
    mime_type: 'image/jpeg',
    size_bytes: 3456789,
    tags: ['bridge', 'foundation', 'inspection'],
    lat: 40.7589,
    lng: -73.9851,
    uploaded_by: 'demo-user',
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'file-3',
    project_id: 'project-1',
    name: 'Safety Report.pdf',
    path: 'project-1/safety-report.pdf',
    mime_type: 'application/pdf',
    size_bytes: 1234567,
    tags: ['safety', 'report', 'compliance'],
    uploaded_by: 'demo-user',
    created_at: new Date(Date.now() - 172800000).toISOString()
  }
];
const mockReports: DailyReport[] = [];
const mockPunchItems: PunchItem[] = [];
const mockTemplates: ChecklistTemplate[] = [];
const mockSubmissions: ChecklistSubmission[] = [];
const mockSignoffs: any[] = [];
const mockProjectNotes: ProjectNote[] = [];
const mockProjectMedia: ProjectMedia[] = [];

// Organizations
export const getOrgs = async (): Promise<Org[]> => {
  // Return mock data for development
  return mockOrgs;
};

export const createOrg = async (name: string): Promise<Org> => {
  // Create mock org for development
  const org: Org = {
    id: `org-${Date.now()}`,
    name,
    created_at: new Date().toISOString()
  };
  mockOrgs.unshift(org);
  return org;
};

// Projects
export const getProjectsByOrg = async (orgId: string): Promise<Project[]> => {
  // Return mock projects for development
  return mockProjects.filter(p => p.org_id === orgId);
};

export const getProject = async (projectId: string): Promise<Project | null> => {
  // Return mock project for development
  return mockProjects.find(p => p.id === projectId) || null;
};

export const createProject = async (project: Omit<Project, 'id' | 'created_at'>): Promise<Project> => {
  // Create mock project for development
  const newProject: Project = {
    ...project,
    status: 'active',
    id: `project-${Date.now()}`,
    created_at: new Date().toISOString()
  };
  mockProjects.unshift(newProject);
  return newProject;
};

// Files
export const getFilesByProject = async (projectId: string): Promise<FileMeta[]> => {
  // Return mock files for development
  return mockFiles.filter(f => f.project_id === projectId);
};

export const searchFiles = async (projectId: string, query: string): Promise<FileMeta[]> => {
  // Return filtered mock files for development
  return mockFiles.filter(f => 
    f.project_id === projectId && 
    (f.name.toLowerCase().includes(query.toLowerCase()) || 
     f.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())))
  );
};

export const createFileMeta = async (fileMeta: Omit<FileMeta, 'id' | 'created_at'>): Promise<FileMeta> => {
  // Create mock file meta for development
  const newFile: FileMeta = {
    ...fileMeta,
    id: `file-${Date.now()}`,
    created_at: new Date().toISOString()
  };
  mockFiles.unshift(newFile);
  return newFile;
};

// Daily Reports
export const getDailyReportsByProject = async (projectId: string): Promise<DailyReport[]> => {
  // Return mock reports for development
  return mockReports.filter(r => r.project_id === projectId);
};

export const createDailyReport = async (report: Omit<DailyReport, 'id' | 'created_at'>): Promise<DailyReport> => {
  // Create mock report for development
  const newReport: DailyReport = {
    ...report,
    id: `report-${Date.now()}`,
    created_at: new Date().toISOString()
  };
  mockReports.unshift(newReport);
  return newReport;
};

// Punch Items
export const getPunchItemsByProject = async (projectId: string): Promise<PunchItem[]> => {
  // Return mock punch items for development
  return mockPunchItems.filter(p => p.project_id === projectId);
};

export const createPunchItem = async (item: Omit<PunchItem, 'id' | 'created_at'>): Promise<PunchItem> => {
  // Create mock punch item for development
  const newItem: PunchItem = {
    ...item,
    id: `punch-${Date.now()}`,
    created_at: new Date().toISOString()
  };
  mockPunchItems.unshift(newItem);
  return newItem;
};

export const updatePunchItem = async (id: string, updates: Partial<PunchItem>): Promise<PunchItem> => {
  // Update mock punch item for development
  const index = mockPunchItems.findIndex(p => p.id === id);
  if (index !== -1) {
    mockPunchItems[index] = { ...mockPunchItems[index], ...updates };
    return mockPunchItems[index];
  }
  throw new Error('Punch item not found');
};

// Checklist Templates
export const getChecklistTemplatesByOrg = async (orgId: string): Promise<ChecklistTemplate[]> => {
  // Return mock templates for development
  return mockTemplates.filter(t => t.org_id === orgId);
};

export const createChecklistTemplate = async (template: Omit<ChecklistTemplate, 'id' | 'created_at'>): Promise<ChecklistTemplate> => {
  // Create mock template for development
  const newTemplate: ChecklistTemplate = {
    ...template,
    id: `template-${Date.now()}`,
    created_at: new Date().toISOString()
  };
  mockTemplates.unshift(newTemplate);
  return newTemplate;
};

// Checklist Submissions
export const getChecklistSubmissionsByProject = async (projectId: string): Promise<ChecklistSubmission[]> => {
  // Return mock submissions for development
  return mockSubmissions.filter(s => s.project_id === projectId);
};

export const createChecklistSubmission = async (submission: Omit<ChecklistSubmission, 'id' | 'created_at'>): Promise<ChecklistSubmission> => {
  // Create mock submission for development
  const newSubmission: ChecklistSubmission = {
    ...submission,
    id: `submission-${Date.now()}`,
    created_at: new Date().toISOString()
  };
  mockSubmissions.unshift(newSubmission);
  return newSubmission;
};

// Job Sign-offs
export const getJobSignoffsByProject = async (projectId: string): Promise<JobSignoff[]> => {
  // Return mock signoffs for development
  return mockSignoffs.filter(s => s.project_id === projectId);
};

export const createJobSignoff = async (signoff: Omit<JobSignoff, 'id' | 'created_at'>): Promise<JobSignoff> => {
  // Create mock signoff for development
  const newSignoff: JobSignoff = {
    ...signoff,
    id: `signoff-${Date.now()}`,
    created_at: new Date().toISOString()
  };
  mockSignoffs.unshift(newSignoff);
  return newSignoff;
};

export const updateJobSignoff = async (id: string, updates: Partial<JobSignoff>): Promise<JobSignoff> => {
  // Update mock signoff for development
  const index = mockSignoffs.findIndex(s => s.id === id);
  if (index !== -1) {
    mockSignoffs[index] = { ...mockSignoffs[index], ...updates };
    return mockSignoffs[index];
  }
  throw new Error('Job signoff not found');
};

// Project Notes
export const getProjectNotes = async (projectId: string): Promise<ProjectNote[]> => {
  return mockProjectNotes.filter(n => n.project_id === projectId);
};

export const searchProjectNotes = async (query: string): Promise<ProjectNote[]> => {
  return mockProjectNotes.filter(note => 
    note.title.toLowerCase().includes(query.toLowerCase()) ||
    note.content.toLowerCase().includes(query.toLowerCase())
  );
};

export const createProjectNote = async (note: Omit<ProjectNote, 'id' | 'created_at'>): Promise<ProjectNote> => {
  const newNote: ProjectNote = {
    ...note,
    id: `note-${Date.now()}`,
    created_at: new Date().toISOString()
  };
  mockProjectNotes.unshift(newNote);
  return newNote;
};

// Project Media
export const getProjectMedia = async (projectId: string): Promise<ProjectMedia[]> => {
  return mockProjectMedia.filter(m => m.project_id === projectId);
};

export const searchProjectMedia = async (query: string): Promise<ProjectMedia[]> => {
  return mockProjectMedia.filter(media => 
    media.file_name.toLowerCase().includes(query.toLowerCase()) ||
    (media.caption && media.caption.toLowerCase().includes(query.toLowerCase()))
  );
};

export const getAllProjectNotes = async (): Promise<ProjectNote[]> => {
  return mockProjectNotes;
};

export const getAllProjectMedia = async (): Promise<ProjectMedia[]> => {
  return mockProjectMedia;
};

export const createProjectMedia = async (media: Omit<ProjectMedia, 'id' | 'created_at'>): Promise<ProjectMedia> => {
  const newMedia: ProjectMedia = {
    ...media,
    id: `media-${Date.now()}`,
    timestamp: new Date().toISOString(),
    created_at: new Date().toISOString()
  };
  mockProjectMedia.unshift(newMedia);
  return newMedia;
};

// Project Status
export const updateProjectStatus = async (projectId: string, status: Project['status']): Promise<Project> => {
  const index = mockProjects.findIndex(p => p.id === projectId);
  if (index !== -1) {
    mockProjects[index] = { ...mockProjects[index], status };
    return mockProjects[index];
  }
  throw new Error('Project not found');
};