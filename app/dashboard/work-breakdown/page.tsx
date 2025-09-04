'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/ui/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getUser } from '@/lib/supabase';
import { Plus, Search, Layers, ChevronRight, ChevronDown, Edit, Trash2, Eye } from 'lucide-react';

interface WBSItem {
  id: string;
  title: string;
  description: string;
  level: number;
  parentId?: string;
  children?: WBSItem[];
  expanded?: boolean;
}

export default function WorkBreakdownPage() {
  const [wbsItems, setWbsItems] = useState<WBSItem[]>([
    {
      id: '1',
      title: 'Project Initiation',
      description: 'Initial project planning and scope definition.',
      level: 0,
      expanded: true,
      children: [
        {
          id: '1.1',
          title: 'Requirements Gathering',
          description: 'Gathering and documenting all project requirements.',
          level: 1,
          parentId: '1'
        }
      ]
    },
    {
      id: '2',
      title: 'System Design',
      description: 'Designing the system architecture and user interface.',
      level: 0,
      expanded: true,
      children: []
    },
    {
      id: '3',
      title: 'Core Development',
      description: 'Developing the core functionalities of the system.',
      level: 0,
      expanded: true,
      children: []
    },
    {
      id: '4',
      title: 'System Testing',
      description: 'Testing the system for bugs and performance issues.',
      level: 0,
      expanded: true,
      children: []
    },
    {
      id: '5',
      title: 'System Deployment',
      description: 'Deploying the system to the production environment.',
      level: 0,
      expanded: true,
      children: []
    },
    {
      id: '6',
      title: 'User Training',
      description: 'Training users on how to use the new system.',
      level: 0,
      expanded: true,
      children: []
    },
    {
      id: '7',
      title: 'System Maintenance',
      description: 'Providing ongoing support and maintenance for the system.',
      level: 0,
      expanded: true,
      children: []
    },
    {
      id: '8',
      title: 'Documentation',
      description: 'Creating project documentation.',
      level: 0,
      expanded: true,
      children: []
    },
    {
      id: '9',
      title: 'Risk Management',
      description: 'Managing project risks and issues.',
      level: 0,
      expanded: true,
      children: []
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<WBSItem[]>(wbsItems);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    const filtered = wbsItems.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchQuery, wbsItems]);

  const toggleExpanded = (itemId: string) => {
    setWbsItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, expanded: !item.expanded }
          : item
      )
    );
  };

  const renderWBSItem = (item: WBSItem) => {
    const hasChildren = item.children && item.children.length > 0;
    const indentLevel = item.level * 24;

    return (
      <div key={item.id}>
        <div 
          className="railcore-table-row flex items-center py-4 px-6"
          style={{ paddingLeft: `${24 + indentLevel}px` }}
        >
          <div className="flex items-center flex-1">
            {hasChildren && (
              <button
                onClick={() => toggleExpanded(item.id)}
                className="mr-2 p-1 hover:bg-gray-100 rounded"
              >
                {item.expanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
              </button>
            )}
            {!hasChildren && <div className="w-6 mr-2" />}
            
            <div className="flex-1">
              <div className="font-medium text-gray-900">{item.title}</div>
              <div className="text-sm text-gray-500 mt-1">{item.description}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
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
        </div>
        
        {hasChildren && item.expanded && item.children?.map(child => renderWBSItem(child))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Work Breakdown Structure</h1>
            <p className="mt-1 text-sm text-gray-500">
              Hierarchical project task and deliverable organization
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              View Ref (Project Id)
            </Button>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="railcore-add-btn">
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add WBS Item</DialogTitle>
                  <DialogDescription>
                    Create a new work breakdown structure item.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <Input placeholder="Task or deliverable title" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <Input placeholder="Detailed description..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Parent Item (Optional)
                    </label>
                    <Input placeholder="Select parent item..." />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="railcore-add-btn">
                      Create Item
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search Work Breakdown Structure"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="railcore-search-bar pl-10"
          />
        </div>

        {/* WBS Tree */}
        <Card className="railcore-card">
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {filteredItems.map(item => renderWBSItem(item))}
            </div>
          </CardContent>
        </Card>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Layers className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No WBS items found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? 'Try adjusting your search terms.' : 'Create your first work breakdown structure item to get started.'}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}