
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import HomePage from '@/components/HomePage';
import AuthPage from '@/components/AuthPage';
import AdminDashboard from '@/components/AdminDashboard';
import BuyerDashboard from '@/components/BuyerDashboard';
import MilkmanDashboard from '@/components/MilkmanDashboard';

const Index = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile when user is authenticated
          setTimeout(async () => {
            await fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setUserProfile(null);
        }
      }
    );

    // Check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }
      setLoading(false);
    };

    checkSession();

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Profile Error",
          description: "Could not fetch user profile",
          variant: "destructive"
        });
        return;
      }

      setUserProfile(data);
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Logout Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setUser(null);
      setSession(null);
      setUserProfile(null);
      setShowAuth(false);
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully.",
      });
    }
  };

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    setShowAuth(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Show auth page if user clicked get started or if they're not authenticated and trying to access protected content
  if (showAuth && !user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  // Show home page if user is not authenticated
  if (!user || !userProfile) {
    return <HomePage onGetStarted={() => setShowAuth(true)} />;
  }

  // Show appropriate dashboard based on user role
  switch (userProfile.role) {
    case 'admin':
      return (
        <AdminDashboard 
          user={{ ...user, role: 'admin', username: userProfile.username }}
          onLogout={handleLogout}
          // Pass empty arrays and functions - will be implemented with Supabase later
          milkmen={[]}
          users={[]}
          dailyRecords={[]}
          dairyRates={{ milkmanRate: 55, buyerRate: 70 }}
          payments={[]}
          buyerDues={{}}
          products={[]}
          productSales={[]}
          onApproveMilkman={() => {}}
          onRejectMilkman={() => {}}
          onUpdateDairyRates={() => {}}
          onPayMilkman={() => {}}
          onAddDailyRecord={() => {}}
          onAddProduct={() => {}}
          onUpdateProduct={() => {}}
          onDeleteProduct={() => {}}
          onSellProduct={() => {}}
        />
      );
    case 'buyer':
      return (
        <BuyerDashboard 
          user={{ ...user, role: 'buyer', username: userProfile.username }}
          onLogout={handleLogout}
          dailyRecords={[]}
          dairyRates={{ milkmanRate: 55, buyerRate: 70 }}
          currentDue={0}
          onPayment={() => {}}
        />
      );
    case 'milkman':
      return (
        <MilkmanDashboard 
          user={{ ...user, role: 'milkman', username: userProfile.username }}
          onLogout={handleLogout}
          dailyRecords={[]}
          milkmanData={null}
          onUpdateAccountDetails={() => {}}
          onMilkmanPayment={() => {}}
        />
      );
    default:
      return <HomePage onGetStarted={() => setShowAuth(true)} />;
  }
};

export default Index;
