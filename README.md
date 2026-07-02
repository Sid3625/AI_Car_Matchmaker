# AI Car Matchmaker

An intelligent, data-driven car recommendation engine built for the Indian automotive market.

## What did you build and why? What did you deliberately cut?
**What I built:** I built a personalized AI Car Matchmaker. Instead of traditional "checkbox" filters that return 100+ overwhelming options, this platform uses a Hybrid Weighted Scoring algorithm combined with a Natural Language AI parser (Gemini) to mathematically rank and recommend the absolute top 3 cars tailored to a user's lifestyle and budget. 

**Why:** Car buying suffers from extreme decision fatigue. Buyers don't want a database; they want a confident shortlist. 

**What I deliberately cut:**
1. **Database Persistency:** I cut out a live database (PostgreSQL/MongoDB) and user authentication in favor of a static `cars.json` dataset. This allowed me to focus 100% of my time on the core recommendation algorithm, UI/UX, and AI integration.
2. **CSS Frameworks:** I deliberately avoided Tailwind/Bootstrap. I built the entire glassmorphic, responsive, premium dark-mode UI from scratch using vanilla CSS variables to demonstrate complete control over aesthetics.

## What’s your tech stack and why did you pick it?
* **Frontend:** React + Vite + TypeScript. Picked for lightning-fast compilation (Vite) and type safety across the monorepo.
* **Backend:** Express + Node.js + TypeScript. Picked for lightweight REST routing and the ability to share TS types (like `UserPreferences`) seamlessly with the frontend.
* **AI Integration:** Google Gemini SDK (`@google/genai`). Picked for its incredibly fast `gemini-2.5-flash` model and strict Structured Output (JSON schema) enforcement, which safely bridges natural language with our deterministic algorithm.
* **Validation:** Zod. Picked to guarantee run-time type safety for API requests and prevent malformed data from crashing the engine.

## What did you delegate to AI tools vs. do manually? Where did the tools help most? Where did they get in the way?
* **Delegated to AI:** Generating the extensive 50-car realistic dataset (`cars.json`), scaffolding the React components, writing the boilerplate CSS glassmorphism styles, and generating the strict Zod schemas. 
* **Done Manually (Guided):** Architecting the actual math for the recommendation engine (40% priority, 30% budget, etc.), defining the strict fallback behavior for the UI, and debugging the API configuration.
* **Where AI helped most:** Generating the realistic JSON car dataset saved hours of manual data entry. Generating the complex CSS grid and glassmorphism styling drastically accelerated the premium UI build.
* **Where AI got in the way:** Initially integrating the raw Gemini REST API. The API had strict, undocumented quirks regarding `v1` vs `v1beta` namespaces and how it validates OpenAPI schemas (like throwing 400 Bad Requests on nested `enum` constraints). We eventually migrated to the official `@google/genai` SDK to bypass these low-level REST headaches.

## If you had another 4 hours, what would you add?
1. **Conversational "Ask AI":** A chat interface allowing users to converse directly with Gemini about their specific shortlisted cars (e.g., "Why did you pick the Nexon over the Brezza for safety?").
2. **Image Integration:** Dynamically scraping or generating actual images for the cars to display on the result cards.
3. **Database Integration:** Moving `cars.json` into a PostgreSQL database managed by Prisma ORM.
4. **EMI Calculator:** Building a financing and EMI estimator directly into the side-by-side comparison grid.

---

## Run Instructions

### 1. Prerequisites
Ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v18 or higher)
* npm (comes with Node.js)

### 2. Environment Setup
1. Copy the example environment file at the root of the project:
   ```bash
   cp .env.example .env
   ```
2. Open the newly created `.env` file and insert your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=5000
   ```
   *(Note: The `backend` server utilizes `dotenv` to load this key dynamically from the root folder at runtime).*

### 3. Installation
Install all dependencies across the entire monorepo (frontend and backend) using npm workspaces:
```bash
npm install
```

### 4. Running the Application
The project uses `concurrently` to run both the Vite frontend and Express backend simultaneously. Run the following command from the root directory:
```bash
npm run dev
```

### 5. Access the App
* **Frontend (React UI):** Open `http://localhost:3000` in your browser.
* **Backend (Express API):** Running on `http://localhost:5000`.

*(You can verify the backend is active by the "API Active" green status indicator in the top right of the React App header).*
