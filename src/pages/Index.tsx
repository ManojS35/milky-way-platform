import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AdminDashboard from '@/components/AdminDashboard';
import BuyerDashboard from '@/components/BuyerDashboard';
import MilkmanDashboard from '@/components/MilkmanDashboard';
import { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'buyer' | 'milkman';
  phone?: string;
  location?: string;
}

interface DailyRecord {
  id: string;
  userId: string;
  userName: string;
  userRole: 'buyer' | 'milkman';
  date: string;
  quantity: number;
  rate: number;
  amount: number;
  type: 'purchase' | 'supply';
}

interface Milkman {
  id: string;
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
  milkmanRate: number;
  buyerRate: number;
}

interface Product {
  id: string;
  name: string;
  category: 'feed' | 'dairy_product';
  price: number;
  unit: string;
}

interface ProductSale {
  id: string;
  productId: string;
  productName: string;
  buyerId: string;
  buyerName: string;
  buyerRole: 'buyer' | 'milkman';
  quantity: number;
  rate: number;
  amount: number;
  date: string;
}

interface AppUser {
  id: string;
  role: string;
  username: string;
  email?: string;
}

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Application state
  const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>([]);
  const [milkmen, setMilkmen] = useState<Milkman[]>([]);
  const [dairyRates, setDairyRates] = useState<DairyRates>({ milkmanRate: 55, buyerRate: 70 });
  const [products, setProducts] = useState<Product[]>([]);
  const [productSales, setProductSales] = useState<ProductSale[]>([]);
  const [payments, setPayments] = useState<Array<{
    id: string;
    buyerId: string;
    buyerName: string;
    amount: number;
    paymentMethod: string;
    transactionId: string;
    date: string;
  }>>([]);
  const [milkmanPayments, setMilkmanPayments] = useState<Array<{
    id: string;
    milkmanId: string;
    milkmanName: string;
    amount: number;
    paymentMethod: string;
    transactionId: string;
    date: string;
  }>>([]);
  const [users, setUsers] = useState<Array<{
    id: string;
    username: string;
    role: string;
  }>>([]);

  // Authentication effect
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (error) {
            console.error('Error fetching profile:', error);
            toast({
              title: "Profile Error",
              description: "Could not fetch user profile. Please try logging in again.",
              variant: "destructive"
            });
          } else {
            setProfile(profileData);
          }
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load data when user is authenticated
  useEffect(() => {
    if (user && profile) {
      loadApplicationData();
    }
  }, [user, profile]);

  const loadApplicationData = async () => {
    try {
      console.log('Loading application data...');
      
      // Load dairy rates
      const { data: ratesData } = await supabase
        .from('dairy_rates')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (ratesData) {
        setDairyRates({
          milkmanRate: ratesData.milkman_rate,
          buyerRate: ratesData.buyer_rate
        });
      }

      // Load products
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (productsData) {
        setProducts(productsData.map(p => ({
          id: p.id,
          name: p.name,
          category: p.category,
          price: p.price,
          unit: p.unit
        })));
      }

      // Load users (profiles) if admin
      if (profile?.role === 'admin') {
        const { data: usersData } = await supabase
          .from('profiles')
          .select('id, username, role');
        
        if (usersData) {
          setUsers(usersData);
        }

        const { data: milkmenData } = await supabase
          .from('milkmen')
          .select('*');
        
        if (milkmenData) {
          setMilkmen(milkmenData.map(m => ({
            id: m.id,
            name: m.name,
            username: m.username,
            location: m.location,
            status: m.status,
            phone: m.phone,
            rating: m.rating || 0,
            distance: m.distance,
            available: m.available,
            accountNumber: m.account_number,
            ifscCode: m.ifsc_code,
            totalDue: m.total_due || 0
          })));
        }
      }

      // Load daily records
      const { data: recordsData } = await supabase
        .from('daily_records')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (recordsData) {
        setDailyRecords(recordsData.map(r => ({
          id: r.id,
          userId: r.user_id,
          userName: r.user_name,
          userRole: r.user_role,
          date: r.date,
          quantity: r.quantity,
          rate: r.rate,
          amount: r.amount,
          type: r.type
        })));
      }

      // Load payments
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (paymentsData) {
        setPayments(paymentsData.map(p => ({
          id: p.id,
          buyerId: p.buyer_id,
          buyerName: p.buyer_name,
          amount: p.amount,
          paymentMethod: p.payment_method,
          transactionId: p.transaction_id,
          date: p.date
        })));
      }

      // Load milkman payments
      const { data: milkmanPaymentsData } = await supabase
        .from('milkman_payments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (milkmanPaymentsData) {
        setMilkmanPayments(milkmanPaymentsData.map(p => ({
          id: p.id,
          milkmanId: p.milkman_id,
          milkmanName: p.milkman_name,
          amount: p.amount,
          paymentMethod: p.payment_method,
          transactionId: p.transaction_id,
          date: p.date
        })));
      }

    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Data Loading Error",
        description: "Failed to load application data. Please refresh the page.",
        variant: "destructive"
      });
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully.",
      });
      navigate('/');
    }
  };

  // Redirect to home if not authenticated
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    navigate('/');
    return null;
  }

  // Create AppUser objects for dashboard components
  const createAppUser = (user: User, profile: Profile): AppUser => ({
    id: user.id,
    role: profile.role,
    username: profile.username,
    email: user.email
  });

  // Calculate buyer dues
  const calculateBuyerDues = () => {
    const dues: { [buyerId: string]: number } = {};
    
    dailyRecords.forEach(record => {
      if (record.type === 'purchase') {
        if (!dues[record.userId]) {
          dues[record.userId] = 0;
        }
        dues[record.userId] += record.amount;
      }
    });

    // Subtract payments
    payments.forEach(payment => {
      if (dues[payment.buyerId]) {
        dues[payment.buyerId] -= payment.amount;
      }
    });

    return dues;
  };

  // Implement daily record functionality
  const handleAddDailyRecord = async (userId: string, userName: string, userRole: 'buyer' | 'milkman', date: string, quantity: number, type: 'purchase' | 'supply') => {
    try {
      const rate = userRole === 'buyer' ? dairyRates.buyerRate : dairyRates.milkmanRate;
      const amount = quantity * rate;

      const { data, error } = await supabase
        .from('daily_records')
        .insert({
          user_id: userId,
          user_name: userName,
          user_role: userRole,
          date,
          quantity,
          rate,
          amount,
          type
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setDailyRecords(prev => [
        {
          id: data.id,
          userId: data.user_id,
          userName: data.user_name,
          userRole: data.user_role,
          date: data.date,
          quantity: data.quantity,
          rate: data.rate,
          amount: data.amount,
          type: data.type
        },
        ...prev
      ]);

      toast({
        title: "Success",
        description: "Daily record added successfully",
      });
    } catch (error: any) {
      console.error('Error adding daily record:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add daily record",
        variant: "destructive"
      });
    }
  };

  const handleBuyerPayment = async (buyerId: string, buyerName: string, amount: number, paymentMethod: string, transactionId: string) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert({
          buyer_id: buyerId,
          buyer_name: buyerName,
          amount,
          payment_method: paymentMethod,
          transaction_id: transactionId,
          date: new Date().toISOString().split('T')[0]
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setPayments(prev => [
        {
          id: data.id,
          buyerId: data.buyer_id,
          buyerName: data.buyer_name,
          amount: data.amount,
          paymentMethod: data.payment_method,
          transactionId: data.transaction_id,
          date: data.date
        },
        ...prev
      ]);

      toast({
        title: "Success",
        description: "Payment recorded successfully",
      });
    } catch (error: any) {
      console.error('Error recording payment:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to record payment",
        variant: "destructive"
      });
    }
  };

  const handleMilkmanPayment = async (milkmanId: string, milkmanName: string, amount: number, paymentMethod: string, transactionId: string) => {
    try {
      const { data, error } = await supabase
        .from('milkman_payments')
        .insert({
          milkman_id: milkmanId,
          milkman_name: milkmanName,
          amount,
          payment_method: paymentMethod,
          transaction_id: transactionId,
          date: new Date().toISOString().split('T')[0]
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setMilkmanPayments(prev => [
        {
          id: data.id,
          milkmanId: data.milkman_id,
          milkmanName: data.milkman_name,
          amount: data.amount,
          paymentMethod: data.payment_method,
          transactionId: data.transaction_id,
          date: data.date
        },
        ...prev
      ]);

      toast({
        title: "Success",
        description: "Milkman payment recorded successfully",
      });
    } catch (error: any) {
      console.error('Error recording milkman payment:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to record milkman payment",
        variant: "destructive"
      });
    }
  };

  // Render appropriate dashboard based on user role
  switch (profile.role) {
    case 'admin':
      return <AdminDashboard 
        user={createAppUser(user, profile)}
        onLogout={handleLogout} 
        milkmen={milkmen}
        users={users}
        dailyRecords={dailyRecords}
        dairyRates={dairyRates}
        payments={payments}
        buyerDues={calculateBuyerDues()}
        products={products}
        productSales={productSales}
        onApproveMilkman={() => {}}
        onRejectMilkman={() => {}}
        onUpdateDairyRates={() => {}}
        onPayMilkman={() => {}}
        onAddDailyRecord={handleAddDailyRecord}
        onAddProduct={() => {}}
        onUpdateProduct={() => {}}
        onDeleteProduct={() => {}}
        onSellProduct={() => {}}
      />;
    case 'buyer':
      const buyerDues = calculateBuyerDues();
      const currentDue = buyerDues[user.id] || 0;
      return <BuyerDashboard 
        user={createAppUser(user, profile)}
        onLogout={handleLogout} 
        dailyRecords={dailyRecords.filter(r => r.userId === user.id)}
        dairyRates={dairyRates}
        currentDue={currentDue}
        onPayment={handleBuyerPayment}
      />;
    case 'milkman':
      const milkmanData = milkmen.find(m => m.id === user.id);
      return <MilkmanDashboard 
        user={createAppUser(user, profile)}
        onLogout={handleLogout} 
        dailyRecords={dailyRecords.filter(r => r.userId === user.id)}
        milkmanData={milkmanData}
        onUpdateAccountDetails={() => {}}
        onMilkmanPayment={handleMilkmanPayment}
      />;
    default:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid User Role</h1>
            <p className="text-gray-600 mb-4">Your account has an invalid role. Please contact support.</p>
            <button 
              onClick={handleLogout}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Logout
            </button>
          </div>
        </div>
      );
  }
};

export default Index;
