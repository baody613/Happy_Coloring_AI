# PRESENTATION SCRIPT — VERSION 2 (LIVE DEMO + DEEP TECHNICAL Q&A)

**Project:** Happy Coloring AI — AI-Integrated Paint-by-Numbers E-Commerce Platform
**Student:** Tong Bao Duy — GCS210642
**Version:** 2 — Focused on live demo and deep technical defence

---

> **How to use Version 2:**
> This version is best suited when the panel asks **in-depth technical questions** or when there is time for a **live browser demo**.
> Total estimated duration: **~15–18 minutes** including the demo.
> Sections marked `[DEMO]` are step-by-step instructions for actions on the live website.

---

## OPENING — [SLIDE 1]

*Open a browser tab to https://happy-coloring-ai.vercel.app in advance. Stand straight and face the panel.*

> "Good morning / Good afternoon, respected members of the examination panel.
>
> My name is **Tong Bao Duy**, student ID **GCS210642**. I am here to present my Final Year Project.
>
> Before jumping into the slides, I would like to open with a question: **Have you ever wanted to colour a painting that came entirely from your own imagination?** Not choosing from a fixed catalogue — but a painting born from your own idea?
>
> That is exactly the problem **Happy Coloring AI** solves. The system lets users type a description — for example, 'a sleeping cat on a Hoi An rooftop' — and receive a complete, print-ready numbered painting in return.
>
> Over the next 15 minutes, I will cover the system architecture, run a live demo, and dive deep into the technical decisions behind the build."

---

## PART 1 — PROBLEM ANALYSIS AND SOLUTION [SLIDE 2]

> "To understand why this project matters, let me begin with a **Context Analysis**.
>
> **Market problem:** The global paint-by-numbers market reached USD 1.2 billion in 2023, growing at 6.1% per year. Yet **100% of current products** use fixed templates. Buyers can only choose from a catalogue — personalisation is impossible.
>
> **My technical solution** combines three components:
> - A complete **e-commerce platform**: browse → cart → checkout → order tracking
> - **AI Generation** using Google Gemini 2.5 Flash Image: text → paint-by-numbers image
> - An **Admin system** for full operational management
>
> **What sets this apart from similar systems:** This is not just an AI chatbot or a simple shop — it is a **native integration** of AI into the e-commerce flow. AI-generated artwork can be added to the cart, paid for, and sent for printing, all within the same system."

---

## PART 2 — SYSTEM ARCHITECTURE [SLIDE 3 → SLIDE 4]

> "The overall architecture is a **Full-Stack** system with two independently deployed services.
>
> **Frontend** — Next.js 14 App Router, deployed on Vercel with automated CI/CD. Every push to the `main` branch on GitHub triggers Vercel to build and deploy automatically. Zero downtime.
>
> **Backend** — Node.js + Express.js RESTful API, deployed on Render. Same CI/CD approach via GitHub webhook.
>
> **Database** — Firebase Firestore NoSQL with 5 collections: Users, Products, Orders, Generations, and Settings.
>
> **Why separate the frontend and backend instead of a monolith?** Three reasons:
> 1. *Independent scaling* — the backend can scale separately when AI generation load increases
> 2. *Independent deployment* — the frontend UI can be updated without restarting the backend
> 3. *Security boundary* — API keys and admin logic live entirely on the backend; the frontend never sees them
>
> **[SLIDE 4 — System Flow]**
>
> The request flow is: User in browser → HTTPS → Vercel CDN → Next.js → Axios calls API → Express Router → Middleware (auth verify) → Service layer → Firebase. The response travels the same path in reverse. Everything runs over HTTPS — no plain HTTP."

---

## PART 3 — LIVE DEMO [~5 MINUTES]

*Switch to the browser tab and share your screen if a projector is available.*

### 3.1 — Home Page and Gallery Demo

