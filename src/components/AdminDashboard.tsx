import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TrendingUp, Users, Package, CreditCard, Star, MapPin, CheckCircle, XCircle } from 'lucide-react';
import DailyRecordCalendar from './DailyRecordCalendar';

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

interface Milkman {
  id: string;
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

interface DairyRates {
  milkmanRate: number;
  buyerRate: number;
}

interface Product {
  id: string;
  name: string;
  category: 'feed' | 'dairy_product';
  price: number;
  unit: string;
}

interface ProductSale {
  id: string;
  productId: string;
  productName: string;
  buyerId: string;
  buyerName: string;
  buyerRole: 'buyer' | 'milkman';
  quantity: number;
  rate: number;
  amount: number;
  date: string;
}

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
  milkmen: Milkman[];
  users: User[];
  dailyRecords: DailyRecord[];
  dairyRates: DairyRates;
  payments: Array<{
    id: string;
    buyerId: string;
    buyerName: string;
    amount: number;
    paymentMethod: string;
    transactionId: string;
    date: string;
  }>;
  buyerDues: Record<string, number>;
  products: Product[];
  productSales: ProductSale[];
  onApproveMilkman: (milkmanId: string) => void;
  onRejectMilkman: (milkmanId: string) => void;
  onUpdateDairyRates: (milkmanRate: number, buyerRate: number) => void;
  onPayMilkman: (milkmanId: string, amount: number) => void;
  onAddDailyRecord: (userId: string, userName: string, userRole: 'buyer' | 'milkman', date: string, quantity: number, type: 'purchase' | 'supply') => void;
  onAddProduct: (name: string, category: 'feed' | 'dairy_product', price: number, unit: string) => void;
  onUpdateProduct: (productId: string, name: string, category: 'feed' | 'dairy_product', price: number, unit: string) => void;
  onDeleteProduct: (productId: string) => void;
  onSellProduct: (productId: string, buyerId: string, quantity: number) => void;
}

const AdminDashboard = ({ 
  user, 
  onLogout, 
  milkmen, 
  users, 
  dailyRecords, 
  dairyRates, 
  payments, 
  buyerDues, 
  products, 
  productSales,
  onApproveMilkman,
  onRejectMilkman,
  onUpdateDairyRates,
  onPayMilkman,
  onAddDailyRecord,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onSellProduct
}: AdminDashboardProps) => {
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'feed' as 'feed' | 'dairy_product',
    price: 0,
    unit: ''
  });

  const [newRates, setNewRates] = useState({
    milkmanRate: dairyRates.milkmanRate,
    buyerRate: dairyRates.buyerRate
  });

  const totalMilkSupplied = dailyRecords
    .filter(record => record.type === 'supply')
    .reduce((sum, record) => sum + record.quantity, 0);

  const totalMilkPurchased = dailyRecords
    .filter(record => record.type === 'purchase')
    .reduce((sum, record) => sum + record.quantity, 0);

  const totalRevenue = dailyRecords.reduce((sum, record) => sum + record.amount, 0);
  const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);

  const stats = [
    { title: 'Total Milkmen', value: milkmen.length, icon: Users, change: `${milkmen.filter(m => m.status === 'approved').length} approved` },
    { title: 'Total Revenue', value: `₹${totalRevenue}`, icon: TrendingUp, change: 'This month' },
    { title: 'Milk Supplied', value: `${totalMilkSupplied}L`, icon: Package, change: 'This month' },
    { title: 'Total Payments', value: `₹${totalPayments}`, icon: CreditCard, change: 'Received' }
  ];

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price > 0 && newProduct.unit) {
      onAddProduct(newProduct.name, newProduct.category, newProduct.price, newProduct.unit);
      setNewProduct({ name: '', category: 'feed', price: 0, unit: '' });
    }
  };

  const handleUpdateRates = () => {
    onUpdateDairyRates(newRates.milkmanRate, newRates.buyerRate);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🥛 DairyConnect Admin</h1>
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
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change}</p>
                  </div>
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="milkmen" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="milkmen">Milkmen</TabsTrigger>
            <TabsTrigger value="records">Daily Records</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="milkmen">
            <Card>
              <CardHeader>
                <CardTitle>Milkmen Management</CardTitle>
                <CardDescription>Approve or reject milkman applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {milkmen.map((milkman) => (
                    <div key={milkman.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-medium">{milkman.name}</h3>
                          <p className="text-sm text-gray-600 flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {milkman.location}
                          </p>
                          <p className="text-sm text-gray-600">{milkman.phone}</p>
                          <div className="flex items-center mt-1">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="text-sm">{milkman.rating}/5</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          milkman.status === 'approved' ? 'default' :
                          milkman.status === 'rejected' ? 'destructive' : 'secondary'
                        }>
                          {milkman.status}
                        </Badge>
                        {milkman.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              onClick={() => onApproveMilkman(milkman.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => onRejectMilkman(milkman.id)}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="records">
            <DailyRecordCalendar
              dailyRecords={dailyRecords}
              users={users}
              milkmanRate={dairyRates.milkmanRate}
              buyerRate={dairyRates.buyerRate}
              onAddRecord={onAddDailyRecord}
            />
          </TabsContent>

          <TabsContent value="products">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Product</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Product Name</Label>
                    <Input
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={newProduct.category} onValueChange={(value: 'feed' | 'dairy_product') => setNewProduct({...newProduct, category: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="feed">Feed</SelectItem>
                        <SelectItem value="dairy_product">Dairy Product</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Price</Label>
                    <Input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
                      placeholder="Enter price"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit</Label>
                    <Input
                      value={newProduct.unit}
                      onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                      placeholder="e.g., kg, liter, piece"
                    />
                  </div>
                  <Button onClick={handleAddProduct} className="w-full">Add Product</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Products List</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {products.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-gray-600">
                            {product.category} • ₹{product.price}/{product.unit}
                          </p>
                        </div>
                        <Button size="sm" variant="destructive" onClick={() => onDeleteProduct(product.id)}>
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>All payments received from buyers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{payment.buyerName}</p>
                        <p className="text-sm text-gray-600">{payment.date}</p>
                        <p className="text-sm text-gray-600">{payment.paymentMethod} • {payment.transactionId}</p>
                      </div>
                      <p className="font-bold text-green-600">₹{payment.amount}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dairy Rates</CardTitle>
                  <CardDescription>Update milk rates for buyers and milkmen</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Milkman Rate (₹/liter)</Label>
                    <Input
                      type="number"
                      value={newRates.milkmanRate}
                      onChange={(e) => setNewRates({...newRates, milkmanRate: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Buyer Rate (₹/liter)</Label>
                    <Input
                      type="number"
                      value={newRates.buyerRate}
                      onChange={(e) => setNewRates({...newRates, buyerRate: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <Button onClick={handleUpdateRates} className="w-full">Update Rates</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Statistics</CardTitle>
                  <CardDescription>Overview of system usage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Users:</span>
                      <span className="font-bold">{users.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Milkmen:</span>
                      <span className="font-bold">{milkmen.filter(m => m.available).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Products:</span>
                      <span className="font-bold">{products.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Daily Records:</span>
                      <span className="font-bold">{dailyRecords.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
