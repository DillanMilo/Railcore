export type Org = {
  id: string;
  name: string;
  created_at: string;
};

export type Project = {
  id: string;
  org_id: string;
  name: string;
  description: string;
  distribution_list: string[];
  status: 'active' | 'completed' | 'archived';
  created_by: string;
  created_at: string;
};

export type FileMeta = {
  id: string;
  project_id: string;
  path: string;
  name: string;
  tags: string[];
  mime_type: string;
  size_bytes: number;
  lat?: number;
  lng?: number;
  uploaded_by: string;
  created_at: string;
};

export type DailyReport = {
  id: string;
  project_id: string;
  report_date: string;
  crew: string;
  activities: string;
  quantities?: string;
  blockers?: string;
  photos: string[];
  pdf_url?: string;
  created_by: string;
  created_at: string;
};

export type PunchItem = {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  assignee?: string;
  status: 'open' | 'in_progress' | 'done';
  photos: string[];
  created_by: string;
  created_at: string;
};

export type ChecklistField = {
  key: string;
  label: string;
  type: 'text' | 'boolean' | 'number';
  required?: boolean;
};

export type ChecklistTemplate = {
  id: string;
  org_id: string;
  name: string;
  fields: ChecklistField[];
  created_by: string;
  created_at: string;
};

export type ChecklistSubmission = {
  id: string;
  project_id: string;
  template_id: string;
  values: Record<string, string | number | boolean>;
  pdf_url?: string;
  created_by: string;
  created_at: string;
};

export type User = {
  id: string;
  email: string;
  created_at: string;
};

export type JobSignoff = {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
  signed_by?: string;
  signed_at?: string;
  signature_data?: string; // Base64 signature image
  photos: string[];
  notes?: string;
  created_by: string;
  created_at: string;
};

export type ProjectNote = {
  id: string;
  project_id: string;
  title: string;
  content: string;
  type: 'note' | 'observation' | 'issue' | 'progress';
  weather_conditions?: string;
  temperature?: number;
  created_by: string;
  created_at: string;
  updated_at?: string;
};

export type ProjectMedia = {
  id: string;
  project_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  caption?: string;
  location?: { lat: number; lng: number };
  timestamp: string;
  created_by: string;
  created_at: string;
};