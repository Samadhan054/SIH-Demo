# FloodGuard – Flash Flood Prediction System for Hilly Regions

**FloodGuard** is a disaster-management platform engineered to predict flash floods in mountainous and hilly catchments (inspired by real Himalayan/Nepal flood scenarios) and coordinate real-time satellite emergency rescues for stranded citizens.

---

## 🌟 Key Features & Modules

1. **Multi-Source Data Ingestion Layer & Risk Engine**:
   - Multi-parameter Flash Flood Risk Engine combining **Rainfall Intensity ($R$)**, **Water Level Rise Rate ($W_{rate}$)**, **Soil Saturation ($S$)**, and **DEM Terrain Slope ($G$) & Valley Funneling ($V_n$)**.
   - Swappable Data Adapters (`server/src/adapters/`) structured for easy drop-in of OpenWeatherMap, IMD, NASA SMAP, Sentinel-1, or IoT MQTT sensor streams.

2. **Live Risk Dashboard (`/dashboard`)**:
   - Leaflet.js dark map displaying color-coded risk zone polygons (LOW, MODERATE, HIGH, SEVERE).
   - Clickable river gauge markers with live popups and Recharts 24-hour time-series trends.
   - **Predictive Timeline Forecast Slider** (0h, 3h, 6h, 12h, 24h risk escalation preview).

3. **Satellite SOS Service (`/sos`)**:
   - Emergency SOS trigger with dual modes: **Satellite SOS Direct Protocol** (compressed binary 128-byte payload working without cellular towers) vs **Standard Cellular SOS**.
   - Auto/manual GPS picker, headcount, medical urgency selector, distress text note.
   - **Orbital Handshake Progression**: `SENT` → `SATELLITE_RELAY` → `RECEIVED` → `DISPATCHED` → `RESCUED`.

4. **Emergency & Rescue Coordination Console (`/rescue-console`)**:
   - Priority-sorted incident queue calculated from urgency level, headcount, zone risk, and water rise rate.
   - Dispatcher workflow: Assign taskforce (Helicopter, Rescue Boat, All-Terrain Truck) and track status progression (`EN_ROUTE`, `ON_SITE`, `EVACUATING`, `COMPLETED`).
   - Live comms log per incident between dispatchers and rescue teams.

5. **Government Override & Sensor Health (`/admin`)**:
   - Live sensor health grid (monitoring online/offline IoT gauges).
   - Historical flood event analytics (Rainfall vs Lives Saved correlation charts).
   - Manual override tool to broadcast red alert banners across all connected citizen devices.

6. **Citizen Alerts & Evacuation Guidance (`/alerts`)**:
   - District alert subscriptions.
   - Designated high-ground safe zones & evacuation shelter directory.
   - **Lite Mode**: Low-bandwidth text-only UI toggle for weak 2G / Satellite connections.
   - Multi-language support (English, Nepali, Hindi).

---

## 🚀 Quick Start & Running Locally

### Prerequisites
- Node.js (v18+)
- npm or yarn

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

## 📐 Flash Flood Risk Algorithm Formula

The **Flash Flood Risk Score** ($0.0$ to $1.0$) is calculated as:

$$\text{RiskScore} = 0.35 \cdot F_{\text{rain}} + 0.30 \cdot F_{\text{rise}} + 0.15 \cdot F_{\text{level}} + 0.10 \cdot F_{\text{soil}} + 0.10 \cdot F_{\text{dem}}$$

- $F_{\text{rain}} = \min(1.0, R / 70.0)$
- $F_{\text{rise}} = \min(1.0, W_{\text{rate}} / 2.0)$
- $F_{\text{level}} = \min(1.0, W_{\text{current}} / W_{\text{danger}})$
- $F_{\text{soil}} = S / 100.0$
- $F_{\text{dem}} = \min(1.0, (G / 45.0) \cdot V_n)$

### Risk Level Categorization
- `0.00 - 0.31` → **LOW** (Emerald)
- `0.32 - 0.54` → **MODERATE** (Amber)
- `0.55 - 0.74` → **HIGH** (Orange)
- `0.75 - 1.00` → **SEVERE** (Red Alert)
