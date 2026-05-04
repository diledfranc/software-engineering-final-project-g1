import { useState } from 'react'
import { Layout } from './components/Layout'
import { Dashboard } from './components/Dashboard'
import { BookingForm } from './components/BookingForm'
import Checkout from './components/Checkout'
import { CheckIn } from './components/CheckIn'
import Billing from './components/Billing'
import { Housekeeping } from './components/Housekeeping'
import { RoomInventory } from './components/RoomInventory'
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
    <Layout setPage={setPage} activePage={page}>
      <div className="space-y-12 pb-12">
        {page === "dashboard" && (
          <Dashboard availableRooms={availableRooms} setPage={setPage} />
        )}
        {page === "booking" && (
           <BookingForm onBook={handleBooking} />
        )}
        {page === "checkin" && (
          <CheckIn />
        )}
        {page === "checkout" && (
          <Checkout />
        )}
        {page === "billing" && (
          <Billing />
        )}
        {page === "rooms" && (
          <RoomInventory />
        )}
        {page === "housekeeping" && (
          <Housekeeping />
        )}
        {/* Modules with placeholder UI for now */}
        {['reports', 'users', 'settings'].includes(page) && (
          <div className="p-8 bg-white rounded-xl shadow-sm border border-slate-200 max-w-5xl mx-auto">
            <h2 className="text-xl font-bold mb-4 capitalize">{page} Module</h2>
            <p className="text-slate-500 text-sm italic font-medium">BCE Controller Layer: {page}Controller pending runtime binding.</p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default App
