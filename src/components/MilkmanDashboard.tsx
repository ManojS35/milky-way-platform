
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

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
}

const MilkmanDashboard = ({ user, onLogout, dailyRecords, milkmanData, onUpdateAccountDetails }: MilkmanDashboardProps) => {
  const [activeTab, setActiveTab] = useState('records');
  const [accountDetails, setAccountDetails] = useState({
    accountNumber: milkmanData?.accountNumber || '',
    ifscCode: milkmanData?.ifscCode || ''
  });

  const totalEarned = dailyRecords.reduce((sum, record) => sum + record.amount, 0);
  const thisMonthRecords = dailyRecords.filter(record => {
    const recordDate = new Date(record.date);
    const currentDate = new Date();
    return recordDate.getMonth() === currentDate.getMonth() && 
           recordDate.getFullYear() === currentDate.getFullYear();
  });

  const handleUpdateAccountDetails = () => {
    if (accountDetails.accountNumber && accountDetails.ifscCode) {
      onUpdateAccountDetails(accountDetails.accountNumber, accountDetails.ifscCode);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🥛 DairyConnect Milkman</h1>
            <p className="text-gray-600">Welcome, {user.username}</p>
            {milkmanData && (
              <Badge variant={milkmanData.status === 'approved' ? 'default' : milkmanData.status === 'pending' ? 'secondary' : 'destructive'}>
                {milkmanData.status}
              </Badge>
            )}
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
                  <p className="text-sm font-medium text-gray-600">Total Due</p>
                  <p className="text-2xl font-bold text-green-600">₹{milkmanData?.totalDue || 0}</p>
                  <p className="text-sm text-gray-500">From dairy</p>
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
                  <p className="text-sm text-gray-500">Milk supplied</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rating</p>
                  <p className="text-2xl font-bold text-yellow-600">⭐ {milkmanData?.rating || 0}</p>
                  <p className="text-sm text-gray-500">Customer rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {milkmanData?.status === 'pending' && (
          <Card className="mb-6 bg-yellow-50 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  ⏳
                </div>
                <div>
                  <h3 className="font-medium text-yellow-800">Application Under Review</h3>
                  <p className="text-sm text-yellow-700">Your application is being reviewed by the dairy admin. You'll be notified once approved.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="records">Supply Records</TabsTrigger>
            <TabsTrigger value="account">Account Details</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="records" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Milk Supply History</CardTitle>
                <CardDescription>Track your daily milk supplies to the dairy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dailyRecords.map((record: DailyRecord) => (
                    <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">Record #{record.id}</p>
                          <Badge variant="secondary">Supply</Badge>
                        </div>
                        <p className="text-sm text-gray-600">Date: {record.date}</p>
                        <p className="text-sm">{record.quantity} liters @ ₹{record.rate}/L</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">₹{record.amount}</p>
                        <p className="text-sm text-gray-600">Earned</p>
                      </div>
                    </div>
                  ))}
                  {dailyRecords.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No supply records yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Bank Account Details</CardTitle>
                <CardDescription>Provide your bank details to receive payments from the dairy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Account Number</Label>
                    <Input
                      type="text"
                      placeholder="Enter your account number"
                      value={accountDetails.accountNumber}
                      onChange={(e) => setAccountDetails({...accountDetails, accountNumber: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>IFSC Code</Label>
                    <Input
                      type="text"
                      placeholder="Enter IFSC code"
                      value={accountDetails.ifscCode}
                      onChange={(e) => setAccountDetails({...accountDetails, ifscCode: e.target.value})}
                    />
                  </div>
                  <Button 
                    onClick={handleUpdateAccountDetails}
                    disabled={!accountDetails.accountNumber || !accountDetails.ifscCode}
                  >
                    Update Account Details
                  </Button>
                </div>

                {milkmanData?.accountNumber && milkmanData?.ifscCode && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h3 className="font-medium text-green-800 mb-2">✅ Account Details Saved</h3>
                    <p className="text-sm text-green-600">
                      Account: ****{milkmanData.accountNumber.slice(-4)} • IFSC: {milkmanData.ifscCode}
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      You can now receive payments from the dairy
                    </p>
                  </div>
                )}

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Payment Information</h3>
                  <p className="text-sm text-blue-600">
                    • Payments are processed by the dairy admin
                  </p>
                  <p className="text-sm text-blue-600">
                    • You'll receive payments for all your milk supplies
                  </p>
                  <p className="text-sm text-blue-600">
                    • Current due amount: ₹{milkmanData?.totalDue || 0}
                  </p>
                </div>
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
                    <Label>Username</Label>
                    <Input value={user.username} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={user.email} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={user.phone || ''} />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input value={user.location || ''} />
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

export default MilkmanDashboard;
