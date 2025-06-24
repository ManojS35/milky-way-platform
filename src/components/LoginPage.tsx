
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LoginPageProps {
  onLogin: (role: string, username: string, email?: string, password?: string) => void;
  loginForm: { email: string; password: string };
  setLoginForm: (form: { email: string; password: string }) => void;
  isSignup: boolean;
  setIsSignup: (signup: boolean) => void;
  signupForm: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
    phone: string;
    location: string;
  };
  setSignupForm: (form: any) => void;
  handleSignup: () => void;
  isAuthorizedAdmin: (email: string, username: string) => boolean;
}

const LoginPage = ({ 
  onLogin, 
  loginForm, 
  setLoginForm, 
  isSignup, 
  setIsSignup, 
  signupForm, 
  setSignupForm, 
  handleSignup, 
  isAuthorizedAdmin 
}: LoginPageProps) => {
  const handleLoginSubmit = () => {
    onLogin('login', '', loginForm.email, loginForm.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🥛 DairyConnect</h1>
          <p className="text-gray-600">Professional Dairy Management Platform</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isSignup ? 'Create Account' : 'Welcome Back'}</CardTitle>
            <CardDescription>
              {isSignup ? 'Sign up for your account' : 'Sign in to your account'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isSignup ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  />
                </div>

                <Button onClick={handleLoginSubmit} className="w-full">
                  Sign In
                </Button>

                <div className="space-y-2">
                  <Label>Demo Login (Select Role)</Label>
                  <div className="grid grid-cols-1 gap-2">
                    <Button 
                      onClick={() => onLogin('buyer', 'priya_sharma')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Login as Milk Buyer (Priya)
                    </Button>
                    <Button 
                      onClick={() => onLogin('milkman', 'ramesh_kumar')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Login as Milkman (Ramesh)
                    </Button>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <button 
                      onClick={() => setIsSignup(true)}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={signupForm.username}
                    onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email *</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={signupForm.phone}
                    onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="Enter your location"
                    value={signupForm.location}
                    onChange={(e) => setSignupForm({ ...signupForm, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password *</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Enter your password"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password *</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={signupForm.confirmPassword}
                    onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role *</Label>
                  <Select onValueChange={(value) => setSignupForm({ ...signupForm, role: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buyer">Milk Buyer</SelectItem>
                      <SelectItem value="milkman">Milkman</SelectItem>
                      <SelectItem value="admin" disabled={!isAuthorizedAdmin(signupForm.email, signupForm.username)}>
                        Admin (Authorization Required)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {signupForm.role === 'admin' && !isAuthorizedAdmin(signupForm.email, signupForm.username) && (
                    <p className="text-sm text-red-600">
                      Admin access requires authorization. Contact system administrator.
                    </p>
                  )}
                </div>

                <Button onClick={handleSignup} className="w-full">
                  Sign Up
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <button 
                      onClick={() => setIsSignup(false)}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
