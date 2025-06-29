import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, TrendingUp, ShoppingCart, Truck, CreditCard, Calendar, DollarSign } from 'lucide-react';
import DailyRecordCalendar from './DailyRecordCalendar';

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

interface Milkman {
  id: number;
  name: string;
  username: string;
  location: string;
  status: 'pending' | 'approved' | 'rejected';
  phone: string;
  rating: number;
  distance?: string;
  available: boolean;
  accountNumber?: string;
  ifscCode?: string;
  totalDue?: number;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  phone?: string;
  location?: string;
}

interface DairyRates {
  milkmanRate: number;
  buyerRate: number;
}

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
  milkmen: Milkman[];
  users: User[];
  dailyRecords: DailyRecord[];
  dairyRates: DairyRates;
  payments: Array<{
    id: number;
    buyerId: number;
    buyerName: string;
    amount: number;
    paymentMethod: string;
    transactionId: string;
    date: string;
  }>;
  buyerDues: { [key: string]: { userId: number; userName: string; totalPurchases: number; totalPayments: number; due: number } };
  onApproveMilkman: (milkmanId: number) => void;
  onRejectMilkman: (milkmanId: number) => void;
  onUpdateDairyRates: (milkmanRate: number, buyerRate: number) => void;
  onPayMilkman: (milkmanId: number, amount: number) => void;
  onAddDailyRecord: (userId: number, userName: string, userRole: 'buyer' | 'milkman', date: string, quantity: number, type: 'purchase' | 'supply') => void;
}

