
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import PaymentOptions from './PaymentOptions';

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

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  phone?: string;
  location?: string;
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
}

const BuyerDashboard = ({ user, onLogout, dailyRecords, dairyRates }: BuyerDashboardProps) => {
  const [activeTab, setActiveTab] = useState('records');
  const [showPayment, setShowPayment] = useState(false);

  const totalDue = dailyRecords.reduce((sum, record) => sum + record.amount, 0);
  const thisMonthRecords = dailyRecords.filter(record => {
    const recordDate = new Date(record.date);
    const currentDate = new Date();
    return recordDate.getMonth() === currentDate.getMonth() && 
           recordDate.getFullYear() === currentDate.getFullYear();
  });

  const handlePaymentComplete = (paymentMethod: string, transactionId: string) => {
    setShowPayment(false);
    // In a real app, this would update the payment status in the backend
    console.log(`Payment completed: ${paymentMethod}, Transaction: ${transactionId}`);
  };

  if (showPayment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <PaymentOptions
          amount={totalDue}
          orderId={user.id}
          onPaymentComplete={handlePaymentComplete}
          onCancel={() => setShowPayment(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🥛 DairyConnect Customer</h1>
            <p className="text-gray-600">Welcome, {user.username}</p>
          </div>
          <Button onClick={onLogout} variant="outline">Logout</Button>
        </div>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Due Amount</p>
                  <p className="text-2xl font-bold text-red-600">₹{totalDue}</p>
                  <p className="text-sm text-gray-500">Pay to dairy</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-blue-600">{thisMonthRecords.reduce((sum, r) => sum + r.quantity, 0)}L</p>
                  <p className="text-sm text-gray-500">Milk purchased</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Rate</p>
                  <p className="text-2xl font-bold text-green-600">₹{dairyRates.buyerRate}</p>
                  <p className="text-sm text-gray-500">Per liter</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="records">Purchase Records</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="records" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Milk Purchase History</CardTitle>
                <CardDescription>Track your daily milk purchases from the dairy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dailyRecords.map((record: DailyRecord) => (
                    <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">Record #{record.id}</p>
                          <Badge variant="default">Purchase</Badge>
                        </div>
                        <p className="text-sm text-gray-600">Date: {record.date}</p>
                        <p className="text-sm">{record.quantity} liters @ ₹{record.rate}/L</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{record.amount}</p>
                        <p className="text-sm text-gray-600">Amount</p>
                      </div>
                    </div>
                  ))}
                  {dailyRecords.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No purchase records yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Center</CardTitle>
                <CardDescription>Pay your outstanding amount to the dairy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <h3 className="font-medium text-red-800 mb-2">Outstanding Amount</h3>
                  <p className="text-3xl font-bold text-red-600">₹{totalDue}</p>
                  <p className="text-sm text-red-600 mt-1">Total amount due to dairy</p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Payment Breakdown:</h4>
                  {dailyRecords.map((record, index) => (
                    <div key={index} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                      <span>{record.date} - {record.quantity}L</span>
                      <span>₹{record.amount}</span>
                    </div>
                  ))}
                </div>

                {totalDue > 0 && (
                  <Button 
                    onClick={() => setShowPayment(true)}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    Pay ₹{totalDue} Now
                  </Button>
                )}

                {totalDue === 0 && (
                  <div className="text-center py-8">
                    <p className="text-green-600 font-medium">✅ All payments are up to date!</p>
                    <p className="text-sm text-gray-500">No outstanding amount</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Username</label>
                    <input className="w-full p-2 border rounded" value={user.username} readOnly />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <input className="w-full p-2 border rounded" value={user.email} readOnly />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <input className="w-full p-2 border rounded" value={user.phone || ''} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <input className="w-full p-2 border rounded" value={user.location || ''} />
                  </div>
                </div>
                <Button>Update Profile</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BuyerDashboard;
