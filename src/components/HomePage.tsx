
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AdminDashboard from './AdminDashboard';
import BuyerDashboard from './BuyerDashboard';
import MilkmanDashboard from './MilkmanDashboard';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'buyer' | 'milkman';
  phone?: string;
  location?: string;
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

interface HomePageProps {
  user: User;
  onLogout: () => void;
}

const HomePage = ({ user, onLogout }: HomePageProps) => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [milkmen, setMilkmen] = useState<Milkman[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>([]);
  const [dairyRates, setDairyRates] = useState<DairyRates>({ milkmanRate: 55, buyerRate: 70 });
  const [payments, setPayments] = useState<Array<{
    id: string;
    buyerId: string;
    buyerName: string;
    amount: number;
    paymentMethod: string;
    transactionId: string;
    date: string;
  }>>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productSales, setProductSales] = useState<Array<{
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
  }>>([]);

  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchAllData();
    }
  }, [profile]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile({
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role,
        phone: data.phone,
        location: data.location
      });
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load user profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    try {
      // Fetch all data needed for admin dashboard
      const [
        milkmenData,
        usersData,
        dailyRecordsData,
        dairyRatesData,
        paymentsData,
        productsData,
        productSalesData
      ] = await Promise.all([
        supabase.from('milkmen').select('*'),
        supabase.from('profiles').select('*'),
        supabase.from('daily_records').select('*'),
        supabase.from('dairy_rates').select('*'),
        supabase.from('payments').select('*'),
        supabase.from('products').select('*'),
        supabase.from('product_sales').select('*')
      ]);

      if (milkmenData.data) {
        setMilkmen(milkmenData.data.map(m => ({
          id: m.id,
          name: m.name,
          username: m.username,
          location: m.location,
          status: m.status as 'pending' | 'approved' | 'rejected',
          phone: m.phone,
          rating: m.rating || 0,
          distance: m.distance,
          available: m.available || false,
          accountNumber: m.account_number,
          ifscCode: m.ifsc_code,
          totalDue: m.total_due || 0
        })));
      }

      if (usersData.data) {
        setUsers(usersData.data.map(u => ({
          id: u.id,
          username: u.username,
          email: u.email,
          role: u.role,
          phone: u.phone,
          location: u.location
        })));
      }

      if (dailyRecordsData.data) {
        setDailyRecords(dailyRecordsData.data.map(r => ({
          id: r.id,
          userId: r.user_id,
          userName: r.user_name,
          userRole: r.user_role as 'buyer' | 'milkman',
          date: r.date,
          quantity: r.quantity,
          rate: r.rate,
          amount: r.amount,
          type: r.type as 'purchase' | 'supply'
        })));
      }

      if (dairyRatesData.data && dairyRatesData.data.length > 0) {
        const rates = dairyRatesData.data[0];
        setDairyRates({
          milkmanRate: rates.milkman_rate,
          buyerRate: rates.buyer_rate
        });
      }

      if (paymentsData.data) {
        setPayments(paymentsData.data.map(p => ({
          id: p.id,
          buyerId: p.buyer_id,
          buyerName: p.buyer_name,
          amount: p.amount,
          paymentMethod: p.payment_method,
          transactionId: p.transaction_id,
          date: p.date
        })));
      }

      if (productsData.data) {
        setProducts(productsData.data.map(p => ({
          id: p.id,
          name: p.name,
          category: p.category as 'feed' | 'dairy_product',
          price: p.price,
          unit: p.unit
        })));
      }

      if (productSalesData.data) {
        setProductSales(productSalesData.data.map(s => ({
          id: s.id,
          productId: s.product_id,
          productName: s.product_name,
          buyerId: s.buyer_id,
          buyerName: s.buyer_name,
          buyerRole: s.buyer_role as 'buyer' | 'milkman',
          quantity: s.quantity,
          rate: s.rate,
          amount: s.amount,
          date: s.date
        })));
      }
    } catch (error: any) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      onLogout();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive"
      });
    }
  };

  // Handler functions for admin operations
  const handleApproveMilkman = async (milkmanId: string) => {
    try {
      const { error } = await supabase
        .from('milkmen')
        .update({ status: 'approved' })
        .eq('id', milkmanId);

      if (error) throw error;
      
      setMilkmen(prev => prev.map(m => 
        m.id === milkmanId ? { ...m, status: 'approved' } : m
      ));
      
      toast({
        title: "Success",
        description: "Milkman approved successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to approve milkman",
        variant: "destructive"
      });
    }
  };

  const handleRejectMilkman = async (milkmanId: string) => {
    try {
      const { error } = await supabase
        .from('milkmen')
        .update({ status: 'rejected' })
        .eq('id', milkmanId);

      if (error) throw error;
      
      setMilkmen(prev => prev.map(m => 
        m.id === milkmanId ? { ...m, status: 'rejected' } : m
      ));
      
      toast({
        title: "Success",
        description: "Milkman rejected"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to reject milkman",
        variant: "destructive"
      });
    }
  };

  const handleUpdateDairyRates = async (milkmanRate: number, buyerRate: number) => {
    try {
      const { error } = await supabase
        .from('dairy_rates')
        .update({ milkman_rate: milkmanRate, buyer_rate: buyerRate })
        .eq('id', (await supabase.from('dairy_rates').select('id').single()).data?.id);

      if (error) throw error;
      
      setDairyRates({ milkmanRate, buyerRate });
      
      toast({
        title: "Success",
        description: "Dairy rates updated successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update dairy rates",
        variant: "destructive"
      });
    }
  };

  const handlePayMilkman = async (milkmanId: string, amount: number) => {
    try {
      const milkman = milkmen.find(m => m.id === milkmanId);
      if (!milkman) return;

      const { error } = await supabase
        .from('milkman_payments')
        .insert({
          milkman_id: milkmanId,
          milkman_name: milkman.name,
          amount,
          payment_method: 'Bank Transfer',
          transaction_id: `TXN${Date.now()}`,
          date: new Date().toISOString().split('T')[0]
        });

      if (error) throw error;

      // Update milkman's total due
      await supabase
        .from('milkmen')
        .update({ total_due: (milkman.totalDue || 0) - amount })
        .eq('id', milkmanId);
      
      setMilkmen(prev => prev.map(m => 
        m.id === milkmanId ? { ...m, totalDue: (m.totalDue || 0) - amount } : m
      ));
      
      toast({
        title: "Success",
        description: `Payment of ₹${amount} sent to ${milkman.name}`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to process payment",
        variant: "destructive"
      });
    }
  };

  const handleAddDailyRecord = async (
    userId: string, 
    userName: string, 
    userRole: 'buyer' | 'milkman', 
    date: string, 
    quantity: number, 
    type: 'purchase' | 'supply'
  ) => {
    try {
      const rate = type === 'supply' ? dairyRates.milkmanRate : dairyRates.buyerRate;
      const amount = quantity * rate;

      const { error } = await supabase
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
        });

      if (error) throw error;
      
      // Refresh daily records
      await fetchAllData();
      
      toast({
        title: "Success",
        description: "Daily record added successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add daily record",
        variant: "destructive"
      });
    }
  };

  const handleAddProduct = async (name: string, category: 'feed' | 'dairy_product', price: number, unit: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .insert({ name, category, price, unit });

      if (error) throw error;
      
      await fetchAllData();
      
      toast({
        title: "Success",
        description: "Product added successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive"
      });
    }
  };

  const handleUpdateProduct = async (id: string, name: string, category: 'feed' | 'dairy_product', price: number, unit: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ name, category, price, unit })
        .eq('id', id);

      if (error) throw error;
      
      await fetchAllData();
      
      toast({
        title: "Success",
        description: "Product updated successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive"
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchAllData();
      
      toast({
        title: "Success",
        description: "Product deleted successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive"
      });
    }
  };

  const handleSellProduct = async (
    productId: string, 
    buyerId: string, 
    buyerName: string, 
    buyerRole: 'buyer' | 'milkman', 
    quantity: number
  ) => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      const amount = quantity * product.price;

      const { error } = await supabase
        .from('product_sales')
        .insert({
          product_id: productId,
          product_name: product.name,
          buyer_id: buyerId,
          buyer_name: buyerName,
          buyer_role: buyerRole,
          quantity,
          rate: product.price,
          amount,
          date: new Date().toISOString().split('T')[0]
        });

      if (error) throw error;
      
      await fetchAllData();
      
      toast({
        title: "Success",
        description: "Product sale recorded successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to record product sale",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Profile not found</p>
          <button onClick={handleLogout} className="text-blue-600 hover:underline">
            Logout
          </button>
        </div>
      </div>
    );
  }

  // Calculate buyer dues
  const buyerDues: { [key: string]: { userId: string; userName: string; totalPurchases: number; totalPayments: number; due: number } } = {};
  
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

  payments.forEach(payment => {
    if (buyerDues[payment.buyerName]) {
      buyerDues[payment.buyerName].totalPayments += payment.amount;
    }
  });

  Object.keys(buyerDues).forEach(buyerName => {
    buyerDues[buyerName].due = buyerDues[buyerName].totalPurchases - buyerDues[buyerName].totalPayments;
  });

  const dashboardProps = {
    user: profile,
    onLogout: handleLogout,
    milkmen,
    users,
    dailyRecords,
    dairyRates,
    payments,
    buyerDues,
    products,
    productSales,
    onApproveMilkman: handleApproveMilkman,
    onRejectMilkman: handleRejectMilkman,
    onUpdateDairyRates: handleUpdateDairyRates,
    onPayMilkman: handlePayMilkman,
    onAddDailyRecord: handleAddDailyRecord,
    onAddProduct: handleAddProduct,
    onUpdateProduct: handleUpdateProduct,
    onDeleteProduct: handleDeleteProduct,
    onSellProduct: handleSellProduct
  };

  switch (profile.role) {
    case 'admin':
      return <AdminDashboard {...dashboardProps} />;
    case 'buyer':
      return <BuyerDashboard user={profile} onLogout={handleLogout} />;
    case 'milkman':
      return <MilkmanDashboard user={profile} onLogout={handleLogout} />;
    default:
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Invalid user role</p>
            <button onClick={handleLogout} className="text-blue-600 hover:underline">
              Logout
            </button>
          </div>
        </div>
      );
  }
};

export default HomePage;
