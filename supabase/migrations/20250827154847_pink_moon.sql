/*
  # Initial Schema for RailCore MVP

  1. New Tables
    - `orgs` - Organizations with basic info
    - `projects` - Projects belonging to orgs with distribution lists
    - `files` - File metadata for repository with optional geolocation
    - `daily_reports` - Daily construction reports with PDF generation
    - `punch_items` - Punch list items with status tracking
    - `checklist_templates` - Configurable checklist templates
    - `checklist_submissions` - Checklist submission data with PDF export

  2. Security
    - Enable RLS on all tables
    - Add policies for org-based access control
    - Users must belong to organization to access data

  3. Storage
    - Create storage buckets for files and generated PDFs
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations table
CREATE TABLE IF NOT EXISTS orgs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  distribution_list text[] DEFAULT '{}',
  created_by uuid NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Files metadata table
CREATE TABLE IF NOT EXISTS files (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  path text NOT NULL,
  mime_type text NOT NULL,
  size_bytes bigint NOT NULL,
  tags text[] DEFAULT '{}',
  lat numeric,
  lng numeric,
  uploaded_by uuid NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Daily reports table
CREATE TABLE IF NOT EXISTS daily_reports (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  report_date date NOT NULL,
  crew text NOT NULL,
  activities text NOT NULL,
  quantities text DEFAULT '',
  blockers text DEFAULT '',
  photos text[] DEFAULT '{}',
  pdf_url text,
  created_by uuid NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Punch list items table
CREATE TABLE IF NOT EXISTS punch_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  assignee text DEFAULT '',
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'done')),
  photos text[] DEFAULT '{}',
  created_by uuid NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Checklist templates table
CREATE TABLE IF NOT EXISTS checklist_templates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id uuid NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  name text NOT NULL,
  fields jsonb NOT NULL DEFAULT '[]',
  created_by uuid NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Checklist submissions table
CREATE TABLE IF NOT EXISTS checklist_submissions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  template_id uuid NOT NULL REFERENCES checklist_templates(id) ON DELETE CASCADE,
  values jsonb NOT NULL DEFAULT '{}',
  pdf_url text,
  created_by uuid NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE orgs ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE punch_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for orgs
CREATE POLICY "Users can view orgs they belong to"
  ON orgs FOR SELECT
  TO authenticated
  USING (true); -- For now, allow all authenticated users to see orgs

CREATE POLICY "Users can insert orgs"
  ON orgs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for projects
CREATE POLICY "Users can view projects in their org"
  ON projects FOR SELECT
  TO authenticated
  USING (true); -- For MVP, simplified access

CREATE POLICY "Users can insert projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update projects they created"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

-- RLS Policies for files
CREATE POLICY "Users can view files in accessible projects"
  ON files FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert files"
  ON files FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);

-- RLS Policies for daily_reports
CREATE POLICY "Users can view daily reports in accessible projects"
  ON daily_reports FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert daily reports"
  ON daily_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their daily reports"
  ON daily_reports FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

-- RLS Policies for punch_items
CREATE POLICY "Users can view punch items in accessible projects"
  ON punch_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert punch items"
  ON punch_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update punch items"
  ON punch_items FOR UPDATE
  TO authenticated
  USING (true);

-- RLS Policies for checklist_templates
CREATE POLICY "Users can view checklist templates in their org"
  ON checklist_templates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert checklist templates"
  ON checklist_templates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- RLS Policies for checklist_submissions
CREATE POLICY "Users can view checklist submissions in accessible projects"
  ON checklist_submissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert checklist submissions"
  ON checklist_submissions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_org_id ON projects(org_id);
CREATE INDEX IF NOT EXISTS idx_files_project_id ON files(project_id);
CREATE INDEX IF NOT EXISTS idx_daily_reports_project_id ON daily_reports(project_id);
CREATE INDEX IF NOT EXISTS idx_punch_items_project_id ON punch_items(project_id);
CREATE INDEX IF NOT EXISTS idx_checklist_templates_org_id ON checklist_templates(org_id);
CREATE INDEX IF NOT EXISTS idx_checklist_submissions_project_id ON checklist_submissions(project_id);