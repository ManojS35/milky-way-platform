import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

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

interface MilkmanDashboardProps {
  user: User;
  onLogout: () => void;
  orders: Order[];
  onAcceptOrder: (orderId: number) => void;
  onRejectOrder: (orderId: number) => void;
  onMarkDelivered: (orderId: number) => void;
  milkmanData?: Milkman;
  onUpdateAccountDetails?: (accountNumber: string, ifscCode: string) => void;
}

const MilkmanDashboard = ({ 
  user, 
  onLogout, 
  orders, 
  onAcceptOrder, 
  onRejectOrder, 
  onMarkDelivered, 
  milkmanData,
  onUpdateAccountDetails
}: MilkmanDashboardProps) => {
  const [activeTab, setActiveTab] = useState('orders');
  const [availableQuantity, setAvailableQuantity] = useState(milkmanData?.availableQuantity || 50);
  const [accountNumber, setAccountNumber] = useState(milkmanData?.accountNumber || '');
  const [ifscCode, setIfscCode] = useState(milkmanData?.ifscCode || '');

  const pendingOrders = orders.filter((o: Order) => o.status === 'admin_approved');
  const acceptedOrders = orders.filter((o: Order) => o.status === 'milkman_accepted');
  const completedOrders = orders.filter((o: Order) => o.status === 'delivered');
  
  const todaysEarnings = completedOrders
    .filter((o: Order) => o.date === new Date().toISOString().split('T')[0])
    .reduce((sum: number, o: Order) => sum + o.amount, 0);

  const totalEarnings = completedOrders.reduce((sum: number, o: Order) => sum + o.amount, 0);

  const handleUpdateAccountDetails = () => {
    if (onUpdateAccountDetails && accountNumber && ifscCode) {
      onUpdateAccountDetails(accountNumber, ifscCode);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🥛 DairyConnect Milkman</h1>
            <p className="text-gray-600">Welcome, {user.username}</p>
            {milkmanData?.status === 'pending' && (
              <p className="text-sm text-orange-600">Account pending admin approval</p>
            )}
          </div>
          <Button onClick={onLogout} variant="outline">Logout</Button>
        </div>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Today's Earnings</p>
                <p className="text-2xl font-bold text-green-600">₹{todaysEarnings}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-blue-600">₹{totalEarnings}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Pending Payment</p>
                <p className="text-2xl font-bold text-orange-600">₹{milkmanData?.pendingPayment || totalEarnings}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Current Rate</p>
                <p className="text-2xl font-bold text-purple-600">₹{milkmanData?.rate || 0}/L</p>
                <p className="text-xs text-gray-500">Set by Admin</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="orders">
              Orders {pendingOrders.length > 0 && <Badge className="ml-2">{pendingOrders.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="account">Account Details</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6">
            <div className="space-y-6">
              {pendingOrders.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>New Orders - Admin Approved ({pendingOrders.length})</CardTitle>
                    <CardDescription>Accept or reject orders approved by admin</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pendingOrders.map((order: Order) => (
                        <div key={order.id} className="p-4 border rounded-lg bg-green-50 border-green-200">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-medium">Order #{order.id}</p>
                              <p className="text-sm text-gray-600">{order.buyerName} • {order.location}</p>
                              <p className="text-sm text-gray-600">{order.deliveryTime} • {order.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-green-600">₹{order.amount}</p>
                              <p className="text-sm text-gray-600">{order.quantity} liters @ ₹{order.rate}/L</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => onAcceptOrder(order.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Accept Order
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => onRejectOrder(order.id)}
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {acceptedOrders.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Accepted Orders ({acceptedOrders.length})</CardTitle>
                    <CardDescription>Orders ready for delivery</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {acceptedOrders.map((order: Order) => (
                        <div key={order.id} className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-medium">Order #{order.id}</p>
                              <p className="text-sm text-gray-600">{order.buyerName} • {order.location}</p>
                              <p className="text-sm text-gray-600">{order.deliveryTime} • {order.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">₹{order.amount}</p>
                              <p className="text-sm text-gray-600">{order.quantity} liters</p>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => onMarkDelivered(order.id)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Mark as Delivered
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Recent Deliveries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {completedOrders.slice(-5).map((order: Order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Order #{order.id}</p>
                          <p className="text-sm text-gray-600">{order.buyerName} • {order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">₹{order.amount}</p>
                          <Badge>Delivered</Badge>
                        </div>
                      </div>
                    ))}
                    {completedOrders.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No deliveries yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="inventory" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Milk Inventory</CardTitle>
                <CardDescription>Manage your milk availability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Available Quantity (liters)</Label>
                      <Input
                        type="number"
                        value={availableQuantity}
                        onChange={(e) => setAvailableQuantity(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    
                    <Button disabled={milkmanData?.status !== 'approved'}>
                      {milkmanData?.status === 'approved' ? 'Update Inventory' : 'Pending Admin Approval'}
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-medium mb-2">Current Status</h3>
                      <div className="space-y-1 text-sm">
                        <p>Rate: ₹{milkmanData?.rate || 0}/liter (Set by Admin)</p>
                        <p>Available: {milkmanData?.availableQuantity || availableQuantity} liters</p>
                        <p>Status: <Badge variant={milkmanData?.status === 'approved' ? 'default' : 'secondary'}>
                          {milkmanData?.status || 'pending'}
                        </Badge></p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Earnings Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Today</p>
                    <p className="text-2xl font-bold text-green-600">₹{todaysEarnings}</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Total Earnings</p>
                    <p className="text-2xl font-bold text-purple-600">₹{completedOrders.reduce((sum: number, o: Order) => sum + o.amount, 0)}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {completedOrders.map((order: Order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Order #{order.id}</p>
                        <p className="text-sm text-gray-600">{order.buyerName} • {order.date}</p>
                        <p className="text-sm text-gray-600">{order.quantity} liters delivered</p>
                      </div>
                      <p className="font-bold text-green-600">+₹{order.amount}</p>
                    </div>
                  ))}
                  {completedOrders.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No earnings yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
                <CardDescription>Update your bank account details for payments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Account Number *</Label>
                      <Input
                        type="text"
                        placeholder="Enter your account number"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>IFSC Code *</Label>
                      <Input
                        type="text"
                        placeholder="Enter your IFSC code"
                        value={ifscCode}
                        onChange={(e) => setIfscCode(e.target.value)}
                      />
                    </div>
                    
                    <Button 
                      onClick={handleUpdateAccountDetails}
                      disabled={!accountNumber || !ifscCode || milkmanData?.status !== 'approved'}
                    >
                      Update Account Details
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h3 className="font-medium mb-2">Payment Status</h3>
                      <div className="space-y-1 text-sm">
                        <p>Pending Payment: ₹{milkmanData?.pendingPayment || totalEarnings}</p>
                        <p>Account: {milkmanData?.accountNumber ? `****${milkmanData.accountNumber.slice(-4)}` : 'Not Added'}</p>
                        <p>IFSC: {milkmanData?.ifscCode || 'Not Added'}</p>
                      </div>
                    </div>
                    
                    {(!milkmanData?.accountNumber || !milkmanData?.ifscCode) && (
                      <div className="p-4 bg-orange-50 rounded-lg">
                        <p className="text-sm font-medium text-orange-800">
                          ⚠️ Please add your bank account details to receive payments from admin.
                        </p>
                      </div>
                    )}
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

export default MilkmanDashboard;
