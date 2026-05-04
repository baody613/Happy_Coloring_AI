# PRESENTATION SCRIPT — FINAL YEAR PROJECT

**Project:** Happy Coloring AI — AI-Integrated Paint-by-Numbers E-Commerce Platform
**Student:** Tong Bao Duy — GCS210642
**Institution:** Greenwich University Vietnam

---

> **How to use this script:**
> Bold `[SLIDE X]` markers are your cue to advance the slide.
> *Italic* lines are stage directions — do not read them aloud.
> Estimated total duration: **~12–15 minutes** + Q&A.

---

## [SLIDE 1] — TITLE SLIDE

*Step forward, greet the panel, settle your posture.*

> "Good morning / Good afternoon, respected members of the examination panel. My name is **Tong Bao Duy**, student ID **GCS210642**, majoring in Information Technology at Greenwich University Vietnam.
>
> My Final Year Project is titled **Happy Coloring AI** — an AI-integrated e-commerce platform that allows users both to purchase ready-made paint-by-numbers products **and** to generate personalised numbered artwork from natural-language descriptions, powered by Google Gemini 2.5 Flash.
>
> Today's presentation is structured into three main parts: **Technology Stack**, **Core Features**, and **AI Image Generation** — which is the centrepiece of this project. Let me begin."

---

## [SLIDE 2] — TECHNOLOGY STACK — FRONTEND *(PART 1 / ~2 min)*

> "First, I would like to introduce the frontend technology choices.
>
> For the **UI Framework**, I used **Next.js 14** with the App Router, combined with **React 18** and **TypeScript**. I chose Next.js because it provides built-in **Server-Side Rendering**, which improves SEO for product pages, and its file-system routing keeps more than 30 pages clean and manageable. I used **Tailwind CSS** to build a fully responsive interface without writing manual CSS, and **Framer Motion** for smooth animations on the home page and the Generate page.
>
> For **State & Data management**, I used **Zustand** to handle global state — including the shopping cart, authentication status, and the favourites list. Zustand is much lighter than Redux and requires no boilerplate. The **Firebase SDK** on the client side handles user authentication in the browser. Every HTTP request goes through **Axios**, whose interceptor automatically attaches the Bearer Token and refreshes it when expired. Notably, the `safeStorage.ts` utility checks `typeof window` before every localStorage access — solving the SSR hydration problem when Next.js renders on the server.
>
> The frontend directory structure consists of `app/` with 30+ pages, `components/`, `store/` with three Zustand stores, `lib/` with API helpers, and `hooks/`."

---

## [SLIDE 3] — TECHNOLOGY STACK — BACKEND & DATABASE

> "Moving to the **Backend**.
>
> The server is built on **Node.js + Express.js**, following a RESTful API architecture. I use the **Firebase Admin SDK** server-side to verify tokens and access Firestore and Firebase Storage. For security, I integrated **Helmet** to set HTTP security headers against XSS and clickjacking; **Morgan** for request logging; and **Express Rate Limit** to cap each IP at 100 requests per 15 minutes — guarding against brute-force attacks, aligned with the OWASP Top 10 guidelines. **Joi** handles input validation, and **Nodemailer** sends password-reset emails.
>
> For **AI APIs**, I used two different models: **Gemini 2.5 Flash Image** to generate paint-by-numbers artwork from text — this is the primary model — and **Gemini 2.5 Flash Text** for the product advisory chatbot. **MyMemory API** translates user prompts from Vietnamese to English before they are sent to Gemini.
>
> For **Database & Storage**, I relied entirely on the Firebase ecosystem: **Firestore** stores all data as NoSQL documents across 5 main collections — Users, Products, Orders, Generations, and Settings. **Firebase Auth** provides JWT identity, and **Firebase Storage** stores product images and AI-generated artwork.
>
> In total, the backend exposes **49 API endpoints** across 14 route files."

---

## [SLIDE 4] — SYSTEM FLOW — 5 STAGES

> "To get a high-level view, here is the **system workflow** broken into 5 stages.
>
> **Stage 1 — Authentication:** Users register or sign in via Firebase Auth. The `AuthProvider` component listens for the `onAuthStateChanged` event and updates the Zustand `authStore`. Every subsequent request carries a **Bearer Token** in the Authorization header.
>
> **Stage 2 — Browse & Shop:** Products are fetched from Firestore and displayed with full filtering by category, difficulty, and price. Users add items to the cart — the cart is persisted by Zustand combined with localStorage, so no data is lost on page refresh.
>
> **Stage 3 — Payment:** After checkout, the system processes payment via COD or Bank Transfer. The backend verifies and updates the order status in Firestore.
>
> **Stage 4 — AI Generation:** This is the most distinctive stage — users enter a description, the system calls Gemini to generate an image, and the result is saved to Firebase Storage. I will cover this in detail in Part 3.
>
> **Stage 5 — Administration:** Admins log into a dedicated dashboard with two-layer authentication, and manage products, orders, users, and order status updates."

