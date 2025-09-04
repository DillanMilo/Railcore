'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/ui/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { getUser } from '@/lib/supabase';
import { Plus, Search, FileEdit, Calendar, DollarSign, Edit, Trash2, Eye, User } from 'lucide-react';
import { format } from 'date-fns';

interface ChangeOrder {
  id: string;
  number: string;
  title: string;
  description: string;
  requestedBy: string;
  status: 'pending' | 'approved' | 'rejected' | 'implemented';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedCost?: number;
  actualCost?: number;
  dateRequested: string;
  dateApproved?: string;
  project?: string;
  reason: string;
  impact: string;
  createdBy: string;
  createdAt: string;
}

export default function ChangeOrdersPage() {
  const [changeOrders, setChangeOrders] = useState<ChangeOrder[]>([
    {
      id: '1',
      number: 'CO-2024-001',
      title: 'Additional Track Section Extension',
      description: 'Extend track section by additional 200 feet due to revised site requirements',
      requestedBy: 'Site Engineer',
      status: 'approved',
      priority: 'high',
      estimatedCost: 45000.00,
      actualCost: 47500.00,
      dateRequested: '2024-01-15T09:00:00Z',
      dateApproved: '2024-01-18T14:30:00Z',
      project: 'Main Line Extension Phase 2',
      reason: 'Client requested scope expansion',
      impact: 'Schedule delay of 5 days, additional materials required',
      createdBy: 'Project Manager',
      createdAt: '2024-01-15T09:00:00Z'
    },
    {
      id: '2',
      number: 'CO-2024-002',
      title: 'Upgrade Signal System Components',
      description: 'Replace standard signals with advanced LED signal system',
      requestedBy: 'Signal Engineer',
      status: 'pending',
      priority: 'medium',
      estimatedCost: 28000.00,
      dateRequested: '2024-01-20T11:15:00Z',
      project: 'Signal Installation Project',
      reason: 'Technology upgrade for better visibility',
      impact: 'Improved safety, minimal schedule impact',
      createdBy: 'Signal Engineer',
      createdAt: '2024-01-20T11:15:00Z'
    },
    {
      id: '3',
      number: 'CO-2024-003',
      title: 'Environmental Mitigation Measures',
      description: 'Additional erosion control measures required by environmental review',
      requestedBy: 'Environmental Consultant',
      status: 'implemented',
      priority: 'urgent',
      estimatedCost: 15000.00,
      actualCost: 14200.00,
      dateRequested: '2024-01-10T08:30:00Z',
      dateApproved: '2024-01-11T16:00:00Z',
      project: 'Environmental Compliance',
      reason: 'Regulatory requirement',
      impact: 'Compliance achieved, 2-day schedule adjustment',
      createdBy: 'Environmental Manager',
      createdAt: '2024-01-10T08:30:00Z'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<ChangeOrder[]>(changeOrders);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ChangeOrder | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reason, setReason] = useState('');
  const [impact, setImpact] = useState('');
  const [priority, setPriority] = useState<ChangeOrder['priority']>('medium');
  const [estimatedCost, setEstimatedCost] = useState<number | ''>('');
  const [project, setProject] = useState('');

  useEffect(() => {
    const filtered = changeOrders.filter(order =>
      order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.requestedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.project?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchQuery, changeOrders]);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    try {
      const user = await getUser();
      if (!user) throw new Error('User not authenticated');

      const newOrder: ChangeOrder = {
        id: Date.now().toString(),
        number: `CO-2024-${String(changeOrders.length + 1).padStart(3, '0')}`,
        title: title.trim(),
        description: description.trim(),
        requestedBy: user.email || 'Unknown',
        status: 'pending',
        priority,
        estimatedCost: estimatedCost ? Number(estimatedCost) : undefined,
        dateRequested: new Date().toISOString(),
        project: project.trim() || undefined,
        reason: reason.trim(),
        impact: impact.trim(),
        createdBy: user.email || 'Unknown',
        createdAt: new Date().toISOString()
      };

      setChangeOrders([newOrder, ...changeOrders]);
      
      // Reset form
      setTitle('');
      setDescription('');
      setReason('');
      setImpact('');
      setPriority('medium');
      setEstimatedCost('');
      setProject('');
      setIsCreateOpen(false);
    } catch (error) {
      console.error('Error creating change order:', error);
      alert('Failed to create change order. Please try again.');
    }
  };

  const openOrderDetails = (order: ChangeOrder) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const getStatusColor = (status: ChangeOrder['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'implemented': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: ChangeOrder['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const totalEstimated = filteredOrders.reduce((sum, order) => sum + (order.estimatedCost || 0), 0);
  const totalActual = filteredOrders.reduce((sum, order) => sum + (order.actualCost || 0), 0);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Change Orders</h1>
            <p className="mt-1 text-sm text-gray-500">
              Track and manage project changes and modifications
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Change Order</DialogTitle>
                <DialogDescription>
                  Submit a new change order for project modifications.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateOrder} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Additional Track Section Extension"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detailed description of the change..."
                    rows={3}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <Select value={priority} onValueChange={(value: ChangeOrder['priority']) => setPriority(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estimated Cost ($)
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={estimatedCost}
                      onChange={(e) => setEstimatedCost(e.target.value ? parseFloat(e.target.value) : '')}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project
                  </label>
                  <Input
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    placeholder="Main Line Extension Phase 2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Change
                  </label>
                  <Textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Why is this change needed?"
                    rows={2}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Impact Assessment
                  </label>
                  <Textarea
                    value={impact}
                    onChange={(e) => setImpact(e.target.value)}
                    placeholder="How will this change affect the project?"
                    rows={2}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
                    Submit Change Order
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search Change Orders"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-orange-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total Estimated</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(totalEstimated)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Change Orders Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Change Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estimated Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Requested
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.number}
                          </div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {order.title}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(order.priority)}`}>
                          {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.estimatedCost ? formatCurrency(order.estimatedCost) : 'TBD'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                          <div className="text-sm text-gray-900">
                            {format(new Date(order.dateRequested), 'MMM d, yyyy')}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openOrderDetails(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                            <Trash2 className="h-4 w-4" />
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

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <FileEdit className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No change orders found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? 'Try adjusting your search terms.' : 'Create your first change order to get started.'}
            </p>
          </div>
        )}

        {/* Change Order Details Modal */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedOrder?.number}: {selectedOrder?.title}</DialogTitle>
              <DialogDescription>
                Change order details and impact assessment
              </DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Order Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Number:</span>
                        <span className="font-medium">{selectedOrder.number}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status:</span>
                        <Badge className={getStatusColor(selectedOrder.status)}>
                          {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Priority:</span>
                        <Badge className={getPriorityColor(selectedOrder.priority)}>
                          {selectedOrder.priority.charAt(0).toUpperCase() + selectedOrder.priority.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Requested By:</span>
                        <span className="font-medium">{selectedOrder.requestedBy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Date Requested:</span>
                        <span className="font-medium">{format(new Date(selectedOrder.dateRequested), 'PPP')}</span>
                      </div>
                      {selectedOrder.dateApproved && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Date Approved:</span>
                          <span className="font-medium">{format(new Date(selectedOrder.dateApproved), 'PPP')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Financial Impact</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Estimated Cost:</span>
                        <span className="font-medium">
                          {selectedOrder.estimatedCost ? formatCurrency(selectedOrder.estimatedCost) : 'TBD'}
                        </span>
                      </div>
                      {selectedOrder.actualCost && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Actual Cost:</span>
                          <span className="font-medium">{formatCurrency(selectedOrder.actualCost)}</span>
                        </div>
                      )}
                      {selectedOrder.project && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Project:</span>
                          <span className="font-medium">{selectedOrder.project}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700">{selectedOrder.description}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Reason for Change</h4>
                  <p className="text-gray-700">{selectedOrder.reason}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Impact Assessment</h4>
                  <p className="text-gray-700">{selectedOrder.impact}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}