import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, ShoppingCart, Truck } from 'lucide-react';

type UserRole = 'admin' | 'buyer' | 'milkman' | null;

const Index = () => {
  const [currentUser, setCurrentUser] = useState<{ role: UserRole; name: string } | null>(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [isSignup, setIsSignup] = useState(false);
  const [signupForm, setSignupForm] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    confirmPassword: '', 
    role: '' as UserRole 
  });

  const handleLogin = (role: UserRole, name: string) => {
    setCurrentUser({ role, name });
  };

  const handleSignup = () => {
    if (signupForm.password !== signupForm.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (!signupForm.username || !signupForm.email || !signupForm.password || !signupForm.role) {
      alert('Please fill all fields!');
      return;
    }
    // Simulate successful signup
    setCurrentUser({ role: signupForm.role, name: signupForm.username });
    setSignupForm({ username: '', email: '', password: '', confirmPassword: '', role: '' as UserRole });
    setIsSignup(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginForm({ email: '', password: '' });
    setSignupForm({ username: '', email: '', password: '', confirmPassword: '', role: '' as UserRole });
    setIsSignup(false);
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
      return <AdminDashboard user={currentUser} onLogout={handleLogout} />;
    case 'buyer':
      return <BuyerDashboard user={currentUser} onLogout={handleLogout} />;
    case 'milkman':
      return <MilkmanDashboard user={currentUser} onLogout={handleLogout} />;
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
                      onClick={() => onLogin('admin', 'Admin User')}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Login as Admin
                    </Button>
                    <Button 
                      onClick={() => onLogin('buyer', 'John Buyer')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Login as Milk Buyer
                    </Button>
                    <Button 
                      onClick={() => onLogin('milkman', 'Ramesh Milkman')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Login as Milkman
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
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={signupForm.username}
                    onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Enter your password"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={signupForm.confirmPassword}
                    onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
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

const AdminDashboard = ({ user, onLogout }: any) => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { title: 'Total Users', value: '234', icon: Users, change: '+12%' },
    { title: 'Daily Revenue', value: '₹45,230', icon: TrendingUp, change: '+8%' },
    { title: 'Active Orders', value: '89', icon: ShoppingCart, change: '+15%' },
    { title: 'Deliveries', value: '156', icon: Truck, change: '+5%' }
  ];

  const milkmen = [
    { id: 1, name: 'Ramesh Kumar', location: 'Sector 21', rate: 65, status: 'approved', phone: '+91-9876543210' },
    { id: 2, name: 'Suresh Yadav', location: 'Sector 15', rate: 70, status: 'pending', phone: '+91-9876543211' },
    { id: 3, name: 'Mahesh Singh', location: 'Sector 8', rate: 60, status: 'approved', phone: '+91-9876543212' }
  ];

  const buyers = [
    { id: 1, name: 'Priya Sharma', location: 'Sector 18', orders: 45, totalSpent: '₹12,450' },
    { id: 2, name: 'Amit Verma', location: 'Sector 12', orders: 32, totalSpent: '₹8,960' },
    { id: 3, name: 'Neha Gupta', location: 'Sector 25', orders: 28, totalSpent: '₹7,840' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🥛 DairyConnect Admin</h1>
            <p className="text-gray-600">Welcome back, {user.name}</p>
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
            <TabsTrigger value="milkmen">Milkmen</TabsTrigger>
            <TabsTrigger value="buyers">Buyers</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Order #{1000 + i}</p>
                          <p className="text-sm text-gray-600">Priya Sharma - 2 liters</p>
                        </div>
                        <Badge>Delivered</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Milkmen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {milkmen.filter(m => m.status === 'approved').map((milkman) => (
                      <div key={milkman.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{milkman.name}</p>
                          <p className="text-sm text-gray-600">{milkman.location}</p>
                        </div>
                        <p className="font-bold text-green-600">₹{milkman.rate}/L</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="milkmen" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Milkmen Management</CardTitle>
                <CardDescription>Approve or manage milkman registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {milkmen.map((milkman) => (
                    <div key={milkman.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{milkman.name}</h3>
                        <p className="text-sm text-gray-600">{milkman.location} • {milkman.phone}</p>
                        <p className="text-sm">Rate: ₹{milkman.rate}/liter</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={milkman.status === 'approved' ? 'default' : 'secondary'}>
                          {milkman.status}
                        </Badge>
                        {milkman.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">Approve</Button>
                            <Button size="sm" variant="outline">Reject</Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="buyers" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Registered Buyers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {buyers.map((buyer) => (
                    <div key={buyer.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{buyer.name}</h3>
                        <p className="text-sm text-gray-600">{buyer.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{buyer.orders} orders</p>
                        <p className="text-sm text-gray-600">{buyer.totalSpent} total</p>
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
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Order #{1000 + i}</p>
                        <p className="text-sm text-gray-600">Priya Sharma → Ramesh Kumar</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">₹130</p>
                        <p className="text-sm text-gray-600">2 liters @ ₹65/L</p>
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

const BuyerDashboard = ({ user, onLogout }: any) => {
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedMilkman, setSelectedMilkman] = useState<any>(null);
  const [orderQuantity, setOrderQuantity] = useState(1);

  const nearbyMilkmen = [
    { id: 1, name: 'Ramesh Kumar', location: 'Sector 21', rate: 65, rating: 4.8, distance: '0.5 km', available: true },
    { id: 2, name: 'Suresh Yadav', location: 'Sector 15', rate: 70, rating: 4.6, distance: '1.2 km', available: true },
    { id: 3, name: 'Mahesh Singh', location: 'Sector 8', rate: 60, rating: 4.9, distance: '2.1 km', available: false }
  ];

  const myOrders = [
    { id: 1, milkman: 'Ramesh Kumar', quantity: 2, amount: 130, status: 'delivered', date: '2024-01-15' },
    { id: 2, milkman: 'Suresh Yadav', quantity: 1, amount: 70, status: 'pending', date: '2024-01-16' },
    { id: 3, milkman: 'Ramesh Kumar', quantity: 3, amount: 195, status: 'confirmed', date: '2024-01-16' }
  ];

  const placeOrder = () => {
    if (selectedMilkman) {
      alert(`Order placed! ${orderQuantity} liters from ${selectedMilkman.name} for ₹${orderQuantity * selectedMilkman.rate}`);
      setSelectedMilkman(null);
      setOrderQuantity(1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🥛 DairyConnect Buyer</h1>
            <p className="text-gray-600">Welcome, {user.name}</p>
          </div>
          <Button onClick={onLogout} variant="outline">Logout</Button>
        </div>
      </header>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="browse">Browse Milkmen</TabsTrigger>
            <TabsTrigger value="orders">My Orders</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Nearby Milkmen</CardTitle>
                    <CardDescription>Choose from quality milk suppliers in your area</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {nearbyMilkmen.map((milkman) => (
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
                              <p className="text-sm text-gray-600">{milkman.location} • {milkman.distance}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="font-bold text-green-600">₹{milkman.rate}/liter</span>
                                <span className="text-sm">⭐ {milkman.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
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
                        <p className="text-sm text-gray-600">{selectedMilkman.location}</p>
                        <p className="text-sm">₹{selectedMilkman.rate}/liter</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Quantity (liters)</Label>
                        <Input
                          type="number"
                          min="1"
                          value={orderQuantity}
                          onChange={(e) => setOrderQuantity(parseInt(e.target.value) || 1)}
                        />
                      </div>

                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="text-xl font-bold">₹{orderQuantity * selectedMilkman.rate}</p>
                      </div>

                      <Button onClick={placeOrder} className="w-full">
                        Place Order
                      </Button>
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
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Order #{order.id}</p>
                        <p className="text-sm text-gray-600">{order.milkman} • {order.date}</p>
                        <p className="text-sm">{order.quantity} liters</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{order.amount}</p>
                        <Badge variant={
                          order.status === 'delivered' ? 'default' : 
                          order.status === 'confirmed' ? 'secondary' : 'outline'
                        }>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
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
                    <Label>Name</Label>
                    <Input value={user.name} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value="john@example.com" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value="+91-9876543210" />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input value="Sector 18, Gurgaon" />
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

const MilkmanDashboard = ({ user, onLogout }: any) => {
  const [activeTab, setActiveTab] = useState('orders');
  const [milkRate, setMilkRate] = useState(65);
  const [availableQuantity, setAvailableQuantity] = useState(50);

  const pendingOrders = [
    { id: 1, buyer: 'Priya Sharma', quantity: 2, amount: 130, location: 'Sector 18', time: '7:00 AM' },
    { id: 2, buyer: 'Amit Verma', quantity: 1, amount: 65, location: 'Sector 12', time: '7:30 AM' },
    { id: 3, buyer: 'Neha Gupta', quantity: 3, amount: 195, location: 'Sector 25', time: '8:00 AM' }
  ];

  const completedOrders = [
    { id: 4, buyer: 'Raj Patel', quantity: 2, amount: 130, status: 'delivered', date: '2024-01-15' },
    { id: 5, buyer: 'Sunita Devi', quantity: 1, amount: 65, status: 'delivered', date: '2024-01-15' },
    { id: 6, buyer: 'Mohan Kumar', quantity: 4, amount: 260, status: 'delivered', date: '2024-01-14' }
  ];

  const acceptOrder = (orderId: number) => {
    alert(`Order #${orderId} accepted!`);
  };

  const rejectOrder = (orderId: number) => {
    alert(`Order #${orderId} rejected!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🥛 DairyConnect Milkman</h1>
            <p className="text-gray-600">Welcome, {user.name}</p>
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
                <p className="text-2xl font-bold text-green-600">₹1,240</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Orders Delivered</p>
                <p className="text-2xl font-bold text-blue-600">8</p>
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
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Orders</CardTitle>
                  <CardDescription>Accept or reject incoming orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingOrders.map((order) => (
                      <div key={order.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-medium">{order.buyer}</p>
                            <p className="text-sm text-gray-600">{order.location} • {order.time}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">₹{order.amount}</p>
                            <p className="text-sm text-gray-600">{order.quantity} liters</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => acceptOrder(order.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Accept
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => rejectOrder(order.id)}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Deliveries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {completedOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{order.buyer}</p>
                          <p className="text-sm text-gray-600">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">₹{order.amount}</p>
                          <Badge>Delivered</Badge>
                        </div>
                      </div>
                    ))}
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
                    
                    <Button>Update Inventory</Button>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-medium mb-2">Current Status</h3>
                      <div className="space-y-1 text-sm">
                        <p>Rate: ₹{milkRate}/liter</p>
                        <p>Available: {availableQuantity} liters</p>
                        <p>Status: <Badge variant="default">Active</Badge></p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h3 className="font-medium mb-2">Today's Summary</h3>
                      <div className="space-y-1 text-sm">
                        <p>Sold: 19 liters</p>
                        <p>Remaining: {availableQuantity} liters</p>
                        <p>Revenue: ₹1,240</p>
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
                    <p className="text-2xl font-bold text-green-600">₹1,240</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <p className="text-sm text-gray-600">This Week</p>
                    <p className="text-2xl font-bold text-blue-600">₹8,650</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg text-center">
                    <p className="text-sm text-gray-600">This Month</p>
                    <p className="text-2xl font-bold text-purple-600">₹34,200</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {['2024-01-16', '2024-01-15', '2024-01-14', '2024-01-13'].map((date, index) => (
                    <div key={date} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{date}</p>
                        <p className="text-sm text-gray-600">{8 - index} orders delivered</p>
                      </div>
                      <p className="font-bold text-green-600">₹{1240 - (index * 100)}</p>
                    </div>
                  ))}
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
                    <Label>Name</Label>
                    <Input value={user.name} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value="+91-9876543210" />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input value="Sector 21, Gurgaon" />
                  </div>
                  <div className="space-y-2">
                    <Label>License Number</Label>
                    <Input value="DL2024001234" />
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
                
                <Button>Update Profile</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
