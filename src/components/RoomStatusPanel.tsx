import { getActiveBookingByRoomId, getRooms } from "../services/bookingService";

function RoomStatusPanel() {
  const rooms = getRooms();

  return (
    <div
      style={{
        marginTop: "24px",
        backgroundColor: "#1e293b",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
      }}
    >
      <h2 style={{ marginBottom: "16px", fontSize: "22px" }}>Room Status</h2>

      <div
        style={{
          display: "grid",
          gap: "12px",
        }}
      >
        {rooms.map((room) => {
          const activeBooking = getActiveBookingByRoomId(room.id);

          return (
            <div
              key={room.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px",
                borderRadius: "10px",
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
              }}
            >
              <div>
                <h3 style={{ marginBottom: "4px" }}>Room {room.roomNumber}</h3>
                <p style={{ color: "#94a3b8" }}>{room.roomType}</p>
              </div>

              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    fontWeight: "bold",
                    color:
                      room.status === "Ready"
                        ? "#22c55e"
                        : room.status === "Occupied"
                        ? "#ef4444"
                        : "#facc15",
                  }}
                >
                  {room.status}
                </p>

                {room.status === "Occupied" && activeBooking && (
                  <p style={{ color: "#94a3b8", fontSize: "14px" }}>
                    Until: {activeBooking.checkOutDate}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RoomStatusPanel;