# Hyperlocal Construction Marketplace
## "Antigravity" Structural Blueprint Edition

A full-stack, secure, responsive **Hyperlocal Construction Marketplace** built with **React (Vite)**, **Node.js / Express**, and **MongoDB (Mongoose)**, following the **"Antigravity / Anti-Design"** structural framework extracted from the Stitch MCP canvas.

---

## 1. Design System & Visual Style ("Antigravity" Blueprint)
- **Digital Blueprint Aesthetic**: Emulates an architectural drafting table with crisp 1px modular grid dividers (`#E2DFD8`).
- **Warm Stone Canvas**: Base canvas uses soft stone off-white (`#F9F8F6`), strictly avoiding cold stark whites.
- **Architectural Typography**: Numeric figures and headers set in `Space Grotesk` / `Outfit`; data labels and system copy in `Plus Jakarta Sans`.
- **Engineering Corners**: Sharp border-radii (strictly between 0px and 4px).
- **Anti-Design Shadowless Depth**: Zero blurry drop-shadows or glowing glassmorphism; depth is communicated purely through value contrast and 1px border lines.

---

## 2. Core Architecture & Feature Matrix

### Contractor Marketplace (Client Dashboard)
- **HTML5 Geolocation API**: Non-intrusive modal requesting browser coordinates with strict privacy guarantees.
- **Dynamic Fallback UI**: Immediate fallback selector for manual City or 6-digit Pincode input with quick preset hubs (Mumbai, Pune, Delhi NCR, Bengaluru, etc.).
- **Haversine Distance Engine**: Programmatically slices and calculates direct distance vectors to nearby depots in kilometers.
- **Engineering Sorting Framework**:
  - `Closest Distance` (Haversine spatial ranking)
  - `Lowest Price First` (Instant unit rate comparison)
  - `Highest Rating & Reviews` (Verified contractor audits)
  - `Active Flash Deals & Bulk Offers` (Highlighting promotional discounts)
- **Material Categories**: Cement (PPC/OPC 53G), Steel / TMT Saria (Fe-550D), Bricks & AAC Blocks, M-Sand & River Sand, Aggregate (10mm/20mm).
- **Time-Stamp Synchronization**: Prominent verification badges:
  - Fresh: `Verified Today at [Time]` (Green)
  - Out of sync (>24h): `Prices last updated [X] days ago` (Warning badge)
- **Rate Comparison Matrix**: Side-by-side benchmark table comparing all suppliers for a selected material.
- **Direct RFQ Dispatch**: Contractor quote request modal with site address, quantity, and grade specs.

### Supplier Portal & Daily Price Overwrite Engine
- **Secure Authentication**: Registration and login connected to MongoDB clusters.
- **Operational Price Sheet**: High-speed spreadsheet-like interface allowing suppliers to overwrite daily prices for core materials, update stock statuses, and toggle flash deal discounts in real-time.
- **One-Click Synchronization**: Instantly syncs all material rates and refreshes the verification timestamp to "Verified Today".

---

## 3. System Security Audit & Mitigation

| Vulnerability Vector | Implemented Mitigation | Verification Status |
| :--- | :--- | :--- |
| **Password Storage** | Bcrypt with minimum 10 salt rounds before persisting to MongoDB. Raw strings never stored. | Verified (`$2a$10$...`) |
| **Session Hardening** | Stateless JSON Web Tokens (JWT) with bearer authorization headers. | Verified |
| **NoSQL Injection** | Recursive input sanitization middleware stripping `$` and `.` operators combined with Zod schema validation. | Verified (Attacks rejected with 400) |
| **Cross-Site Scripting (XSS)** | React JSX escaping and sanitized text fields preventing script injection. | Verified |
| **Telemetry Privacy** | Client GPS coordinates are transient in-memory only and never logged or written to user history. | Verified |
| **Brute-Force & Script Bots** | Global rate limiting via `express-rate-limit` (20 req / 15 min on Auth, 60 req / 5 min on Price updates). | Verified |
| **HTTP Headers & CORS** | `helmet` CSP headers and strict CORS configuration. | Verified |

---

## 4. Quick Start & Execution

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Run

1. **Install Dependencies**:
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

2. **Start Backend Server**:
   ```bash
   cd backend
   npm run dev
   # Runs on http://localhost:5000 (auto-connects to MongoDB or launches resilient in-memory MongoDB fallback with pre-seeded data)
   ```

3. **Start Frontend Client**:
   ```bash
   cd frontend
   npm run dev
   # Runs on http://localhost:5173
   ```

4. **Run Verification Test Suites**:
   ```bash
   cd backend
   node test-suite.js    # Verifies database, Haversine, Bcrypt, 2dsphere index, timestamps
   node test-api.js      # Verifies nearest vendors, sorting, auth, and price update APIs
   node test-security.js # Verifies NoSQL sanitization and rate-limit headers
   ```

---

## 5. Demo Supplier Accounts (Pre-Seeded)

| Supplier Name | Email | Password | Location Hub |
| :--- | :--- | :--- | :--- |
| **Shree Balaji Building Materials & Steel** | `balaji.materials@example.com` | `password123` | Chembur, Mumbai (Freshly verified) |
| **Metro Infrastructure & Cement Wholesalers**| `metro.infra@example.com` | `password123` | Lower Parel, Mumbai (Freshly verified) |
| **Apex Steel & Construction Supplies Hub** | `apex.steel@example.com` | `password123` | Turbhe, Navi Mumbai (Freshly verified) |
| **Heritage Masonry & Raw Materials Yard** | `heritage.materials@example.com` | `password123` | Goregaon, Mumbai (Prices updated 3 days ago - shows stale warning) |
| **Pune Builders Mart & Saria Emporium** | `pune.mart@example.com` | `password123` | Baner, Pune |