> "This is the live home page at **happy-coloring-ai.vercel.app**. A few technical highlights:
>
> — The 'Color with Pure Elegance' animation uses **Framer Motion** with `staggerChildren` — each word appears in sequence.
> — The background features `backdrop-blur` and a `parallax scroll` effect.
> — This page is **Static Site Generated** — Next.js pre-renders it as static HTML, so no server is needed to serve it; it loads very fast."

*[DEMO] Scroll down, click Explore Gallery.*

> "The gallery offers **filtering by category, difficulty level, and price range**. Filters do not reload the page — state is managed in Zustand, filter changes update the URL query parameters, and the page re-renders client-side. This makes the URL shareable — sending the link to someone preserves all active filters."

### 3.2 — AI Generation Demo

*[DEMO] Click 'Generate AI Art' in the navbar, log in if prompted.*

> "This is the **Generate** page. I will type a prompt:
> `'an orange cat sleeping in a basket of flowers'`
>
> Complexity level: **Easy** — 16 colours, suitable for a demo.
>
> Click Generate. The backend immediately returns **HTTP 202 Accepted** — not 200. This is a key technical decision: Gemini can take 30–120 seconds to produce an image. If the connection were kept open, the request would time out. Instead, the backend creates a Firestore document with status 'processing' and returns a `generationId`. The frontend begins **polling every 5 seconds**.
>
> While we wait, I can explain what is happening behind the scenes:
> 1. MyMemory API translates the prompt to English
> 2. The prompt is injected into a 150+ word template with hard constraints on line art and numbered regions
> 3. Google AI Studio returns a Base64 PNG
> 4. It is uploaded to Firebase Storage → public URL
> 5. The Firestore document is updated → the frontend polling receives 'completed' → the image is displayed"

*[DEMO] When the image appears, point out the numbered regions and the colour palette row.*

> "Here is the result — a complete numbered painting with:
> - A drawing zone occupying the top 78% of the canvas
> - A colour palette row in the bottom 22%, with fully numbered colour swatches
> - Every region numbered from 1 to 16
>
> The user can **Download**, **Add to Cart**, or **Add to Favourites** directly from here."

### 3.3 — Admin Panel Demo

*[DEMO] Log in with the admin account, navigate to /admin.*

> "The admin panel is only accessible after passing **two authentication layers**:
> - Layer 1: The email must be present in the `ADMIN_EMAILS` environment variable
> - Layer 2: The Firestore user document must have `role: 'admin'`
>
> This is the dashboard with summary statistics. I can add products, upload images directly to Firebase Storage, and manage orders through the pipeline: pending → processing → shipping → delivered."

---

## PART 4 — DEEP TECHNICAL: AI GENERATION SYSTEM [SLIDE 7 → 9]

> "The most technically significant part is the **async system design**.
>
> **The problem:** HTTP requests have a default timeout of around 30 seconds. Gemini needs 30–120 seconds. That is a direct conflict.
>
> **My solution — Pattern: Lightweight Job Queue with Firestore:**
>
> ```
> Client                    Server                   Firebase
>   |                          |                         |
>   |── POST /generate ──────>|                         |
>   |                          |── Create doc (processing)──>|
>   |<─ 202 + generationId ───|                         |
>   |                          |                         |
>   |   (every 5 seconds)      |── Fire-and-forget task |
>   |── GET /status/:id ──────>|── AI generation ──────>Gemini
>   |<─ {status: processing} ─|                         |
>   |                          |<── Base64 image ───────|
>   |── GET /status/:id ──────>|── Upload Storage ──────>|
>   |<─ {status: completed,   |── Update doc ───────────>|
>   |    imageUrl: ...} ──────|                         |
> ```
>
> **Technical highlights:**
>
> One: `generatePaintByNumbers()` runs **without `await`** — this is intentional fire-and-forget. It does not block the Event Loop. Node.js can continue handling other requests while the generation is running.
>
> Two: Frontend polling uses `setInterval` with the ID stored in a `useRef`. When the component unmounts — when the user navigates away — `clearInterval` is called inside the `useEffect` cleanup function. No memory leaks.
>
> Three: Security in polling — `GET /status/:id` checks that `data.userId === req.user.uid` before returning any data. User A cannot access User B's image even if they know the generationId."

