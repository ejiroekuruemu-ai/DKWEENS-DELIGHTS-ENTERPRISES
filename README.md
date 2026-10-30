# DKWEENS DELIGHTS ENTERPRISES — Event Services, Staffing & Rentals Management System

> **Official Capstone Project Presentation Date:** November 5, 2026  
> **Candidate:** Ejiro Ekuruemu  
> **Specialization:** AI Fundamentals Capstone Project  
> **Official Business Brand:** DKWEENS DELIGHTS ENTERPRISES  
> **Official Slogan:** “WE PLAN • WE CREATE • YOU CELEBRATE.”  
> **Headquarters / Primary Base:** Warri, Delta State, Nigeria  
> **Official Contact Hotline:** 09061453586  

---

## 1. Executive Overview

**DKWEENS DELIGHTS ENTERPRISES** is an enterprise-grade, full-stack event services, entertainment, staffing, and rental operations system engineered for a real luxury event enterprise based in **Warri, Delta State, Nigeria**.

The system connects wedding couples, high-society celebrants, corporate brands, and families with verified afterparty entertainment packages, professional uniformed ushers, champagne hostesses, executive security bouncers, illuminated luxury serving bowls, LED hype boards, custom performance attire, and acrobatic mascots.

Unlike generic mockups, DKWEENS DELIGHTS ENTERPRISES features:
- **Zero-Manipulation Database Pricing Engine:** Guaranteed rates directly linked to the central database.
- **Zero Double-Counting of Inclusions:** When an official package is selected, all its inclusions are covered automatically.
- **Serving Bowls Terminology Standard:** Strictly Serving Bowls (B-O-W-L-S) — never boats! (Silver: ₦2,000 / Gold: ₦2,500).
- **Realistic Out-of-Corridor Logistics Handling:** Base corridor covers Warri and Delta State. Out-of-state travel is flagged for administrator itemized assessment without fabricating fake rates.
- **Original Brand Assets:** Powered by the actual client logo emblem and 18 real business photographs and videos.
- **Integrated Media Manager:** Dedicated administrator portal allowing full CRUD control over images, videos, captions, categories, and homepage highlights.
- **Internal AI Event Planning Assistant:** Discreet server-side Gemini 3.8 Flash model assisting customers with budget alignment.

---

## 2. Core System Architecture

### 1. Central Database & Pricing Engine (`/server/pricingEngine.ts`, `/server/db.ts`)
- All package prices, staff unit rates, and rental items originate from authoritative database records.
- Every booking request captures an immutable price snapshot, preventing historical quotations from distorting if catalog rates change in the future.
- Generates official references prefixed with `DK-2026-XXXX`.

### 2. The 6 Official Afterparty Packages
- **Package 1 — Premium Experience:** ₦1,000,000  
  *Includes couples mix, gorilla, power bike, fire dancer, LED costumes, afterparty props, board, lights, and bottle girls.*
- **Package 2 — Deluxe Experience:** ₦800,000  
  *Includes couples mix, gorilla, fire dancer, LED costumes, afterparty props, board, lights, and bottle girls.*
- **Package 3 — Gold Experience:** ₦750,000  
  *Includes gorilla, fire dancer, LED costumes, afterparty props, board, lights, and bottle girls.*
- **Package 4 — Silver Experience:** ₦550,000  
  *Includes gorilla, LED costumes, afterparty props, board, lights, and bottle girls.*
- **Package 5 — Classic Experience:** ₦500,000  
  *Includes gorilla, LED costumes, board, lights, and bottle girls.*
- **Package 6 — Essential Experience:** ₦400,000  
  *Includes LED costumes, board, lights, drink carriers, and bottle girls.*

### 3. Staffing & Hardware Rentals
- **Professional Ushers:** ₦17,000 per person (available in Ankara skirts, beaded crowns, or formal black waistcoats).
- **Champagne Hostesses (Champagne Girls):** ₦17,000 per person (white feathered halter gowns and VIP bottle service).
- **Executive Bouncers:** ₦30,000 per bouncer (crowd control, perimeter and VIP protection).
- **Luxury Serving Bowls (B-O-W-L-S):**
  - **Silver Serving Bowls:** ₦2,000 each
  - **Gold-Coloured Serving Bowls:** ₦2,500 each
- **Illuminated Boards & Displays:** Crown-crested video screen boards, LED luxury drink carriers.
- **Performance Costumes & Wardrobe:** Black & gold fringe sets, canary yellow sets, royal purple velvet sets, emerald green VIP attire.
- **Hype Mascots Troupe:** Acrobatic Spiderman, dancing Panda, Super Mario, and the King Kong Hype Gorilla (₦50,000 solo).

