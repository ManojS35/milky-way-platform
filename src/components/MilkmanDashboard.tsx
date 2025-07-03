
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, TrendingUp, Package, User, DollarSign } from 'lucide-react';
import PaymentOptions from './PaymentOptions';
import { useToast } from '@/hooks/use-toast';

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

interface Milkman {
  id: number;
  name: string;
  username: string;
  location: string;
  status: 'pending' | 'approved' | 'rejected';
  phone: string;
  rating: number;
  distance?: string;
  available: boolean;
  accountNumber?: string;
  ifscCode?: string;
  totalDue?: number;
}

interface MilkmanDashboardProps {
  user: User;
  onLogout: () => void;
  dailyRecords: DailyRecord[];
  milkmanData?: Milkman;
  onUpdateAccountDetails: (accountNumber: string, ifscCode: string) => void;
  onMilkmanPayment: (milkmanId: string, milkmanName: string, amount: number, paymentMethod: string, transactionId: string) => void;
}

const MilkmanDashboard = ({ 
  user, 
  onLogout, 
  dailyRecords, 
  milkmanData,
  onUpdateAccountDetails,
  onMilkmanPayment
}: MilkmanDashboardProps) => {
  const [accountDetails, setAccountDetails] = useState({
    accountNumber: milkmanData?.accountNumber || '',
    ifscCode: milkmanData?.ifscCode || ''
  });
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const { toast } = useToast();

  const totalSupply = dailyRecords.reduce((sum, record) => sum + record.quantity, 0);
  const totalEarnings = dailyRecords.reduce((sum, record) => sum + record.amount, 0);
  const dueAmount = Math.abs(milkmanData?.totalDue || 0);
  const needsToPay = (milkmanData?.totalDue || 0) < 0;

  const stats = [
    { title: 'Total Milk Supplied', value: `${totalSupply}L`, icon: Package, change: 'This month' },
    { title: 'Total Earnings', value: `₹${totalEarnings}`, icon: TrendingUp, change: 'This month' },
    { title: 'Status', value: milkmanData?.status || 'Unknown', icon: User, change: milkmanData?.available ? 'Available' : 'Not Available' },
    { title: needsToPay ? 'Amount to Pay' : 'Amount Due', value: `₹${dueAmount}`, icon: DollarSign, change: needsToPay ? 'You owe' : 'You are owed' }
  ];

  const validateAndUpdateAccountDetails = () => {
    const { accountNumber, ifscCode } = accountDetails;

    // Validate account number (9-18 digits, specifically allowing 15 digits)
    const accountNumberRegex = /^\d{9,18}$/;
    if (!accountNumberRegex.test(accountNumber)) {
      toast({
        title: "Error",
        description: "Account number should be between 9-18 digits (15 digits recommended)",
        variant: "destructive"
      });
      return;
    }

    // Validate IFSC code
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscRegex.test(ifscCode.toUpperCase())) {
      toast({
        title: "Error",
        description: "Invalid IFSC code format. Should be like ABCD0123456 (4 letters, then 0, then 6 alphanumeric)",
        variant: "destructive"
      });
      return;
    }

    onUpdateAccountDetails(accountNumber, ifscCode.toUpperCase());
  };

  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 18) {
      setAccountDetails({...accountDetails, accountNumber: value});
    }
  };

  const handleIfscChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); // Only allow letters and numbers
    if (value.length <= 11) {
      setAccountDetails({...accountDetails, ifscCode: value});
    }
  };

  const handlePayment = (amount: number, method: string, transactionId: string) => {
    onMilkmanPayment(user.id, user.username, amount, method, transactionId);
    setShowPaymentOptions(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🥛 DairyConnect Milkman</h1>
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
                    <p className={`text-2xl font-bold ${stat.title.includes('Amount to Pay') ? 'text-red-600' : 'text-gray-900'}`}>
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
              <CardTitle>Bank Account Details</CardTitle>
              <CardDescription>Update your bank account information for payments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Account Number (9-18 digits, 15 digits recommended)</Label>
                <Input
                  value={accountDetails.accountNumber}
                  onChange={handleAccountNumberChange}
                  placeholder="Enter 15-digit account number"
                  maxLength={18}
                />
                <p className="text-xs text-gray-500">
                  Current length: {accountDetails.accountNumber.length} digits
                </p>
              </div>
              <div className="space-y-2">
                <Label>IFSC Code (11 characters: ABCD0123456)</Label>
                <Input
                  value={accountDetails.ifscCode}
                  onChange={handleIfscChange}
                  placeholder="ABCD0123456"
                  maxLength={11}
                />
                <p className="text-xs text-gray-500">
                  Format: 4 letters + 0 + 6 alphanumeric characters
                </p>
              </div>
              <Button 
                onClick={validateAndUpdateAccountDetails}
                disabled={!accountDetails.accountNumber || !accountDetails.ifscCode}
              >
                Update Account Details
              </Button>
            </CardContent>
          </Card>

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
                    <span className="text-blue-700">Total Earnings:</span>
                    <span className="font-bold text-blue-600">₹{totalEarnings}</span>
                  </div>
                  {needsToPay && (
                    <div className="flex justify-between">
                      <span className="text-red-700">Amount to Pay:</span>
                      <span className="font-bold text-red-600">₹{dueAmount}</span>
                    </div>
                  )}
                  {!needsToPay && dueAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-green-700">Amount Due to You:</span>
                      <span className="font-bold text-green-600">₹{dueAmount}</span>
                    </div>
                  )}
                </div>
              </div>

              {needsToPay && dueAmount > 0 && (
                <Button 
                  onClick={() => setShowPaymentOptions(true)}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay ₹{dueAmount}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Supply Records</CardTitle>
            <CardDescription>Your milk supply history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dailyRecords.slice(-10).reverse().map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Milk Supply</p>
                    <p className="text-sm text-gray-600">{record.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{record.quantity}L</p>
                    <p className="text-sm text-green-600">₹{record.amount}</p>
                    <p className="text-xs text-gray-500">@ ₹{record.rate}/L</p>
                  </div>
                </div>
              ))}
              {dailyRecords.length === 0 && (
                <p className="text-gray-500 text-center py-8">No supply records yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {showPaymentOptions && (
        <PaymentOptions
          amount={dueAmount}
          customerName={user.username}
          onPayment={handlePayment}
          onCancel={() => setShowPaymentOptions(false)}
        />
      )}
    </div>
  );
};

export default MilkmanDashboard;
