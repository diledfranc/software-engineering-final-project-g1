import { useState } from 'react'
import { Layout } from './components/Layout'
import { Dashboard } from './components/Dashboard'
import { BookingForm } from './components/BookingForm'
import { Checkout } from './components/Checkout'
import { Login } from './components/Login'
import './tailwind.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <Layout>
      <div className="space-y-12 pb-12">
        <Dashboard />
        <div className="grid grid-cols-1 gap-12 max-w-5xl mx-auto">
          <BookingForm />
          <Checkout />
        </div>
      </div>
    </Layout>
  )
}

export default App
