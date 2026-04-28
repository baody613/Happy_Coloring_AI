<div align="center">

# FINAL YEAR PROJECT REPORT
### Greenwich Template

**Project Title:** Happy Coloring AI
**Student:** [Full Name]
**Student ID:** [ID Number]
**Major:** Information Technology
**Supervisor:** [Supervisor's Name]
**Academic Year:** 2025 - 2026

</div>

---

## ACKNOWLEDGEMENTS
[Insert your acknowledgements here]

---

## TABLE OF CONTENTS
- [Chapter 1 Introduction](#chapter-1-introduction)
- [Chapter 2 Literature Review](#chapter-2-literature-review)
- [Chapter 3 Technology and Tools](#chapter-3-technology-and-tools)
- [Chapter 4 Software Product Requirements](#chapter-4-software-product-requirements)
- [Chapter 5 Review of Software Development Methodologies](#chapter-5-review-of-software-development-methodologies)
- [Chapter 6 Design and Implementation of your demo product](#chapter-6-design-and-implementation-of-your-demo-product)
- [Chapter 7 Conclusions](#chapter-7-conclusions)
- [References](#references)

---

## Chapter 1 Introduction

### 1.1 Introduction about the project subject

Paint-by-numbers is an art activity that helps users relax, focus, and develop aesthetic sensibility without requiring professional drawing skills. The global paint-by-numbers market is projected to reach USD 1.2 billion by 2028, growing at a CAGR of 6.1% (Grand View Research, 2023).

However, traditional paint-by-numbers products have a fundamental limitation: buyers can only choose from pre-designed templates and cannot create artwork from their own ideas. The emergence of generative image AI models such as Google Gemini opens the possibility of fully personalising products on demand.

This project builds an AI-integrated e-commerce platform that allows users to both purchase ready-made paint-by-numbers products and generate custom numbered templates from natural language descriptions.

---

> **Figure 1.1** — Screenshot of the Happy Coloring AI homepage (hero section)
>
> `[INSERT FIGURE 1.1 HERE]`
> 
> **Explanation:** *This figure visually illustrates > **figure 1.1** — screenshot of the happy coloring ai homepage (hero section). It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project.*


---

### 1.2 Project objectives

### 1.3 Project plan
(See Appendix A)

### 1.4 Project outcomes


- Build a fully functional online store (product browsing, cart, checkout, order management)
- Integrate AI image generation for paint-by-numbers artwork from Vietnamese text descriptions
- Build an administration system for store management
- Deploy the system to a cloud environment with automated CI/CD

### 1.5 Project evaluation
This project presents a functional custom-generated e-commerce system that executes AI prompts efficiently and correctly.

### 1.6 Project Scope

| In Scope                                     | Out of Scope                         |
| -------------------------------------------- | ------------------------------------ |
| User registration, login, profile management | Online payment gateway (VNPay, MoMo) |
| Product browsing, filtering, sorting         | Real-time chat feature               |
| Shopping cart, order placement (COD)         | OTP phone verification               |
| Product favourites                           | Advanced system settings panel       |
| AI artwork generation from text prompt       |                                      |
| Admin statistics dashboard                   |                                      |

---

## Chapter 4 Software Product Requirements

### 4.1 Review/overview of other similar products
(Original comparison lacking; stakeholders detailed below)

#### Stakeholders

| Stakeholder               | Role                                                 |
| ------------------------- | ---------------------------------------------------- |
| **Customer (User)**       | Browse products, place orders, generate AI artwork   |
| **Administrator (Admin)** | Manage products, orders, and users                   |
| **System**                | Authentication, security, automated image generation |

### 4.2 Use Case Diagrams/User Stories

#### User Functions

| ID    | Feature               | Description                                          |
| ----- | --------------------- | ---------------------------------------------------- |
| UC-01 | User Registration     | Create account with email and password               |
| UC-02 | Login                 | Firebase authentication with "Remember Me" support   |
| UC-03 | Forgot Password       | Send password-reset email via Firebase               |
| UC-04 | Profile Update        | Edit name, phone number, address, date of birth      |
| UC-05 | Product Gallery       | Browse products with filtering and sorting           |
| UC-06 | Product Detail        | View full information for a single product           |
| UC-07 | Favourites            | Add/remove products from a personal favourites list  |
| UC-08 | Shopping Cart         | Add, remove, update item quantities                  |
| UC-09 | Checkout              | Fill in shipping information and select COD payment  |
| UC-10 | Order History         | View list and status of past orders                  |
| UC-11 | AI Artwork Generation | Describe artwork in Vietnamese and select complexity |
| UC-12 | Contact Us            | Send a message via the contact form                  |

---

> **Figure 2.1** — Use Case Diagram showing interactions between User, Admin, and System
>
> `[INSERT FIGURE 2.1 HERE — Use Case Diagram]`
> 
> **Explanation:** *This figure visually illustrates > **figure 2.1** — use case diagram showing interactions between user, admin, and system. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project.*


---

#### Administrator Functions

| ID    | Feature            | Description                                  |
| ----- | ------------------ | -------------------------------------------- |
| UC-13 | Admin Dashboard    | Aggregate statistics: revenue, orders, users |
| UC-14 | Product Management | Create, edit, delete products; upload images |
| UC-15 | Order Management   | View, filter, and update order status        |
| UC-16 | User Management    | Search users and disable accounts            |

### 2.3. Non-Functional Requirements

| Category            | Requirement                                                 |
| ------------------- | ----------------------------------------------------------- |
| **Performance**     | Page load time < 3 seconds for product listings             |
| **Security**        | JWT authentication, HTTPS, rate limiting (100 req / 15 min) |
| **Scalability**     | RESTful, stateless backend architecture                     |
| **Availability**    | Frontend 99.9% uptime (Vercel); backend on Render free tier |
| **Maintainability** | Decoupled frontend/backend; TypeScript for type safety      |

---


## Chapter 5 Review of Software Development Methodologies

### 5.1 Waterfall
### 5.2 Spiral
### 5.3 RAD (Prototyping)
### 5.4 Agile
### 5.5 Selection of software development methodology
**Agile Methodology** was selected to ensure continuous feedback handling and rapid feature prototyping.

## Chapter 6 Design and Implementation of your demo product

### 6.1 Product Analysis and Design

### 3.1. Architecture Overview

The system follows a **Decoupled Client-Server Architecture** with a separate frontend and backend:

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT TIER                          │
│  Browser → Next.js 14 (App Router) → Vercel CDN            │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTPS / REST API
┌─────────────────────────▼───────────────────────────────────┐
│                       SERVER TIER                           │
│  Node.js + Express → Render Cloud                           │
│  Middleware: Helmet, CORS, Rate Limit, JWT Verify           │
└─────────────────────────┬───────────────────────────────────┘
                          │ Firebase Admin SDK
┌─────────────────────────▼───────────────────────────────────┐
│                      DATA / SERVICE TIER                    │
│  Firebase Auth │ Firestore (NoSQL) │ Firebase Storage       │
│                    Google Gemini AI API                     │
└─────────────────────────────────────────────────────────────┘
```

---

> **Figure 3.1** — System Architecture Diagram (three-tier overview)
>
> `[INSERT FIGURE 3.1 HERE — Architecture diagram, e.g. drawn in draw.io]`
> 
> **Explanation:** *This figure visually illustrates > **figure 3.1** — system architecture diagram (three-tier overview). It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project.*


---

### 3.2. Authentication Flow

```
User → Firebase Auth SDK (Client)
     → getIdToken() → JWT
     → Authorization: Bearer <JWT>
     → Backend: auth.verifyIdToken(JWT) [Firebase Admin SDK]
     → req.user = { uid, email, isAdmin }
```

This design leverages Firebase Authentication as an Identity Provider; the backend does not store passwords or session data. According to Firebase Documentation (Google, 2024a), each ID Token is valid for 1 hour and is automatically refreshed by the Firebase SDK.

---

> **Figure 3.2** — Authentication sequence diagram: Firebase Auth SDK → JWT issuance → Backend middleware verification
>
> `[INSERT FIGURE 3.2 HERE — Authentication sequence diagram]`
> 
> **Explanation:** *This figure visually illustrates > **figure 3.2** — authentication sequence diagram: firebase auth sdk → jwt issuance → backend middleware verification. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project.*


---

### 3.3. AI Image Generation Flow (Asynchronous Pattern)

The AI generation feature uses a **Fire-and-Forget with Polling** design pattern:

```
Frontend           Backend                  External Services
   │                  │                           │
   ├─POST /generate──►│                           │
   │◄─202 + jobId─────┤                           │
   │                  ├─translatePrompt──────────►│ MyMemory API
   │                  │◄─englishPrompt────────────┤
   │                  ├─generateImage────────────►│ Gemini API
   │                  │ (async, ~30–90s)           │
   │                  │◄─base64 image─────────────┤
   │                  ├─uploadStorage─────────────►│ Firebase Storage
   │                  │◄─publicUrl────────────────┤
   │                  ├─updateFirestore(completed) │
   │                  │                           │
   ├─GET /status/:id──►│ [every 5 seconds]         │
   │◄─{status,imageUrl}┤                           │
```

**Why polling instead of WebSocket?** Render's free tier does not support persistent WebSocket connections. Polling every 5 seconds with a maximum of 60 attempts (5-minute timeout) is efficient and incurs minimal cost — only one Firestore document read per request.

---

> **Figure 3.3** — AI Generation sequence diagram: prompt input → translation → Gemini call → Storage upload → Firestore update → polling
>
> `[INSERT FIGURE 3.3 HERE — Full AI generation sequence diagram]`
> 
> **Explanation:** *This figure visually illustrates > **figure 3.3** — ai generation sequence diagram: prompt input → translation → gemini call → storage upload → firestore update → polling. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project.*


---


## Chapter 2 Literature Review

### 2.1 The Global Paint-by-Numbers Market
### 2.2 Generative AI in Art Production

## Chapter 3 Technology and Tools

### 3.1 Chapter 3.1: Frontend Framework (Next.js, React)

| Technology          | Version | Purpose                                        |
| ------------------- | ------- | ---------------------------------------------- |
| **Next.js**         | 14.2.33 | React framework with App Router, SSR/SSG       |
| **TypeScript**      | 5.x     | Static typing, reduced runtime errors          |
| **Tailwind CSS**    | 3.4.0   | Utility-first CSS framework                    |
| **Zustand**         | 4.4.7   | State management (auth, cart, favourites)      |
| **Framer Motion**   | 10.18.0 | UI animations and transitions                  |
| **Axios**           | 1.6.2   | HTTP client with request/response interceptors |
| **Firebase SDK**    | 11.10.0 | Firebase Auth client-side SDK                  |
| **react-hot-toast** | 2.4.1   | Toast notification UI                          |

**Why Next.js 14?** Next.js supports Server-Side Rendering, improving SEO for product pages. The App Router (introduced in Next.js 13) enables collocated layouts and loading states. Vercel — the company behind Next.js — provides free hosting with automated CI/CD from GitHub (Vercel, 2024).

**Why Zustand over Redux?** Zustand is significantly smaller (8 KB vs Redux Toolkit 40 KB+), requires no boilerplate actions or reducers, and includes a built-in `persist` middleware for localStorage synchronisation (Dai, 2021).

---

> **Figure 4.1** — Frontend technology stack diagram showing component relationships
>
> `[INSERT FIGURE 4.1 HERE — Frontend tech stack diagram]`
> 
> **Explanation:** *This figure visually illustrates > **figure 4.1** — frontend technology stack diagram showing component relationships. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project.*


---

### 3.2 Chapter 3.2: Backend Framework (Node.js, Express)

| Technology             | Version | Purpose                                        |
| ---------------------- | ------- | ---------------------------------------------- |
| **Node.js**            | 18+     | Server-side JavaScript runtime                 |
| **Express**            | 4.18.2  | Web framework for RESTful routing              |
| **Firebase Admin SDK** | 10.3.0  | JWT verification, Firestore and Storage access |
| **Helmet**             | 7.1.0   | HTTP security headers                          |
| **CORS**               | 2.8.5   | Cross-Origin Resource Sharing                  |
| **express-rate-limit** | 7.1.5   | Request rate limiting per IP                   |
| **Joi**                | 17.11.0 | Input schema validation                        |
| **Morgan**             | 1.10.0  | HTTP request logging                           |
| **Axios**              | 1.6.2   | Outbound calls to Gemini and MyMemory APIs     |
| **Swagger UI**         | 5.0.1   | Auto-generated API documentation               |

### 3.3 Chapter 3.3: Cloud Infrastructure (Firebase, Vercel, Render)

| Service                     | Provider        | Purpose                             |
| --------------------------- | --------------- | ----------------------------------- |
| **Firebase Authentication** | Google Cloud    | User identity management            |
| **Cloud Firestore**         | Google Cloud    | NoSQL document database             |
| **Firebase Storage**        | Google Cloud    | Image file storage                  |
| **Vercel**                  | Vercel Inc.     | Frontend hosting with global CDN    |
| **Render**                  | Render Inc.     | Backend Node.js hosting             |
| **Gemini 2.5 Flash Image**  | Google DeepMind | AI image generation                 |
| **MyMemory Translation**    | Translated.net  | Free Vietnamese→English translation |

---

> **Figure 4.2** — Cloud infrastructure diagram: Vercel ↔ Render ↔ Firebase ↔ Google AI
>
> `[INSERT FIGURE 4.2 HERE — Cloud infrastructure / deployment overview diagram]`
> 
> **Explanation:** *This figure visually illustrates > **figure 4.2** — cloud infrastructure diagram: vercel ↔ render ↔ firebase ↔ google ai. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project.*


---

### 4.4 ERD Database Design
The database relies on NoSQL structure (Firestore Collections)

### 4.5 Sitemap
- `/` : Homepage
- `/gallery` : Products
- `/generate` : AI Interface
- `/cart`, `/checkout`, `/login`, `/admin`

Cloud Firestore is a NoSQL document database. According to Google Firebase documentation (Google, 2024b), data is organised in a Collection → Document → Fields hierarchy.

---

> **Figure 5.1** — Firestore data model overview showing 4 collections and their relationships
>
> `[INSERT FIGURE 5.1 HERE — Firestore entity-relationship / collections diagram]`
> 
> **Explanation:** *This figure visually illustrates > **figure 5.1** — firestore data model overview showing 4 collections and their relationships. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project.*


---

### 5.1. Collection `users`

```
users/{uid}
├── uid            : string   — Firebase Auth UID (primary key)
├── email          : string   — user's email address (unique)
├── displayName    : string   — display name
├── role           : string   — "user" | "admin"
├── phoneNumber    : string   — phone number (optional)
├── address        : string   — shipping address (optional)
├── dateOfBirth    : string   — ISO 8601 date (optional)
├── createdAt      : string   — ISO 8601 timestamp
└── updatedAt      : string   — ISO 8601 timestamp
```

### 5.2. Collection `products`

```
products/{productId}
├── title          : string   — product name
├── description    : string   — full description
├── price          : number   — price in VND
├── category       : string   — category name ("Flowers & Nature", ...)
├── difficulty     : string   — "easy" | "medium" | "hard"
├── dimensions     : string   — canvas size ("30x40 cm")
├── colors         : number   — number of paint colours
├── imageUrl       : string   — main image URL (Firebase Storage)
├── thumbnailUrl   : string   — thumbnail URL
├── status         : string   — "active" | "inactive"
├── sales          : number   — total units sold (aggregated from orders)
├── createdAt      : string   — ISO 8601 timestamp
└── updatedAt      : string   — ISO 8601 timestamp
```

### 5.3. Collection `orders`

```
orders/{orderId}
├── orderNumber    : string   — order code "ORD-XXXXXXXX-XXXX"
├── userId         : string   — UID of the customer
├── items[]        : array    — list of ordered products
│   ├── productId  : string
│   ├── title      : string
│   ├── price      : number
│   ├── quantity   : number
│   └── isAIProduct: boolean
├── shippingAddress:
│   ├── fullName   : string
│   ├── phone      : string
│   ├── address    : string
│   └── city       : string
├── totalAmount    : number   — total price in VND
├── paymentMethod  : string   — "cod" | "bank_transfer"
├── status         : string   — "pending"|"processing"|"shipping"|"delivered"|"cancelled"
├── paymentStatus  : string   — "pending" | "paid" | "failed"
├── note           : string   — delivery note (optional)
├── createdAt      : string
└── updatedAt      : string
```

### 5.4. Collection `generations`

```
generations/{generationId}
├── id             : string   — Firestore document ID
├── userId         : string   — UID of the creator
├── prompt         : string   — original description (in Vietnamese)
├── style          : string   — art style ("realistic", "anime", ...)
├── complexity     : string   — "easy" | "medium" | "hard"
├── status         : string   — "processing" | "completed" | "failed"
├── imageUrl       : string   — result image URL (after completion)
├── error          : string   — error message (if failed)
├── createdAt      : string   — generation start time
├── completedAt    : string   — completion time
└── failedAt       : string   — failure time
```

---

### 6.2 Features include with screenshots

---

### 6.1. USER REGISTRATION (UC-01)

**Files:** `frontend/src/app/register/page.tsx`, `backend/src/routes/auth.js`

---

> **Figure 6.1** — Screenshot of the Registration page
>
> `[INSERT FIGURE 6.1 HERE]`
> 
> **Explanation:** *This figure visually illustrates > **figure 6.1** — screenshot of the registration page. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project.*


---

**Execution Flow:**

```
Step 1:  User fills in email, password, and display name
Step 2:  Frontend validates (email format, password ≥ 6 characters)
Step 3:  createUserWithEmailAndPassword(auth, email, password) — Firebase SDK
Step 4:  updateProfile(user, { displayName }) — set display name in Firebase Auth
Step 5:  user.getIdToken() — obtain JWT
Step 6:  POST /api/auth/register + Bearer token + body { email, displayName }
Step 7:  Backend verifyIdToken(token) → confirms user exists in Firebase Auth
Step 8:  Creates Firestore document users/{uid} with role: "user"
Step 9:  Returns 201 Created
Step 10: Redirect user to homepage
```

**Dual-mode design:** The `/api/auth/register` route supports two flows:

- **Flow A (Bearer token present):** User was already created by the Firebase SDK → backend only creates the Firestore document
- **Flow B (no token):** Backend creates the Firebase Auth user first, then the Firestore document

**Error Codes:**

| Code                        | Source        | Cause                              | User-facing Message                      |
| --------------------------- | ------------- | ---------------------------------- | ---------------------------------------- |
| `auth/email-already-in-use` | Firebase Auth | Email already registered           | "This email is already in use"           |
| `auth/weak-password`        | Firebase Auth | Password shorter than 6 characters | "Password must be at least 6 characters" |
| `auth/invalid-email`        | Firebase Auth | Malformed email address            | "Invalid email address"                  |
| `400 Bad Request`           | Backend       | Missing email field in body        | `{ error: "Email is required" }`         |
| `500 Internal Server Error` | Backend       | Firestore write failure            | `{ error: "Internal server error" }`     |

---

### 6.2. LOGIN (UC-02)

**Files:** `frontend/src/app/login/page.tsx`, `frontend/src/store/authStore.ts`

---

> **Figure 6.2** — Screenshot of the Login page
>
> `[INSERT FIGURE 6.2 HERE]`
> 
> **Explanation:** *This figure visually illustrates > **figure 6.2** — screenshot of the login page. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project.*


---

> **Figure 6.3** — Axios interceptor flow: request token injection and automatic 401 retry logic
>
> `[INSERT FIGURE 6.3 HERE — Interceptor flow diagram]`
> 
> **Explanation:** *This figure visually illustrates > **figure 6.3** — axios interceptor flow: request token injection and automatic 401 retry logic. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project.*


---

**Important note:** The backend has **no login route**. All authentication is handled client-side through the Firebase Auth SDK. This is an intentional design decision to prevent the backend from issuing tokens outside of Firebase's control.

**Execution Flow:**

```
Step 1: signInWithEmailAndPassword(auth, email, password) — Firebase SDK
Step 2: user.getIdToken() — obtain JWT (valid for 1 hour)
Step 3: Store token:
         rememberMe = true  → localStorage["authToken"]
         rememberMe = false → sessionStorage["authToken"]
Step 4: Check isAdmin(email) — reads ADMIN_EMAILS from adminConfig.ts
         isAdmin → redirect /admin
         user    → redirect /
```

**Automatic token refresh (api.ts interceptors):**

```javascript
// Request Interceptor: always fetch the latest token before each request
fetchFreshToken() → auth.currentUser.getIdToken(true) → Bearer <token>

// Response Interceptor: on 401 → silently retry once with a fresh token
if (error.response.status === 401 && !retried) {
    retried = true
    refreshToken() → retry original request
} else {
    clearTokens() → redirect "/login"
}
```

**Error Codes:**

| Code                      | Source        | Cause                                  | User-facing Message                  |
| ------------------------- | ------------- | -------------------------------------- | ------------------------------------ |
| `auth/user-not-found`     | Firebase Auth | Email not registered                   | "Incorrect email or password"        |
| `auth/wrong-password`     | Firebase Auth | Wrong password                         | "Incorrect email or password"        |
| `auth/invalid-credential` | Firebase Auth | Invalid credentials (Firebase SDK v9+) | "Incorrect email or password"        |
| `auth/too-many-requests`  | Firebase Auth | Too many consecutive failed attempts   | "Account temporarily locked"         |
| `auth/user-disabled`      | Firebase Auth | Account disabled by admin              | "This account has been suspended"    |
| `401 Unauthorized`        | Backend API   | Token expired mid-session              | Auto-refresh → if still 401 → logout |

---

### 6.3. FORGOT PASSWORD (UC-03)

**File:** `frontend/src/app/forgot-password/page.tsx`

---

> **Figure 6.4** — Screenshot of the Forgot Password page (email input and success state)
>
> `[INSERT FIGURE 6.4 HERE]`
> 
> **Explanation:** *This figure visually illustrates > **figure 6.4** — screenshot of the forgot password page (email input and success state). It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project.*


---

**Execution Flow:**

```
Step 1: User enters their email address
Step 2: sendPasswordResetEmail(auth, email) — Firebase Auth SDK
Step 3: Firebase sends an automated email containing a reset link
Step 4: User clicks the link → Firebase handles the password update
Step 5: Display success confirmation screen
```

**Error Codes:**

| Code                     | Cause                   | Message                                   |
| ------------------------ | ----------------------- | ----------------------------------------- |
| `auth/user-not-found`    | Email not registered    | "This email does not exist in the system" |
| `auth/invalid-email`     | Malformed email         | "Invalid email address"                   |
| `auth/too-many-requests` | Too many reset requests | "Please wait and try again later"         |

---

### 6.4. PRODUCT GALLERY (UC-05)

**Files:** `frontend/src/app/gallery/page.tsx`, `backend/src/routes/products.js`, `backend/src/services/productService.js`

**API:** `GET /api/products`

---

> **Figure 6.5** — Screenshot of the Gallery page with filter options and masonry product grid
>
> `[INSERT FIGURE 6.5 HERE]`
> 
> **Explanation:** *This figure visually illustrates > **figure 6.5** — screenshot of the gallery page with filter options and masonry product grid. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project.*


---

**Query Parameters:**

| Parameter    | Type   | Description                     |
| ------------ | ------ | ------------------------------- |
| `category`   | string | Filter by category              |
| `difficulty` | string | "easy" / "medium" / "hard"      |
| `minPrice`   | number | Minimum price (VND)             |
| `maxPrice`   | number | Maximum price (VND)             |
| `sortBy`     | string | "price" / "sales" / "createdAt" |
| `sortOrder`  | string | "asc" / "desc"                  |
| `page`       | number | Current page (default: 1)       |
| `limit`      | number | Items per page (default: 20)    |

**Pagination and Sorting Strategy:**

Firestore does not efficiently support multi-field ordering without Composite Indexes. To avoid index management overhead, the system adopts the strategy: **query Firestore with basic filters → sort and paginate in JavaScript memory**. This is a deliberate trade-off: simpler operations (no manual index creation) at the cost of fetching more documents initially — acceptable for a moderate dataset size.

**Error Codes:**

| Code  | Cause                      | Behaviour                                                      |
| ----- | -------------------------- | -------------------------------------------------------------- |
| `500` | Firestore connection error | Returns `{ products: [], pagination: {...} }` — does not crash |

---

### 6.5. FAVOURITES (UC-07)

**File:** `frontend/src/store/favoriteStore.ts`

**Design:** Entirely client-side storage (localStorage via Zustand `persist`); **no backend API required**.

---

> **Figure 6.6** — Screenshot of the Profile page "Favourites" tab
>
> `[INSERT FIGURE 6.6 HERE]`
> 
> **Explanation:** *This figure visually illustrates > **figure 6.6** — screenshot of the profile page "favourites" tab. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project.*


---

**Zustand Store Structure:**

```typescript
{
  favoritesByUser: Record<string, Product[]>,  // { [uid]: [...products] }
  favorites: Product[],                         // active user's favourites
  currentUserId: string | null,
}
```

**Why multi-user keying?** If multiple users log in on the same device, their favourites remain isolated. `setCurrentUser(uid)` reads `favoritesByUser[uid]` and loads it into `favorites[]`.

```
setCurrentUser(uid) → favorites = favoritesByUser[uid] ?? []
addFavorite(product) → favoritesByUser[uid].push(product) → persist to localStorage
removeFavorite(id)   → favoritesByUser[uid].filter(p => p.id !== id)
```

---

### 6.6. SHOPPING CART (UC-08)

**Files:** `frontend/src/store/cartStore.ts`, `frontend/src/app/cart/page.tsx`

**Design:** Client-side storage (localStorage) via Zustand `persist` middleware.

---

> **Figure 6.7** — Screenshot of the Shopping Cart page
>
> `[INSERT FIGURE 6.7 HERE]`
> 
> **Explanation:** *This figure visually illustrates > **figure 6.7** — screenshot of the shopping cart page. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project.*


---

**Store Actions:**

| Action                       | Description                                        |
| ---------------------------- | -------------------------------------------------- |
| `addItem(product, quantity)` | Add product; increment quantity if already present |
| `removeItem(productId)`      | Remove product from cart                           |
| `updateQuantity(id, qty)`    | Update item quantity                               |
| `toggleSelectItem(id)`       | Toggle selection for checkout                      |
| `selectAllItems()`           | Select all items                                   |
| `moveToSavedForLater(id)`    | Move item to saved-for-later list                  |
| `getSelectedTotal()`         | Compute total for selected items                   |
| `clearCart()`                | Remove all items from cart                         |

---

### 6.7. CHECKOUT AND ORDER PLACEMENT (UC-09)

**Files:** `frontend/src/app/checkout/page.tsx`, `backend/src/routes/orders.js`, `backend/src/services/orderService.js`

**API:** `POST /api/orders`

---

> **Figure 6.8** — Screenshot of the Checkout page with shipping form
>
> `[INSERT FIGURE 6.8 HERE]`
> 
> **Explanation:** *This figure visually illustrates > **figure 6.8** — screenshot of the checkout page with shipping form. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project.*


---

> **Figure 6.9** — Screenshot of the Order Success confirmation page
>
> `[INSERT FIGURE 6.9 HERE]`
> 
> **Explanation:** *This figure visually illustrates > **figure 6.9** — screenshot of the order success confirmation page. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project.*


---

**Joi Validation Schema:**

```javascript
createOrderSchema = {
  items: array of { productId, title, price, quantity },  // required
  shippingAddress: {
    fullName: string.required(),
    phone:    string.required(),
    address:  string.required(),
    city:     string.required()
  },
  totalAmount:   number.required(),
  paymentMethod: "cod" | "bank_transfer",
  note:          string.optional()
}
```

**Order Number Generation:**

```javascript
generateOrderNumber() {
  timestamp = Date.now().toString(36).toUpperCase()     // Base-36 encoded timestamp
  random    = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `ORD-${timestamp}-${random}`
  // Example output: "ORD-M6JZTW12-K3P7"
}
```

**Full Order Placement Flow:**

```
Frontend: validate form → POST /api/orders (with Bearer token)
Backend:
  1. authenticateUser     → extract userId from JWT
  2. validate(schema)     → Joi validates request body
  3. createOrder(userId)  → generateOrderNumber()
  4. Write to Firestore orders/{id} with status: "pending"
  5. Return 201 Created + order object
Frontend:
  6. Save lastOrder to localStorage
  7. clearCart()          → empty the shopping cart
  8. Redirect to /order-success
```

**Error Codes:**

| Code                        | Cause                                              |
| --------------------------- | -------------------------------------------------- |
| `400 Bad Request`           | Joi validation failure (missing or invalid fields) |
| `401 Unauthorized`          | No Bearer token provided                           |
| `500 Internal Server Error` | Firestore write failure                            |

---

### 6.8. AI ARTWORK GENERATION (UC-11) — Core Feature

**Files:** `frontend/src/app/generate/page.tsx`, `backend/src/routes/generate.js`

**APIs:**

- `POST /api/generate/paint-by-numbers` — initiate generation
- `GET /api/generate/status/:generationId` — poll status

---

> **Figure 6.10** — Screenshot of the AI Generate page: prompt input area, complexity selector buttons
>
> `[INSERT FIGURE 6.10 HERE]`
> 
> **Explanation:** *This figure visually illustrates > **figure 6.10** — screenshot of the ai generate page: prompt input area, complexity selector buttons. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project.*


---

> **Figure 6.11** — Example of a completed AI-generated paint-by-numbers image showing numbered regions and colour palette strip at the bottom
>
> `[INSERT FIGURE 6.11 HERE — Sample generated output image]`
> 
> **Explanation:** *This figure visually illustrates > **figure 6.11** — example of a completed ai-generated paint-by-numbers image showing numbered regions and colour palette strip at the bottom. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project.*


---

#### 6.8.1. Complexity Configuration

| Level    | Max Colours | Detail Description                                                 |
| -------- | ----------- | ------------------------------------------------------------------ |
| `easy`   | 16          | Simple bold shapes, large paint regions, minimal detail            |
| `medium` | 28          | Moderate detail, medium-sized regions, balanced composition        |
| `hard`   | 44          | Highly detailed, many small intricate regions, complex composition |

#### 6.8.2. Full Processing Pipeline

**Step 1 — Translation (`translatePromptToEnglish`)**

```
Input:  "con mèo ngồi dưới cây hoa anh đào"  (Vietnamese)
→ GET  https://api.mymemory.translated.net/get?q=...&langpair=vi|en
→ Output: "a cat sitting under cherry blossom tree"  (English)
Timeout: 10 seconds — on failure, use original Vietnamese text as fallback
```

**Step 2 — Prompt Construction (`buildLineArtPrompt`)**

The prompt template has two sections:

- **Static instructions:** drawing rules, style guidance, prohibition of colour fills inside regions, palette strip layout
- **Dynamic placeholders:** `{{USER_PROMPT}}`, `{{STYLE}}`, `{{COLOR_MAX}}`, `{{SEQ_NUMBERS}}`, `{{DETAIL}}`

For `medium` complexity, the prompt specifies: 28 colours, number sequence `1, 2, 3, ... 28`, and moderate detail instructions.

**Step 3 — Gemini API Call (`generateWithGoogleImage`)**

```
Endpoint: POST https://generativelanguage.googleapis.com/v1beta/
          models/gemini-2.5-flash-image:generateContent?key={API_KEY}

Payload:
{
  "contents": [{ "parts": [{ "text": "<lineArtPrompt>" }] }],
  "generationConfig": { "responseModalities": ["TEXT", "IMAGE"] }
}

Timeout: 120 seconds
Parse result: candidates[0].content.parts → find part where inlineData.data exists
→ Buffer.from(base64String, "base64")
```

**Step 4 — Upload to Firebase Storage (`uploadToStorage`)**

```javascript
bucket.file(`generations/${fileName}`).save(buffer, {
  metadata: { contentType: "image/png" }
})
file.makePublic()
→ https://storage.googleapis.com/{bucketName}/generations/{fileName}
```

**Step 5 — Firestore Update and Frontend Polling**

```
Backend updates Firestore: generations/{id}.status = "completed", imageUrl = publicUrl
Frontend polls:            setInterval(5000ms) → GET /api/generate/status/:id
Termination conditions:
  status = "completed" → render image
  status = "failed"    → display error message
  After 60 polls (5 min) → timeout, display "Request timed out"
```

**Error Codes:**

| Code                 | Source    | Cause                                                                |
| -------------------- | --------- | -------------------------------------------------------------------- |
| `400`                | Backend   | Missing prompt or prompt exceeds 500 characters                      |
| `401`                | Backend   | User not authenticated                                               |
| `403`                | Backend   | Requesting status of another user's generation                       |
| `404`                | Backend   | generationId not found in Firestore                                  |
| `500`                | Backend   | Gemini API failure, Firebase Storage error, or Firestore write error |
| `RESOURCE_EXHAUSTED` | Google AI | Free-tier quota exceeded (60 req/min)                                |
| `INVALID_ARGUMENT`   | Google AI | Prompt violates content safety policy                                |

---

### 6.9. ADMIN DASHBOARD (UC-13)

**Files:** `frontend/src/app/admin/page.tsx`, `backend/src/routes/admin.js`

**API:** `GET /api/admin/stats`

---

> **Figure 6.12** — Screenshot of the Admin Dashboard with statistics cards and order status breakdown
>
> `[INSERT FIGURE 6.12 HERE]`
> 
> **Explanation:** *This figure visually illustrates > **figure 6.12** — screenshot of the admin dashboard with statistics cards and order status breakdown. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project.*


---

**Statistics Aggregation:**

The backend calls three service functions concurrently using `Promise.all()`:

```javascript
const [productStats, orderStats, userStats] = await Promise.all([
  getProductStats(), // count active/inactive products
  getOrderStats(), // total orders and paid revenue (paymentStatus = "paid")
  getUserStats(), // total users and new registrations by month
]);
```

**Response Payload:**

```json
{
  "totalOrders": 42,
  "totalProducts": 15,
  "totalUsers": 128,
  "totalRevenue": 12450000,
  "pendingOrders": 8,
  "processingOrders": 5,
  "shippingOrders": 3,
  "deliveredOrders": 26
}
```

**Error Codes:**

| Code  | Cause                          |
| ----- | ------------------------------ |
| `401` | No Bearer token provided       |
| `403` | Email not in ADMIN_EMAILS list |

---

### 6.10. ADMIN PRODUCT MANAGEMENT (UC-14)

**Files:** `frontend/src/app/admin/products/page.tsx`, `backend/src/routes/admin/products.js`

---

> **Figure 6.13** — Screenshot of the Admin Products page with product list table and add/edit modal
>
> `[INSERT FIGURE 6.13 HERE]`
> 
> **Explanation:** *This figure visually illustrates > **figure 6.13** — screenshot of the admin products page with product list table and add/edit modal. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project.*


---

**REST Endpoints:**

| Method   | Path                  | Description                              |
| -------- | --------------------- | ---------------------------------------- |
| `GET`    | `/api/admin/products` | List all products (including inactive)   |
| `POST`   | `/api/products`       | Create a new product                     |
| `PUT`    | `/api/products/:id`   | Update product details                   |
| `DELETE` | `/api/products/:id`   | Soft delete — sets `status = "inactive"` |

**Image Upload:** The frontend uses the Firebase Storage Client SDK to upload images directly (bypassing the backend) and receives a `downloadURL`. This URL is submitted alongside product data when creating or updating a product.

---

### 6.3 Product Implementation (Security & API Flow)

### 7.1. Authentication and Authorisation

The system uses **JSON Web Tokens (JWT)** issued by Firebase Authentication. Each token contains:

- `uid`: Firebase User ID
- `email`: user's email address
- `exp`: expiry timestamp (1 hour from issuance)
- RS256 digital signature to prevent forgery

The backend validates every protected request using `auth.verifyIdToken(token)` from the Firebase Admin SDK, which verifies the JWT signature without any database lookup (Rescorla, 2015).

**Admin authorisation** is enforced at two independent layers:

- **Client-side:** `adminConfig.ts` — automatically redirects admin users after login
- **Server-side:** `requireAdmin` middleware — returns HTTP 403 if email is not in ADMIN_EMAILS

---

> **Figure 7.1** — Two-layer authorisation diagram: client-side redirect guard and server-side middleware guard
>
> `[INSERT FIGURE 7.1 HERE — Authorisation layers diagram]`
> 
> **Explanation:** *This figure visually illustrates > **figure 7.1** — two-layer authorisation diagram: client-side redirect guard and server-side middleware guard. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project.*


---

### 7.2. OWASP Top 10 Mitigations

| OWASP Vulnerability                                  | Mitigation Applied                                                                     |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **A01 — Broken Access Control**                      | JWT verification on all protected routes; ownership checks (`userId === req.user.uid`) |
| **A02 — Cryptographic Failures**                     | HTTPS enforced end-to-end; passwords never stored (Firebase manages credentials)       |
| **A03 — Injection**                                  | Joi schema validation on all inputs; Firestore uses parameterised queries (no raw SQL) |
| **A05 — Security Misconfiguration**                  | Helmet.js automatically sets 12 HTTP security response headers                         |
| **A07 — Identification and Authentication Failures** | Firebase Auth account lock-out after repeated failed login attempts                    |
| **A09 — Security Logging and Monitoring**            | Morgan HTTP request logger enabled on all routes                                       |

### 7.3. Rate Limiting

```javascript
rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute window
  max: 100, // max 100 requests per IP per window
  message: "Too many requests, please try again later",
});
```

`app.set("trust proxy", 1)` is set to correctly extract the client's real IP address when running behind Render's reverse proxy (Express.js, 2024).

### 7.4. CORS Configuration

```javascript
const allowedOrigins = new Set([
  "http://localhost:3002",
  "https://happy-coloring-ai.vercel.app",
  "https://paint-by-numbers-ai-607c4.web.app",
  // + values from env CORS_ORIGIN and FRONTEND_URL
]);
// All *.vercel.app subdomains are permitted for Vercel Preview deployments
```

---

## 8. HTTP ERROR CODE REFERENCE

### 8.1. HTTP Status Code Groups

According to RFC 9110 (Fielding et al., 2022):

| Group | Range   | Meaning           |
| ----- | ------- | ----------------- |
| 2xx   | 200–299 | Success           |
| 4xx   | 400–499 | Client-side error |
| 5xx   | 500–599 | Server-side error |

---

> **Figure 8.1** — Error propagation flow diagram: source (Firebase / Gemini / Firestore) → backend response → frontend user message
>
> `[INSERT FIGURE 8.1 HERE — Error flow diagram]`
> 
> **Explanation:** *This figure visually illustrates > **figure 8.1** — error propagation flow diagram: source (firebase / gemini / firestore) → backend response → frontend user message. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project.*


---

### 8.2. System-Specific HTTP Error Codes

#### 2xx — Success

| Code           | Name     | When It Occurs                                                        |
| -------------- | -------- | --------------------------------------------------------------------- |
| `200 OK`       | OK       | Reading products, viewing orders, fetching profile                    |
| `201 Created`  | Created  | Account registered; order placed successfully                         |
| `202 Accepted` | Accepted | AI generation started — request accepted, processing not yet complete |

#### 4xx — Client Errors

| Code                    | Name                | Specific Cause in This System                                                                            | Related Route                                                                                |
| ----------------------- | ------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `400 Bad Request`       | Invalid data        | Joi validation failure (missing field, wrong type); empty prompt or prompt > 500 chars for AI generation | `/api/auth/register`, `/api/orders`, `/api/generate`                                         |
| `401 Unauthorized`      | Not authenticated   | Missing `Authorization: Bearer <token>` header; token expired (> 1 hour); token revoked                  | All protected routes                                                                         |
| `403 Forbidden`         | No permission       | Email not in ADMIN_EMAILS when calling admin route; User A accessing User B's order or generation status | `/api/admin/*`, `/api/orders/:id`, `/api/generate/status/:id`                                |
| `404 Not Found`         | Resource missing    | Product deleted or wrong ID; order not found; Firestore user profile missing; unknown generationId       | `/api/products/:id`, `/api/orders/:id`, `/api/auth/profile/:uid`, `/api/generate/status/:id` |
| `429 Too Many Requests` | Rate limit exceeded | More than 100 requests from the same IP within any 15-minute window                                      | All routes                                                                                   |

#### 5xx — Server Errors

| Code                        | Name         | Specific Cause                                                                                                                    | System Behaviour                                                                                                      |
| --------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `500 Internal Server Error` | Server error | Firestore connection failure; Gemini returns no image data; Firebase Storage upload error; missing or invalid `GOOGLE_AI_API_KEY` | Error is logged server-side; response body: `{ error: "message" }`; generation document updated to `status: "failed"` |

### 8.3. Firebase Authentication Error Codes

| Firebase Error Code           | When It Occurs                                       | User-Facing Message                                          |
| ----------------------------- | ---------------------------------------------------- | ------------------------------------------------------------ |
| `auth/email-already-in-use`   | Registration with an existing email                  | "This email is already in use"                               |
| `auth/weak-password`          | Password shorter than 6 characters                   | "Password must be at least 6 characters"                     |
| `auth/invalid-email`          | Malformed email address                              | "Invalid email address"                                      |
| `auth/user-not-found`         | Login or password reset with unknown email           | "Incorrect email or password"                                |
| `auth/wrong-password`         | Wrong password entered                               | "Incorrect email or password"                                |
| `auth/invalid-credential`     | Invalid credentials — Firebase SDK v9+ unified error | "Incorrect email or password"                                |
| `auth/too-many-requests`      | Too many consecutive failed login attempts           | "Account temporarily locked due to too many failed attempts" |
| `auth/user-disabled`          | Account disabled by administrator                    | "This account has been suspended"                            |
| `auth/network-request-failed` | No internet connection                               | "Please check your connection and try again"                 |

### 8.4. Google Gemini API Error Codes

| Code / Type                 | Cause                                          | System Behaviour                                            |
| --------------------------- | ---------------------------------------------- | ----------------------------------------------------------- |
| `RESOURCE_EXHAUSTED`        | Free-tier API quota exceeded (60 req/min)      | Generation set to `status: "failed"`                        |
| `INVALID_ARGUMENT`          | Prompt violates Google's content safety policy | Generation set to `status: "failed"`                        |
| `DEADLINE_EXCEEDED`         | Axios timeout after 120 seconds                | `lastError` is thrown; generation set to `status: "failed"` |
| No `inlineData` in response | AI returned only text, no image                | `throw new Error("No image data returned by <model>")`      |

---

### 6.4 Evaluation of your product

#### User Interface Highlights

### 9.1. Homepage (Landing Page — `/`)

The page is structured in 6 sections following the AIDA design pattern (Attention, Interest, Desire, Action):

1. **Hero Section:** Animated wave-effect title "Color with Pure Elegance", two CTA buttons (Generate AI Art / Explore Gallery), full-width banner with hover zoom effect
2. **Featured Products:** Masonry grid layout, loads the 8 best-selling products from the API, price and title overlay on hover
3. **About Us:** Two-column layout (introductory text + illustrative image), slide-in animation from both sides on scroll
4. **3 Simple Steps:** Three cards with step numbers, emoji icons, scroll-triggered fade-in animation
5. **Why Choose Yu Ling Store:** Four feature cards with hover float effect
6. **Final CTA:** Purple-to-pink gradient banner with two action buttons

---

> **Figure 9.1** — Annotated screenshot of the full Homepage showing all 6 sections
>
> `[INSERT FIGURE 9.1 HERE — Full homepage annotated screenshot]`
> 
> **Explanation:** *This figure visually illustrates > **figure 9.1** — annotated screenshot of the full homepage showing all 6 sections. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project.*


---

### 9.2. Gallery Page (`/gallery`)

- Topbar filter panel: category dropdown, difficulty radio buttons, price range inputs
- Sort options: Popular / Newest / Price Ascending / Price Descending
- Masonry grid layout with lazy loading (Intersection Observer API)
- Heart/favourite toggle button on each product card (instant state update, no page reload)
- Pagination / "Load More" button

---

> **Figure 9.2** — Screenshot of the Gallery page with filters applied and masonry grid
>
> `[INSERT FIGURE 9.2 HERE — Gallery page with active filters]`
> 
> **Explanation:** *This figure visually illustrates > **figure 9.2** — screenshot of the gallery page with filters applied and masonry grid. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project.*


---

### 9.3. AI Generate Page (`/generate`)

- Textarea for entering the artwork description (Vietnamese, max 500 characters with live counter)
- Three complexity selector buttons displaying colour counts: Easy (16), Medium (28), Hard (44)
- Loading animation with progress messages during generation
- Result display area with "Add to Cart" button once the image is ready

---

> **Figure 9.3** — Screenshot of the Generate page: left — input state; right — result display state
>
> `[INSERT FIGURE 9.3 HERE — Generate page input and result states]`
> 
> **Explanation:** *This figure visually illustrates > **figure 9.3** — screenshot of the generate page: left — input state; right — result display state. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project.*


---

### 9.4. User Profile Page (`/profile`)

Three tabs:

| Tab            | Content                                                    |
| -------------- | ---------------------------------------------------------- |
| **My Info**    | Editable form: display name, phone, address, date of birth |
| **Favourites** | Grid of favourited products loaded from `favoriteStore`    |
| **My Orders**  | List of the user's orders with status badges               |

---

> **Figure 9.4** — Screenshot of the Profile page showing the three tabs
>
> `[INSERT FIGURE 9.4 HERE — Profile page with tabs]`
> 
> **Explanation:** *This figure visually illustrates > **figure 9.4** — screenshot of the profile page showing the three tabs. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project.*


---

### 9.5. Admin Dashboard (`/admin`)

- Four statistics cards: Revenue, Orders, Products, Users
- Order status breakdown chart (pending / processing / shipping / delivered)
- Navigation links to sub-pages: Orders / Products / Users
- **Access protection:** admin email account required; non-admin users are redirected by `adminConfig.ts`; backend returns `403` for direct API calls without admin credentials

---

> **Figure 9.5** — Screenshot of the Admin Dashboard with statistics cards
>
> `[INSERT FIGURE 9.5 HERE — Admin Dashboard screenshot]`
> 
> **Explanation:** *This figure visually illustrates > **figure 9.5** — screenshot of the admin dashboard with statistics cards. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project.*


---

> **Figure 9.6** — Screenshot of the Admin Orders management table with status filter
>
> `[INSERT FIGURE 9.6 HERE — Admin Orders management page]`
> 
> **Explanation:** *This figure visually illustrates > **figure 9.6** — screenshot of the admin orders management table with status filter. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project.*


---

> **Figure 9.7** — Screenshot of the Admin Products page with the product add/edit modal
>
> `[INSERT FIGURE 9.7 HERE — Admin Products management page]`
> 
> **Explanation:** *This figure visually illustrates > **figure 9.7** — screenshot of the admin products page with the product add/edit modal. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project.*


---

### 9.6. Contact Page (`/contact`)

- Hero banner with gradient background
- Left column: contact information cards (email, phone, address, working hours) and social media links
- Right column: validated contact form
  - Fields: Full Name, Email, Subject (dropdown with 6 options), Message (min 20 characters, live character counter)
  - Submit button with loading spinner
  - Post-submission success screen with the submitted email displayed
- FAQ section: 6 common questions and concise answers

---

> **Figure 9.8** — Screenshot of the Contact page showing the info panel and contact form
>
> `[INSERT FIGURE 9.8 HERE — Contact page screenshot]`
> 
> **Explanation:** *This figure visually illustrates > **figure 9.8** — screenshot of the contact page showing the info panel and contact form. It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project.*


---

#### Deployment Procedures

### 10.1. Production Environment

| Component   | URL                                              | Platform     |
| ----------- | ------------------------------------------------ | ------------ |
| Frontend    | `https://happy-coloring-ai.vercel.app`           | Vercel       |
| Backend API | `https://paint-by-numbers-back-end.onrender.com` | Render       |
| Database    | Firebase Firestore                               | Google Cloud |
| Storage     | Firebase Storage                                 | Google Cloud |

### 10.2. CI/CD Pipeline

**Frontend (Vercel):**

```
git push origin main → Vercel webhook → next build → deploy to global CDN
A unique Preview URL is automatically created for every Pull Request
```

**Backend (Render):**

```
git push origin main → Render deploy hook → npm start → service live
```

---

> **Figure 10.1** — CI/CD pipeline diagram: GitHub repository → Vercel (frontend) and GitHub → Render (backend)
>
> `[INSERT FIGURE 10.1 HERE — CI/CD pipeline diagram]`
> 
> **Explanation:** *This figure visually illustrates > **figure 10.1** — ci/cd pipeline diagram: github repository → vercel (frontend) and github → render (backend). It serves to highlight the specific UI layout, system architecture, or logical sequence mapped for this section of the project.*


---

### 10.3. Environment Variables

**Backend (`.env`):**

| Variable                  | Description                                   |
| ------------------------- | --------------------------------------------- |
| `FIREBASE_PROJECT_ID`     | Firebase project ID                           |
| `FIREBASE_CLIENT_EMAIL`   | Service account email address                 |
| `FIREBASE_PRIVATE_KEY`    | Service account private key (PEM format)      |
| `FIREBASE_STORAGE_BUCKET` | Firebase Storage bucket name                  |
| `GOOGLE_AI_API_KEY`       | Google AI Studio (Gemini) API key             |
| `ADMIN_EMAILS`            | Comma-separated list of admin email addresses |
| `CORS_ORIGIN`             | Allowed frontend domain for production        |

**Frontend (`.env.local`):**

| Variable                           | Description          |
| ---------------------------------- | -------------------- |
| `NEXT_PUBLIC_API_URL`              | Backend API base URL |
| `NEXT_PUBLIC_FIREBASE_API_KEY`     | Firebase web API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`  | Firebase project ID  |

### 10.4. Render Free Tier Cold Start

Render's free tier suspends the service after 15 minutes without incoming traffic. The first request after a suspension period may take 30–50 seconds for the instance to wake up. This is a documented and accepted limitation for development and demo environments (Render, 2024).

---

## Chapter 7 Conclusions

### 7.1 What you have learned in this project?

### 7.2 What is the result of this project?

| Objective                       | Result                                                |
| ------------------------------- | ----------------------------------------------------- |
| Full-featured e-commerce system | ✅ 21 features implemented                            |
| AI image generation integration | ✅ Gemini 2.5 Flash Image, 3 complexity levels        |
| Admin management system         | ✅ Dashboard, full CRUD for products / orders / users |
| Cloud deployment with CI/CD     | ✅ Vercel + Render + Firebase                         |
| OWASP security compliance       | ✅ JWT, Helmet, CORS, Rate Limiting, Joi validation   |

### 11.2. Known Limitations

- **Backend cold start:** Render free tier suspends after 15 minutes of inactivity
- **AI output variability:** Gemini occasionally does not fully comply with the prompt template structure; few-shot prompting could improve consistency
- **Payment:** Only COD and manual bank transfer are supported; no automated payment gateway integration
- **Search:** No full-text search capability; current product filtering uses exact-match only

### 7.3 Further development of this project

- Integrate an automated payment gateway (VNPay or MoMo)
- Add a product ratings and reviews system
- Improve AI output quality with few-shot prompt examples
- Replace polling with WebSocket when upgrading to a paid Render plan
- Add full-text search using Algolia or Typesense
- Implement automated order status email notifications

---

## REFERENCES
[insert refs here]

## PROJECT PROPOSAL
[Insert approved proposal]

## APPENDIX 1
### SURVEY AND RESULTS

## APPENDIX 2
### SCHEDULE OF WORK


Dai, P. (2021). _Zustand: Bear necessities for state management in React_. GitHub. https://github.com/pmndrs/zustand

Express.js. (2024). _Trust proxy in Express_. Express.js Documentation. https://expressjs.com/en/guide/behind-proxies.html

Fielding, R., Nottingham, M. and Reschke, J. (2022). _HTTP Semantics_ (RFC 9110). Internet Engineering Task Force. https://www.rfc-editor.org/rfc/rfc9110

Google. (2024a). _Firebase Authentication overview_. Firebase Documentation. https://firebase.google.com/docs/auth

Google. (2024b). _Cloud Firestore data model_. Firebase Documentation. https://firebase.google.com/docs/firestore/data-model

Google. (2024c). _Gemini API reference — generateContent_. Google AI for Developers. https://ai.google.dev/api/generate-content

Grand View Research. (2023). _Paint by Numbers Market Size, Share & Trends Analysis Report_. Grand View Research. https://www.grandviewresearch.com/industry-analysis/paint-by-numbers-market

Helme, S. (2023). _Helmet.js — Help secure Express apps with various HTTP headers_. GitHub. https://github.com/helmetjs/helmet

Lethbridge, T. C. and Laganière, R. (2005). _Object-Oriented Software Engineering: Practical Software Development using UML and Java_ (2nd ed.). McGraw-Hill.

Next.js. (2024). _App Router Introduction_. Vercel / Next.js Documentation. https://nextjs.org/docs/app

OWASP Foundation. (2021). _OWASP Top Ten 2021_. Open Web Application Security Project. https://owasp.org/www-project-top-ten/

Rescorla, E. (2015). _HTTP Over TLS_ (RFC 7235). Internet Engineering Task Force. https://www.rfc-editor.org/rfc/rfc7235

Render. (2024). _Free tier limitations_. Render Documentation. https://render.com/docs/free

Translated.net. (2024). _MyMemory Translation API_. Translated. https://mymemory.translated.net/doc/spec.php

Vercel. (2024). _Vercel deployment overview_. Vercel Documentation. https://vercel.com/docs/deployments/overview
