'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/ui/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { getUser } from '@/lib/supabase';
import { Plus, Search, Package, Calendar, Truck, Edit, Trash2, Eye, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface MaterialUsage {
  id: string;
  date: string;
  material: string;
  quantity: number;
  unit: string;
  supplier?: string;
  location?: string;
  project?: string;
  cost?: number;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export default function MaterialUsagePage() {
  const [materials, setMaterials] = useState<MaterialUsage[]>([
    {
      id: '1',
      date: '2025-05-31T05:16:00',
      material: 'Gravel',
      quantity: 25,
      unit: 'tons',
      supplier: 'ABC Materials',
      location: 'Section A',
      project: 'Main Line Extension',
      cost: 1250.00,
      notes: 'High-grade gravel for track foundation',
      createdBy: 'Site Supervisor',
      createdAt: '2025-05-31T05:16:00'
    },
    {
      id: '2',
      date: '2022-10-14T11:29:00',
      material: 'Sand',
      quantity: 15,
      unit: 'tons',
      supplier: 'Desert Sand Co',
      location: 'Section B',
      project: 'Bridge Construction',
      cost: 450.00,
      notes: 'Fine sand for concrete mix',
      createdBy: 'Materials Manager',
      createdAt: '2022-10-14T11:29:00'
    },
    {
      id: '3',
      date: '2020-03-22T09:35:00',
      material: 'Cement',
      quantity: 100,
      unit: 'bags',
      supplier: 'Portland Cement Ltd',
      location: 'Storage Yard',
      project: 'Platform Construction',
      cost: 800.00,
      notes: 'Type I Portland cement for structural work',
      createdBy: 'Construction Lead',
      createdAt: '2020-03-22T09:35:00'
    },
    {
      id: '4',
      date: '2021-03-09T06:58:00',
      material: 'Rebar',
      quantity: 500,
      unit: 'feet',
      supplier: 'Steel Works Inc',
      location: 'Section C',
      project: 'Foundation Work',
      cost: 2500.00,
      notes: '#4 rebar for reinforcement',
      createdBy: 'Structural Engineer',
      createdAt: '2021-03-09T06:58:00'
    },
    {
      id: '5',
      date: '2021-02-09T08:07:00',
      material: 'Asphalt',
      quantity: 12,
      unit: 'tons',
      supplier: 'Highway Materials',
      location: 'Access Road',
      project: 'Site Access',
      cost: 1800.00,
      notes: 'Hot mix asphalt for road surface',
      createdBy: 'Road Crew Lead',
      createdAt: '2021-02-09T08:07:00'
    },
    {
      id: '6',
      date: '2020-08-23T02:56:00',
      material: 'Bricks',
      quantity: 2000,
      unit: 'pieces',
      supplier: 'Classic Brick Co',
      location: 'Building Site',
      project: 'Station Building',
      cost: 1200.00,
      notes: 'Red clay bricks for exterior walls',
      createdBy: 'Mason Contractor',
      createdAt: '2020-08-23T02:56:00'
    },
    {
      id: '7',
      date: '2021-01-18T04:18:00',
      material: 'Wood Planks',
      quantity: 150,
      unit: 'boards',
      supplier: 'Lumber Yard Pro',
      location: 'Temporary Structures',
      project: 'Scaffolding',
      cost: 900.00,
      notes: '2x10 pressure treated lumber',
      createdBy: 'Carpenter',
      createdAt: '2021-01-18T04:18:00'
    },
    {
      id: '8',
      date: '2023-05-01T09:30:00',
      material: 'Concrete Mix',
      quantity: 50,
      unit: 'cubic yards',
      supplier: 'Ready Mix Concrete',
      location: 'Foundation Area',
      project: 'Signal Foundation',
      cost: 3500.00,
      notes: '4000 PSI concrete for signal foundations',
      createdBy: 'Concrete Crew',
      createdAt: '2023-05-01T09:30:00'
    },
    {
      id: '9',
      date: '2022-03-08T02:56:00',
      material: 'Steel Beams',
      quantity: 20,
      unit: 'pieces',
      supplier: 'Structural Steel Co',
      location: 'Bridge Site',
      project: 'Bridge Construction',
      cost: 15000.00,
      notes: 'I-beam steel for bridge structure',
      createdBy: 'Steel Worker',
      createdAt: '2022-03-08T02:56:00'
    },
    {
      id: '10',
      date: '2023-09-27T08:55:00',
      material: 'Insulation',
      quantity: 200,
      unit: 'square feet',
      supplier: 'Insulation Pro',
      location: 'Control Building',
      project: 'Control Systems',
      cost: 600.00,
      notes: 'Fiberglass insulation for building',
      createdBy: 'Building Contractor',
      createdAt: '2023-09-27T08:55:00'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMaterials, setFilteredMaterials] = useState<MaterialUsage[]>(materials);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialUsage | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Form state
  const [material, setMaterial] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [unit, setUnit] = useState('');
  const [date, setDate] = useState('');
  const [supplier, setSupplier] = useState('');
  const [location, setLocation] = useState('');
  const [project, setProject] = useState('');
  const [cost, setCost] = useState<number | ''>('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const filtered = materials.filter(material =>
      material.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.supplier?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.project?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMaterials(filtered);
  }, [searchQuery, materials]);

  const handleCreateMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!material.trim() || !quantity || !unit.trim() || !date) return;

    try {
      const user = await getUser();
      if (!user) throw new Error('User not authenticated');

      const newMaterial: MaterialUsage = {
        id: Date.now().toString(),
        date,
        material: material.trim(),
        quantity: Number(quantity),
        unit: unit.trim(),
        supplier: supplier.trim() || undefined,
        location: location.trim() || undefined,
        project: project.trim() || undefined,
        cost: cost ? Number(cost) : undefined,
        notes: notes.trim() || undefined,
        createdBy: user.email || 'Unknown',
        createdAt: new Date().toISOString()
      };

      setMaterials([newMaterial, ...materials]);
      
      // Reset form
      setMaterial('');
      setQuantity('');
      setUnit('');
      setDate('');
      setSupplier('');
      setLocation('');
      setProject('');
      setCost('');
      setNotes('');
      setIsCreateOpen(false);
    } catch (error) {
      console.error('Error creating material usage:', error);
      alert('Failed to create material usage record. Please try again.');
    }
  };

  const openMaterialDetails = (material: MaterialUsage) => {
    setSelectedMaterial(material);
    setIsDetailsOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const totalCost = filteredMaterials.reduce((sum, material) => sum + (material.cost || 0), 0);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Material Usage</h1>
            <p className="mt-1 text-sm text-gray-500">
              Track construction materials, quantities, and costs
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Project Details
            </Button>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="railcore-add-btn">
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Record Material Usage</DialogTitle>
                  <DialogDescription>
                    Track materials used in construction projects.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateMaterial} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Material <span className="text-red-500">*</span>
                      </label>
                      <Select value={material} onValueChange={setMaterial}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select material" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Gravel">Gravel</SelectItem>
                          <SelectItem value="Sand">Sand</SelectItem>
                          <SelectItem value="Cement">Cement</SelectItem>
                          <SelectItem value="Rebar">Rebar</SelectItem>
                          <SelectItem value="Asphalt">Asphalt</SelectItem>
                          <SelectItem value="Bricks">Bricks</SelectItem>
                          <SelectItem value="Wood Planks">Wood Planks</SelectItem>
                          <SelectItem value="Concrete Mix">Concrete Mix</SelectItem>
                          <SelectItem value="Steel Beams">Steel Beams</SelectItem>
                          <SelectItem value="Insulation">Insulation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date & Time <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="datetime-local"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value ? parseFloat(e.target.value) : '')}
                        placeholder="0"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unit <span className="text-red-500">*</span>
                      </label>
                      <Select value={unit} onValueChange={setUnit}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tons">Tons</SelectItem>
                          <SelectItem value="bags">Bags</SelectItem>
                          <SelectItem value="feet">Feet</SelectItem>
                          <SelectItem value="pieces">Pieces</SelectItem>
                          <SelectItem value="boards">Boards</SelectItem>
                          <SelectItem value="cubic yards">Cubic Yards</SelectItem>
                          <SelectItem value="square feet">Square Feet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Supplier
                      </label>
                      <Input
                        value={supplier}
                        onChange={(e) => setSupplier(e.target.value)}
                        placeholder="ABC Materials"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Section A"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project
                      </label>
                      <Input
                        value={project}
                        onChange={(e) => setProject(e.target.value)}
                        placeholder="Main Line Extension"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cost ($)
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        value={cost}
                        onChange={(e) => setCost(e.target.value ? parseFloat(e.target.value) : '')}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <Input
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Additional notes about material usage..."
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="railcore-add-btn">
                      Record Usage
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search Material Usage"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="railcore-search-bar pl-10"
              />
            </div>
          </div>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-orange-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total Cost</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(totalCost)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Materials Table */}
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
                      Material
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Supplier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cost
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMaterials.map((material) => (
                    <tr key={material.id} className="railcore-table-row">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {format(new Date(material.date), 'M/d/yyyy')}
                            </div>
                            <div className="text-sm text-gray-500">
                              {format(new Date(material.date), 'h:mm:ss a')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Package className="mr-2 h-4 w-4 text-orange-500" />
                          <div className="text-sm font-medium text-gray-900">
                            {material.material}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {material.quantity} {material.unit}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {material.supplier || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {material.cost ? formatCurrency(material.cost) : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openMaterialDetails(material)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <button className="railcore-action-btn">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="railcore-action-btn">
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

        {filteredMaterials.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No material usage found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? 'Try adjusting your search terms.' : 'Record your first material usage to get started.'}
            </p>
          </div>
        )}

        {/* Material Details Modal */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedMaterial?.material} Usage Details</DialogTitle>
              <DialogDescription>
                {selectedMaterial && format(new Date(selectedMaterial.date), 'PPP p')}
              </DialogDescription>
            </DialogHeader>
            {selectedMaterial && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Quantity</h4>
                    <p className="text-gray-700">{selectedMaterial.quantity} {selectedMaterial.unit}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Cost</h4>
                    <p className="text-gray-700">
                      {selectedMaterial.cost ? formatCurrency(selectedMaterial.cost) : 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Supplier</h4>
                    <p className="text-gray-700">{selectedMaterial.supplier || 'Not specified'}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Location</h4>
                    <p className="text-gray-700">{selectedMaterial.location || 'Not specified'}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Project</h4>
                    <p className="text-gray-700">{selectedMaterial.project || 'Not specified'}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Recorded By</h4>
                    <p className="text-gray-700">{selectedMaterial.createdBy}</p>
                  </div>
                </div>
                
                {selectedMaterial.notes && (
                  <div>
                    <h4 className="font-medium text-gray-900">Notes</h4>
                    <p className="text-gray-700">{selectedMaterial.notes}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}