---

## PART 5 — PROMPT ENGINEERING [SLIDE 10]

> "Prompt Engineering is my **main technical contribution** — not training a model, but steering one.
>
> **The 4-section prompt structure:**
>
> **Section 1 — Canvas Layout:** Splits the 1024×1024 canvas into 78% drawing zone + 22% palette. This is a hard constraint — without it, Gemini generates a regular image with no structure.
>
> **Section 2 — Drawing Zone Rules:** Subject accuracy is critical — 'Draw X and nothing else. Do NOT replace, simplify, or omit any part.' This guards against hallucination. Line art rules: 'pure black outlines on pure white background ONLY. Zero grey tones, zero colour tints.' Without this, Gemini adds shading and gradients.
>
> **Section 3 — Numbering Rules:** 'Every single region must contain exactly one small black number. Numbers outside range 1..N are forbidden. Every integer from 1 to N must appear at least once.' These constraints ensure the painting is actually usable.
>
> **Section 4 — Absolute Prohibitions:** An explicit list of what is NOT allowed. I found that AI models respond better to explicit prohibitions than to implied constraints.
>
> **Result:** Before adding Section 4, the model occasionally added watermarks or text labels. After adding the explicit prohibition, the error rate dropped significantly."

---

## PART 6 — SECURITY (OWASP TOP 10) [SLIDE 5 → 6]

> "I want to address security specifically, as it is an important evaluation criterion.
>
> **A1 — Broken Access Control:** Every sensitive route requires a Bearer Token. Admin routes have double-layer auth. The order status endpoint checks ownership. Users can only CRUD their own data.
>
> **A2 — Cryptographic Failures:** No passwords are stored in the database — all authentication goes through Firebase Auth (Google-managed). JWT tokens are signed by Firebase using RS256.
>
> **A3 — Injection:** User prompts are sanitised to remove template markers `{{` and `}}` before injection into the prompt template. SQL/NoSQL injection is not applicable because Firestore uses an SDK, not string queries.
>
> **A4 — Insecure Design:** The CORS whitelist only permits specific domains. Rate limiting is set at 100 requests per 15 minutes per IP. Helmet.js sets 14 HTTP security headers including HSTS, X-Frame-Options, and CSP.
>
> **A5 — Security Misconfiguration:** `.env` is in `.gitignore`. API keys exist only as backend environment variables. Firebase Security Rules restrict read/write based on authentication status.
>
> **A6 — Vulnerable Components:** All dependencies are audited with `npm audit`. There are no high or critical vulnerabilities in production dependencies."

---

## CONCLUSION [SLIDE 11]

> "To summarise what I have achieved:
>
> **Functionally:** A complete e-commerce system with a unique AI generation feature, running stably on the cloud. This is not a prototype — it is a production deployment.
>
> **Technically:** I solved the async AI generation problem using a lightweight job queue pattern with Firestore and polling. I designed a structured Prompt Engineering system to reliably steer Gemini's output into the correct paint-by-numbers format.
>
> **Academically:** This project integrates knowledge from multiple modules: Web Development, Database Systems, Software Engineering, Cloud Computing, and Security.
>
> **Future development directions:**
> - Integrate a payment gateway (VNPay / MoMo)
> - Replace polling with WebSockets for real-time generation progress
> - Fine-tune prompts per artistic style (watercolour, oil painting, etc.)
> - Progressive Web App (PWA) for mobile
>
> This concludes my presentation. I greatly appreciate any questions from the panel and am ready to discuss any technical aspect in detail.
>
> 'Thank you very much for your time. I am ready for your questions.'"

---

## DEEP TECHNICAL Q&A — SUGGESTED ANSWERS

---

### "Why use polling instead of WebSockets or Server-Sent Events?"

