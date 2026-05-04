import { getRooms } from "../services/bookingService";

function DashboardStats() {
  const rooms = getRooms();

  const totalRooms = rooms.length;
  const availableRooms = rooms.filter((room) => room.status === "Ready").length;
  const occupiedRooms = rooms.filter((room) => room.status === "Occupied").length;

  const cardStyle = {
    backgroundColor: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "16px",
        marginBottom: "24px",
      }}
    >
      <div style={cardStyle}>
        <p style={{ color: "#94a3b8" }}>Total Rooms</p>
        <h2 style={{ fontSize: "32px" }}>{totalRooms}</h2>
      </div>

      <div style={cardStyle}>
        <p style={{ color: "#94a3b8" }}>Available Rooms</p>
        <h2 style={{ fontSize: "32px", color: "#22c55e" }}>
          {availableRooms}
        </h2>
      </div>

      <div style={cardStyle}>
        <p style={{ color: "#94a3b8" }}>Occupied Rooms</p>
        <h2 style={{ fontSize: "32px", color: "#ef4444" }}>
          {occupiedRooms}
        </h2>
      </div>
    </div>
  );
}

export default DashboardStats;