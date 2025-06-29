import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, TrendingUp, ShoppingCart, Truck, CreditCard } from 'lucide-react';

interface Order {
  id: number;
  buyerId: number;
  buyerName: string;
  milkmanId: number;
  milkmanName: string;
  quantity: number;
  rate: number;
  amount: number;
  status: 'pending' | 'admin_approved' | 'milkman_accepted' | 'delivered' | 'rejected';
  date: string;
  location?: string;
  deliveryTime?: string;
}

interface Milkman {
  id: number;
  name: string;
  username: string;
  location: string;
  rate: number;
  status: 'pending' | 'approved' | 'rejected';
  phone: string;
  availableQuantity: number;
  rating: number;
  distance?: string;
  available: boolean;
  accountNumber?: string;
  ifscCode?: string;
  pendingPayment?: number;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  phone?: string;
  location?: string;
}

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
  orders: Order[];
  milkmen: Milkman[];
  users: User[];
  onApproveOrder: (orderId: number) => void;
  onRejectOrder: (orderId: number) => void;
  onApproveMilkman: (milkmanId: number) => void;
  onRejectMilkman: (milkmanId: number) => void;
  onUpdateMilkmanRate?: (milkmanId: number, rate: number) => void;
  onPayMilkman?: (milkmanId: number, amount: number) => void;
}

const AdminDashboard = ({ 
  user, 
  onLogout, 
  orders, 
  milkmen, 
  users, 
  onApproveOrder, 
  onRejectOrder, 
  onApproveMilkman, 
  onRejectMilkman,
  onUpdateMilkmanRate,
  onPayMilkman
}: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMilkmanRate, setSelectedMilkmanRate] = useState<{[key: number]: number}>({});

  const stats = [
    { title: 'Total Users', value: users.length.toString(), icon: Users, change: '+12%' },
    { title: 'Daily Revenue', value: `₹${orders.filter(o => o.status === 'delivered').reduce((sum: number, o: Order) => sum + o.amount, 0)}`, icon: TrendingUp, change: '+8%' },
    { title: 'Pending Orders', value: orders.filter((o: Order) => o.status === 'pending').length.toString(), icon: ShoppingCart, change: '+15%' },
    { title: 'Active Milkmen', value: milkmen.filter((m: Milkman) => m.status === 'approved').length.toString(), icon: Truck, change: '+5%' }
  ];

  const pendingOrders = orders.filter((o: Order) => o.status === 'pending');
  const pendingMilkmen = milkmen.filter((m: Milkman) => m.status === 'pending');
  const totalPendingPayments = milkmen.reduce((sum, m) => sum + (m.pendingPayment || 0), 0);

  const handleUpdateMilkmanRate = (milkmanId: number) => {
    const rate = selectedMilkmanRate[milkmanId];
    if (rate && onUpdateMilkmanRate) {
      onUpdateMilkmanRate(milkmanId, rate);
    }
  };

  const handlePayMilkman = (milkmanId: number, amount: number) => {
    if (onPayMilkman) {
      onPayMilkman(milkmanId, amount);
    }
  };

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
            <TabsTrigger value="orders">
              Orders {pendingOrders.length > 0 && <Badge className="ml-2">{pendingOrders.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="milkmen">
              Milkmen {pendingMilkmen.length > 0 && <Badge className="ml-2">{pendingMilkmen.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="rates">Rate Management</TabsTrigger>
            <TabsTrigger value="payments">
              Payments <Badge className="ml-2">₹{totalPendingPayments}</Badge>
            </TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Orders ({pendingOrders.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingOrders.slice(0, 3).map((order: Order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div>
                          <p className="font-medium">Order #{order.id}</p>
                          <p className="text-sm text-gray-600">{order.buyerName} → {order.milkmanName}</p>
                          <p className="text-sm">{order.quantity} liters • ₹{order.amount}</p>
                        </div>
                        <Badge variant="outline">Pending Approval</Badge>
                      </div>
                    ))}
                    {pendingOrders.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No pending orders</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pending Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {milkmen.filter(m => (m.pendingPayment || 0) > 0).slice(0, 3).map((milkman: Milkman) => (
                      <div key={milkman.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                        <div>
                          <p className="font-medium">{milkman.name}</p>
                          <p className="text-sm text-gray-600">{milkman.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">₹{milkman.pendingPayment || 0}</p>
                        </div>
                      </div>
                    ))}
                    {totalPendingPayments === 0 && (
                      <p className="text-gray-500 text-center py-4">No pending payments</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>Review and approve customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order: Order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">Order #{order.id}</h3>
                          <Badge variant={
                            order.status === 'delivered' ? 'default' : 
                            order.status === 'pending' ? 'destructive' :
                            order.status === 'admin_approved' ? 'secondary' :
                            order.status === 'milkman_accepted' ? 'outline' : 'secondary'
                          }>
                            {order.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{order.buyerName} → {order.milkmanName}</p>
                        <p className="text-sm">{order.quantity} liters @ ₹{order.rate}/L = ₹{order.amount}</p>
                        <p className="text-sm text-gray-500">{order.date} • {order.deliveryTime}</p>
                      </div>
                      {order.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => onApproveOrder(order.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => onRejectOrder(order.id)}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No orders found</p>
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
                        <p className="text-sm">Rate: ₹{milkman.rate}/liter • Available: {milkman.availableQuantity}L</p>
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
                <CardTitle>Rate Management</CardTitle>
                <CardDescription>Set milk rates for each milkman</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {milkmen.filter(m => m.status === 'approved').map((milkman: Milkman) => (
                    <div key={milkman.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{milkman.name}</h3>
                        <p className="text-sm text-gray-600">{milkman.location}</p>
                        <p className="text-sm">Current Rate: ₹{milkman.rate}/liter</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm">New Rate:</Label>
                        <Input
                          type="number"
                          placeholder="Rate"
                          className="w-24"
                          value={selectedMilkmanRate[milkman.id] || ''}
                          onChange={(e) => setSelectedMilkmanRate({
                            ...selectedMilkmanRate,
                            [milkman.id]: parseInt(e.target.value) || 0
                          })}
                        />
                        <Button 
                          size="sm"
                          onClick={() => handleUpdateMilkmanRate(milkman.id)}
                          disabled={!selectedMilkmanRate[milkman.id]}
                        >
                          Update
                        </Button>
                      </div>
                    </div>
                  ))}
                  {milkmen.filter(m => m.status === 'approved').length === 0 && (
                    <p className="text-gray-500 text-center py-8">No approved milkmen</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Management</CardTitle>
                <CardDescription>Pay milkmen for delivered orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {milkmen.filter(m => (m.pendingPayment || 0) > 0).map((milkman: Milkman) => (
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
                          <p className="text-lg font-bold text-green-600">₹{milkman.pendingPayment}</p>
                          <p className="text-sm text-gray-600">Pending Payment</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          onClick={() => handlePayMilkman(milkman.id, milkman.pendingPayment || 0)}
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
                  {milkmen.filter(m => (m.pendingPayment || 0) > 0).length === 0 && (
                    <p className="text-gray-500 text-center py-8">No pending payments</p>
                  )}
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
