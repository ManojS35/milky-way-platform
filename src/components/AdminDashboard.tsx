import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, TrendingUp, ShoppingCart, Truck, CreditCard, Calendar, DollarSign, Package, Settings, Shield } from 'lucide-react';
import DailyRecordCalendar from './DailyRecordCalendar';

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

interface User {
  id: string;
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

interface AdminProfile {
  name: string;
  email: string;
  phone: string;
  dairyName: string;
  accountNumber: string;
  ifscCode: string;
  address: string;
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
  buyerDues: { [key: string]: { userId: string; userName: string; totalPurchases: number; totalPayments: number; due: number } };
  products: Product[];
  productSales: ProductSale[];
  onApproveMilkman: (milkmanId: string) => void;
  onRejectMilkman: (milkmanId: string) => void;
  onUpdateDairyRates: (milkmanRate: number, buyerRate: number) => void;
  onPayMilkman: (milkmanId: string, amount: number) => void;
  onAddDailyRecord: (userId: string, userName: string, userRole: 'buyer' | 'milkman', date: string, quantity: number, type: 'purchase' | 'supply') => void;
  onAddProduct: (name: string, category: 'feed' | 'dairy_product', price: number, unit: string) => void;
  onUpdateProduct: (id: string, name: string, category: 'feed' | 'dairy_product', price: number, unit: string) => void;
  onDeleteProduct: (id: string) => void;
  onSellProduct: (productId: string, buyerId: string, buyerName: string, buyerRole: 'buyer' | 'milkman', quantity: number) => void;
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
  const [activeTab, setActiveTab] = useState('overview');
  const [newRates, setNewRates] = useState({
    milkmanRate: dairyRates.milkmanRate,
    buyerRate: dairyRates.buyerRate
  });
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'feed' as 'feed' | 'dairy_product',
    price: 0,
    unit: ''
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productSaleForm, setProductSaleForm] = useState({
    productId: '',
    buyerId: '',
    quantity: 0
  });
  const [adminProfile, setAdminProfile] = useState<AdminProfile>({
    name: 'Dairy Owner',
    email: user.email,
    phone: '',
    dairyName: 'DairyConnect Farm',
    accountNumber: '',
    ifscCode: '',
    address: ''
  });
  const [adminAccessForm, setAdminAccessForm] = useState({
    email: '',
    reason: ''
  });

