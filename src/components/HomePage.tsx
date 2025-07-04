
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

interface HomePageProps {
  user: User;
  onLogout: () => void;
}

const HomePage = ({ user, onLogout }: HomePageProps) => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
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

  const dashboardProps = {
    user: profile,
    onLogout: handleLogout
  };

  switch (profile.role) {
    case 'admin':
      return <AdminDashboard {...dashboardProps} />;
    case 'buyer':
      return <BuyerDashboard {...dashboardProps} />;
    case 'milkman':
      return <MilkmanDashboard {...dashboardProps} />;
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
