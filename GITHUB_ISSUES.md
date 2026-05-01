# GitHub Issues for HMS Project Implementation

This document contains a structured list of issues to be copied into GitHub for project tracking.

---

### Issue 1: [Control] Implement Room State Machine & Booking Logic
**Label:** `Logic`, `BCE-Control`, `Priority: High`
**Module:** Booking Logic
**Description:**
Refine the `bookingService.ts` to implement full state management for room bookings. 
**Tasks:**
- Implement logic to update room status from `Ready` to `Occupied` upon successful booking.
- Add guard clauses for date range validation (Check-out must be after Check-in).
- Create an internal Array-based "database" to persist bookings during the session.
**Files:** [src/services/bookingService.ts](src/services/bookingService.ts)

---

### Issue 2: [Control/Boundary] Develop Billing Engine & Calculation Logic
**Label:** `Logic`, `Finance`, `BCE-Control`
**Module:** Billing System
**Description:**
Create a robust billing service to replace hardcoded values in the Checkout component.
**Tasks:**
- Create `src/services/billingService.ts` to handle dynamic pricing.
- Implement Calculation Logic: `(RoomRate * Nights) + VAT(7%)`.
- Integrate the calculation engine into the Checkout UI.
**Files:** `src/services/billingService.ts`, [src/components/Checkout.tsx](src/components/Checkout.tsx)

---

### Issue 3: [Boundary] Finalize Analytics Dashboard & Real-time Stats
**Label:** `UI/UX`, `BCE-Boundary`, `Lucide`
**Module:** UI/Dashboard
**Description:**
Connect the dashboard KPI cards to the application state so they reflect real-time data.
**Tasks:**
- Dynamically update "Rooms Available" count based on the room state machine.
- Integrate "Today's Overview" table with real check-in/check-out data.
- Ensure all charts/stats reflect the current session state.
**Files:** [src/components/Dashboard.tsx](src/components/Dashboard.tsx)

---

### Issue 4: [Boundary/UX] Implement Responsive Layout & Navigation Flow
**Label:** `UI/UX`, `Responsiveness`
**Module:** UI/Dashboard
**Description:**
Ensure the "Dark Slate" dashboard theme is fully responsive and the user flow is seamless.
**Tasks:**
- Optimize `Layout.tsx` for mobile and tablet viewport widths.
- Implement smooth transitions between Dashboard, Booking Form, and Checkout views.
- Add "Empty States" for tables with no data to improve UX.
**Files:** [src/components/Layout.tsx](src/components/Layout.tsx), [src/App.tsx](src/App.tsx)

---

### Issue 5: [Integrity] PDPA Compliance & Multi-format ID Masking
**Label:** `Security`, `Utility`
**Module:** Booking Logic / Security
**Description:**
Extend the existing masking logic in `bookingService.ts` to ensure full compliance with PDPA guidelines.
**Tasks:**
- Update `maskGuestId` to handle different ID types (Passport and National ID).
- Ensure masked IDs are used throughout the UI logs and dashboard tables.
- Add unit tests (or guard clauses) to verify sensitive data is never exposed in raw format.
**Files:** [src/services/bookingService.ts](src/services/bookingService.ts), [src/components/BookingForm.tsx](src/components/BookingForm.tsx)
