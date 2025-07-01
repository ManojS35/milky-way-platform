
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Smartphone, Building2, X } from 'lucide-react';

interface PaymentOptionsProps {
  amount: number;
  customerName?: string;
  orderId?: number;
  onPayment?: (amount: number, method: string, transactionId: string) => void;
  onPaymentComplete?: (paymentMethod: string, transactionId: string) => void;
  onCancel?: () => void;
}

const PaymentOptions = ({ 
  amount, 
  customerName, 
  orderId, 
  onPayment, 
  onPaymentComplete, 
  onCancel 
}: PaymentOptionsProps) => {
  const [activeTab, setActiveTab] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    ifscCode: ''
  });

  const handleUPIPayment = () => {
    if (!upiId) return;
    const transactionId = `UPI${Date.now()}`;
    if (onPayment) {
      onPayment(amount, 'UPI', transactionId);
    } else if (onPaymentComplete) {
      onPaymentComplete('UPI', transactionId);
    }
  };

  const handleCardPayment = () => {
    if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) return;
    const transactionId = `CARD${Date.now()}`;
    if (onPayment) {
      onPayment(amount, 'Card', transactionId);
    } else if (onPaymentComplete) {
      onPaymentComplete('Card', transactionId);
    }
  };

  const handleBankTransfer = () => {
    if (!bankDetails.accountNumber || !bankDetails.ifscCode) return;
    const transactionId = `BANK${Date.now()}`;
    if (onPayment) {
      onPayment(amount, 'Bank Transfer', transactionId);
    } else if (onPaymentComplete) {
      onPaymentComplete('Bank Transfer', transactionId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Payment {orderId ? `for Order #${orderId}` : ''}</CardTitle>
            <CardDescription>
              {customerName && <span>Customer: {customerName}<br/></span>}
              Total Amount: <span className="font-bold text-green-600">₹{amount}</span>
            </CardDescription>
          </div>
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upi" className="flex items-center gap-1">
                <Smartphone className="w-4 h-4" />
                UPI
              </TabsTrigger>
              <TabsTrigger value="card" className="flex items-center gap-1">
                <CreditCard className="w-4 h-4" />
                Card
              </TabsTrigger>
              <TabsTrigger value="bank" className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                Bank
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upi" className="space-y-4">
              <div className="space-y-2">
                <Label>UPI ID</Label>
                <Input
                  type="text"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUPIPayment} className="flex-1" disabled={!upiId}>
                  Pay ₹{amount}
                </Button>
                {onCancel && (
                  <Button variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                )}
              </div>
            </TabsContent>

            <TabsContent value="card" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Card Number</Label>
                  <Input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Expiry</Label>
                    <Input
                      type="text"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CVV</Label>
                    <Input
                      type="text"
                      placeholder="123"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Cardholder Name</Label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleCardPayment} 
                  className="flex-1"
                  disabled={!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name}
                >
                  Pay ₹{amount}
                </Button>
                {onCancel && (
                  <Button variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                )}
              </div>
            </TabsContent>

            <TabsContent value="bank" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Account Number</Label>
                  <Input
                    type="text"
                    placeholder="Your account number"
                    value={bankDetails.accountNumber}
                    onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>IFSC Code</Label>
                  <Input
                    type="text"
                    placeholder="IFSC Code"
                    value={bankDetails.ifscCode}
                    onChange={(e) => setBankDetails({...bankDetails, ifscCode: e.target.value})}
                  />
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Admin Bank Details:<br/>
                    Acc: 1234567890<br/>
                    IFSC: ADMIN001<br/>
                    Transfer ₹{amount} and submit details
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleBankTransfer} 
                  className="flex-1"
                  disabled={!bankDetails.accountNumber || !bankDetails.ifscCode}
                >
                  Confirm Transfer
                </Button>
                {onCancel && (
                  <Button variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentOptions;
