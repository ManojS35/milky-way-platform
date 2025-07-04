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

  // Authentication effect
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
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

      // Load milkmen if admin
      if (profile?.role === 'admin') {
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

    } catch (error) {
      console.error('Error loading data:', error);
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
      navigate('/auth');
    }
  };

  // Redirect to auth if not authenticated
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user || !profile) {
    navigate('/auth');
    return null;
  }

  // Placeholder functions for dashboard operations
  const handleAddDailyRecord = async (userId: string, userName: string, userRole: 'buyer' | 'milkman', date: string, quantity: number, type: 'purchase' | 'supply') => {
    // Implementation will be added later
    toast({ title: "Feature Coming Soon", description: "Daily record functionality will be implemented." });
  };

  const handleBuyerPayment = (buyerId: string, buyerName: string, amount: number, paymentMethod: string, transactionId: string) => {
    // Implementation will be added later
    toast({ title: "Feature Coming Soon", description: "Payment functionality will be implemented." });
  };

  const handleMilkmanPayment = (milkmanId: string, milkmanName: string, amount: number, paymentMethod: string, transactionId: string) => {
    // Implementation will be added later
    toast({ title: "Feature Coming Soon", description: "Milkman payment functionality will be implemented." });
  };

  // Render appropriate dashboard based on user role
  switch (profile.role) {
    case 'admin':
      return <AdminDashboard 
        user={{ ...user, role: 'admin', username: profile.username }}
        onLogout={handleLogout} 
        milkmen={milkmen}
        users={[]} // Will be populated later
        dailyRecords={dailyRecords}
        dairyRates={dairyRates}
        payments={payments}
        buyerDues={{}} // Will be calculated later
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
      return <BuyerDashboard 
        user={{ ...user, role: 'buyer', username: profile.username }}
        onLogout={handleLogout} 
        dailyRecords={dailyRecords.filter(r => r.userId === user.id)}
        dairyRates={dairyRates}
        currentDue={0} // Will be calculated later
        onPayment={handleBuyerPayment}
      />;
    case 'milkman':
      const milkmanData = milkmen.find(m => m.id === user.id);
      return <MilkmanDashboard 
        user={{ ...user, role: 'milkman', username: profile.username }}
        onLogout={handleLogout} 
        dailyRecords={dailyRecords.filter(r => r.userId === user.id)}
        milkmanData={milkmanData}
        onUpdateAccountDetails={() => {}}
        onMilkmanPayment={handleMilkmanPayment}
      />;
    default:
      return <div>Invalid user role</div>;
  }
};

export default Index;
