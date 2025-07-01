
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Users, Package, DollarSign } from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface DailyRecord {
  id: number;
  userId: number;
  userName: string;
  userRole: 'buyer' | 'milkman';
  date: string;
  quantity: number;
  rate: number;
  amount: number;
  type: 'purchase' | 'supply';
}

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
  dailyRecords: DailyRecord[];
}

const AdminDashboard = ({ user, onLogout, dailyRecords }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate statistics
  const totalUsers = 150; // This would come from your database
  const totalTransactions = dailyRecords.length;
  const totalRevenue = dailyRecords.reduce((sum, record) => sum + record.amount, 0);
  const totalMilk = dailyRecords.reduce((sum, record) => sum + record.quantity, 0);

  const stats = [
    { title: 'Total Users', value: totalUsers.toString(), icon: Users, change: '+12 this month' },
    { title: 'Total Transactions', value: totalTransactions.toString(), icon: TrendingUp, change: '+23 this week' },
    { title: 'Total Revenue', value: `₹${totalRevenue}`, icon: DollarSign, change: '+15% this month' },
    { title: 'Total Milk Processed', value: `${totalMilk}L`, icon: Package, change: '+8% this week' }
  ];

  const recentTransactions = dailyRecords.slice(-10).reverse();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🥛 DairyConnect Admin</h1>
            <p className="text-gray-600">Welcome back, {user.username}</p>
          </div>
          <Button onClick={onLogout} variant="outline">Logout</Button>
        </div>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change}</p>
                  </div>
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest transactions and user activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">
                          {record.type === 'purchase' ? 'Purchase' : 'Supply'} by {record.userName}
                        </p>
                        <p className="text-sm text-gray-600">{record.date}</p>
                        <Badge variant={record.userRole === 'buyer' ? 'default' : 'secondary'}>
                          {record.userRole}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{record.quantity}L</p>
                        <p className="text-sm text-green-600">₹{record.amount}</p>
                      </div>
                    </div>
                  ))}
                  {recentTransactions.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No recent transactions</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage buyers, milkmen, and other users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button>Add New User</Button>
                  <div className="text-gray-500 text-center py-8">
                    User management interface coming soon...
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Transactions</CardTitle>
                <CardDescription>Complete transaction history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dailyRecords.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">
                          {record.type === 'purchase' ? 'Purchase' : 'Supply'} by {record.userName}
                        </p>
                        <p className="text-sm text-gray-600">{record.date}</p>
                        <Badge variant={record.userRole === 'buyer' ? 'default' : 'secondary'}>
                          {record.userRole}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{record.quantity}L</p>
                        <p className="text-sm text-green-600">₹{record.amount}</p>
                        <p className="text-xs text-gray-500">@ ₹{record.rate}/L</p>
                      </div>
                    </div>
                  ))}
                  {dailyRecords.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No transactions found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure dairy rates and system preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button>Update Dairy Rates</Button>
                  <Button variant="outline">System Configuration</Button>
                  <div className="text-gray-500 text-center py-8">
                    Settings interface coming soon...
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