> "That is a great question. I considered all three approaches:
>
> **WebSockets:** Best suited for bi-directional real-time communication like chat. But generation is a one-way notification — the server only needs to say 'it is done'. Using WebSockets here would be over-engineering.
>
> **Server-Sent Events (SSE):** Closer to the right tool — server pushes events. However, Render's free tier has connection limits and does not handle keep-alive connections well.
>
> **Polling:** Simple, stateless, works with any load balancer, and costs no connection slots. With a 5-second interval and a maximum of 60 attempts (5-minute timeout), the total cost is 60 lightweight GET requests — entirely acceptable.
>
> If scaling to production with many concurrent users, SSE would be the natural next upgrade."

---

### "What happens if the Gemini API goes down?"

> "I designed a graceful degradation path:
>
> 1. If Gemini returns an error, `generatePaintByNumbers()` catches the exception and updates the Firestore document to `status: 'failed'` with an error message.
> 2. On the frontend, when polling receives `status: 'failed'`, an error message is shown to the user with an option to retry.
> 3. The `GOOGLE_IMAGE_MODELS` array currently holds one model, but the architecture allows adding fallback models — if the primary model fails, the next one is tried.
> 4. API quota exhausted → `RESOURCE_EXHAUSTED` error → caught and set to failed with the message 'quota exceeded'."

---

### "What are Firestore's disadvantages compared to SQL for an e-commerce system?"

> "There are genuine trade-offs:
>
> **Firestore disadvantages:**
> - No ACID transactions across collections — if an order is created successfully but an inventory update fails, a manual compensating transaction is needed
> - No complex joins — a query for 'orders including product details' requires two round trips or data denormalisation
> - No aggregation pipeline like MongoDB — COUNT and SUM must be computed in application code
>
> **Why I still chose it:**
> - The project scope does not include inventory management, so the transaction concern is not critical
> - Firebase Auth + Firestore in the same ecosystem significantly reduces integration complexity
> - Firestore's real-time listeners would be valuable in a future WebSocket upgrade
>
> If scaling to a real production system with inventory management, I would consider PostgreSQL or a hybrid approach: PostgreSQL for transactional data, Firestore for user sessions and real-time features."

---

### "How could your code be attacked? How have you defended against it?"

> "I identified 4 main attack surfaces:
>
> **1. Authentication bypass:** Firebase ID Tokens are verified server-side via `auth.verifyIdToken()` — forged or expired tokens are rejected. No custom 'remember tokens' are stored in the database.
>
> **2. IDOR (Insecure Direct Object Reference):** All data-access endpoints check ownership. For example, `GET /orders/:id` returns 403 if `order.userId !== req.user.uid`.
>
> **3. Prompt injection:** User prompts are sanitised to remove `{{` and `}}` before injection into the Gemini prompt template. The rate limit of 100 requests per 15 minutes prevents brute-force generation attempts.
>
> **4. Mass assignment:** When updating a user profile or order, I explicitly destructure only the permitted fields instead of using `Object.assign(doc, req.body)`. This prevents users from injecting `role: 'admin'` into the request body."

---

### "Why not use Next.js API Routes instead of a separate Express backend?"

> "That is a very valid question. Next.js API Routes — or even Server Actions in Next.js 14 — could replace a simple Express backend.
>
> My reasons for separating them:
>
> **1. Firebase Admin SDK limitations on Vercel Serverless.** Vercel functions have a 10-second execution timeout on the free plan. Gemini generation needs up to 120 seconds — it simply cannot run inside a Vercel function. A persistent server is required.
>
> **2. Background tasks.** The fire-and-forget pattern requires the server to remain alive after the response has been sent. Serverless functions do not support this.
>
> **3. Swagger documentation.** I have an `/api-docs` endpoint with a full interactive UI — straightforward to implement on Express.
>
> If the AI generation had no long-running requirement, I would use Next.js Server Actions for simplicity."

---

*End of file — Tong Bao Duy, GCS210642, Greenwich University Vietnam, 2025–2026*
*Version 2 — Live Demo + Deep Technical Defence*
