import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import BuyerDashboard from '@/components/BuyerDashboard';
import MilkmanDashboard from '@/components/MilkmanDashboard';
import AdminDashboard from '@/components/AdminDashboard';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  phone?: string;
  location?: string;
}

interface Session {
  user: any;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [dailyRecords, setDailyRecords] = useState([]);
  const [milkmanData, setMilkmanData] = useState(null);
  const [dairyRates, setDairyRates] = useState({ milkmanRate: 55, buyerRate: 70 });
  const [currentDue, setCurrentDue] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Check for existing session first
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        
        if (existingSession && mounted) {
          console.log('Existing session found:', existingSession);
          setSession(existingSession);
          await loadUserProfile(existingSession);
        } else if (mounted) {
          console.log('No existing session, redirecting to auth');
          setLoading(false);
          navigate('/auth');
          return;
        }

        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event, session);
            
            if (!mounted) return;

            if (session?.user) {
              setSession(session);
              await loadUserProfile(session);
            } else {
              setUser(null);
              setSession(null);
              setLoading(false);
              navigate('/auth');
            }
          }
        );

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setLoading(false);
          navigate('/auth');
        }
      }
    };

    const loadUserProfile = async (session: any) => {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          toast({
            title: "Error",
            description: "Failed to load user profile",
            variant: "destructive"
          });
        } else if (profile && mounted) {
          setUser({
            id: profile.id,
            username: profile.username,
            email: session.user.email || '',
            role: profile.role,
            phone: profile.phone,
            location: profile.location
          });
        }
      } catch (error) {
        console.error('Profile loading error:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, [toast, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch daily records
      const { data: records, error: recordsError } = await supabase
        .from('daily_records')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (recordsError) {
        console.error('Error fetching records:', recordsError);
      } else {
        setDailyRecords(records || []);
      }

      // Fetch dairy rates
      const { data: rates, error: ratesError } = await supabase
        .from('dairy_rates')
        .select('*')
        .order('effective_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (ratesError) {
        console.error('Error fetching rates:', ratesError);
      } else if (rates) {
        setDairyRates({
          milkmanRate: rates.milkman_rate,
          buyerRate: rates.buyer_rate
        });
      }

      // If user is a milkman, fetch milkman data
      if (user.role === 'milkman') {
        const { data: milkman, error: milkmanError } = await supabase
          .from('milkmen')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (milkmanError) {
          console.error('Error fetching milkman data:', milkmanError);
        } else {
          setMilkmanData(milkman);
        }
      }

      // Calculate current due for buyers
      if (user.role === 'buyer') {
        const totalPurchases = (records || []).reduce((sum: number, record: any) => sum + record.amount, 0);
        
        // Fetch payments made by this buyer
        const { data: payments, error: paymentsError } = await supabase
          .from('payments')
          .select('amount')
          .eq('buyer_id', user.id);

        if (!paymentsError) {
          const totalPaid = (payments || []).reduce((sum: number, payment: any) => sum + payment.amount, 0);
          setCurrentDue(Math.max(0, totalPurchases - totalPaid));
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
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
      navigate('/');
    }
  };

  const handleBuyerPayment = async (buyerId: string, buyerName: string, amount: number, paymentMethod: string, transactionId: string) => {
    try {
      const { error } = await supabase
        .from('payments')
        .insert({
          buyer_id: buyerId,
          buyer_name: buyerName,
          amount: amount,
          payment_method: paymentMethod,
          transaction_id: transactionId,
          date: new Date().toISOString().split('T')[0]
        });

      if (error) {
        console.error('Error recording payment:', error);
        toast({
          title: "Error",
          description: "Failed to record payment",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: `Payment of ₹${amount} recorded successfully!`
        });
        fetchUserData();
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Error",
        description: "Failed to process payment",
        variant: "destructive"
      });
    }
  };

  const handleMilkmanPayment = async (milkmanId: string, milkmanName: string, amount: number, paymentMethod: string, transactionId: string) => {
    try {
      const { error } = await supabase
        .from('milkman_payments')
        .insert({
          milkman_id: milkmanId,
          milkman_name: milkmanName,
          amount: amount,
          payment_method: paymentMethod,
          transaction_id: transactionId,
          date: new Date().toISOString().split('T')[0]
        });

      if (error) {
        console.error('Error recording milkman payment:', error);
        toast({
          title: "Error",
          description: "Failed to record payment",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: `Payment of ₹${amount} recorded successfully!`
        });
        fetchUserData();
      }
    } catch (error) {
      console.error('Error processing milkman payment:', error);
      toast({
        title: "Error",
        description: "Failed to process payment",
        variant: "destructive"
      });
    }
  };

  const handleUpdateAccountDetails = async (accountNumber: string, ifscCode: string) => {
    if (!user) return;

    // Validate account number (should be 9-18 digits, but we'll specifically allow 15 digits)
    const accountNumberRegex = /^\d{9,18}$/;
    if (!accountNumberRegex.test(accountNumber)) {
      toast({
        title: "Error",
        description: "Account number should be between 9-18 digits",
        variant: "destructive"
      });
      return;
    }

    // Validate IFSC code (should be 11 characters: 4 letters + 0 + 6 alphanumeric)
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscRegex.test(ifscCode.toUpperCase())) {
      toast({
        title: "Error", 
        description: "Invalid IFSC code format. Should be like ABCD0123456",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('milkmen')
        .update({
          account_number: accountNumber,
          ifsc_code: ifscCode.toUpperCase()
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating account details:', error);
        toast({
          title: "Error",
          description: "Failed to update account details",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Account details updated successfully!"
        });
        fetchUserData();
      }
    } catch (error) {
      console.error('Error updating account details:', error);
      toast({
        title: "Error",
        description: "Failed to update account details",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session || !user) {
    return null; // Will redirect to auth page
  }

  // Render appropriate dashboard based on user role
  if (user.role === 'admin') {
    return (
      <AdminDashboard
        user={user}
        onLogout={handleLogout}
        dailyRecords={dailyRecords}
      />
    );
  } else if (user.role === 'milkman') {
    return (
      <MilkmanDashboard
        user={user}
        onLogout={handleLogout}
        dailyRecords={dailyRecords}
        milkmanData={milkmanData}
        onUpdateAccountDetails={handleUpdateAccountDetails}
        onMilkmanPayment={handleMilkmanPayment}
      />
    );
  } else {
    return (
      <BuyerDashboard
        user={user}
        onLogout={handleLogout}
        dailyRecords={dailyRecords}
        dairyRates={dairyRates}
        currentDue={currentDue}
        onPayment={handleBuyerPayment}
      />
    );
  }
};

export default Index;
