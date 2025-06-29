import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import LoginPage from '@/components/LoginPage';
import AdminDashboard from '@/components/AdminDashboard';
import BuyerDashboard from '@/components/BuyerDashboard';
import MilkmanDashboard from '@/components/MilkmanDashboard';

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
  accountNumber?: string;
  ifscCode?: string;
  pendingPayment?: number;
}

const Index = () => {
  const { toast } = useToast();
  
  // Secure admin credentials - only authorized admin
  const ADMIN_EMAIL = 'manojs030504@gmail.com';
  const ADMIN_PASSWORD = 'Manojs@04';
  
  // Global state for users, orders, and milkmen
  const [users, setUsers] = useState<User[]>([
    { id: 1, username: 'admin', email: ADMIN_EMAIL, role: 'admin' },
    { id: 2, username: 'priya_sharma', email: 'priya@example.com', role: 'buyer', phone: '+91-9876543210', location: 'Sector 18' },
    { id: 3, username: 'ramesh_kumar', email: 'ramesh@example.com', role: 'milkman', phone: '+91-9876543211', location: 'Sector 21' }
  ]);

  const [milkmen, setMilkmen] = useState<Milkman[]>([
    { 
      id: 3, 
      name: 'Ramesh Kumar', 
      username: 'ramesh_kumar', 
      location: 'Sector 21', 
      rate: 65, 
      status: 'approved', 
      phone: '+91-9876543211', 
      availableQuantity: 50, 
      rating: 4.8, 
      distance: '0.5 km', 
      available: true,
      pendingPayment: 130
    },
    { 
      id: 4, 
      name: 'Suresh Yadav', 
      username: 'suresh_yadav', 
      location: 'Sector 15', 
      rate: 70, 
      status: 'pending', 
      phone: '+91-9876543212', 
      availableQuantity: 30, 
      rating: 4.6, 
      distance: '1.2 km', 
      available: true,
      pendingPayment: 0
    },
    { 
      id: 5, 
      name: 'Mahesh Singh', 
      username: 'mahesh_singh', 
      location: 'Sector 8', 
      rate: 60, 
      status: 'approved', 
      phone: '+91-9876543213', 
      availableQuantity: 25, 
      rating: 4.9, 
      distance: '2.1 km', 
      available: false,
      pendingPayment: 0
    }
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

  const isAuthorizedAdmin = (email: string, username: string) => {
    return email.toLowerCase() === ADMIN_EMAIL.toLowerCase() || username.toLowerCase() === 'admin';
  };

  const handleLogin = (type: string, username: string, email?: string, password?: string) => {
    // Handle email/password login
    if (type === 'login' && email && password) {
      // Check for admin login
      if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
        const adminUser = { id: 1, username: 'admin', email: ADMIN_EMAIL, role: 'admin' as UserRole };
        setCurrentUser(adminUser);
        toast({
          title: "Admin Login Successful",
          description: `Welcome back, Admin!`,
        });
        return;
      }
      
      // Check for other users (demo functionality - in real app, validate against database)
      const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
      if (user) {
        setCurrentUser(user);
        toast({
          title: "Login Successful",
          description: `Welcome back, ${user.username}!`,
        });
        return;
      }
      
      toast({
        title: "Login Failed",
        description: "Invalid email or password.",
        variant: "destructive"
      });
      return;
    }

    // Handle demo login
    const user = users.find(u => u.username === username) || { id: 1, username, email: '', role: type as UserRole };
    setCurrentUser(user);
    toast({
      title: "Demo Login Successful",
      description: `Welcome, ${username}!`,
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

    // Prevent admin signup unless authorized
    if (signupForm.role === 'admin') {
      if (!isAuthorizedAdmin(signupForm.email, signupForm.username)) {
        toast({
          title: "Access Denied",
          description: "You are not authorized to create an admin account. Contact the system administrator.",
          variant: "destructive"
        });
        return;
      }
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
        available: false,
        pendingPayment: 0
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
    
    // Update milkman's pending payment
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setMilkmen(milkmen.map(m => 
        m.id === order.milkmanId 
          ? { ...m, pendingPayment: (m.pendingPayment || 0) + order.amount }
          : m
      ));
    }

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

  const updateMilkmanRate = (milkmanId: number, rate: number) => {
    setMilkmen(milkmen.map(m => 
      m.id === milkmanId 
        ? { ...m, rate }
        : m
    ));
    toast({
      title: "Rate Updated",
      description: `Milk rate updated to ₹${rate}/liter`,
    });
  };

  const payMilkman = (milkmanId: number, amount: number) => {
    setMilkmen(milkmen.map(m => 
      m.id === milkmanId 
        ? { ...m, pendingPayment: 0 }
        : m
    ));
    toast({
      title: "Payment Processed",
      description: `₹${amount} has been paid to milkman`,
    });
  };

  const updateMilkmanAccountDetails = (milkmanId: number, accountNumber: string, ifscCode: string) => {
    setMilkmen(milkmen.map(m => 
      m.id === milkmanId 
        ? { ...m, accountNumber, ifscCode }
        : m
    ));
    toast({
      title: "Account Details Updated",
      description: "Bank account details have been updated successfully",
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
      isAuthorizedAdmin={isAuthorizedAdmin}
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
        onUpdateMilkmanRate={updateMilkmanRate}
        onPayMilkman={payMilkman}
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
        onUpdateAccountDetails={(accountNumber, ifscCode) => updateMilkmanAccountDetails(currentUser.id, accountNumber, ifscCode)}
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
        isAuthorizedAdmin={isAuthorizedAdmin}
      />;
  }
};

export default Index;
