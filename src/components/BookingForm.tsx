import { useState } from "react";
import type { BookingInput } from "../types/hotelTypes";
import { createBooking, getRooms } from "../services/bookingService";

interface BookingFormProps {
  onBookingCreated: () => void;
}

function BookingForm({ onBookingCreated }: BookingFormProps) {
  const rooms = getRooms();

  const [formData, setFormData] = useState<BookingInput>({
    guestName: "",
    guestId: "",
    roomId: 1,
    checkInDate: "",
    checkOutDate: "",
  });

  const [message, setMessage] = useState("");

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: name === "roomId" ? Number(value) : value,
    });
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      const booking = createBooking(formData);

      setMessage(
        `Booking confirmed for ${booking.guestName}. Guest ID saved as ${booking.guestId}.`
      );

      onBookingCreated();

      setFormData({
        guestName: "",
        guestId: "",
        roomId: 1,
        checkInDate: "",
        checkOutDate: "",
      });
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage(
  "We are sorry, the system is temporarily unavailable. Please try again."
);
      }
    }
  }

    const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #475569",
  backgroundColor: "#0f172a",
  color: "#e5e7eb",
    };

 return (
  <div
    style={{
      backgroundColor: "#1e293b",
      padding: "24px",
      borderRadius: "12px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
    }}
  >
    <h2 style={{ marginBottom: "20px", fontSize: "22px" }}>
      New Booking
    </h2>

    <form
      onSubmit={handleSubmit}
      style={{
        display: "grid",
        gap: "16px",
      }}
    >
      <div>
        <label style={{ display: "block", marginBottom: "4px" }}>
          Guest Name
        </label>
        <input
          type="text"
          name="guestName"
          value={formData.guestName}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "4px" }}>
          Guest ID / Passport
        </label>
        <input
          type="text"
          name="guestId"
          value={formData.guestId}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "4px" }}>
          Room
        </label>
        <select
          name="roomId"
          value={formData.roomId}
          onChange={handleChange}
          style={inputStyle}
        >
          {rooms.map((room) => (
            <option
              key={room.id}
              value={room.id}
              disabled={room.status !== "Ready"}
            >
              Room {room.roomNumber} - {room.roomType} - {room.status}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            Check-in Date
          </label>
          <input
            type="date"
            name="checkInDate"
            value={formData.checkInDate}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            Check-out Date
          </label>
          <input
            type="date"
            name="checkOutDate"
            value={formData.checkOutDate}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>
      </div>

      <button
        type="submit"
        style={{
          marginTop: "10px",
          padding: "12px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#3b82f6",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Create Booking
      </button>
    </form>

    {message && (
      <p
        style={{
          marginTop: "16px",
          padding: "10px",
          backgroundColor: "#334155",
          borderRadius: "6px",
        }}
      >
        {message}
      </p>
    )}
  </div>
);
}
export default BookingForm;

