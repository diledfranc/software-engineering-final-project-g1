import { useState } from "react";
import BookingForm from "./components/BookingForm";
import RoomStatusPanel from "./components/RoomStatusPanel";
import DashboardStats from "./components/DashboardStats";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  function handleBookingCreated() {
    setRefreshKey((oldValue) => oldValue + 1);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        color: "#e5e7eb",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <header style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "42px", marginBottom: "8px" }}>
            Hotel Management System
          </h1>

          <p style={{ color: "#94a3b8", fontSize: "16px" }}>
            Booking Logic & Real-Time Dashboard
          </p>
        </header>

        <div key={refreshKey}>
          <DashboardStats />
        </div>

        <BookingForm onBookingCreated={handleBookingCreated} />

        <div key={`rooms-${refreshKey}`}>
          <RoomStatusPanel />
        </div>
      </div>
    </main>
  );
}

export default App;