const AdminDashboard = ({ 
  user, 
  onLogout, 
  milkmen, 
  users, 
  dailyRecords,
  dairyRates,
  payments,
  buyerDues,
  onApproveMilkman, 
  onRejectMilkman,
  onUpdateDairyRates,
  onPayMilkman,
  onAddDailyRecord
}: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [newRates, setNewRates] = useState({
    milkmanRate: dairyRates.milkmanRate,
    buyerRate: dairyRates.buyerRate
  });

  const todayRecords = dailyRecords.filter(r => r.date === new Date().toISOString().split('T')[0]);
  const totalRevenue = dailyRecords.filter(r => r.type === 'purchase').reduce((sum, r) => sum + r.amount, 0);
  const totalExpenses = dailyRecords.filter(r => r.type === 'supply').reduce((sum, r) => sum + r.amount, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const pendingMilkmen = milkmen.filter(m => m.status === 'pending');
  const totalPendingPayments = milkmen.reduce((sum, m) => sum + (m.totalDue || 0), 0);
  const totalBuyerDues = Object.values(buyerDues).reduce((sum, buyer) => sum + buyer.due, 0);

  const stats = [
    { title: 'Total Users', value: users.length.toString(), icon: Users, change: '+12%' },
    { title: 'Daily Profit', value: `₹${totalProfit}`, icon: TrendingUp, change: '+8%' },
    { title: "Today's Records", value: todayRecords.length.toString(), icon: ShoppingCart, change: '+15%' },
    { title: 'Active Milkmen', value: milkmen.filter(m => m.status === 'approved').length.toString(), icon: Truck, change: '+5%' }
  ];

  const handleUpdateRates = () => {
    if (newRates.milkmanRate > 0 && newRates.buyerRate > 0 && newRates.buyerRate > newRates.milkmanRate) {
      onUpdateDairyRates(newRates.milkmanRate, newRates.buyerRate);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🥛 DairyConnect Admin</h1>
            <p className="text-gray-600">Welcome back, {user.username} (Dairy Owner)</p>
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
            <TabsTrigger value="calendar">
              <Calendar className="w-4 h-4 mr-2" />
              Daily Records
            </TabsTrigger>
            <TabsTrigger value="buyer-dues">
              <DollarSign className="w-4 h-4 mr-2" />
              Buyer Dues <Badge className="ml-2">₹{totalBuyerDues}</Badge>
            </TabsTrigger>
            <TabsTrigger value="milkmen">
              Milkmen {pendingMilkmen.length > 0 && <Badge className="ml-2">{pendingMilkmen.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="rates">Rate Management</TabsTrigger>
            <TabsTrigger value="payments">
              Payments <Badge className="ml-2">₹{totalPendingPayments}</Badge>
            </TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Milk Purchased (from farmers):</span>
                      <span className="font-bold">{todayRecords.filter(r => r.type === 'supply').reduce((sum, r) => sum + r.quantity, 0)}L</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Milk Sold (to customers):</span>
                      <span className="font-bold">{todayRecords.filter(r => r.type === 'purchase').reduce((sum, r) => sum + r.quantity, 0)}L</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Today's Profit:</span>
                      <span className="font-bold">₹{todayRecords.filter(r => r.type === 'purchase').reduce((sum, r) => sum + r.amount, 0) - todayRecords.filter(r => r.type === 'supply').reduce((sum, r) => sum + r.amount, 0)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Current Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Rate paid to farmers:</span>
                      <span className="font-bold text-red-600">₹{dairyRates.milkmanRate}/L</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rate charged to customers:</span>
                      <span className="font-bold text-green-600">₹{dairyRates.buyerRate}/L</span>
                    </div>
                    <div className="flex justify-between text-blue-600">
                      <span>Profit per liter:</span>
                      <span className="font-bold">₹{dairyRates.buyerRate - dairyRates.milkmanRate}/L</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Records Management</CardTitle>
                <CardDescription>Track daily milk purchases and supplies with calendar view</CardDescription>
              </CardHeader>
              <CardContent>
                <DailyRecordCalendar
                  dailyRecords={dailyRecords}
                  users={users}
                  milkmanRate={dairyRates.milkmanRate}
                  buyerRate={dairyRates.buyerRate}
                  onAddRecord={onAddDailyRecord}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="buyer-dues" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Buyer Due Amounts</CardTitle>
                <CardDescription>Outstanding payments from milk buyers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-medium text-blue-800 mb-2">Total Outstanding</h3>
                    <p className="text-3xl font-bold text-blue-600">₹{totalBuyerDues}</p>
                    <p className="text-sm text-blue-600 mt-1">Total amount due from all buyers</p>
                  </div>

                  {Object.values(buyerDues).filter(buyer => buyer.due > 0).map((buyer) => (
                    <div key={buyer.userId} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium">{buyer.userName}</h3>
                          <p className="text-sm text-gray-600">Customer ID: {buyer.userId}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-red-600">₹{buyer.due}</p>
                          <p className="text-sm text-gray-600">Due Amount</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-2 bg-red-50 rounded">
                          <span className="text-red-600">Total Purchases: ₹{buyer.totalPurchases}</span>
                        </div>
                        <div className="p-2 bg-green-50 rounded">
                          <span className="text-green-600">Total Payments: ₹{buyer.totalPayments}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {Object.values(buyerDues).filter(buyer => buyer.due > 0).length === 0 && (
                    <p className="text-gray-500 text-center py-8">No outstanding dues from buyers</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="milkmen" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Milkmen Management</CardTitle>
                <CardDescription>Approve or manage milkman registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {milkmen.map((milkman: Milkman) => (
                    <div key={milkman.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{milkman.name} (@{milkman.username})</h3>
                          <Badge variant={milkman.status === 'approved' ? 'default' : milkman.status === 'pending' ? 'secondary' : 'destructive'}>
                            {milkman.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{milkman.location} • {milkman.phone}</p>
                        <p className="text-sm">Total Due: ₹{milkman.totalDue || 0}</p>
                      </div>
                      {milkman.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => onApproveMilkman(milkman.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => onRejectMilkman(milkman.id)}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rates" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Dairy Rate Management</CardTitle>
                <CardDescription>Set rates for milk purchase and sale</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Rate paid to farmers (₹/liter)</Label>
                    <Input
                      type="number"
                      value={newRates.milkmanRate}
                      onChange={(e) => setNewRates({...newRates, milkmanRate: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Rate charged to customers (₹/liter)</Label>
                    <Input
                      type="number"
                      value={newRates.buyerRate}
                      onChange={(e) => setNewRates({...newRates, buyerRate: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Profit per liter: ₹{newRates.buyerRate - newRates.milkmanRate}
                  </p>
                </div>
                <Button 
                  onClick={handleUpdateRates}
                  disabled={newRates.milkmanRate <= 0 || newRates.buyerRate <= 0 || newRates.buyerRate <= newRates.milkmanRate}
                >
                  Update Rates
                </Button>
                {newRates.buyerRate <= newRates.milkmanRate && (
                  <p className="text-sm text-red-600">Customer rate must be higher than farmer rate to ensure profit</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Management</CardTitle>
                <CardDescription>Pay milkmen for supplied milk</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {milkmen.filter(m => (m.totalDue || 0) > 0).map((milkman: Milkman) => (
                    <div key={milkman.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium">{milkman.name}</h3>
                          <p className="text-sm text-gray-600">{milkman.location} • {milkman.phone}</p>
                          <p className="text-sm">
                            Account: {milkman.accountNumber ? `****${milkman.accountNumber.slice(-4)}` : 'Not Provided'}
                            {milkman.ifscCode && ` • IFSC: ${milkman.ifscCode}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">₹{milkman.totalDue}</p>
                          <p className="text-sm text-gray-600">Total Due</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          onClick={() => onPayMilkman(milkman.id, milkman.totalDue || 0)}
                          disabled={!milkman.accountNumber || !milkman.ifscCode}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Pay Now
                        </Button>
                        {(!milkman.accountNumber || !milkman.ifscCode) && (
                          <p className="text-sm text-orange-600 flex items-center">
                            ⚠️ Bank details missing
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  {milkmen.filter(m => (m.totalDue || 0) > 0).length === 0 && (
                    <p className="text-gray-500 text-center py-8">No pending payments</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-medium text-green-800">Total Revenue</h3>
                    <p className="text-2xl font-bold text-green-600">₹{totalRevenue}</p>
                    <p className="text-sm text-green-600">From milk sales</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h3 className="font-medium text-red-800">Total Expenses</h3>
                    <p className="text-2xl font-bold text-red-600">₹{totalExpenses}</p>
                    <p className="text-sm text-red-600">Milk purchases</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-800">Net Profit</h3>
                    <p className="text-2xl font-bold text-blue-600">₹{totalProfit}</p>
                    <p className="text-sm text-blue-600">Overall profit</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium mb-4">Customer Dues</h3>
                  <div className="space-y-2">
                    {Object.entries(getBuyerDues()).map(([buyer, amount]) => (
                      <div key={buyer} className="flex justify-between p-2 bg-gray-50 rounded">
                        <span>{buyer}</span>
                        <span className="font-bold">₹{amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Registered Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user: User) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{user.username}</h3>
                          <Badge variant={user.role === 'buyer' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        {user.location && <p className="text-sm text-gray-500">{user.location}</p>}
                        {user.role === 'buyer' && (
                          <p className="text-sm text-blue-600">
                            Total Due: ₹{getBuyerDues()[user.username] || 0}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">User ID: {user.id}</p>
                      </div>
                    </div>
                  ))}
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
