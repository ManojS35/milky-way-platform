import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, ShoppingCart, Truck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type UserRole = 'admin' | 'buyer' | 'milkman' | null;

interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  phone?: string;
  location?: string;
}

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

const Index = () => {
  const { toast } = useToast();
  
  // Global state for users, orders, and milkmen
  const [users, setUsers] = useState<User[]>([
    { id: 1, username: 'admin', email: 'admin@dairy.com', role: 'admin' },
    { id: 2, username: 'priya_sharma', email: 'priya@example.com', role: 'buyer', phone: '+91-9876543210', location: 'Sector 18' },
    { id: 3, username: 'ramesh_kumar', email: 'ramesh@example.com', role: 'milkman', phone: '+91-9876543211', location: 'Sector 21' }
  ]);

  const [milkmen, setMilkmen] = useState<Milkman[]>([
    { id: 3, name: 'Ramesh Kumar', username: 'ramesh_kumar', location: 'Sector 21', rate: 65, status: 'approved', phone: '+91-9876543211', availableQuantity: 50, rating: 4.8, distance: '0.5 km', available: true },
    { id: 4, name: 'Suresh Yadav', username: 'suresh_yadav', location: 'Sector 15', rate: 70, status: 'pending', phone: '+91-9876543212', availableQuantity: 30, rating: 4.6, distance: '1.2 km', available: true },
    { id: 5, name: 'Mahesh Singh', username: 'mahesh_singh', location: 'Sector 8', rate: 60, status: 'approved', phone: '+91-9876543213', availableQuantity: 25, rating: 4.9, distance: '2.1 km', available: false }
  ]);

  const [orders, setOrders] = useState<Order[]>([
    { id: 1, buyerId: 2, buyerName: 'priya_sharma', milkmanId: 3, milkmanName: 'ramesh_kumar', quantity: 2, rate: 65, amount: 130, status: 'delivered', date: '2024-01-15', location: 'Sector 18', deliveryTime: '7:00 AM' },
    { id: 2, buyerId: 2, buyerName: 'priya_sharma', milkmanId: 4, milkmanName: 'suresh_yadav', quantity: 1, rate: 70, amount: 70, status: 'pending', date: '2024-01-16', location: 'Sector 18', deliveryTime: '7:30 AM' }
  ]);

  const [nextOrderId, setNextOrderId] = useState(3);
  const [nextUserId, setNextUserId] = useState(6);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [isSignup, setIsSignup] = useState(false);
  const [signupForm, setSignupForm] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    confirmPassword: '', 
    role: '' as UserRole,
    phone: '',
    location: ''
  });

  const handleLogin = (role: UserRole, username: string) => {
    const user = users.find(u => u.username === username) || { id: 1, username, email: '', role };
    setCurrentUser(user);
    toast({
      title: "Login Successful",
      description: `Welcome back, ${username}!`,
    });
  };

  const handleSignup = () => {
    if (signupForm.password !== signupForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match!",
        variant: "destructive"
      });
      return;
    }
    if (!signupForm.username || !signupForm.email || !signupForm.password || !signupForm.role) {
      toast({
        title: "Error", 
        description: "Please fill all required fields!",
        variant: "destructive"
      });
      return;
    }

    const newUser: User = {
      id: nextUserId,
      username: signupForm.username,
      email: signupForm.email,
      role: signupForm.role,
      phone: signupForm.phone || undefined,
      location: signupForm.location || undefined
    };

    setUsers([...users, newUser]);
    setNextUserId(nextUserId + 1);

    // If milkman, add to milkmen list with pending status
    if (signupForm.role === 'milkman') {
      const newMilkman: Milkman = {
        id: nextUserId,
        name: signupForm.username,
        username: signupForm.username,
        location: signupForm.location || 'Unknown',
        rate: 65,
        status: 'pending',
        phone: signupForm.phone || '',
        availableQuantity: 0,
        rating: 0,
        available: false
      };
      setMilkmen([...milkmen, newMilkman]);
    }

    setCurrentUser(newUser);
    setSignupForm({ username: '', email: '', password: '', confirmPassword: '', role: '' as UserRole, phone: '', location: '' });
    setIsSignup(false);
    
    toast({
      title: "Signup Successful",
      description: `Account created for ${signupForm.username}!`,
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginForm({ email: '', password: '' });
    setSignupForm({ username: '', email: '', password: '', confirmPassword: '', role: '' as UserRole, phone: '', location: '' });
    setIsSignup(false);
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  const placeOrder = (milkman: Milkman, quantity: number, deliveryTime: string) => {
    if (!currentUser) return;

    const newOrder: Order = {
      id: nextOrderId,
      buyerId: currentUser.id,
      buyerName: currentUser.username,
      milkmanId: milkman.id,
      milkmanName: milkman.username,
      quantity,
      rate: milkman.rate,
      amount: quantity * milkman.rate,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      location: currentUser.location,
      deliveryTime
    };

    setOrders([...orders, newOrder]);
    setNextOrderId(nextOrderId + 1);
    
    toast({
      title: "Order Placed",
      description: `Order for ${quantity} liters placed with ${milkman.name}. Waiting for admin approval.`,
    });
  };

  const approveOrderByAdmin = (orderId: number) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'admin_approved' as const }
        : order
    ));
    toast({
      title: "Order Approved",
      description: "Order has been approved and sent to milkman.",
    });
  };

  const rejectOrderByAdmin = (orderId: number) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'rejected' as const }
        : order
    ));
    toast({
      title: "Order Rejected",
      description: "Order has been rejected.",
      variant: "destructive"
    });
  };

  const acceptOrderByMilkman = (orderId: number) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'milkman_accepted' as const }
        : order
    ));
    toast({
      title: "Order Accepted",
      description: "Order has been accepted. Ready for delivery.",
    });
  };

  const rejectOrderByMilkman = (orderId: number) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'rejected' as const }
        : order
    ));
    toast({
      title: "Order Rejected",
      description: "Order has been rejected by milkman.",
      variant: "destructive"
    });
  };

  const markOrderDelivered = (orderId: number) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'delivered' as const }
        : order
    ));
    toast({
      title: "Order Delivered",
      description: "Order has been marked as delivered.",
    });
  };

  const approveMilkman = (milkmanId: number) => {
    setMilkmen(milkmen.map(m => 
      m.id === milkmanId 
        ? { ...m, status: 'approved' as const, available: true, availableQuantity: 50 }
        : m
    ));
    toast({
      title: "Milkman Approved",
      description: "Milkman has been approved and can now accept orders.",
    });
  };

  const rejectMilkman = (milkmanId: number) => {
    setMilkmen(milkmen.map(m => 
      m.id === milkmanId 
        ? { ...m, status: 'rejected' as const }
        : m
    ));
    toast({
      title: "Milkman Rejected",
      description: "Milkman application has been rejected.",
      variant: "destructive"
    });
  };

  if (!currentUser) {
    return <LoginPage 
      onLogin={handleLogin} 
      loginForm={loginForm} 
      setLoginForm={setLoginForm}
      isSignup={isSignup}
      setIsSignup={setIsSignup}
      signupForm={signupForm}
      setSignupForm={setSignupForm}
      handleSignup={handleSignup}
    />;
  }

  switch (currentUser.role) {
    case 'admin':
      return <AdminDashboard 
        user={currentUser} 
        onLogout={handleLogout} 
        orders={orders}
        milkmen={milkmen}
        users={users.filter(u => u.role !== 'admin')}
        onApproveOrder={approveOrderByAdmin}
        onRejectOrder={rejectOrderByAdmin}
        onApproveMilkman={approveMilkman}
        onRejectMilkman={rejectMilkman}
      />;
    case 'buyer':
      return <BuyerDashboard 
        user={currentUser} 
        onLogout={handleLogout} 
        milkmen={milkmen.filter(m => m.status === 'approved')}
        orders={orders.filter(o => o.buyerId === currentUser.id)}
        onPlaceOrder={placeOrder}
      />;
    case 'milkman':
      return <MilkmanDashboard 
        user={currentUser} 
        onLogout={handleLogout} 
        orders={orders.filter(o => o.milkmanId === currentUser.id)}
        onAcceptOrder={acceptOrderByMilkman}
        onRejectOrder={rejectOrderByMilkman}
        onMarkDelivered={markOrderDelivered}
        milkmanData={milkmen.find(m => m.id === currentUser.id)}
      />;
    default:
      return <LoginPage 
        onLogin={handleLogin} 
        loginForm={loginForm} 
        setLoginForm={setLoginForm}
        isSignup={isSignup}
        setIsSignup={setIsSignup}
        signupForm={signupForm}
        setSignupForm={setSignupForm}
        handleSignup={handleSignup}
      />;
  }
};

