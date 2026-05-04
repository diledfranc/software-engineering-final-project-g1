import { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { BookingForm } from './components/BookingForm';
import { Login } from './components/Login';

// Placeholder components for modules being integrated
const CheckIn = () => <div className="p-8 bg-white rounded-xl shadow-sm border border-slate-200">
  <h2 className="text-xl font-bold mb-4">Guest Check-In</h2>
  <p className="text-slate-500">Scan QR or enter Booking ID to proceed with room assignment.</p>
</div>;

const Checkout = () => <div className="p-8 bg-white rounded-xl shadow-sm border border-slate-200">
  <h2 className="text-xl font-bold mb-4">Guest Check-Out & Billing</h2>
  <p className="text-slate-500">Generate final invoice and process payment transactions.</p>
</div>;

const RoomInventory = () => <div className="p-8 bg-white rounded-xl shadow-sm border border-slate-200">
  <h2 className="text-xl font-bold mb-4">Room Management</h2>
  <p className="text-slate-500">Real-time status of all 50 hotel rooms.</p>
</div>;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={setActiveTab} 
      onLogout={() => setIsLoggedIn(false)}
    >
      {activeTab === 'dashboard' && <Dashboard setPage={setActiveTab} />}
      {activeTab === 'bookings' && <BookingForm />}
      {activeTab === 'checkin' && <CheckIn />}
      {activeTab === 'checkout' && <Checkout />}
      {activeTab === 'rooms' && <RoomInventory />}
      
      {/* Other integrated sections */}
      {['billing', 'housekeeping', 'reports', 'users', 'settings'].includes(activeTab) && (
        <div className="p-8 bg-white rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold mb-4 capitalize">{activeTab} Module</h2>
          <p className="text-slate-500 text-sm italic font-medium">BCE Controller Layer: {activeTab}Controller pending runtime binding.</p>
        </div>
      )}
    </Layout>
  );
}

export default App;
