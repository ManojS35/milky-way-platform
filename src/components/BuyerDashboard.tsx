
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, TrendingUp, Package, User } from 'lucide-react';
import PaymentOptions from './PaymentOptions';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface DailyRecord {
  id: number;
  userId: number;
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

interface BuyerDashboardProps {
  user: User;
  onLogout: () => void;
  dailyRecords: DailyRecord[];
  dairyRates: DairyRates;
  currentDue: number;
  onPayment: (buyerId: string, buyerName: string, amount: number, paymentMethod: string, transactionId: string) => void;
}

const BuyerDashboard = ({ 
  user, 
  onLogout, 
  dailyRecords, 
  dairyRates, 
  currentDue, 
  onPayment 
}: BuyerDashboardProps) => {
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  const totalPurchases = dailyRecords.reduce((sum, record) => sum + record.quantity, 0);
  const totalSpent = dailyRecords.reduce((sum, record) => sum + record.amount, 0);

  const stats = [
    { title: 'Total Milk Purchased', value: `${totalPurchases}L`, icon: Package, change: 'This month' },
    { title: 'Total Spent', value: `₹${totalSpent}`, icon: TrendingUp, change: 'This month' },
    { title: 'Current Rate', value: `₹${dairyRates.buyerRate}/L`, icon: User, change: 'Per liter' },
    { title: 'Amount Due', value: `₹${currentDue}`, icon: CreditCard, change: currentDue > 0 ? 'Pay now' : 'All paid' }
  ];

  const handlePayment = (amount: number, method: string, transactionId: string) => {
    onPayment(user.id, user.username, amount, method, transactionId);
    setShowPaymentOptions(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🥛 DairyConnect Buyer</h1>
            <p className="text-gray-600">Welcome back, {user.username}</p>
          </div>
          <Button onClick={onLogout} variant="outline">Logout</Button>
        </div>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className={`text-2xl font-bold ${stat.title === 'Amount Due' && currentDue > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                      {stat.value}
                    </p>
                    <p className="text-sm text-green-600">{stat.change}</p>
                  </div>
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Status</CardTitle>
              <CardDescription>Your current payment information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-800 mb-2">Current Balance</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Total Purchases:</span>
                    <span className="font-bold text-blue-600">₹{totalSpent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Amount Due:</span>
                    <span className={`font-bold ${currentDue > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ₹{currentDue}
                    </span>
                  </div>
                </div>
              </div>

              {currentDue > 0 && (
                <Button 
                  onClick={() => setShowPaymentOptions(true)}
                  className="w-full"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay ₹{currentDue}
                </Button>
              )}
              
              {currentDue === 0 && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-green-800 font-medium">✓ All payments up to date!</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your account and orders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                View Full Purchase History
              </Button>
              <Button variant="outline" className="w-full">
                Update Account Details
              </Button>
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Purchases</CardTitle>
            <CardDescription>Your recent milk purchase history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dailyRecords.slice(-10).reverse().map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Milk Purchase</p>
                    <p className="text-sm text-gray-600">{record.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{record.quantity}L</p>
                    <p className="text-sm text-blue-600">₹{record.amount}</p>
                    <Badge variant="secondary">₹{record.rate}/L</Badge>
                  </div>
                </div>
              ))}
              {dailyRecords.length === 0 && (
                <p className="text-gray-500 text-center py-8">No purchase records yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {showPaymentOptions && (
        <PaymentOptions
          amount={currentDue}
          customerName={user.username}
          onPayment={handlePayment}
          onCancel={() => setShowPaymentOptions(false)}
        />
      )}
    </div>
  );
};

export default BuyerDashboard;
