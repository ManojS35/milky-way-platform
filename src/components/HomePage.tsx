
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Milk, Users, TrendingUp, Shield, Clock, MapPin } from 'lucide-react';

interface HomePageProps {
  onGetStarted: () => void;
}

const HomePage = () => {
  const features = [
    {
      icon: Milk,
      title: "Dairy Management",
      description: "Complete dairy supply chain management from farm to customer"
    },
    {
      icon: Users,
      title: "Multi-Role System",
      description: "Support for buyers, milkmen, and administrators with role-based dashboards"
    },
    {
      icon: TrendingUp,
      title: "Analytics & Reports",
      description: "Track sales, payments, and performance with detailed analytics"
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Multiple payment options with secure transaction processing"
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Live tracking of orders, deliveries, and payment status"
    },
    {
      icon: MapPin,
      title: "Location Tracking",
      description: "GPS-based delivery tracking and route optimization"
    }
  ];

  const stats = [
    { label: "Active Users", value: "500+" },
    { label: "Daily Transactions", value: "1000+" },
    { label: "Milk Suppliers", value: "50+" },
    { label: "Coverage Area", value: "25 km²" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Hero Section */}
      <header className="px-6 py-8">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Milk className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">DairyConnect</h1>
          </div>
          <Button onClick={() => window.location.href = '/auth'}>
            Get Started
          </Button>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        {/* Hero Content */}
        <section className="text-center py-16">
          <Badge variant="secondary" className="mb-4">
            Modern Dairy Management Platform
          </Badge>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Streamline Your Dairy Business
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect dairy farmers, suppliers, and customers with our comprehensive platform. 
            Manage orders, track deliveries, process payments, and grow your dairy business efficiently.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => window.location.href = '/auth'}>
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg">
              Watch Demo
            </Button>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Your Dairy Business
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform provides comprehensive tools for dairy businesses of all sizes, 
              from small local farms to large distribution networks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* User Types Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Built for Every Role in Your Dairy Supply Chain
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>For Buyers</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2 text-gray-600">
                  <li>• Track your daily milk purchases</li>
                  <li>• View payment history and due amounts</li>
                  <li>• Multiple payment options</li>
                  <li>• Quality assurance tracking</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                  <Milk className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>For Milkmen</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2 text-gray-600">
                  <li>• Record daily milk supplies</li>
                  <li>• Track earnings and payments</li>
                  <li>• Manage bank account details</li>
                  <li>• View supply history</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle>For Administrators</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2 text-gray-600">
                  <li>• Manage all users and transactions</li>
                  <li>• Set dairy rates and policies</li>
                  <li>• Generate comprehensive reports</li>
                  <li>• Monitor system performance</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 text-center">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-green-600 text-white">
            <CardContent className="p-12">
              <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Dairy Business?</h3>
              <p className="text-lg mb-8 opacity-90">
                Join hundreds of dairy businesses already using DairyConnect to streamline their operations.
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => window.location.href = '/auth'}
                >
                  Get Started Today
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Contact Sales
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Milk className="h-6 w-6" />
                <span className="text-lg font-semibold">DairyConnect</span>
              </div>
              <p className="text-gray-400">
                Modern dairy management platform connecting farmers, suppliers, and customers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Features</li>
                <li>Pricing</li>
                <li>API</li>
                <li>Documentation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Community</li>
                <li>Status</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DairyConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
