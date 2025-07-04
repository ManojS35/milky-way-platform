
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Milk, Users, TrendingUp, Shield } from 'lucide-react';

interface HomePageProps {
  onGetStarted: () => void;
}

const HomePage = ({ onGetStarted }: HomePageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <Milk className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">DairyConnect</h1>
            </div>
            <Button onClick={onGetStarted} className="bg-blue-600 hover:bg-blue-700">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Professional Dairy Management Platform
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamline your dairy operations with our comprehensive management system. 
            Connect buyers, suppliers, and manage transactions seamlessly.
          </p>
          <Button 
            onClick={onGetStarted} 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
          >
            Start Managing Your Dairy Business
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Multi-Role Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Separate dashboards for admins, buyers, and milkmen with role-specific features and permissions.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Daily Records</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track daily milk supply and purchase records with automatic calculations and rate management.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>Payment Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Secure payment processing with multiple payment methods including UPI, cards, and bank transfers.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Milk className="h-8 w-8 text-orange-600 mb-2" />
              <CardTitle>Product Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Manage dairy products and feeds with inventory tracking and sales management.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-xl mb-8">
            Join thousands of dairy businesses already using DairyConnect
          </p>
          <Button 
            onClick={onGetStarted} 
            size="lg" 
            variant="secondary"
            className="text-lg px-8 py-3"
          >
            Create Your Account Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 DairyConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