---

## [SLIDE 5] — 7 CORE FEATURE GROUPS *(PART 2 / ~4 min)*

> "Moving to **Part 2**, I will walk through the 7 core feature groups.
>
> **Group 1 — Authentication:** Full register, login, and logout flow. The 'Remember me' feature stores credentials in localStorage; if disabled, sessionStorage is used instead. Password reset via email using Nodemailer is supported.
>
> **Group 2 — Products:** The product listing includes full filtering by category, difficulty, and price, plus pagination. Admins can add, edit, delete products, and upload images directly to Firebase Storage.
>
> **Group 3 — Cart:** The cart uses Zustand persist — state survives page reloads. Users can save products to a 'favourites' list for later purchase. The system supports 3 discount vouchers: `YULING10` for 10% off, `YULING20` for 20% off, and `GIAMGIA15` for 15% off.
>
> **Group 4 — Payment:** Supports Cash on Delivery (COD) and Bank Transfer. A callback verification flow confirms transactions.
>
> **Group 5 — Orders:** Orders progress through a lifecycle: pending → processing → shipping → delivered or cancelled. Users can view their order history; admins update the status.
>
> **Group 6 — AI Generation:** This is the **flagship feature** — covered in depth in Part 3.
>
> **Group 7 — Admin Dashboard:** Comprehensive management of products, orders, users, and system settings, with an overview statistics panel."

---

## [SLIDE 6] — BACKEND ARCHITECTURE — LAYERED DESIGN

> "Before diving into AI Generation, I want to present the backend's **Layered Design** — a key architectural decision.
>
> Request processing flows through 4 layers. **Routes** receive requests and perform basic input validation — there are 14 route files. Next is the **Middleware** layer with two main files: `auth.js` verifies the Firebase ID Token and attaches `req.user`, while `adminAuth.js` enforces **two-layer admin authentication**. **Services** contain all business logic across 6 files. Finally, the **Firebase** layer handles Firestore, Storage, and Auth.
>
> The two-layer `adminAuth` mechanism works as follows: **Layer 1** checks the email against the `ADMIN_EMAILS` environment variable — fast, no database query needed. **Layer 2** queries Firestore to verify the user document has `role = "admin"` — precise and flexible, allowing admin access to be granted or revoked without redeploying.
>
> Regarding Services: `productService` handles CRUD, filtering, and pagination; `orderService` manages the order lifecycle; `userService` manages accounts and profiles."

---

## [SLIDE 7] — AI IMAGE GENERATION — OVERVIEW *(PART 3 / ~5 min — CORE FEATURE)*

> "And now, **Part 3** — the most important part of this project: the **AI Image Generation feature**.
>
> I use the **Gemini 2.5 Flash Image** model from Google AI Studio — one of the very few **free** models that support inline image generation via a plain REST API, with no heavy SDK required. The model returns images as **Base64 inline data** in the response body.
>
> The feature offers **3 complexity levels**:
> - **Easy (16 colours):** Thick outlines (3–4px), large regions at minimum 40×40px, simple cartoon style — suitable for children.
> - **Medium (28 colours):** Standard outlines (2–3px), semi-realistic, minimum 18×18px regions — for adults.
> - **Hard (44 colours):** Fine outlines (1.5–2px), many small regions down to 8×8px — for experienced painters.
>
> Here is the full **7-step processing flow** I designed — detailed across the next two slides."

---

## [SLIDE 8] — 7-STEP PROCESSING FLOW — STEPS 1 TO 4

> "**Step 1 — User sends the request:** The frontend POSTs to `/api/generate/paint-by-numbers` with a Bearer Token. The route is protected by the `authenticateUser` middleware. Before sending to Gemini, **MyMemory API** translates the Vietnamese prompt to English.
>
> **Step 2 — Backend responds immediately with 202 Accepted:** This is the key design decision. Gemini can take 30–120 seconds to generate an image — keeping the connection open would cause a timeout. Instead, the backend immediately creates a Firestore document with `status: 'processing'` and returns HTTP 202 with a `generationId`. The frontend receives this ID and starts polling.
>
> **Step 3 — Prompt Engineering:** The `buildLineArtPrompt()` function runs in the background as a **fire-and-forget** task — no `await`, no blocking of Node.js's Event Loop. The prompt is built from a template: the model is assigned the role of *'a professional paint-by-numbers illustrator'*, followed by **hard requirements** such as closed regions, numbered sections, palette-based colours, no watermarks, and no inappropriate content.
>
> **Step 4 — Call the Google AI Studio API:** `generateContent` is called with `responseModalities: ['TEXT', 'IMAGE']`. The model returns a `parts[]` array; I iterate through it to find the `inlineData` entry containing the Base64 PNG string, then convert it to a `Buffer`."

