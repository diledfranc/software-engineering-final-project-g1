import { BookingForm } from './components/BookingForm'
import './tailwind.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Hotel Management System 
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Group 1 - Saraburi Modelling Challenge
          </p>
        </div>
        
        <BookingForm />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg p-5 border-l-4 border-blue-500">
            <h3 className="text-lg font-medium text-gray-900">Branching Strategy</h3>
            <p className="mt-1 text-sm text-gray-500">
              Daniil: `feat/booking-logic`<br/>
              Daniel: `feat/billing-system`<br/>
              Andrew: `feat/ui-dashboard`
            </p>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg p-5 border-l-4 border-green-500">
            <h3 className="text-lg font-medium text-gray-900">BCE Architecture</h3>
            <p className="mt-1 text-sm text-gray-500">
              Boundary: Components<br/>
              Control: Services<br/>
              Entity: Types/Interfaces
            </p>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg p-5 border-l-4 border-yellow-500">
            <h3 className="text-lg font-medium text-gray-900">Compliance</h3>
            <p className="mt-1 text-sm text-gray-500">
              PDPA Masking active<br/>
              Guard Clauses implemented<br/>
              Audit Logs simulated
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
