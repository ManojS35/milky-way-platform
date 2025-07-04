
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Package, CreditCard, ShoppingCart } from 'lucide-react';
import PaymentOptions from './PaymentOptions';

interface User {
  id: string;
  username: string;
  email?: string;
  role: string;
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
  const thisMonthPurchases = dailyRecords.filter(record => {
    const recordDate = new Date(record.date);
    const now = new Date();
    return recordDate.getMonth() === now.getMonth() && recordDate.getFullYear() === now.getFullYear();
  }).reduce((sum, record) => sum + record.quantity, 0);

  const stats = [
    { title: 'Total Milk Purchased', value: `${totalPurchases}L`, icon: Package, change: `${thisMonthPurchases}L this month` },
    { title: 'Total Spent', value: `₹${totalSpent}`, icon: TrendingUp, change: 'All time' },
    { title: 'Current Rate', value: `₹${dairyRates.buyerRate}/L`, icon: ShoppingCart, change: 'Per Liter' },
    { title: 'Amount Due', value: `₹${Math.abs(currentDue)}`, icon: CreditCard, change: currentDue < 0 ? 'You owe' : 'Credit balance' }
  ];

  const handlePayment = (paymentMethod: string, transactionId: string) => {
    onPayment(user.id, user.username, Math.abs(currentDue), paymentMethod, transactionId);
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
                    <p className={`text-2xl font-bold ${stat.title === 'Amount Due' && currentDue < 0 ? 'text-red-600' : 'text-gray-900'}`}>
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
                <h3 className="font-medium text-blue-800 mb-2">Payment Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Total Spent:</span>
                    <span className="font-bold text-blue-600">₹{totalSpent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Current Due:</span>
                    <span className={`font-bold ${currentDue < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ₹{Math.abs(currentDue)} {currentDue < 0 ? '(owe)' : '(credit)'}
                    </span>
                  </div>
                </div>
              </div>

              {currentDue < 0 && (
                <Button 
                  onClick={() => setShowPaymentOptions(true)}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay ₹{Math.abs(currentDue)}
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Milk Rates</CardTitle>
              <CardDescription>Current pricing information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="text-green-700 font-medium">Current Rate:</span>
                    <span className="text-2xl font-bold text-green-600">₹{dairyRates.buyerRate}/L</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p>• Fresh milk delivered daily</p>
                  <p>• Quality guaranteed</p>
                  <p>• Direct from local milkmen</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Purchases</CardTitle>
            <CardDescription>Your milk purchase history</CardDescription>
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
                    <p className="text-xs text-gray-500">@ ₹{record.rate}/L</p>
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
          amount={Math.abs(currentDue)}
          customerName={user.username}
          onPaymentComplete={handlePayment}
          onCancel={() => setShowPaymentOptions(false)}
        />
      )}
    </div>
  );
};

export default BuyerDashboard;