const LoginPage = ({ onLogin, loginForm, setLoginForm, isSignup, setIsSignup, signupForm, setSignupForm, handleSignup }: any) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🥛 DairyConnect</h1>
          <p className="text-gray-600">Professional Dairy Management Platform</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isSignup ? 'Create Account' : 'Welcome Back'}</CardTitle>
            <CardDescription>
              {isSignup ? 'Sign up for your account' : 'Sign in to your account'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isSignup ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Demo Login (Select Role)</Label>
                  <div className="grid grid-cols-1 gap-2">
                    <Button 
                      onClick={() => onLogin('admin', 'admin')}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Login as Admin
                    </Button>
                    <Button 
                      onClick={() => onLogin('buyer', 'priya_sharma')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Login as Milk Buyer (Priya)
                    </Button>
                    <Button 
                      onClick={() => onLogin('milkman', 'ramesh_kumar')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Login as Milkman (Ramesh)
                    </Button>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <button 
                      onClick={() => setIsSignup(true)}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={signupForm.username}
                    onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email *</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={signupForm.phone}
                    onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="Enter your location"
                    value={signupForm.location}
                    onChange={(e) => setSignupForm({ ...signupForm, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password *</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Enter your password"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password *</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={signupForm.confirmPassword}
                    onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role *</Label>
                  <Select onValueChange={(value) => setSignupForm({ ...signupForm, role: value as UserRole })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buyer">Milk Buyer</SelectItem>
                      <SelectItem value="milkman">Milkman</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleSignup} className="w-full">
                  Sign Up
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <button 
                      onClick={() => setIsSignup(false)}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const AdminDashboard = ({ user, onLogout, orders, milkmen, users, onApproveOrder, onRejectOrder, onApproveMilkman, onRejectMilkman }: any) => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { title: 'Total Users', value: users.length.toString(), icon: Users, change: '+12%' },
    { title: 'Daily Revenue', value: `₹${orders.filter(o => o.status === 'delivered').reduce((sum: number, o: Order) => sum + o.amount, 0)}`, icon: TrendingUp, change: '+8%' },
    { title: 'Pending Orders', value: orders.filter((o: Order) => o.status === 'pending').length.toString(), icon: ShoppingCart, change: '+15%' },
    { title: 'Active Milkmen', value: milkmen.filter((m: Milkman) => m.status === 'approved').length.toString(), icon: Truck, change: '+5%' }
  ];

  const pendingOrders = orders.filter((o: Order) => o.status === 'pending');
  const pendingMilkmen = milkmen.filter((m: Milkman) => m.status === 'pending');

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
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
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
                  <CardTitle>Pending Milkmen ({pendingMilkmen.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingMilkmen.slice(0, 3).map((milkman: Milkman) => (
                      <div key={milkman.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div>
                          <p className="font-medium">{milkman.name}</p>
                          <p className="text-sm text-gray-600">{milkman.location}</p>
                        </div>
                        <Badge variant="outline">Pending Approval</Badge>
                      </div>
                    ))}
                    {pendingMilkmen.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No pending applications</p>
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

          <TabsContent value="transactions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.filter((o: Order) => o.status === 'delivered').map((order: Order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Order #{order.id}</p>
                        <p className="text-sm text-gray-600">{order.buyerName} → {order.milkmanName}</p>
                        <p className="text-sm text-gray-500">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">₹{order.amount}</p>
                        <p className="text-sm text-gray-600">{order.quantity} liters @ ₹{order.rate}/L</p>
                      </div>
                    </div>
                  ))}
                  {orders.filter((o: Order) => o.status === 'delivered').length === 0 && (
                    <p className="text-gray-500 text-center py-8">No completed transactions</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const BuyerDashboard = ({ user, onLogout, milkmen, orders, onPlaceOrder }: any) => {
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

const MilkmanDashboard = ({ user, onLogout, orders, onAcceptOrder, onRejectOrder, onMarkDelivered, milkmanData }: any) => {
  const [activeTab, setActiveTab] = useState('orders');
  const [milkRate, setMilkRate] = useState(milkmanData?.rate || 65);
  const [availableQuantity, setAvailableQuantity] = useState(milkmanData?.availableQuantity || 50);

  const pendingOrders = orders.filter((o: Order) => o.status === 'admin_approved');
  const acceptedOrders = orders.filter((o: Order) => o.status === 'milkman_accepted');
  const completedOrders = orders.filter((o: Order) => o.status === 'delivered');
  
  const todaysEarnings = completedOrders
    .filter((o: Order) => o.date === new Date().toISOString().split('T')[0])
    .reduce((sum: number, o: Order) => sum + o.amount, 0);

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                <p className="text-sm font-medium text-gray-600">Orders Delivered</p>
                <p className="text-2xl font-bold text-blue-600">{completedOrders.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-orange-600">{pendingOrders.length}</p>
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
            <TabsTrigger value="profile">Profile</TabsTrigger>
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
                              <p className="text-sm text-gray-600">{order.quantity} liters</p>
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
                <CardTitle>Milk Inventory & Pricing</CardTitle>
                <CardDescription>Manage your milk availability and rates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Milk Rate (per liter)</Label>
                      <div className="flex items-center gap-2">
                        <span>₹</span>
                        <Input
                          type="number"
                          value={milkRate}
                          onChange={(e) => setMilkRate(parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    
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
                        <p>Rate: ₹{milkmanData?.rate || milkRate}/liter</p>
                        <p>Available: {milkmanData?.availableQuantity || availableQuantity} liters</p>
                        <p>Status: <Badge variant={milkmanData?.status === 'approved' ? 'default' : 'secondary'}>
                          {milkmanData?.status || 'pending'}
                        </Badge></p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h3 className="font-medium mb-2">Today's Summary</h3>
                      <div className="space-y-1 text-sm">
                        <p>Orders: {orders.filter((o: Order) => o.date === new Date().toISOString().split('T')[0]).length}</p>
                        <p>Delivered: {completedOrders.filter((o: Order) => o.date === new Date().toISOString().split('T')[0]).length}</p>
                        <p>Revenue: ₹{todaysEarnings}</p>
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

          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
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
                    <Input value={user.phone || milkmanData?.phone || ''} />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input value={user.location || milkmanData?.location || ''} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Business Hours</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm">Start Time</Label>
                      <Input type="time" value="06:00" />
                    </div>
                    <div>
                      <Label className="text-sm">End Time</Label>
                      <Input type="time" value="10:00" />
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium mb-2">Account Status</p>
                  <Badge variant={milkmanData?.status === 'approved' ? 'default' : 'secondary'}>
                    {milkmanData?.status === 'approved' ? 'Approved - Active' : 
                     milkmanData?.status === 'pending' ? 'Pending Admin Approval' : 
                     'Status Unknown'}
                  </Badge>
                </div>
                
                <Button disabled={milkmanData?.status !== 'approved'}>
                  Update Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
