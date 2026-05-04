import { useState } from 'react'
import { Layout } from './components/Layout'
import { Dashboard } from './components/Dashboard'
import { BookingForm } from './components/BookingForm'
import { Checkout } from './components/Checkout'
import { Login } from './components/Login'
import './tailwind.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [availableRooms, setAvailableRooms] = useState(18);
  const [page, setPage] = useState("dashboard");
  const handleBooking = () => {
  setAvailableRooms(prev => (prev > 0 ? prev - 1 : 0));
  };

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <Layout setPage={setPage}>
      <div className="space-y-12 pb-12">
        {page === "dashboard" && (
          <Dashboard availableRooms={availableRooms} setPage={setPage} />
        )}
        {page === "booking" && (
           <BookingForm onBook={handleBooking} />
        )}
        {page === "checkout" && <Checkout />}
        {page === "checkin" && <Checkout />}
      </div>
    </Layout>
  )
}

export default App