### 4. Logistics, Travel & Service Corridor Policy
- Base operational corridor is **Warri, Effurun, and Delta State**.
- Events outside Delta State are flagged as **Outside Service Area**.
- The system **never invents a travel surcharge**. It sets quotation status to **Incomplete (Pending Assessment)** until the administrator logs itemized transport and accommodation fees.

### 5. Media & Asset Management System
- Stored under `/public/assets/aistudio/`:
  - `my_logo_f5406092.jpeg`: Original Logo Emblem with phone `09061453586`
  - `gorrilla_and_other_mascots_fee51748.mp4`: Real Mascot Troupe Video
  - `gold_bowls_2428a428.mp4`: Real Gold Serving Bowls Video
  - `one_usher_59339047.mp4`: Real Usher on Duty Video
  - `drink_carrier_board_4490446f.jpeg`: Illuminated LED Drink Carrier Board
  - `small_board_3cbf85c9.jpeg`: Crown-Crested Hype Video Board
  - `5_ushers_76d2682c.jpeg`: 5 Ushers in Ankara Skirts & Beads
  - `ushers_for_sunday_c3213695.jpeg`: Corporate Ushers in Waistcoats
  - `ushers_for_burial_119e6e5a.jpeg`: Memorial & Ceremonial Ushers
  - `white_champagne_gown_standing_506b0fbc.jpeg`: Champagne Girls in Feathered Gowns
  - `white_champagne_gown_sitting_d19493e9.jpeg`: Champagne Girls Seated at VIP Table
  - `silver_bowl_3f2e880f.jpeg`: Silver Serving Bowls in Field Use
  - `afterparty_team_ac9b2157.jpeg`: Full Afterparty Crew & Mascots
  - Performance attire photos (black/gold, yellow, purple velvet, emerald green)
- Admin can add, tag, feature, and delete media items dynamically via `/api/admin/media`.

---

## 3. Technology Stack

- **Backend Runtime:** Node.js, Express, TypeScript (`tsx`)
- **Frontend Framework:** React 19, TypeScript, Tailwind CSS
- **Design Aesthetic:** Luxury Black, Gold, and Cream
- **Icons & Motion:** Lucide React, Motion
- **AI Integration:** `@google/genai` (SDK 2.4.0) with model `gemini-3.8-flash`
- **Data Persistence:** Server-backed JSON database (`/server/data/eventsease_db.json`) with atomic file writes and initial database seeding

---

## 4. Setup and Installation

### Prerequisites
- Node.js (version 20 or higher)
- NPM

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Environment Variables
Create or verify `.env` in the project root:
```env
# Gemini API Key (injected automatically in Google AI Studio)
GEMINI_API_KEY="your-gemini-api-key"

# Port (defaults to 3000)
PORT=3000
```

### Step 3: Run Development Server
```bash
npm run dev
```
The server will start on `http://localhost:3000` with Express handling API routes (`/api/*`) and Vite serving client assets.

---

## 5. Administrative Credentials

- **Admin Portal URL:** Navigate to `/admin` via the footer link or URL
- **Admin Email:** `admin@dkweensdelights.ng` (or legacy `admin@eventsease.ng`)
- **Password:** `dkweens2026` (or legacy `eventsease2026`)
- **Quick Demo Access:** 1-Click login button on the admin page enables fast evaluation during capstone presentation.

---

## 6. Capstone Presentation Walkthrough Guide (Nov 5, 2026)

1. **Brand Identity & Real Media:**
   - Showcase original DKWEENS DELIGHTS ENTERPRISES logo with tagline *“WE PLAN • WE CREATE • YOU CELEBRATE.”*
   - Play the authentic videos of the Gold Serving Bowls and Gorilla Mascot.
2. **Serving Bowls Terminology:**
   - Demonstrate the strict compliance with **Serving Bowls (B-O-W-L-S)** across Services, Rentals, and Booking forms.
3. **Dedicated Rentals Page:**
   - Browse illuminated boards, costumes, mascots, and serving bowls with direct reservation triggers.
4. **Interactive Gallery:**
   - Filter by ushers, champagne girls, costumes, mascots, and boards with full-screen lightbox and video playback.
5. **Real-Time Booking & Snapshot:**
   - Submit a booking request for Warri, Delta State; verify reference format `DK-2026-XXXX`.
   - Test out-of-corridor toggle to show the transparent pending travel status.
6. **Administrator Control & Media Manager:**
   - Sign into the operations dashboard, inspect bookings, add an itemized travel surcharge, update status to "Approved".
   - Switch to the Media Manager tab, register a new photo/video, toggle homepage visibility, and observe immediate updates.
