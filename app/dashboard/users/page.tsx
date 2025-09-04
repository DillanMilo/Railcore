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
import { Plus, Search, Users, Mail, Edit, Trash2, Eye, UserCheck, Shield, Briefcase, User } from 'lucide-react';

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Project Manager' | 'Foreman' | 'Inspector' | 'Client';
  status: 'active' | 'inactive';
  lastLogin?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<AppUser[]>([
    {
      id: '1',
      name: 'Jayson Martz',
      email: 'jayson.martz@railcore.com',
      role: 'Admin',
      status: 'active',
      lastLogin: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Kobe Ankundung',
      email: 'kobe.ankundung@railcore.com',
      role: 'Project Manager',
      status: 'active',
      lastLogin: '2024-01-14T16:45:00Z'
    },
    {
      id: '3',
      name: 'Rosalind McDermott',
      email: 'rosalind.mcdermott@railcore.com',
      role: 'Foreman',
      status: 'active',
      lastLogin: '2024-01-14T08:15:00Z'
    },
    {
      id: '4',
      name: 'Jaron Kunze',
      email: 'jaron.kunze@railcore.com',
      role: 'Inspector',
      status: 'active',
      lastLogin: '2024-01-13T14:20:00Z'
    },
    {
      id: '5',
      name: 'Khalid Schmeier',
      email: 'khalid.schmeier@client.com',
      role: 'Client',
      status: 'active',
      lastLogin: '2024-01-12T11:00:00Z'
    },
    {
      id: '6',
      name: 'Macy Harvey',
      email: 'macy.harvey@railcore.com',
      role: 'Admin',
      status: 'active',
      lastLogin: '2024-01-11T09:30:00Z'
    },
    {
      id: '7',
      name: 'Paul Bartley',
      email: 'paul.bartley@railcore.com',
      role: 'Admin',
      status: 'inactive',
      lastLogin: '2023-12-20T15:45:00Z'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<AppUser[]>(users);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('all');

  useEffect(() => {
    let filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    setFilteredUsers(filtered);
  }, [searchQuery, users, selectedRole]);

  const getRoleIcon = (role: AppUser['role']) => {
    switch (role) {
      case 'Admin': return <Shield className="h-4 w-4" />;
      case 'Project Manager': return <Briefcase className="h-4 w-4" />;
      case 'Foreman': return <UserCheck className="h-4 w-4" />;
      case 'Inspector': return <Eye className="h-4 w-4" />;
      case 'Client': return <User className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: AppUser['role']) => {
    switch (role) {
      case 'Admin': return 'bg-red-100 text-red-800';
      case 'Project Manager': return 'bg-blue-100 text-blue-800';
      case 'Foreman': return 'bg-green-100 text-green-800';
      case 'Inspector': return 'bg-yellow-100 text-yellow-800';
      case 'Client': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: AppUser['status']) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage user accounts and permissions
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Compose Email (Email)
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
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>
                    Create a new user account with appropriate permissions.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <Input placeholder="John Smith" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <Input type="email" placeholder="john.smith@railcore.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="project-manager">Project Manager</SelectItem>
                        <SelectItem value="foreman">Foreman</SelectItem>
                        <SelectItem value="inspector">Inspector</SelectItem>
                        <SelectItem value="client">Client</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="railcore-add-btn">
                      Create User
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search Users"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="railcore-search-bar pl-10"
            />
          </div>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Project Manager">Project Manager</SelectItem>
              <SelectItem value="Foreman">Foreman</SelectItem>
              <SelectItem value="Inspector">Inspector</SelectItem>
              <SelectItem value="Client">Client</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Users Table */}
        <Card className="railcore-card">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="railcore-table-row">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-orange-500 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                            {getRoleIcon(user.role)}
                            <span className="ml-1">{user.role}</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
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
                            <Mail className="h-4 w-4" />
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

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? 'Try adjusting your search terms.' : 'Add your first user to get started.'}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}