'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/ui/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getUser } from '@/lib/supabase';
import { Plus, Search, DollarSign, Calendar, FileText, Edit, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface PayApplication {
  id: string;
  date: string;
  amount: number;
  status: 'pending' | 'approved' | 'paid';
  description: string;
  submittedBy: string;
}

export default function PayApplicationsPage() {
  const [applications, setApplications] = useState<PayApplication[]>([
    {
      id: '1',
      date: '2021-12-29T18:35:00',
      amount: 99500.00,
      status: 'paid',
      description: 'Monthly progress payment - December 2021',
      submittedBy: 'Project Manager'
    },
    {
      id: '2',
      date: '2024-04-25T23:30:00',
      amount: 720500.00,
      status: 'approved',
      description: 'Quarterly milestone payment - Q1 2024',
      submittedBy: 'Finance Team'
    },
    {
      id: '3',
      date: '2023-08-19T21:00:00',
      amount: 744500.00,
      status: 'paid',
      description: 'Material and labor costs - August 2023',
      submittedBy: 'Site Supervisor'
    },
    {
      id: '4',
      date: '2023-05-12T22:20:00',
      amount: 748500.00,
      status: 'pending',
      description: 'Equipment rental and maintenance - May 2023',
      submittedBy: 'Operations Manager'
    },
    {
      id: '5',
      date: '2023-05-26T13:50:00',
      amount: 792500.00,
      status: 'approved',
      description: 'Track installation progress payment',
      submittedBy: 'Construction Lead'
    },
    {
      id: '6',
      date: '2020-12-31T20:30:00',
      amount: 830500.00,
      status: 'paid',
      description: 'Year-end completion bonus - 2020',
      submittedBy: 'Project Director'
    },
    {
      id: '7',
      date: '2022-08-18T20:00:00',
      amount: 900500.00,
      status: 'paid',
      description: 'Bridge construction milestone payment',
      submittedBy: 'Engineering Team'
    },
    {
      id: '8',
      date: '2021-02-14T13:00:00',
      amount: 864500.00,
      status: 'approved',
      description: 'Safety compliance and training costs',
      submittedBy: 'Safety Officer'
    },
    {
      id: '9',
      date: '2023-01-20T10:00:00',
      amount: 688500.00,
      status: 'pending',
      description: 'Environmental impact mitigation costs',
      submittedBy: 'Environmental Consultant'
    },
    {
      id: '10',
      date: '2024-08-11T14:27:00',
      amount: 912500.00,
      status: 'paid',
      description: 'Final phase completion payment',
      submittedBy: 'Project Manager'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredApplications, setFilteredApplications] = useState<PayApplication[]>(applications);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    const filtered = applications.filter(app =>
      app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.submittedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.amount.toString().includes(searchQuery)
    );
    setFilteredApplications(filtered);
  }, [searchQuery, applications]);

  const getStatusColor = (status: PayApplication['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const totalAmount = filteredApplications.reduce((sum, app) => sum + app.amount, 0);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pay Applications</h1>
            <p className="mt-1 text-sm text-gray-500">
              Track and manage project payment applications
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="railcore-add-btn">
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Pay Application</DialogTitle>
                <DialogDescription>
                  Submit a new payment application for project work.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <Input type="number" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <Input placeholder="Payment description..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <Input type="datetime-local" />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="railcore-add-btn">
                    Submit Application
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search Pay Applications"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="railcore-search-bar pl-10"
              />
            </div>
          </div>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total Amount</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(totalAmount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications Table */}
        <Card className="railcore-card">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted By
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.map((application) => (
                    <tr key={application.id} className="railcore-table-row">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {format(new Date(application.date), 'M/d/yyyy')}
                            </div>
                            <div className="text-sm text-gray-500">
                              {format(new Date(application.date), 'h:mm:ss a')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(application.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {application.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.status)}`}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {application.submittedBy}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="railcore-action-btn">
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button className="railcore-action-btn">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="railcore-action-btn">
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No pay applications found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? 'Try adjusting your search terms.' : 'Create your first pay application to get started.'}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}