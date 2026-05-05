export interface Room {
  id: string;
  roomNumber: string;
  type: 'Single' | 'Double' | 'Suite';
  status: 'Ready' | 'Dirty' | 'Occupied' | 'Maintenance';
  price: number;
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface Booking {
  id: string;
  guestId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  status: 'Confirmed' | 'CheckedIn' | 'CheckedOut' | 'Cancelled';
  totalAmount: number;
}

export interface Refund {
  id: string;
  bookingId: string;
  amount: number;
  reason: string;
  processedAt: string;
  status: 'Pending' | 'Completed' | 'Rejected';
}

export interface AuditLog {
  id: string;
  action: string;
  userId: string;
  entityType: string;
  entityId: string;
  oldValue?: any;
  newValue?: any;
  timestamp: string;
}

export interface HousekeepingTask {
  id: string;
  roomId: string;
  assignedTo?: string;
  status: 'Pending' | 'InProgress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  notes?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  method: 'Cash' | 'CreditCard' | 'Transfer';
  status: 'Paid' | 'Pending' | 'Failed';
  transactionId?: string;
  createdAt: string;
}
