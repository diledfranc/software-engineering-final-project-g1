# HMS Team Assignment & Implementation Guide

This document outlines the tasks for each team member based on the current BCE (Boundary-Control-Entity) architecture.

## 🛠️ Tech Stack
- **Frontend:** React 18, Vite, TypeScript
- **Styling:** Tailwind CSS v4
- **Architecture:** BCE Pattern (Boundary: Components, Control: Services, Entity: Types)

---

## 📋 Module Assignments

### 1. Booking Logic & Room Management (`feat/booking-logic`)
**Responsible:** Daniil
**Target Files:** 
- [src/services/bookingService.ts](src/services/bookingService.ts)
- [src/components/BookingForm.tsx](src/components/BookingForm.tsx)

**Tasks:**
- [ ] **State Machine Logic:** Implement logic to update room status from `Ready` to `Occupied` upon successful booking.
- [ ] **Extended Validation:** Add guard clauses for date range validation (Check-out must be after Check-in).
- [ ] **PDPA Compliance:** Refine the `maskGuestId` utility to handle different ID formats (Passport vs National ID).
- [ ] **Persistence Mock:** Create an `Array` based "database" in the service to store bookings during the session.

### 2. Billing & Checkout System (`feat/billing-system`)
**Responsible:** Andrew
**Target Files:** 
- [src/components/Checkout.tsx](src/components/Checkout.tsx)
- `src/services/billingService.ts` (To be created)

**Tasks:**
- [ ] **Dynamic Calculation:** Replace hardcoded prices with a calculation engine: `(RoomRate * Nights) + VAT(7%)`.
- [ ] **Service Refactoring:** Move calculation logic from the UI component to a new `billingService.ts` (Control Layer).
- [ ] **Invoice Generation:** Implement the "Print Invoice" button functionality (can be a simple `window.print()` or a styled PDF view).
- [ ] **Payment Integration:** Add a "Success" state after clicking "Pay Now".

### 3. UI/UX & Dashboard Analytics (`feat/ui-dashboard`)
**Responsible:** Daniel
**Target Files:** 
- [src/components/Dashboard.tsx](src/components/Dashboard.tsx)
- [src/components/Layout.tsx](src/components/Layout.tsx)
- [src/App.tsx](src/App.tsx)

**Tasks:**
- [ ] **Real-time Stats:** Connect the `Dashboard` cards to the `bookingService` so "Rooms Available" decrements when a booking is made.
- [ ] **Navigation Flow:** Ensure smooth transitions between Dashboard, Booking, and Checkout views.
- [ ] **Responsive Design:** Verify that the "Dark Slate" dashboard layout works on tablet and mobile resolutions.
- [ ] **Empty States:** Add "No Pending Checkouts" illustrations for when the table is empty.

---

## 🚀 Getting Started
1. `git fetch origin`
2. `git checkout [your-assigned-branch]`
3. `npm install`
4. `npm run dev`