---

## [SLIDE 9] — 7-STEP PROCESSING FLOW — STEPS 5 TO 7

> "**Step 5 — Upload to Firebase Storage:** The `uploadToStorage()` function creates a reference under `generations/<filename>`, saves the buffer with `contentType: 'image/png'`, and calls `makePublic()` to obtain a public URL. Why not return the Base64 directly to the frontend? Because a Base64-encoded image is roughly **500 KB of text** — too large to store in Firestore and impossible to reuse. A public URL is compact and permanent.
>
> **Step 6 — Update Firestore:** The document is updated:
> - Success: `status: 'completed'` + `imageUrl` + `completedAt`
> - Failure: `status: 'failed'` + error message
> - Gemini quota exceeded → `RESOURCE_EXHAUSTED` → set failed
> - Content policy violation → `INVALID_ARGUMENT` → set failed
> - Axios timeout after 120 seconds → set failed
>
> **Step 7 — Frontend Polling:** The frontend calls `GET /api/generate/status/:id` every **5 seconds**, up to **60 attempts** — a 5-minute timeout. The server verifies that the `userId` in Firestore matches the token — preventing any user from accessing another user's result. The interval ID is stored in a `useRef` and `clearInterval` is called on component unmount — no memory leaks. Once the image is ready, users can **download it**, **add it to the cart**, or **add it to favourites**."

---

## [SLIDE 10] — WHY GEMINI? PROMPT ENGINEERING

> "A natural question is: **why choose Gemini instead of training a custom model?**
>
> First, Gemini is one of the few **free** models that support inline image generation via a plain REST API. The Google AI Studio free tier is sufficient for the scope of this project.
>
> Second, on **Prompt Engineering versus model training:** Gemini has already been trained on billions of data points — there is no need to retrain from scratch. My strategy was to *steer* the model with a detailed prompt. The prompt structure has three parts: **Role assignment** → **Hard requirements** → **Runtime variables** (user prompt + style + complexity). The result is that the same model **consistently outputs the correct paint-by-numbers format**.
>
> **This is my main technical contribution:** I designed a structured Prompt Engineering system to reliably produce the correct 78%/22% canvas split, closed regions, numbered sections, and a populated colour palette row — together with the entire async processing pipeline surrounding it."

---

## [SLIDE 11] — THANK YOU / Q&A

> "That brings me to the end of my presentation of **Happy Coloring AI**.
>
> To summarise: I have successfully built and deployed a fully functional e-commerce platform — integrating AI image generation via Google Gemini, a 7-step async architecture, a two-layer admin authentication system, and CI/CD pipelines on Vercel and Render.
>
> Live frontend: **happy-coloring-ai.vercel.app**
> Backend API: **paint-by-numbers-back-end.onrender.com**
>
> *Deliver the closing line calmly and confidently:*
>
> 'That concludes my Final Year Project presentation. Thank you very much for your time and attention. I warmly welcome any questions or feedback from the panel.'
>
> I am now ready for your questions. Thank you."

---

## SUGGESTED ANSWERS TO COMMON QUESTIONS

### "Why did you choose Firebase over PostgreSQL / MySQL?"
> "Firestore is a NoSQL document database well-suited to the flexible schema of this project — each product can carry different attributes. Moreover, Firebase bundles Auth, Storage, and Database in one ecosystem, which significantly reduces configuration and integration overhead — ideal for an individual final-year project."

### "How many concurrent users can the system handle?"
> "The backend is deployed on Render's free tier with limited resources. However, because of the async fire-and-forget architecture, generation requests do not block one another. The real bottleneck comes from Gemini's API rate limit and Render's compute constraints."

### "Why use polling instead of WebSockets?"
> "WebSockets suit two-way real-time communication such as live chat. Here, the client only needs to know when generation is complete — polling every 5 seconds is sufficient and far simpler to implement, requiring no persistent connection."

### "How is the Gemini API key kept secure?"
> "The API key is stored in a `.env` file on the backend and is never hard-coded or exposed to the client. The `.env` file is listed in `.gitignore`. On Render, it is stored as an encrypted environment variable."

### "Can voucher codes be brute-forced?"
> "There is a theoretical risk. In the current version, rate limiting at 100 requests per 15 minutes per IP significantly slows any brute-force attempt. Future improvements — such as hashing voucher codes or adding CAPTCHA — are planned enhancements."

---

*End of file — Tong Bao Duy, GCS210642, Greenwich University Vietnam, 2025–2026*
