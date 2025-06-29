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

interface DairyRates {
  milkmanRate: number;  // Rate paid to milkmen per liter
  buyerRate: number;    // Rate charged to buyers per liter
}

interface Product {
  id: number;
  name: string;
  category: 'feed' | 'dairy_product';
  price: number;
  unit: string;
}

interface ProductSale {
  id: number;
  productId: number;
  productName: string;
  buyerId: number;
  buyerName: string;
  buyerRole: 'buyer' | 'milkman';
  quantity: number;
  rate: number;
  amount: number;
  date: string;
}

const Index = () => {
  const { toast } = useToast();
  
  // Secure admin credentials - only authorized admin
  const ADMIN_EMAIL = 'manojs030504@gmail.com';
  const ADMIN_PASSWORD = 'Manojs@04';
  
  // Global state for users and daily records
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
      status: 'approved', 
      phone: '+91-9876543211', 
      rating: 4.8, 
      distance: '0.5 km', 
      available: true,
      totalDue: 0
    },
    { 
      id: 4, 
      name: 'Suresh Yadav', 
      username: 'suresh_yadav', 
      location: 'Sector 15', 
      status: 'pending', 
      phone: '+91-9876543212', 
      rating: 4.6, 
      distance: '1.2 km', 
      available: true,
      totalDue: 0
    }
  ]);

  const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>([
    {
      id: 1,
      userId: 2,
      userName: 'priya_sharma',
      userRole: 'buyer',
      date: '2024-01-15',
      quantity: 2,
      rate: 70,
      amount: 140,
      type: 'purchase'
    },
    {
      id: 2,
      userId: 3,
      userName: 'ramesh_kumar',
      userRole: 'milkman',
      date: '2024-01-15',
      quantity: 50,
      rate: 55,
      amount: 2750,
      type: 'supply'
    }
  ]);

  const [dairyRates, setDairyRates] = useState<DairyRates>({
    milkmanRate: 55,  // Rate paid to milkmen
    buyerRate: 70     // Rate charged to buyers
  });

  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Premium Cow Feed', category: 'feed', price: 25, unit: 'kg' },
    { id: 2, name: 'Fresh Ghee', category: 'dairy_product', price: 500, unit: 'kg' },
    { id: 3, name: 'Homemade Curd', category: 'dairy_product', price: 60, unit: 'liter' }
  ]);

  const [productSales, setProductSales] = useState<ProductSale[]>([]);

  const [nextRecordId, setNextRecordId] = useState(3);
  const [nextUserId, setNextUserId] = useState(6);
  const [nextProductId, setNextProductId] = useState(4);
  const [nextProductSaleId, setNextProductSaleId] = useState(1);

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

  const [payments, setPayments] = useState<Array<{
    id: number;
    buyerId: number;
    buyerName: string;
    amount: number;
    paymentMethod: string;
    transactionId: string;
    date: string;
  }>>([]);

  const [nextPaymentId, setNextPaymentId] = useState(1);

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
        status: 'pending',
        phone: signupForm.phone || '',
        rating: 0,
        available: false,
        totalDue: 0
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

  const addDailyRecord = (userId: number, userName: string, userRole: 'buyer' | 'milkman', date: string, quantity: number, type: 'purchase' | 'supply') => {
    const rate = type === 'purchase' ? dairyRates.buyerRate : dairyRates.milkmanRate;
    const amount = quantity * rate;

    const newRecord: DailyRecord = {
      id: nextRecordId,
      userId,
      userName,
      userRole,
      date,
      quantity,
      rate,
      amount,
      type
    };

    setDailyRecords([...dailyRecords, newRecord]);
    setNextRecordId(nextRecordId + 1);

    // Update milkman's total due if it's a supply record
    if (type === 'supply') {
      setMilkmen(milkmen.map(m => 
        m.id === userId 
          ? { ...m, totalDue: (m.totalDue || 0) + amount }
          : m
      ));
    }

    toast({
      title: "Record Added",
      description: `${type === 'purchase' ? 'Purchase' : 'Supply'} record added for ${quantity} liters`,
    });
  };

  const addProduct = (name: string, category: 'feed' | 'dairy_product', price: number, unit: string) => {
    const newProduct: Product = {
      id: nextProductId,
      name,
      category,
      price,
      unit
    };

    setProducts([...products, newProduct]);
    setNextProductId(nextProductId + 1);

    toast({
      title: "Product Added",
      description: `${name} has been added to inventory`,
    });
  };

  const sellProduct = (productId: number, buyerId: number, buyerName: string, buyerRole: 'buyer' | 'milkman', quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const amount = product.price * quantity;
    const newSale: ProductSale = {
      id: nextProductSaleId,
      productId,
      productName: product.name,
      buyerId,
      buyerName,
      buyerRole,
      quantity,
      rate: product.price,
      amount,
      date: new Date().toISOString().split('T')[0]
    };

    setProductSales([...productSales, newSale]);
    setNextProductSaleId(nextProductSaleId + 1);

    // Handle payment logic
    if (buyerRole === 'milkman') {
      // For milkman, deduct from earnings or add to due
      const milkman = milkmen.find(m => m.id === buyerId);
      if (milkman) {
        const currentDue = milkman.totalDue || 0;
        if (currentDue >= amount) {
          // Deduct from existing due
          setMilkmen(milkmen.map(m => 
            m.id === buyerId 
              ? { ...m, totalDue: currentDue - amount }
              : m
          ));
        } else {
          // Add negative due (milkman owes money)
          setMilkmen(milkmen.map(m => 
            m.id === buyerId 
              ? { ...m, totalDue: currentDue - amount }
              : m
          ));
        }
      }
    }

    toast({
      title: "Product Sold",
      description: `Sold ${quantity} ${product.unit} of ${product.name} to ${buyerName}`,
    });
  };

  const handleBuyerPayment = (buyerId: number, buyerName: string, amount: number, paymentMethod: string, transactionId: string) => {
    const newPayment = {
      id: nextPaymentId,
      buyerId,
      buyerName,
      amount,
      paymentMethod,
      transactionId,
      date: new Date().toISOString().split('T')[0]
    };

    setPayments([...payments, newPayment]);
    setNextPaymentId(nextPaymentId + 1);

    toast({
      title: "Payment Received",
      description: `₹${amount} payment received from ${buyerName}`,
    });
  };

  const getBuyerDues = () => {
    const buyerDues: { [key: string]: { userId: number; userName: string; totalPurchases: number; totalPayments: number; due: number } } = {};
    
    // Calculate total purchases for each buyer
    dailyRecords.filter(r => r.type === 'purchase').forEach(record => {
      if (!buyerDues[record.userName]) {
        buyerDues[record.userName] = {
          userId: record.userId,
          userName: record.userName,
          totalPurchases: 0,
          totalPayments: 0,
          due: 0
        };
      }
      buyerDues[record.userName].totalPurchases += record.amount;
    });

    // Add product purchases for buyers
    productSales.filter(sale => sale.buyerRole === 'buyer').forEach(sale => {
      if (!buyerDues[sale.buyerName]) {
        buyerDues[sale.buyerName] = {
          userId: sale.buyerId,
          userName: sale.buyerName,
          totalPurchases: 0,
          totalPayments: 0,
          due: 0
        };
      }
      buyerDues[sale.buyerName].totalPurchases += sale.amount;
    });

    // Subtract payments
    payments.forEach(payment => {
      if (buyerDues[payment.buyerName]) {
        buyerDues[payment.buyerName].totalPayments += payment.amount;
      }
    });

    // Calculate due amounts
    Object.keys(buyerDues).forEach(buyerName => {
      buyerDues[buyerName].due = buyerDues[buyerName].totalPurchases - buyerDues[buyerName].totalPayments;
    });

    return buyerDues;
  };

  const getBuyerDueAmount = (buyerId: number) => {
    const buyerName = users.find(u => u.id === buyerId)?.username || '';
    const buyerDues = getBuyerDues();
    return buyerDues[buyerName]?.due || 0;
  };

  const approveMilkman = (milkmanId: number) => {
    setMilkmen(milkmen.map(m => 
      m.id === milkmanId 
        ? { ...m, status: 'approved' as const, available: true }
        : m
    ));
    toast({
      title: "Milkman Approved",
      description: "Milkman has been approved and can now supply milk.",
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

  const updateDairyRates = (milkmanRate: number, buyerRate: number) => {
    setDairyRates({ milkmanRate, buyerRate });
    toast({
      title: "Rates Updated",
      description: `Milkman rate: ₹${milkmanRate}/L, Buyer rate: ₹${buyerRate}/L`,
    });
  };

  const payMilkman = (milkmanId: number, amount: number) => {
    setMilkmen(milkmen.map(m => 
      m.id === milkmanId 
        ? { ...m, totalDue: 0 }
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
        milkmen={milkmen}
        users={users.filter(u => u.role !== 'admin')}
        dailyRecords={dailyRecords}
        dairyRates={dairyRates}
        payments={payments}
        buyerDues={getBuyerDues()}
        products={products}
        productSales={productSales}
        onApproveMilkman={approveMilkman}
        onRejectMilkman={rejectMilkman}
        onUpdateDairyRates={updateDairyRates}
        onPayMilkman={payMilkman}
        onAddDailyRecord={addDailyRecord}
        onAddProduct={addProduct}
        onSellProduct={sellProduct}
      />;
    case 'buyer':
      return <BuyerDashboard 
        user={currentUser} 
        onLogout={handleLogout} 
        dailyRecords={dailyRecords.filter(r => r.userId === currentUser.id)}
        dairyRates={dairyRates}
        currentDue={getBuyerDueAmount(currentUser.id)}
        onPayment={handleBuyerPayment}
      />;
    case 'milkman':
      return <MilkmanDashboard 
        user={currentUser} 
        onLogout={handleLogout} 
        dailyRecords={dailyRecords.filter(r => r.userId === currentUser.id)}
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
