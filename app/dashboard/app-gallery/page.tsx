"use client";

import { Layout } from "@/components/ui/layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Grid3X3,
  Camera,
  MapPin,
  BarChart3,
  FileSpreadsheet,
  Smartphone,
  Cloud,
  Zap,
  ExternalLink,
  Download,
  Settings,
} from "lucide-react";

interface AppIntegration {
  id: string;
  name: string;
  description: string;
  category: "productivity" | "mapping" | "reporting" | "mobile" | "integration";
  status: "available" | "coming_soon" | "beta";
  icon: any;
  features: string[];
}

export default function AppGalleryPage() {
  const integrations: AppIntegration[] = [
    {
      id: "1",
      name: "EarthCam Integration",
      description:
        "Connect with EarthCam systems for automated photo capture and time-lapse documentation.",
      category: "productivity",
      status: "coming_soon",
      icon: Camera,
      features: [
        "Automated photo capture",
        "Time-lapse creation",
        "Weather overlay",
        "Progress tracking",
      ],
    },
    {
      id: "2",
      name: "GPS Mapping Tools",
      description:
        "Advanced GPS and mapping tools for precise location tracking and surveying.",
      category: "mapping",
      status: "available",
      icon: MapPin,
      features: [
        "GPS coordinates",
        "Site mapping",
        "Progress visualization",
        "Location tagging",
      ],
    },
    {
      id: "3",
      name: "Advanced Analytics",
      description:
        "Comprehensive reporting and analytics dashboard for project insights.",
      category: "reporting",
      status: "beta",
      icon: BarChart3,
      features: [
        "Custom dashboards",
        "Trend analysis",
        "Performance metrics",
        "Export capabilities",
      ],
    },
    {
      id: "4",
      name: "Excel Integration",
      description:
        "Import and export data to Microsoft Excel for advanced analysis and reporting.",
      category: "productivity",
      status: "available",
      icon: FileSpreadsheet,
      features: [
        "Data import/export",
        "Template sync",
        "Bulk operations",
        "Formula support",
      ],
    },
    {
      id: "5",
      name: "Mobile App",
      description:
        "Native mobile application for iOS and Android with offline capabilities.",
      category: "mobile",
      status: "coming_soon",
      icon: Smartphone,
      features: [
        "Offline mode",
        "Photo capture",
        "GPS tracking",
        "Push notifications",
      ],
    },
    {
      id: "6",
      name: "Cloud Backup",
      description:
        "Automated cloud backup and disaster recovery for all project data.",
      category: "integration",
      status: "available",
      icon: Cloud,
      features: [
        "Automated backups",
        "Point-in-time recovery",
        "Multi-region storage",
        "Encryption",
      ],
    },
  ];

  const getStatusColor = (status: AppIntegration["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "beta":
        return "bg-yellow-100 text-yellow-800";
      case "coming_soon":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: AppIntegration["category"]) => {
    switch (category) {
      case "productivity":
        return "bg-blue-100 text-blue-800";
      case "mapping":
        return "bg-green-100 text-green-800";
      case "reporting":
        return "bg-purple-100 text-purple-800";
      case "mobile":
        return "bg-orange-100 text-orange-800";
      case "integration":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">App Gallery</h1>
          <p className="mt-1 text-sm text-gray-500">
            Additional tools and integrations to enhance your RailCore
            experience
          </p>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {integrations.map((integration) => {
            const Icon = integration.icon;
            return (
              <Card
                key={integration.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-500 rounded-lg">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {integration.name}
                        </CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge
                            className={getCategoryColor(integration.category)}
                          >
                            {integration.category.charAt(0).toUpperCase() +
                              integration.category.slice(1)}
                          </Badge>
                          <Badge className={getStatusColor(integration.status)}>
                            {integration.status === "coming_soon"
                              ? "Coming Soon"
                              : integration.status.charAt(0).toUpperCase() +
                                integration.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-600 text-sm">
                      {integration.description}
                    </p>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Features:
                      </h4>
                      <ul className="space-y-1">
                        {integration.features.map((feature, index) => (
                          <li
                            key={index}
                            className="text-sm text-gray-600 flex items-center"
                          >
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2">
                      {integration.status === "available" ? (
                        <Button
                          size="sm"
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Install
                        </Button>
                      ) : integration.status === "beta" ? (
                        <Button size="sm" variant="outline" className="w-full">
                          <Zap className="mr-2 h-4 w-4" />
                          Join Beta
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          disabled
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Coming Soon
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts for power users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-medium">Demo Setup</div>
                  <div className="text-xs text-gray-500">
                    Create sample data
                  </div>
                </div>
              </Button>

              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-medium">Export Data</div>
                  <div className="text-xs text-gray-500">
                    Download project data
                  </div>
                </div>
              </Button>

              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-medium">System Settings</div>
                  <div className="text-xs text-gray-500">
                    Configure preferences
                  </div>
                </div>
              </Button>

              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-medium">Help Center</div>
                  <div className="text-xs text-gray-500">
                    Documentation & support
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
