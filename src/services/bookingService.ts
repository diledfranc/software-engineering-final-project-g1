import type { Booking, BookingInput, Room, RoomStatus } from "../types/hotelTypes";

let rooms: Room[] = [
  {
    id: 1,
    roomNumber: "101",
    roomType: "Standard",
    rate: 1200,
    status: "Ready",
  },
  {
    id: 2,
    roomNumber: "102",
    roomType: "Standard",
    rate: 1200,
    status: "Ready",
  },
  {
    id: 3,
    roomNumber: "201",
    roomType: "Deluxe",
    rate: 1800,
    status: "Ready",
  },
  {
    id: 4,
    roomNumber: "202",
    roomType: "Deluxe",
    rate: 1800,
    status: "Maintenance",
  },
];

let bookings: Booking[] = [];

export function getRooms(): Room[] {
  return rooms;
}

export function getBookings(): Booking[] {
  return bookings;
}

export function updateRoomStatus(roomId: number, newStatus: RoomStatus): void {
  rooms = rooms.map((room) =>
    room.id === roomId ? { ...room, status: newStatus } : room
  );
}

export function validateBookingDates(checkInDate: string, checkOutDate: string): void {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  if (!checkInDate || !checkOutDate) {
    throw new Error("Please select both check-in and check-out dates.");
  }

  if (checkOut <= checkIn) {
    throw new Error("Check-out date must be after check-in date.");
  }
}

export function maskGuestId(guestId: string): string {
  const cleanedId = guestId.trim();

  const isThaiNationalId = /^\d{13}$/.test(cleanedId);
  const isPassport = /^[A-Z0-9]{6,9}$/i.test(cleanedId);

  if (isThaiNationalId) {
    return `*********${cleanedId.slice(-4)}`;
  }

  if (isPassport) {
    return `${cleanedId.slice(0, 2).toUpperCase()}****${cleanedId
      .slice(-2)
      .toUpperCase()}`;
  }

  return "****";
}

export function createBooking(input: BookingInput): Booking {
  // 1. Validate dates
  validateBookingDates(input.checkInDate, input.checkOutDate);

  // 2. Check if room exists
  const room = rooms.find((r) => r.id === input.roomId);
  if (!room) {
    throw new Error("Selected room does not exist.");
  }

  // 3. Check if room is available
  if (room.status !== "Ready") {
  throw new Error(
    "This room is currently not available. Please select another room."
  );
}

const overlappingBooking = bookings.find(
  (booking) =>
    booking.roomId === input.roomId &&
    booking.status === "Confirmed" &&
    !(
      input.checkOutDate <= booking.checkInDate ||
      input.checkInDate >= booking.checkOutDate
    )
);

if (overlappingBooking) {
  throw new Error("This room is already booked for the selected dates.");
}

  // 4. Create booking object
  const newBooking: Booking = {
    id: bookings.length + 1,
    guestName: input.guestName,
    guestId: maskGuestId(input.guestId),
    roomId: input.roomId,
    checkInDate: input.checkInDate,
    checkOutDate: input.checkOutDate,
    status: "Confirmed",
  };

  // 5. Save booking
  bookings.push(newBooking);

  // 6. Update room status → Occupied
updateRoomStatus(input.roomId, "Occupied");

console.log(
  `Audit Log: Booking #${newBooking.id} created for room ${input.roomId}`
);

return newBooking;

}

export function getActiveBookingByRoomId(roomId: number): Booking | undefined {
  return bookings.find(
    (booking) => booking.roomId === roomId && booking.status === "Confirmed"
  );
}