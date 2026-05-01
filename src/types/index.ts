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
