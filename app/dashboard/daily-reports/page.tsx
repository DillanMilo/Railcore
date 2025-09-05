"use client";

import React, { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { getUser } from "@/lib/supabase";
import {
  Plus,
  Search,
  FileText,
  Calendar,
  User,
  Download,
  Eye,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";

interface DailyReportSummary {
  id: string;
  date: string;
  project: string;
  crew: string;
  activitiesSummary: string;
  status: "draft" | "submitted" | "approved";
  submittedBy: string;
  submittedAt: string;
  pdfUrl?: string;
}

export default function DailyReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<DailyReportSummary[]>([
    {
      id: "1",
      date: "2024-01-25",
      project: "Main Line Extension Phase 2",
      crew: "John Smith (Foreman), Mike Johnson, Sarah Davis",
      activitiesSummary:
        "Completed track laying for section 4A-4B, installed concrete ties, tested alignment",
      status: "approved",
      submittedBy: "John Smith",
      submittedAt: "2024-01-25T17:30:00Z",
      pdfUrl: "mock-url",
    },
    {
      id: "2",
      date: "2024-01-24",
      project: "Main Line Extension Phase 2",
      crew: "John Smith (Foreman), Tom Wilson, Alex Brown",
      activitiesSummary:
        "Excavation for signal foundation, ballast placement, safety briefing",
      status: "submitted",
      submittedBy: "John Smith",
      submittedAt: "2024-01-24T16:45:00Z",
      pdfUrl: "mock-url",
    },
    {
      id: "3",
      date: "2024-01-23",
      project: "Bridge Construction",
      crew: "Lisa Chen (Supervisor), Mark Taylor, Jennifer Lee",
      activitiesSummary:
        "Bridge deck preparation, rebar installation, concrete pour preparation",
      status: "approved",
      submittedBy: "Lisa Chen",
      submittedAt: "2024-01-23T18:00:00Z",
      pdfUrl: "mock-url",
    },
    {
      id: "4",
      date: "2024-01-22",
      project: "Signal Installation",
      crew: "David Kim (Technician), Robert Johnson",
      activitiesSummary:
        "Signal cabinet installation, cable routing, system testing",
      status: "draft",
      submittedBy: "David Kim",
      submittedAt: "2024-01-22T15:20:00Z",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredReports, setFilteredReports] =
    useState<DailyReportSummary[]>(reports);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedReport, setSelectedReport] =
    useState<DailyReportSummary | null>(null);

  useEffect(() => {
    const filtered = reports.filter(
      (report) =>
        report.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.crew.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.activitiesSummary
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        report.submittedBy.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredReports(filtered);
  }, [searchQuery, reports]);

  const getStatusColor = (status: DailyReportSummary["status"]) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "submitted":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const toggleRowExpansion = (reportId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(reportId)) {
      newExpandedRows.delete(reportId);
    } else {
      newExpandedRows.add(reportId);
    }
    setExpandedRows(newExpandedRows);
  };

  return (
    <Layout>
      <div className="flex gap-6 h-[calc(100vh-140px)]">
        {/* Left Panel - Reports List */}
        <div className="w-1/2 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Daily Reports</h1>
              <p className="text-sm text-gray-500">
                {filteredReports.length} report
                {filteredReports.length !== 1 ? "s" : ""}
              </p>
            </div>
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => {
                // Navigate to create daily report or open dialog
                router.push("/dashboard/projects/project-1/daily-report");
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search Daily Reports"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Reports List */}
          <div className="flex-1 overflow-y-auto bg-white rounded-lg border border-gray-200">
            {filteredReports.length === 0 ? (
              <div className="text-center py-16 px-4">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No daily reports found
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery
                    ? "Try adjusting your search terms."
                    : "Create your first daily report to get started."}
                </p>
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() =>
                    router.push("/dashboard/projects/project-1/daily-report")
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Report
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredReports.map((report) => (
                  <div
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedReport?.id === report.id
                        ? "bg-orange-50 border-r-4 border-orange-500"
                        : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {format(new Date(report.date), "MMM d, yyyy")} -{" "}
                            {report.project}
                          </h3>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              report.status
                            )}`}
                          >
                            {report.status.charAt(0).toUpperCase() +
                              report.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {report.activitiesSummary}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <User className="mr-1 h-3 w-3" />
                            {report.submittedBy}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            {format(new Date(report.submittedAt), "MMM d")}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        {report.pdfUrl && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(report.pdfUrl, "_blank");
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReport(report);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Implement edit functionality
                            alert("Edit functionality coming soon!");
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Report Details */}
        <div className="w-1/2 flex flex-col">
          {selectedReport ? (
            <div className="bg-white rounded-lg border border-gray-200 h-full overflow-y-auto">
              {/* Report Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Daily Report -{" "}
                      {format(new Date(selectedReport.date), "MMM d, yyyy")}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedReport.project}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        // TODO: Implement edit functionality
                        alert("Edit functionality coming soon!");
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    {selectedReport.pdfUrl && (
                      <Button
                        size="sm"
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                        onClick={() =>
                          window.open(selectedReport.pdfUrl, "_blank")
                        }
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <p className="font-medium">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          selectedReport.status
                        )}`}
                      >
                        {selectedReport.status.charAt(0).toUpperCase() +
                          selectedReport.status.slice(1)}
                      </span>
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Submitted:</span>
                    <p className="font-medium">
                      {format(
                        new Date(selectedReport.submittedAt),
                        "MMM d, yyyy 'at' h:mm a"
                      )}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Submitted by:</span>
                    <p className="font-medium">{selectedReport.submittedBy}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Report Date:</span>
                    <p className="font-medium">
                      {format(new Date(selectedReport.date), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Report Details */}
              <div className="p-6 space-y-6">
                {/* Crew Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Crew Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      {selectedReport.crew}
                    </p>
                  </div>
                </div>

                {/* Activities Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Activities Summary
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {selectedReport.activitiesSummary}
                    </p>
                  </div>
                </div>

                {/* Related Change Orders */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Related Change Orders
                    </h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      0
                    </span>
                  </div>
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No related change orders</p>
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
                        <p className="font-medium text-sm">Safety Inspection</p>
                        <p className="text-xs text-gray-500">
                          Completed same day
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          // TODO: Navigate to inspections
                          alert("Navigation to inspections coming soon!");
                        }}
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
                      2
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">Update punch list</p>
                        <p className="text-xs text-gray-500">Due tomorrow</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          // TODO: Navigate to tasks
                          alert("Navigation to tasks coming soon!");
                        }}
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
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Select a report
                </h3>
                <p className="text-gray-500">
                  Choose a daily report from the list to view details and
                  related information.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
