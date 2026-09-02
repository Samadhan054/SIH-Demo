# FloodGuard – Flash Flood Prediction & Satellite Rescue System

**FloodGuard** is a disaster-management platform engineered to predict flash floods in hilly and river catchments (inspired by real Himalayan and Indian river basin scenarios) and coordinate real-time satellite emergency rescues for stranded citizens.

---

## 🌟 Key Features & Modules

1. **Per-River CWC Threshold Registry & Extended Risk Engine**:
   - Seeded with 28+ real Indian rivers (Ganga, Yamuna, Brahmaputra, Godavari, Krishna, Kaveri, Narmada, Tapi, Mahanadi, Indus, Sutlej, Beas, Ravi, Chenab, Jhelum, Sabarmati, Periyar, Tungabhadra, Damodar, Kosi, Gandak, Ghaghara, Son, Chambal, Betwa, Alaknanda, Bhagirathi, Teesta).
   - Modeled on Central Water Commission (CWC) classification concepts with derived `normalLevelM`, `warningLevelM`, `dangerLevelM`, and `extremeLevelM` gauge thresholds based on channel depth, width, and catchment geometry (*ILLUSTRATIVE DEMO VALUES*).
   - Extended Risk Engine formula incorporates a per-river threshold breach factor ($F_{\text{threshold}}$).

2. **Auto Danger Indication & SMS Alert Adapter Stub**:
   - Automated event trigger when river levels cross danger or extreme marks.
   - `server/src/adapters/smsAdapter.ts`: STUB adapter for MSG91 / Twilio / NDMA alert gateway. Logs simulated SMS broadcasts to at-risk residents within catchment radius and surfaces logs in `/admin`.
   - Extreme threshold breaches automatically create priority-sorted incident tickets in `/rescue-console`.

3. **Login & Role-Based Access Control (RBAC)**:
   - Login Portal (`/login`) supporting roles:
     - **Public / Citizen**: Access to `/dashboard`, `/sos`, `/alerts`.
     - **Rescue Team**: Adds `/rescue-console` (can assign taskforce, update lifecycle `EN_ROUTE` → `ON_SITE` → `EVACUATING` → `COMPLETED`, send comms).
     - **Government Authority**: Read-only access to `/rescue-console`, `/admin` analytics, and `/data-methodology`.
     - **Admin**: Full access including CWC threshold editing, sensor configs, manual override broadcasts, and editing `/data-methodology` content.
   - Server-side JWT authentication middleware (`server/src/middleware/authMiddleware.ts`).

4. **Government Data & Methodology Specification (`/data-methodology`)**:
   - Official portal for government & rescue officials documenting formula weightings, CWC threshold models, and adapter data provenance. Editable by Admin.

5. **Live River-Linked Map & Actionable SOS Red Dots**:
   - River selector dropdown re-centers map and displays live gauge readouts vs CWC bands in Recharts popups.
   - Distinct pulsing red dot markers for active SOS distress signals.
   - Actionable status advance: Rescue Team and Admin can advance SOS status directly from the map popup, syncing state across WebSockets.

---

## 🚀 Quick Start & Running Locally

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Environment Variables (Optional)
- `JWT_SECRET`: Secret key for JWT signing (default: `floodguard-himalayan-secret-key-2026`)
- `SMS_PROVIDER_STUB`: Name of simulated SMS provider stub

### Installation & Launching

```bash
# 1. Install dependencies for Server & Client
cd server && npm install
cd ../client && npm install
cd ..

# 2. Run Server (Terminal 1)
npm run dev:server

# 3. Run Frontend Client (Terminal 2)
npm run dev:client
```

Open `http://localhost:3000` in your browser.

---

## 📐 Extended Risk Score Formula

The **Flash Flood Risk Score** ($0.0$ to $1.0$) is calculated as:

$$\text{RiskScore} = 0.30 \cdot F_{\text{rain}} + 0.25 \cdot F_{\text{rise}} + 0.15 \cdot F_{\text{level}} + 0.15 \cdot F_{\text{threshold}} + 0.08 \cdot F_{\text{soil}} + 0.07 \cdot F_{\text{dem}}$$

- $F_{\text{rain}} = \min(1.0, R / 70.0)$
- $F_{\text{rise}} = \min(1.0, W_{\text{rate}} / 2.0)$
- $F_{\text{level}} = \min(1.0, W_{\text{current}} / W_{\text{danger}})$
- $F_{\text{threshold}} = \text{CWC Warning/Danger/Extreme Breach Ratio}$
- $F_{\text{soil}} = S / 100.0$
- $F_{\text{dem}} = \min(1.0, (G / 45.0) \cdot V_n)$

### Risk Level Categorization
- `0.00 - 0.31` → **LOW** (Emerald)
- `0.32 - 0.54` → **MODERATE** (Amber)
- `0.55 - 0.74` → **HIGH** (Orange)
- `0.75 - 1.00` → **SEVERE** (Red Alert)

---

## 👥 Team & Connected Repositories

- **Primary Repository**: [Samadhan054/SIH-Demo](https://github.com/Samadhan054/SIH-Demo.git)
- **Team Repository**: [anushkajadhav1776-boo/SIH-demo](https://github.com/anushkajadhav1776-boo/SIH-demo.git)
- **Team Contributor**: [NileshBojware](https://github.com/NileshBojware)