'use client';

import { Layout } from '@/components/ui/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, FileText, Shield, Zap, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-orange-500 rounded-xl">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">RailCore CM</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Professional rail construction management and reporting platform designed for the construction industry.
          </p>
          <Badge className="mt-4 bg-orange-100 text-orange-800">
            Version 1.0.0
          </Badge>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="p-2 bg-orange-500 rounded-lg w-fit mb-2">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Project Management</CardTitle>
              <CardDescription>
                Comprehensive project tracking with daily reports, punch lists, and document management.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="p-2 bg-orange-500 rounded-lg w-fit mb-2">
                <Users className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Team Collaboration</CardTitle>
              <CardDescription>
                Role-based access control with team management and automated notifications.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="p-2 bg-orange-500 rounded-lg w-fit mb-2">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Safety Compliance</CardTitle>
              <CardDescription>
                Track safety incidents, inspections, and maintain compliance with industry standards.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="p-2 bg-orange-500 rounded-lg w-fit mb-2">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Automated Reporting</CardTitle>
              <CardDescription>
                Generate professional PDF reports with automated email distribution to stakeholders.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="p-2 bg-orange-500 rounded-lg w-fit mb-2">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Mobile Ready</CardTitle>
              <CardDescription>
                Progressive Web App (PWA) with offline capabilities for field use.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="p-2 bg-orange-500 rounded-lg w-fit mb-2">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Industry Focused</CardTitle>
              <CardDescription>
                Built specifically for rail construction with industry-standard workflows and terminology.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Technical Stack</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Frontend:</span>
                    <span>Next.js 14 + TypeScript</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Database:</span>
                    <span>Supabase PostgreSQL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Authentication:</span>
                    <span>Supabase Auth</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Storage:</span>
                    <span>Supabase Storage</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email:</span>
                    <span>Resend API</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Features</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Organizations:</span>
                    <span>Multi-tenant support</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Projects:</span>
                    <span>Unlimited projects</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">File Storage:</span>
                    <span>Unlimited uploads</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">PDF Generation:</span>
                    <span>Automated reports</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Mobile Support:</span>
                    <span>PWA enabled</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Information */}
        <Card>
          <CardHeader>
            <CardTitle>Support & Documentation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Getting Started</h4>
                <p className="text-sm text-gray-600">
                  New to RailCore? Check out our getting started guide to learn how to set up your first project 
                  and begin tracking construction activities.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">User Guide</h4>
                <p className="text-sm text-gray-600">
                  Comprehensive documentation covering all features including daily reports, punch lists, 
                  checklist templates, and file management.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">API Documentation</h4>
                <p className="text-sm text-gray-600">
                  For developers looking to integrate with RailCore or build custom extensions, 
                  our API documentation provides complete endpoint references.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Support Contact</h4>
                <p className="text-sm text-gray-600">
                  Need help? Contact our support team at support@railcore.com or visit our help center 
                  for frequently asked questions and troubleshooting guides.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}