  const todayRecords = dailyRecords.filter(r => r.date === new Date().toISOString().split('T')[0]);
  const totalRevenue = dailyRecords.filter(r => r.type === 'purchase').reduce((sum, r) => sum + r.amount, 0);
  const totalExpenses = dailyRecords.filter(r => r.type === 'supply').reduce((sum, r) => sum + r.amount, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const pendingMilkmen = milkmen.filter(m => m.status === 'pending');
  const totalPendingPayments = milkmen.reduce((sum, m) => sum + (m.totalDue || 0), 0);
  const totalBuyerDues = Object.values(buyerDues).reduce((sum, buyer) => sum + buyer.due, 0);
  const totalProductSales = productSales.reduce((sum, sale) => sum + sale.amount, 0);

  const stats = [
    { title: 'Total Users', value: users.length.toString(), icon: Users, change: '+12%' },
    { title: 'Daily Profit', value: `₹${totalProfit}`, icon: TrendingUp, change: '+8%' },
    { title: "Today's Records", value: todayRecords.length.toString(), icon: ShoppingCart, change: '+15%' },
    { title: 'Active Milkmen', value: milkmen.filter(m => m.status === 'approved').length.toString(), icon: Truck, change: '+5%' }
  ];

  const handleUpdateRates = () => {
    if (newRates.milkmanRate > 0 && newRates.buyerRate > 0 && newRates.buyerRate > newRates.milkmanRate) {
      onUpdateDairyRates(newRates.milkmanRate, newRates.buyerRate);
    }
  };

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price > 0 && newProduct.unit) {
      onAddProduct(newProduct.name, newProduct.category, newProduct.price, newProduct.unit);
      setNewProduct({ name: '', category: 'feed', price: 0, unit: '' });
    }
  };

  const handleUpdateProduct = () => {
    if (editingProduct && editingProduct.name && editingProduct.price > 0 && editingProduct.unit) {
      onUpdateProduct(editingProduct.id, editingProduct.name, editingProduct.category, editingProduct.price, editingProduct.unit);
      setEditingProduct(null);
    }
  };

  const handleSellProduct = () => {
    if (productSaleForm.productId && productSaleForm.buyerId && productSaleForm.quantity > 0) {
      const buyer = users.find(u => u.id === productSaleForm.buyerId);
      if (buyer) {
        onSellProduct(
          productSaleForm.productId, 
          productSaleForm.buyerId, 
          buyer.username, 
          buyer.role as 'buyer' | 'milkman', 
          productSaleForm.quantity
        );
        setProductSaleForm({ productId: '', buyerId: '', quantity: 0 });
      }
    }
  };

  // Only show positive dues for milkmen payments
  const milkmenWithPositiveDues = milkmen.filter(m => (m.totalDue || 0) > 0);

  const handleGrantAdminAccess = () => {
    if (adminAccessForm.email && adminAccessForm.reason) {
      // In a real application, this would send a request to the backend
      // For now, we'll just show a success message
      console.log(`Admin access granted to: ${adminAccessForm.email}, Reason: ${adminAccessForm.reason}`);
      setAdminAccessForm({ email: '', reason: '' });
      // You would implement the actual admin access granting logic here
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🥛 DairyConnect Admin</h1>
            <p className="text-gray-600">Welcome back, {user.username} (Dairy Owner)</p>
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

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="calendar">
              <Calendar className="w-4 h-4 mr-2" />
              Daily Records
            </TabsTrigger>
            <TabsTrigger value="buyer-dues">
              <DollarSign className="w-4 h-4 mr-2" />
              Buyer Dues <Badge className="ml-2">₹{totalBuyerDues}</Badge>
            </TabsTrigger>
            <TabsTrigger value="products">
              <Package className="w-4 h-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="milkmen">
              Milkmen {pendingMilkmen.length > 0 && <Badge className="ml-2">{pendingMilkmen.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="rates">Rate Management</TabsTrigger>
            <TabsTrigger value="payments">
              Payments {milkmenWithPositiveDues.length > 0 && <Badge className="ml-2">₹{totalPendingPayments}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="admin-access">
              <Shield className="w-4 h-4 mr-2" />
              Admin Access
            </TabsTrigger>
            <TabsTrigger value="profile">
              <Settings className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Milk Purchased (from farmers):</span>
                      <span className="font-bold">{todayRecords.filter(r => r.type === 'supply').reduce((sum, r) => sum + r.quantity, 0)}L</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Milk Sold (to customers):</span>
                      <span className="font-bold">{todayRecords.filter(r => r.type === 'purchase').reduce((sum, r) => sum + r.quantity, 0)}L</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Today's Profit:</span>
                      <span className="font-bold">₹{todayRecords.filter(r => r.type === 'purchase').reduce((sum, r) => sum + r.amount, 0) - todayRecords.filter(r => r.type === 'supply').reduce((sum, r) => sum + r.amount, 0)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Current Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Rate paid to farmers:</span>
                      <span className="font-bold text-red-600">₹{dairyRates.milkmanRate}/L</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rate charged to customers:</span>
                      <span className="font-bold text-green-600">₹{dairyRates.buyerRate}/L</span>
                    </div>
                    <div className="flex justify-between text-blue-600">
                      <span>Profit per liter:</span>
                      <span className="font-bold">₹{dairyRates.buyerRate - dairyRates.milkmanRate}/L</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Records Management</CardTitle>
                <CardDescription>Track daily milk purchases and supplies with calendar view</CardDescription>
              </CardHeader>
              <CardContent>
                <DailyRecordCalendar
                  dailyRecords={dailyRecords}
                  users={users}
                  milkmanRate={dairyRates.milkmanRate}
                  buyerRate={dairyRates.buyerRate}
                  onAddRecord={onAddDailyRecord}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="buyer-dues" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Buyer Due Amounts</CardTitle>
                <CardDescription>Outstanding payments from milk buyers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-medium text-blue-800 mb-2">Total Outstanding</h3>
                    <p className="text-3xl font-bold text-blue-600">₹{totalBuyerDues}</p>
                    <p className="text-sm text-blue-600 mt-1">Total amount due from all buyers</p>
                  </div>

                  {Object.values(buyerDues).filter(buyer => buyer.due > 0).map((buyer) => (
                    <div key={buyer.userId} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium">{buyer.userName}</h3>
                          <p className="text-sm text-gray-600">Customer ID: {buyer.userId}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-red-600">₹{buyer.due}</p>
                          <p className="text-sm text-gray-600">Due Amount</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-2 bg-red-50 rounded">
                          <span className="text-red-600">Total Purchases: ₹{buyer.totalPurchases}</span>
                        </div>
                        <div className="p-2 bg-green-50 rounded">
                          <span className="text-green-600">Total Payments: ₹{buyer.totalPayments}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {Object.values(buyerDues).filter(buyer => buyer.due > 0).length === 0 && (
                    <p className="text-gray-500 text-center py-8">No outstanding dues from buyers</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</CardTitle>
                  <CardDescription>Add cow feeds and dairy products to sell</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Product Name</Label>
                    <Input
                      value={editingProduct ? editingProduct.name : newProduct.name}
                      onChange={(e) => editingProduct 
                        ? setEditingProduct({...editingProduct, name: e.target.value})
                        : setNewProduct({...newProduct, name: e.target.value})
                      }
                      placeholder="e.g., Cow Feed Premium, Ghee, Curd"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <select 
                      className="w-full px-3 py-2 border rounded-md"
                      value={editingProduct ? editingProduct.category : newProduct.category}
                      onChange={(e) => editingProduct
                        ? setEditingProduct({...editingProduct, category: e.target.value as 'feed' | 'dairy_product'})
                        : setNewProduct({...newProduct, category: e.target.value as 'feed' | 'dairy_product'})
                      }
                    >
                      <option value="feed">Cow Feed</option>
                      <option value="dairy_product">Dairy Product</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Price</Label>
                      <Input
                        type="number"
                        value={editingProduct ? editingProduct.price : newProduct.price}
                        onChange={(e) => editingProduct
                          ? setEditingProduct({...editingProduct, price: parseFloat(e.target.value) || 0})
                          : setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})
                        }
                        placeholder="Price per unit"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit</Label>
                      <Input
                        value={editingProduct ? editingProduct.unit : newProduct.unit}
                        onChange={(e) => editingProduct
                          ? setEditingProduct({...editingProduct, unit: e.target.value})
                          : setNewProduct({...newProduct, unit: e.target.value})
                        }
                        placeholder="kg, liter, piece"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {editingProduct ? (
                      <>
                        <Button onClick={handleUpdateProduct} disabled={!editingProduct.name || editingProduct.price <= 0 || !editingProduct.unit}>
                          Update Product
                        </Button>
                        <Button variant="outline" onClick={() => setEditingProduct(null)}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button onClick={handleAddProduct} disabled={!newProduct.name || newProduct.price <= 0 || !newProduct.unit}>
                        Add Product
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sell Product</CardTitle>
                  <CardDescription>Record product sales to buyers and milkmen</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Product</Label>
                    <select 
                      className="w-full px-3 py-2 border rounded-md"
                      value={productSaleForm.productId}
                      onChange={(e) => setProductSaleForm({...productSaleForm, productId: e.target.value})}
                    >
                      <option value="">Select Product</option>
                      {products.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name} - ₹{product.price}/{product.unit}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Customer</Label>
                    <select 
                      className="w-full px-3 py-2 border rounded-md"
                      value={productSaleForm.buyerId}
                      onChange={(e) => setProductSaleForm({...productSaleForm, buyerId: e.target.value})}
                    >
                      <option value="">Select Customer</option>
                      {users.filter(u => u.role !== 'admin').map(user => (
                        <option key={user.id} value={user.id}>
                          {user.username} ({user.role})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={productSaleForm.quantity}
                      onChange={(e) => setProductSaleForm({...productSaleForm, quantity: parseFloat(e.target.value) || 0})}
                      placeholder="Quantity"
                    />
                  </div>
                  <Button 
                    onClick={handleSellProduct} 
                    disabled={!productSaleForm.productId || !productSaleForm.buyerId || productSaleForm.quantity <= 0}
                  >
                    Record Sale
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Product Inventory</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map(product => (
                    <div key={product.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{product.name}</h3>
                        <Badge variant={product.category === 'feed' ? 'secondary' : 'default'}>
                          {product.category === 'feed' ? 'Feed' : 'Dairy'}
                        </Badge>
                      </div>
                      <p className="text-lg font-bold text-green-600 mb-3">₹{product.price}/{product.unit}</p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setEditingProduct(product)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => onDeleteProduct(product.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                  {products.length === 0 && (
                    <p className="text-gray-500 col-span-full text-center py-8">No products added yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Recent Product Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productSales.slice(-10).map(sale => (
                    <div key={sale.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{sale.productName}</h3>
                        <p className="text-sm text-gray-600">
                          Sold to: {sale.buyerName} ({sale.buyerRole}) • {sale.date}
                        </p>
                        <p className="text-sm">{sale.quantity} units @ ₹{sale.rate}/unit</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">₹{sale.amount}</p>
                      </div>
                    </div>
                  ))}
                  {productSales.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No product sales yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="milkmen" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Milkmen Management</CardTitle>
                <CardDescription>Approve or manage milkman registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {milkmen.map((milkman: Milkman) => (
                    <div key={milkman.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{milkman.name} (@{milkman.username})</h3>
                          <Badge variant={milkman.status === 'approved' ? 'default' : milkman.status === 'pending' ? 'secondary' : 'destructive'}>
                            {milkman.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{milkman.location} • {milkman.phone}</p>
                        <p className="text-sm">Total Due: ₹{milkman.totalDue || 0}</p>
                      </div>
                      {milkman.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => onApproveMilkman(milkman.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => onRejectMilkman(milkman.id)}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rates" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Dairy Rate Management</CardTitle>
                <CardDescription>Set rates for milk purchase and sale</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Rate paid to farmers (₹/liter)</Label>
                    <Input
                      type="number"
                      value={newRates.milkmanRate}
                      onChange={(e) => setNewRates({...newRates, milkmanRate: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Rate charged to customers (₹/liter)</Label>
                    <Input
                      type="number"
                      value={newRates.buyerRate}
                      onChange={(e) => setNewRates({...newRates, buyerRate: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Profit per liter: ₹{newRates.buyerRate - newRates.milkmanRate}
                  </p>
                </div>
                <Button 
                  onClick={handleUpdateRates}
                  disabled={newRates.milkmanRate <= 0 || newRates.buyerRate <= 0 || newRates.buyerRate <= newRates.milkmanRate}
                >
                  Update Rates
                </Button>
                {newRates.buyerRate <= newRates.milkmanRate && (
                  <p className="text-sm text-red-600">Customer rate must be higher than farmer rate to ensure profit</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Management</CardTitle>
                <CardDescription>Pay milkmen for supplied milk</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {milkmenWithPositiveDues.map((milkman: Milkman) => (
                    <div key={milkman.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium">{milkman.name}</h3>
                          <p className="text-sm text-gray-600">{milkman.location} • {milkman.phone}</p>
                          <p className="text-sm">
                            Account: {milkman.accountNumber ? `****${milkman.accountNumber.slice(-4)}` : 'Not Provided'}
                            {milkman.ifscCode && ` • IFSC: ${milkman.ifscCode}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">₹{milkman.totalDue}</p>
                          <p className="text-sm text-gray-600">Total Due</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          onClick={() => onPayMilkman(milkman.id, milkman.totalDue || 0)}
                          disabled={!milkman.accountNumber || !milkman.ifscCode}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Pay Now
                        </Button>
                        {(!milkman.accountNumber || !milkman.ifscCode) && (
                          <p className="text-sm text-orange-600 flex items-center">
                            ⚠️ Bank details missing
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  {milkmenWithPositiveDues.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No pending payments</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-medium text-green-800">Total Revenue</h3>
                    <p className="text-2xl font-bold text-green-600">₹{totalRevenue + totalProductSales}</p>
                    <p className="text-sm text-green-600">Milk + Products</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h3 className="font-medium text-red-800">Total Expenses</h3>
                    <p className="text-2xl font-bold text-red-600">₹{totalExpenses}</p>
                    <p className="text-sm text-red-600">Milk purchases</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-800">Net Profit</h3>
                    <p className="text-2xl font-bold text-blue-600">₹{totalRevenue + totalProductSales - totalExpenses}</p>
                    <p className="text-sm text-blue-600">Overall profit</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium mb-4">Customer Dues</h3>
                  <div className="space-y-2">
                    {Object.values(buyerDues).map(buyer => (
                      <div key={buyer.userId} className="flex justify-between p-2 bg-gray-50 rounded">
                        <span>{buyer.userName}</span>
                        <span className="font-bold">₹{buyer.due}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Registered Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user: User) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{user.username}</h3>
                          <Badge variant={user.role === 'buyer' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        {user.location && <p className="text-sm text-gray-500">{user.location}</p>}
                        {user.role === 'buyer' && (
                          <p className="text-sm text-blue-600">
                            Total Due: ₹{buyerDues[user.username]?.due || 0}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">User ID: {user.id}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin-access" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Admin Access Management</CardTitle>
                <CardDescription>Grant admin access to trusted users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h3 className="font-medium text-yellow-800 mb-2">⚠️ Important Notice</h3>
                  <p className="text-sm text-yellow-700">
                    Only grant admin access to trusted individuals. Admin users will have full control over the dairy management system.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Grant Admin Access</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label>User Email</Label>
                      <Input
                        value={adminAccessForm.email}
                        onChange={(e) => setAdminAccessForm({...adminAccessForm, email: e.target.value})}
                        placeholder="Enter user email address"
                        type="email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Reason for Admin Access</Label>
                      <Input
                        value={adminAccessForm.reason}
                        onChange={(e) => setAdminAccessForm({...adminAccessForm, reason: e.target.value})}
                        placeholder="e.g., Co-owner, Manager, Trusted employee"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={handleGrantAdminAccess}
                    disabled={!adminAccessForm.email || !adminAccessForm.reason}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Grant Admin Access
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Current Admins</h3>
                  <div className="space-y-2">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">manojs030504@gmail.com</h4>
                          <p className="text-sm text-gray-600">Primary Admin • Owner</p>
                        </div>
                        <Badge>Primary</Badge>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">madhusudhanhk321@gmail.com</h4>
                          <p className="text-sm text-gray-600">Secondary Admin</p>
                        </div>
                        <Badge variant="secondary">Admin</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-medium text-blue-800 mb-2">Admin Permissions Include:</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Manage milk rates and pricing</li>
                    <li>• Approve/reject milkman applications</li>
                    <li>• Process payments to milkmen</li>
                    <li>• Manage product inventory</li>
                    <li>• View financial reports and user data</li>
                    <li>• Grant admin access to other users</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Admin Profile</CardTitle>
                <CardDescription>Manage your dairy information and payment details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={adminProfile.name}
                      onChange={(e) => setAdminProfile({...adminProfile, name: e.target.value})}
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={adminProfile.email}
                      onChange={(e) => setAdminProfile({...adminProfile, email: e.target.value})}
                      placeholder="Your email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={adminProfile.phone}
                      onChange={(e) => setAdminProfile({...adminProfile, phone: e.target.value})}
                      placeholder="Your phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Dairy Name</Label>
                    <Input
                      value={adminProfile.dairyName}
                      onChange={(e) => setAdminProfile({...adminProfile, dairyName: e.target.value})}
                      placeholder="Name of your dairy"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Bank Account Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Account Number</Label>
                      <Input
                        value={adminProfile.accountNumber}
                        onChange={(e) => setAdminProfile({...adminProfile, accountNumber: e.target.value})}
                        placeholder="Bank account number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>IFSC Code</Label>
                      <Input
                        value={adminProfile.ifscCode}
                        onChange={(e) => setAdminProfile({...adminProfile, ifscCode: e.target.value})}
                        placeholder="IFSC code"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input
                    value={adminProfile.address}
                    onChange={(e) => setAdminProfile({...adminProfile, address: e.target.value})}
                    placeholder="Dairy address"
                  />
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

export default AdminDashboard;
