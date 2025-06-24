
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
}

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  phone?: string;
  location?: string;
}

interface BuyerDashboardProps {
  user: User;
  onLogout: () => void;
  milkmen: Milkman[];
  orders: Order[];
  onPlaceOrder: (milkman: Milkman, quantity: number, deliveryTime: string) => void;
}

const BuyerDashboard = ({ user, onLogout, milkmen, orders, onPlaceOrder }: BuyerDashboardProps) => {
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedMilkman, setSelectedMilkman] = useState<Milkman | null>(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [deliveryTime, setDeliveryTime] = useState('7:00 AM');

  const placeOrder = () => {
    if (selectedMilkman) {
      onPlaceOrder(selectedMilkman, orderQuantity, deliveryTime);
      setSelectedMilkman(null);
      setOrderQuantity(1);
      setDeliveryTime('7:00 AM');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🥛 DairyConnect Buyer</h1>
            <p className="text-gray-600">Welcome, {user.username}</p>
          </div>
          <Button onClick={onLogout} variant="outline">Logout</Button>
        </div>
      </header>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="browse">Browse Milkmen</TabsTrigger>
            <TabsTrigger value="orders">My Orders ({orders.length})</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Available Milkmen</CardTitle>
                    <CardDescription>Choose from approved milk suppliers in your area</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {milkmen.map((milkman: Milkman) => (
                        <div 
                          key={milkman.id} 
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedMilkman?.id === milkman.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                          } ${!milkman.available ? 'opacity-50' : ''}`}
                          onClick={() => milkman.available && setSelectedMilkman(milkman)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{milkman.name}</h3>
                                <Badge variant={milkman.available ? 'default' : 'secondary'}>
                                  {milkman.available ? 'Available' : 'Unavailable'}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">@{milkman.username} • {milkman.location}</p>
                              {milkman.distance && <p className="text-sm text-gray-500">{milkman.distance}</p>}
                              <div className="flex items-center gap-4 mt-2">
                                <span className="font-bold text-green-600">₹{milkman.rate}/liter</span>
                                <span className="text-sm">⭐ {milkman.rating}</span>
                                <span className="text-sm text-gray-500">{milkman.availableQuantity}L available</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {milkmen.length === 0 && (
                        <p className="text-gray-500 text-center py-8">No approved milkmen available</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                {selectedMilkman && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Place Order</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="font-medium">{selectedMilkman.name}</p>
                        <p className="text-sm text-gray-600">@{selectedMilkman.username}</p>
                        <p className="text-sm text-gray-600">{selectedMilkman.location}</p>
                        <p className="text-sm">₹{selectedMilkman.rate}/liter</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Quantity (liters)</Label>
                        <Input
                          type="number"
                          min="1"
                          max={selectedMilkman.availableQuantity}
                          value={orderQuantity}
                          onChange={(e) => setOrderQuantity(parseInt(e.target.value) || 1)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Preferred Delivery Time</Label>
                        <Select value={deliveryTime} onValueChange={setDeliveryTime}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="6:00 AM">6:00 AM</SelectItem>
                            <SelectItem value="6:30 AM">6:30 AM</SelectItem>
                            <SelectItem value="7:00 AM">7:00 AM</SelectItem>
                            <SelectItem value="7:30 AM">7:30 AM</SelectItem>
                            <SelectItem value="8:00 AM">8:00 AM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="text-xl font-bold">₹{orderQuantity * selectedMilkman.rate}</p>
                      </div>

                      <Button onClick={placeOrder} className="w-full" disabled={orderQuantity > selectedMilkman.availableQuantity}>
                        Place Order
                      </Button>
                      {orderQuantity > selectedMilkman.availableQuantity && (
                        <p className="text-sm text-red-600">Quantity exceeds available stock</p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>Track your milk orders and delivery status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order: Order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">Order #{order.id}</p>
                          <Badge variant={
                            order.status === 'delivered' ? 'default' : 
                            order.status === 'pending' ? 'destructive' :
                            order.status === 'admin_approved' ? 'secondary' :
                            order.status === 'milkman_accepted' ? 'outline' :
                            order.status === 'rejected' ? 'destructive' : 'secondary'
                          }>
                            {order.status === 'admin_approved' ? 'Approved' : 
                             order.status === 'milkman_accepted' ? 'Accepted' :
                             order.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{order.milkmanName} • {order.date}</p>
                        <p className="text-sm">{order.quantity} liters • {order.deliveryTime}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{order.amount}</p>
                        <p className="text-sm text-gray-600">₹{order.rate}/L</p>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No orders placed yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Username</Label>
                    <Input value={user.username} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={user.email} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={user.phone || ''} />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input value={user.location || ''} />
                  </div>
                </div>
                <Button>Update Profile</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BuyerDashboard;
