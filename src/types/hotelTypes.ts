export type RoomStatus = "Ready" | "Occupied" | "Needs Cleaning" | "Maintenance";

export interface Room {
  id: number;
  roomNumber: string;
  roomType: string;
  rate: number;
  status: RoomStatus;
}

export interface Booking {
  id: number;
  guestName: string;
  guestId: string;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  status: "Confirmed" | "Checked In" | "Checked Out" | "Cancelled";
}

export interface BookingInput {
  guestName: string;
  guestId: string;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
}