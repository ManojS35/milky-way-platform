
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Milk, Users, TrendingUp, Shield, Star, CheckCircle } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const handleGetStarted = () => {
    setShowAuthPrompt(true);
  };

  const handleLogin = () => {
    navigate('/auth');
  };

  const handleSignup = () => {
    navigate('/auth');
  };

  const features = [
    {
      icon: <Milk className="h-8 w-8 text-blue-600" />,
      title: "Daily Milk Records",
      description: "Track daily milk collection and supply with automated calculations"
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "User Management",
      description: "Manage buyers, milkmen, and admin roles with secure authentication"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
      title: "Analytics & Reports",
      description: "Get insights into your dairy business with detailed analytics"
    },
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      title: "Secure Payments",
      description: "Handle payments securely with transaction tracking"
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Milk Buyer",
      content: "DairyConnect has simplified my daily milk procurement process. The automated calculations save me hours every day.",
      rating: 5
    },
    {
      name: "Ramesh Kumar",
      role: "Milkman",
      content: "Finally, a platform where I can track my supplies and payments easily. The interface is very user-friendly.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Milk className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">DairyConnect</h1>
            </div>
            <div className="space-x-4">
              <Button variant="outline" onClick={handleLogin}>
                Sign In
              </Button>
              <Button onClick={handleSignup}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Professional Dairy Management Platform
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamline your dairy business with automated record keeping, secure payments, 
            and comprehensive analytics. Connect buyers, milkmen, and administrators in one platform.
          </p>
          <div className="space-x-4">
            <Button size="lg" onClick={handleGetStarted}>
              Start Your Journey
            </Button>
            <Button variant="outline" size="lg" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose DairyConnect?
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform is designed specifically for the dairy industry with features that matter most to your business.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h3>
            <p className="text-lg text-gray-600">
              Real feedback from dairy professionals using DairyConnect
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Dairy Business?
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of dairy professionals who trust DairyConnect for their daily operations.
          </p>
          <Button size="lg" variant="secondary" onClick={handleGetStarted}>
            Start Free Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <Milk className="h-8 w-8 text-blue-400" />
            <h1 className="text-2xl font-bold">DairyConnect</h1>
          </div>
          <div className="text-center text-gray-400">
            <p>&copy; 2024 DairyConnect. All rights reserved.</p>
            <p className="mt-2">Professional Dairy Management Platform</p>
          </div>
        </div>
      </footer>

      {/* Auth Prompt Modal */}
      {showAuthPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Get Started with DairyConnect</CardTitle>
              <CardDescription>
                Choose an option to continue with your dairy management journey
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" onClick={handleSignup}>
                Create New Account
              </Button>
              <Button variant="outline" className="w-full" onClick={handleLogin}>
                Sign In to Existing Account
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setShowAuthPrompt(false)}>
                Maybe Later
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default HomePage;
