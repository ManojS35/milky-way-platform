
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

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
  role: string;
}

interface DailyRecordCalendarProps {
  dailyRecords: DailyRecord[];
  users: User[];
  milkmanRate: number;
  buyerRate: number;
  onAddRecord: (userId: number, userName: string, userRole: 'buyer' | 'milkman', date: string, quantity: number, type: 'purchase' | 'supply') => void;
}

const DailyRecordCalendar = ({ dailyRecords, users, milkmanRate, buyerRate, onAddRecord }: DailyRecordCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [recordType, setRecordType] = useState<'purchase' | 'supply'>('purchase');

  const selectedDateString = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const recordsForSelectedDate = dailyRecords.filter(record => record.date === selectedDateString);

  const handleAddRecord = () => {
    if (!selectedUser || !selectedDate || quantity <= 0) return;

    const user = users.find(u => u.username === selectedUser);
    if (!user) return;

    const userRole = user.role as 'buyer' | 'milkman';
    const type = user.role === 'buyer' ? 'purchase' : 'supply';

    onAddRecord(user.id, user.username, userRole, selectedDateString, quantity, type);
    setQuantity(1);
    setSelectedUser('');
  };

  const getTotalForDate = (date: string, type: 'purchase' | 'supply') => {
    return dailyRecords
      .filter(record => record.date === date && record.type === type)
      .reduce((sum, record) => sum + record.quantity, 0);
  };

  const getDatesWithRecords = () => {
    return dailyRecords.map(record => new Date(record.date));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Daily Records Calendar
          </CardTitle>
          <CardDescription>Track daily milk purchases and supplies</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            modifiers={{
              hasRecords: getDatesWithRecords()
            }}
            modifiersStyles={{
              hasRecords: { backgroundColor: '#dbeafe', fontWeight: 'bold' }
            }}
          />
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Add Daily Record</CardTitle>
            <CardDescription>
              Selected Date: {selectedDate ? format(selectedDate, 'PPP') : 'No date selected'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select User</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a user" />
                </SelectTrigger>
                <SelectContent>
                  {users.filter(u => u.role !== 'admin').map(user => (
                    <SelectItem key={user.id} value={user.username}>
                      {user.username} ({user.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quantity (liters)</Label>
              <Input
                type="number"
                min="0.5"
                step="0.5"
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Rate: ₹{selectedUser && users.find(u => u.username === selectedUser)?.role === 'buyer' ? buyerRate : milkmanRate}/liter
              </p>
              <p className="font-bold">
                Total: ₹{quantity * (selectedUser && users.find(u => u.username === selectedUser)?.role === 'buyer' ? buyerRate : milkmanRate)}
              </p>
            </div>

            <Button 
              onClick={handleAddRecord} 
              className="w-full"
              disabled={!selectedUser || !selectedDate || quantity <= 0}
            >
              Add Record
            </Button>
          </CardContent>
        </Card>

        {selectedDate && (
          <Card>
            <CardHeader>
              <CardTitle>Records for {format(selectedDate, 'PPP')}</CardTitle>
            </CardHeader>
            <CardContent>
              {recordsForSelectedDate.length > 0 ? (
                <div className="space-y-3">
                  {recordsForSelectedDate.map(record => (
                    <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{record.userName}</p>
                        <p className="text-sm text-gray-600">
                          {record.quantity}L • ₹{record.rate}/L
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={record.type === 'purchase' ? 'default' : 'secondary'}>
                          {record.type === 'purchase' ? 'Purchase' : 'Supply'}
                        </Badge>
                        <p className="font-bold">₹{record.amount}</p>
                      </div>
                    </div>
                  ))}
                  <div className="pt-3 border-t">
                    <div className="flex justify-between text-sm">
                      <span>Total Purchases: {getTotalForDate(selectedDateString, 'purchase')}L</span>
                      <span>Total Supplies: {getTotalForDate(selectedDateString, 'supply')}L</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No records for this date</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DailyRecordCalendar;
