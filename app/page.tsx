"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Building2,
  FileText,
  CheckSquare,
  Upload,
  Users,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getUser();
        if (user) {
          router.push("/dashboard");
        }
      } catch (error) {
        // User not authenticated, stay on landing page
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="border-b glass-effect backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 primary-gradient rounded-xl">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              RailCore
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.push("/login")}>
              Sign In
            </Button>
            <Button
              onClick={() => router.push("/login")}
              className="primary-gradient text-white shadow-lg"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-8 leading-tight">
            Rail Construction
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Made Simple
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Streamline your rail projects with powerful record-keeping,
            automated daily reports, and comprehensive project management tools
            designed for the construction industry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => router.push("/login")}
              className="primary-gradient text-white shadow-xl hover:shadow-2xl"
            >
              Start Your Project
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Everything You Need to Manage Rail Projects
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-10">
            <Card className="card-hover border-0 shadow-lg bg-gradient-to-br from-white to-blue-50">
              <CardHeader>
                <div className="p-3 primary-gradient rounded-2xl w-fit mb-4">
                  <Upload className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">
                  Document Repository
                </CardTitle>
                <CardDescription>
                  Centralized file storage with tagging, search, and optional
                  GPS coordinates for field documentation.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover border-0 shadow-lg bg-gradient-to-br from-white to-orange-50">
              <CardHeader>
                <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl w-fit mb-4">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">
                  Daily Reports
                </CardTitle>
                <CardDescription>
                  Automated PDF generation and email distribution to keep
                  stakeholders informed of daily progress.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover border-0 shadow-lg bg-gradient-to-br from-white to-green-50">
              <CardHeader>
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl w-fit mb-4">
                  <CheckSquare className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">Punch Lists</CardTitle>
                <CardDescription>
                  Track defects and incomplete work with status updates,
                  assignments, and exportable reports.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover border-0 shadow-lg bg-gradient-to-br from-white to-purple-50">
              <CardHeader>
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl w-fit mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">
                  Team Management
                </CardTitle>
                <CardDescription>
                  Organize projects by teams and organizations with role-based
                  access and automated notifications.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover border-0 shadow-lg bg-gradient-to-br from-white to-indigo-50">
              <CardHeader>
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl w-fit mb-4">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">
                  Quality Checklists
                </CardTitle>
                <CardDescription>
                  Configurable inspection forms and quality control checklists
                  with digital submission tracking.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover border-0 shadow-lg bg-gradient-to-br from-white to-teal-50">
              <CardHeader>
                <div className="p-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl w-fit mb-4">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">
                  Export & Reports
                </CardTitle>
                <CardDescription>
                  Professional PDF exports for all documentation with automated
                  distribution to project stakeholders.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 primary-gradient">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            Ready to Transform Your Rail Projects?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
            Join construction teams already using RailCore to streamline their
            operations and improve project efficiency.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => router.push("/login")}
            className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl"
          >
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 text-white">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-2 primary-gradient rounded-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              RailCore
            </span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 RailCore. Built for the rail construction industry.
          </p>
        </div>
      </footer>
    </div>
  );
}
