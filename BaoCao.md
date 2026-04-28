<div align="center">

# FINAL YEAR PROJECT REPORT

**Project Title:** Happy Coloring AI — AI-Integrated Paint-by-Numbers E-Commerce Platform

**Student Name:** [Full Name]

**Student ID:** [ID Number]

**Major:** Information Technology

**Supervisor:** [Supervisor's Name]

**Academic Year:** 2025 – 2026

**Institution:** Greenwich University Vietnam

</div>

---

## ACKNOWLEDGEMENTS

The author would like to express sincere gratitude to the supervisor for the continuous guidance and feedback throughout the development of this project. Appreciation also goes to the faculty of the Information Technology department at Greenwich University Vietnam for providing the academic foundation required to complete this work.

---

## TABLE OF CONTENTS

- [Chapter 1 — Introduction](#chapter-1--introduction)
- [Chapter 2 — Literature Review](#chapter-2--literature-review)
- [Chapter 3 — Technology and Tools](#chapter-3--technology-and-tools)
- [Chapter 4 — Software Product Requirements](#chapter-4--software-product-requirements)
- [Chapter 5 — Review of Software Development Methodologies](#chapter-5--review-of-software-development-methodologies)
- [Chapter 6 — Design and Implementation](#chapter-6--design-and-implementation)
- [Chapter 7 — Conclusions](#chapter-7--conclusions)
- [References](#references)
- [Appendices](#appendices)

---

## Chapter 1 — Introduction

### 1.1 Introduction to the Project Subject

Paint-by-numbers is an art activity that helps users relax, focus, and develop aesthetic sensibility without requiring professional drawing skills. The global paint-by-numbers market is projected to reach USD 1.2 billion by 2028, growing at a CAGR of 6.1% (Grand View Research, 2023).

However, traditional paint-by-numbers products have a fundamental limitation: buyers can only choose from pre-designed templates and cannot create artwork from their own ideas. The emergence of generative image AI models such as Google Gemini opens the possibility of fully personalising products on demand.

This project builds an AI-integrated e-commerce platform — **Happy Coloring AI** — that allows users to both purchase ready-made paint-by-numbers products and generate custom numbered templates from natural language descriptions in Vietnamese.

> **Figure 1.1** — Screenshot of the Happy Coloring AI homepage (hero section)
>
> `[INSERT FIGURE 1.1 HERE]`
>
> **Explanation:** This figure shows the hero section of the Happy Coloring AI homepage, including the animated title "Color with Pure Elegance", two call-to-action buttons (Generate AI Art and Explore Gallery), and the full-width banner image with hover zoom effect.

---

### 1.2 Project Objectives

The objectives of this project are as follows:

- Build a fully functional online store supporting product browsing, shopping cart management, checkout, and order tracking.
- Integrate AI image generation using Google Gemini to allow users to create custom paint-by-numbers artwork from Vietnamese text descriptions.
- Build a complete administration panel supporting product, order, and user management.
- Deploy the entire system to a production cloud environment with automated CI/CD pipelines.
- Implement security best practices aligned with the OWASP Top 10 guidelines.

### 1.3 Project Plan

A detailed project schedule is provided in Appendix 2 — Schedule of Work.

### 1.4 Project Outcomes

The following deliverables were achieved upon completion of the project:

- A fully deployed e-commerce platform accessible at `https://happy-coloring-ai.vercel.app`
- A RESTful backend API deployed at `https://paint-by-numbers-back-end.onrender.com`
- An AI-powered artwork generation feature supporting three levels of complexity
- An administration system with full CRUD operations for products, orders, and users
- Automated CI/CD pipelines for both frontend (Vercel) and backend (Render)

### 1.5 Project Evaluation

This project presents a functional AI-integrated e-commerce system. The AI generation feature successfully produces paint-by-numbers line art from Vietnamese natural language input via the Google Gemini 2.5 Flash Image model. The system is deployed and accessible publicly. All stated objectives were met within the academic timeline.

### 1.6 Project Scope

The following table defines what is included and excluded from the scope of this project.

| In Scope                                         | Out of Scope                         |
| ------------------------------------------------ | ------------------------------------ |
| User registration, login, and profile management | Online payment gateway (VNPay, MoMo) |
| Product browsing, filtering, and sorting         | Real-time chat feature               |
| Shopping cart and order placement (COD)          | OTP phone number verification        |
| Product favourites                               | Advanced system settings panel       |
| AI artwork generation from text prompt           |                                      |
| Admin statistics dashboard                       |                                      |
| Admin product, order, and user management        |                                      |

---

## Chapter 2 — Literature Review

### 2.1 The Global Paint-by-Numbers Market

Paint-by-numbers has evolved from a leisure hobby into a commercially significant product category. According to Grand View Research (2023), the global market is projected to reach USD 1.2 billion by 2028, driven by growing consumer interest in stress-relieving creative activities and the rise of home-based entertainment. The traditional model, however, is constrained by fixed template designs that limit personalisation.

### 2.2 Generative AI in Art Production

Generative AI models capable of producing images from text descriptions — commonly referred to as text-to-image models — have undergone rapid advancement since 2021. Google's Gemini model family (Google, 2024c), OpenAI's DALL·E series, and Stability AI's Stable Diffusion are among the leading systems. These models enable on-demand, personalised visual content creation at scale. Applying this technology to paint-by-numbers template production is a novel use case that directly addresses the personalisation limitation of traditional products.

### 2.3 E-Commerce Platform Architectures

Modern e-commerce systems commonly adopt a decoupled architecture separating the frontend presentation layer from the backend business logic layer. Next.js, a React-based framework supporting Server-Side Rendering and Static Site Generation, is widely used for frontend development of e-commerce platforms due to its SEO benefits and performance optimisation capabilities (Next.js, 2024). Backend services are typically built with Node.js and Express, providing a lightweight and scalable RESTful API layer.

### 2.4 Firebase as a Backend-as-a-Service Platform

Firebase, operated by Google Cloud, provides a suite of backend infrastructure services including authentication, a NoSQL document database (Cloud Firestore), and file storage. Firebase Authentication provides identity management with JSON Web Token issuance, eliminating the need for the application to manage password storage (Google, 2024a). This significantly reduces security risk and development effort for authentication-related features.

---

## Chapter 3 — Technology and Tools

### 3.1 Frontend Framework

The frontend of the Happy Coloring AI system is built using the following technologies.

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

**Rationale for Next.js 14:** Next.js supports Server-Side Rendering, improving SEO for product pages. The App Router (introduced in Next.js 13) enables collocated layouts and loading states. Vercel — the company behind Next.js — provides free hosting with automated CI/CD from GitHub (Vercel, 2024).

**Rationale for Zustand over Redux:** Zustand is significantly smaller (8 KB vs Redux Toolkit 40 KB+), requires no boilerplate actions or reducers, and includes a built-in `persist` middleware for localStorage synchronisation (Dai, 2021).

> **Figure 3.1** — Frontend technology stack diagram showing component relationships
>
> `[INSERT FIGURE 3.1 HERE]`
>
> **Explanation:** This diagram illustrates the layered structure of the frontend technology stack, from the Vercel CDN hosting layer at the top, through the Next.js framework, down to the state management (Zustand), HTTP client (Axios), and Firebase Auth SDK layers at the bottom.

---

### 3.2 Backend Framework

The backend API server is built using the following technologies.

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

### 3.3 Cloud Infrastructure

The system is deployed across three cloud platforms, each serving a distinct infrastructure role.

| Service                     | Provider        | Purpose                                   |
| --------------------------- | --------------- | ----------------------------------------- |
| **Firebase Authentication** | Google Cloud    | User identity management and JWT issuance |
| **Cloud Firestore**         | Google Cloud    | NoSQL document database                   |
| **Firebase Storage**        | Google Cloud    | Image file storage (PNG files)            |
| **Vercel**                  | Vercel Inc.     | Frontend hosting with global CDN          |
| **Render**                  | Render Inc.     | Backend Node.js hosting                   |
| **Gemini 2.5 Flash Image**  | Google DeepMind | AI image generation                       |
| **MyMemory Translation**    | Translated.net  | Free Vietnamese→English translation       |

> **Figure 3.2** — Cloud infrastructure diagram: Vercel ↔ Render ↔ Firebase ↔ Google AI
>
> `[INSERT FIGURE 3.2 HERE]`
>
> **Explanation:** This diagram illustrates the deployment topology of the Happy Coloring AI system, showing how the Vercel-hosted frontend, Render-hosted backend, Firebase platform services, and Google Gemini AI API are interconnected. GitHub acts as the shared source code repository triggering CI/CD pipelines for both Vercel and Render.

---

## Chapter 4 — Software Product Requirements

### 4.1 Overview of Similar Products

Existing paint-by-numbers platforms, such as Pictorem and PaintYourNumbers, offer only pre-designed template catalogues with no personalisation capability. No existing commercial platform provides AI-driven, on-demand generation of paint-by-numbers templates from natural language input. This gap represents the primary differentiation of Happy Coloring AI.

#### Stakeholders

| Stakeholder               | Role                                                 |
| ------------------------- | ---------------------------------------------------- |
| **Customer (User)**       | Browse products, place orders, generate AI artwork   |
| **Administrator (Admin)** | Manage products, orders, and users                   |
| **System**                | Authentication, security, automated image generation |

### 4.2 Use Case Diagrams and User Stories

#### 4.2.1 Customer Use Cases

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

> **Figure 4.1** — Use Case Diagram showing interactions between User, Admin, and System
>
> `[INSERT FIGURE 4.1 HERE]`
>
> **Explanation:** This use case diagram maps all 16 use cases (UC-01 through UC-16) to their respective actors: Customer, Administrator, and System. Include relationships are shown between UC-02 and JWT Authentication, UC-11 and AI Image Generation, and UC-03 and Email Notification.

---

#### 4.2.2 Administrator Use Cases

| ID    | Feature            | Description                                  |
| ----- | ------------------ | -------------------------------------------- |
| UC-13 | Admin Dashboard    | Aggregate statistics: revenue, orders, users |
| UC-14 | Product Management | Create, edit, delete products; upload images |
| UC-15 | Order Management   | View, filter, and update order status        |
| UC-16 | User Management    | Search users and disable accounts            |

### 4.3 Non-Functional Requirements

| Category            | Requirement                                                 |
| ------------------- | ----------------------------------------------------------- |
| **Performance**     | Page load time < 3 seconds for product listings             |
| **Security**        | JWT authentication, HTTPS, rate limiting (100 req / 15 min) |
| **Scalability**     | RESTful, stateless backend architecture                     |
| **Availability**    | Frontend 99.9% uptime (Vercel); backend on Render free tier |
| **Maintainability** | Decoupled frontend/backend; TypeScript for type safety      |

### 4.4 Database Design (Firestore Collections)

Cloud Firestore is a NoSQL document database. According to Google Firebase documentation (Google, 2024b), data is organised in a Collection → Document → Fields hierarchy. The system uses four top-level collections.

> **Figure 4.2** — Firestore data model overview showing 4 collections and their relationships
>
> `[INSERT FIGURE 4.2 HERE]`
>
> **Explanation:** This entity-relationship diagram illustrates the four Firestore collections — users, products, orders, and generations — and the foreign-key relationships between them (userId in orders and generations referencing users; productId in order items referencing products).

---

#### 4.4.1 Collection `users`

Each document in this collection represents a registered user account and is keyed by the Firebase Authentication UID.

| Field         | Type    | Description                     |
| ------------- | ------- | ------------------------------- |
| `uid`         | string  | Firebase Auth UID (primary key) |
| `email`       | string  | User's email address (unique)   |
| `displayName` | string  | Display name                    |
| `role`        | string  | `"user"` or `"admin"`           |
| `phoneNumber` | string? | Phone number (optional)         |
| `address`     | string? | Shipping address (optional)     |
| `dateOfBirth` | string? | ISO 8601 date (optional)        |
| `createdAt`   | string  | ISO 8601 timestamp              |
| `updatedAt`   | string  | ISO 8601 timestamp              |

#### 4.4.2 Collection `products`

Each document represents a paint-by-numbers product available in the store.

| Field          | Type   | Description                               |
| -------------- | ------ | ----------------------------------------- |
| `title`        | string | Product name                              |
| `description`  | string | Full description                          |
| `price`        | number | Price in VND                              |
| `category`     | string | Category name (e.g. "Flowers & Nature")   |
| `difficulty`   | string | `"easy"`, `"medium"`, or `"hard"`         |
| `dimensions`   | string | Canvas size (e.g. "30x40 cm")             |
| `colors`       | number | Number of paint colours                   |
| `imageUrl`     | string | Main image URL (Firebase Storage)         |
| `thumbnailUrl` | string | Thumbnail URL                             |
| `status`       | string | `"active"` or `"inactive"`                |
| `sales`        | number | Total units sold (aggregated from orders) |
| `createdAt`    | string | ISO 8601 timestamp                        |
| `updatedAt`    | string | ISO 8601 timestamp                        |

#### 4.4.3 Collection `orders`

Each document represents a customer order.

| Field             | Type    | Description                                                                 |
| ----------------- | ------- | --------------------------------------------------------------------------- |
| `orderNumber`     | string  | Human-readable order code (e.g. `ORD-M6JZTW12-K3P7`)                        |
| `userId`          | string  | UID of the customer (FK → users)                                            |
| `items[]`         | array   | List of ordered products                                                    |
| `shippingAddress` | object  | fullName, phone, address, city                                              |
| `totalAmount`     | number  | Total price in VND                                                          |
| `paymentMethod`   | string  | `"cod"` or `"bank_transfer"`                                                |
| `status`          | string  | `"pending"` / `"processing"` / `"shipping"` / `"delivered"` / `"cancelled"` |
| `paymentStatus`   | string  | `"pending"` / `"paid"` / `"failed"`                                         |
| `note`            | string? | Delivery note (optional)                                                    |
| `createdAt`       | string  | ISO 8601 timestamp                                                          |
| `updatedAt`       | string  | ISO 8601 timestamp                                                          |

#### 4.4.4 Collection `generations`

Each document represents a single AI image generation job.

| Field         | Type    | Description                                 |
| ------------- | ------- | ------------------------------------------- |
| `id`          | string  | Firestore document ID                       |
| `userId`      | string  | UID of the creator (FK → users)             |
| `prompt`      | string  | Original description (Vietnamese)           |
| `style`       | string  | Art style (e.g. "realistic", "anime")       |
| `complexity`  | string  | `"easy"`, `"medium"`, or `"hard"`           |
| `status`      | string  | `"processing"` / `"completed"` / `"failed"` |
| `imageUrl`    | string  | Result image URL (after completion)         |
| `error`       | string? | Error message (if failed)                   |
| `createdAt`   | string  | Generation start time                       |
| `completedAt` | string? | Completion time                             |
| `failedAt`    | string? | Failure time                                |

### 4.5 Sitemap

The application consists of the following top-level routes:

| Path               | Description                     |
| ------------------ | ------------------------------- |
| `/`                | Homepage (landing page)         |
| `/gallery`         | Product gallery with filters    |
| `/products/[id]`   | Product detail page             |
| `/generate`        | AI artwork generation interface |
| `/cart`            | Shopping cart                   |
| `/checkout`        | Order placement form            |
| `/order-success`   | Order confirmation              |
| `/login`           | Login page                      |
| `/register`        | Registration page               |
| `/forgot-password` | Password reset page             |
| `/profile`         | User profile with tabs          |
| `/contact`         | Contact form and information    |
| `/admin`           | Admin dashboard (protected)     |
| `/admin/products`  | Admin product management        |
| `/admin/orders`    | Admin order management          |
| `/admin/users`     | Admin user management           |

---

## Chapter 5 — Review of Software Development Methodologies

### 5.1 Waterfall

The Waterfall methodology follows a strictly sequential process: Requirements → Design → Implementation → Testing → Deployment. Each phase must be fully completed before the next begins. This approach is well-suited to projects with completely stable and unchanging requirements. However, it is unsuitable for this project, as requirements for the AI generation feature evolved iteratively based on testing results.

### 5.2 Spiral

The Spiral model emphasises risk analysis at each iteration cycle. It is well-suited to large, high-risk projects requiring formal risk management at each stage. For a single-developer academic project of moderate complexity, the overhead of formal risk assessment at each spiral cycle is disproportionate.

### 5.3 RAD (Rapid Application Development / Prototyping)

RAD focuses on building rapid prototypes to gather user feedback quickly. While this accelerates the early discovery phase, it can lead to poorly structured codebases if not combined with a disciplined architectural approach.

### 5.4 Agile

Agile methodology is an iterative, incremental development approach built on short development cycles called sprints. Each sprint delivers a working software increment. Continuous feedback and adaptation are central principles (Beck et al., 2001). Agile supports flexible scope management and is widely adopted in both academic and commercial software projects.

### 5.5 Selected Methodology

**Agile methodology** was selected for this project for the following reasons:

- Requirements for the AI generation pipeline were refined iteratively based on testing Gemini API outputs.
- Incremental delivery allowed individual features (authentication, product catalogue, AI generation) to be built, tested, and deployed independently.
- The decoupled frontend/backend architecture maps naturally to sprint-based parallel development.
- Lightweight Agile practices (sprint planning, backlog management) are proportionate to the project's scope and team size.

---

## Chapter 6 — Design and Implementation

### 6.1 System Architecture and Design

#### 6.1.1 Architecture Overview

The system follows a **three-tier, decoupled Client-Server Architecture**:

- **Client Tier:** A Next.js 14 single-page application hosted on Vercel's global CDN. The frontend communicates with the backend exclusively through HTTPS REST API calls.
- **Server Tier:** A Node.js + Express RESTful API server hosted on Render Cloud. All business logic, data validation, and external API calls are handled in this tier.
- **Data / Service Tier:** Firebase Auth, Cloud Firestore, Firebase Storage, and Google Gemini AI API, all managed by Google Cloud.

> **Figure 6.1** — System Architecture Diagram (three-tier overview)
>
> `[INSERT FIGURE 6.1 HERE]`
>
> **Explanation:** This three-tier architecture diagram shows the Client Tier (Next.js + Zustand on Vercel), the Server Tier (Node.js + Express middleware pipeline on Render), and the Data/Service Tier (Firebase Auth, Firestore, Storage, and Gemini AI on Google Cloud). Bidirectional arrows between tiers are labelled with the communication protocol used (HTTPS/REST API between tiers 1 and 2; Firebase Admin SDK and Axios HTTP between tiers 2 and 3).

---

#### 6.1.2 Authentication Flow

The system delegates all authentication to Firebase Authentication. The backend does not store passwords or issue tokens; it only verifies tokens issued by Firebase.

The authentication flow operates as follows:

1. The user submits credentials via the Firebase Auth SDK (`signInWithEmailAndPassword`).
2. Firebase validates the credentials and returns a Firebase User object.
3. The client calls `getIdToken()` to obtain a signed JWT (RS256, valid for 1 hour).
4. All subsequent API requests include the JWT in the `Authorization: Bearer <token>` header.
5. The backend's `authenticateUser` middleware calls `auth.verifyIdToken(token)` via the Firebase Admin SDK, which validates the RS256 signature without a database lookup.
6. The decoded token payload `{ uid, email }` is attached to `req.user` for use in route handlers.

> **Figure 6.2** — Authentication sequence diagram: Firebase Auth SDK → JWT issuance → Backend middleware verification
>
> `[INSERT FIGURE 6.2 HERE]`
>
> **Explanation:** This sequence diagram shows the complete authentication flow across five participants: User (Browser), Firebase Auth SDK (client-side), Backend (Express + Admin SDK), Firebase Auth Server (Google), and Firestore. Steps 1–6 cover credential submission and JWT issuance; steps 7–12 cover an authenticated API request, backend verification, and data response.

---

#### 6.1.3 AI Image Generation Flow

The AI generation feature uses an **asynchronous Fire-and-Forget with Polling** design pattern. This is necessary because the Gemini API image generation process takes approximately 30–90 seconds, which exceeds the HTTP timeout threshold for synchronous requests.

The generation flow proceeds through five steps:

**Step 1 — Translation:** The user's Vietnamese prompt is translated to English via the MyMemory API (10-second timeout; falls back to the original text if translation fails).

**Step 2 — Prompt Construction:** The translated prompt is inserted into a structured template specifying line art drawing rules, colour count, numbering sequence, and detail level appropriate to the selected complexity level.

**Step 3 — Gemini API Call:** The constructed prompt is sent to the Gemini 2.5 Flash Image model via HTTPS POST. The response contains a base64-encoded PNG image in `candidates[0].content.parts[n].inlineData.data`.

**Step 4 — Firebase Storage Upload:** The decoded image buffer is uploaded to Firebase Storage under the `generations/` path and made publicly accessible.

**Step 5 — Firestore Update and Frontend Polling:** The Firestore generation document is updated with `status: "completed"` and the public image URL. The frontend polls `GET /api/generate/status/:id` every 5 seconds (maximum 60 attempts / 5 minutes) until the status transitions to `"completed"` or `"failed"`.

**Rationale for polling over WebSocket:** Render's free tier does not support persistent WebSocket connections. Polling every 5 seconds with a maximum of 60 attempts is efficient and incurs minimal cost — one Firestore document read per request.

> **Figure 6.3** — AI Generation sequence diagram: prompt input → translation → Gemini call → Storage upload → Firestore update → polling
>
> `[INSERT FIGURE 6.3 HERE]`
>
> **Explanation:** This sequence diagram illustrates the complete asynchronous AI generation flow across six participants: Frontend (Next.js), Backend (Express), MyMemory Translation API, Gemini 2.5 Flash Image, Firebase Storage, and Firestore. The diagram distinguishes between the immediate 202 Accepted response (step 3) and the background async processing block (steps 4–10), as well as the frontend polling loop (steps 11–12).

---

### 6.2 Feature Implementation

#### 6.2.1 User Registration (UC-01)

**Key files:** `frontend/src/app/register/page.tsx`, `backend/src/routes/auth.js`

> **Figure 6.4** — Screenshot of the Registration page
>
> `[INSERT FIGURE 6.4 HERE]`
>
> **Explanation:** This screenshot shows the registration form with input fields for email address, password, and display name, along with client-side validation feedback and the submit button.

The registration process executes in ten steps:

1. User submits email, password, and display name via the registration form.
2. Frontend validates input (email format, password minimum 6 characters).
3. `createUserWithEmailAndPassword(auth, email, password)` — Firebase SDK creates the account.
4. `updateProfile(user, { displayName })` — sets the display name in Firebase Auth.
5. `user.getIdToken()` — obtains the JWT for the newly created account.
6. `POST /api/auth/register` with Bearer token and body `{ email, displayName }`.
7. Backend calls `verifyIdToken(token)` to confirm the user exists in Firebase Auth.
8. Backend creates a Firestore document `users/{uid}` with `role: "user"`.
9. Backend returns `201 Created`.
10. Frontend redirects the user to the homepage.

The `/api/auth/register` route supports a dual-mode design: if a Bearer token is present, the user was already created by the Firebase SDK and the backend only creates the Firestore document. If no token is present, the backend creates the Firebase Auth user first.

| Error Code                  | Source        | Cause                              | User-facing Message                      |
| --------------------------- | ------------- | ---------------------------------- | ---------------------------------------- |
| `auth/email-already-in-use` | Firebase Auth | Email already registered           | "This email is already in use"           |
| `auth/weak-password`        | Firebase Auth | Password shorter than 6 characters | "Password must be at least 6 characters" |
| `auth/invalid-email`        | Firebase Auth | Malformed email address            | "Invalid email address"                  |
| `400 Bad Request`           | Backend       | Missing email field in body        | "Email is required"                      |
| `500 Internal Server Error` | Backend       | Firestore write failure            | "Internal server error"                  |

---

#### 6.2.2 Login (UC-02)

**Key files:** `frontend/src/app/login/page.tsx`, `frontend/src/store/authStore.ts`

> **Figure 6.5** — Screenshot of the Login page
>
> `[INSERT FIGURE 6.5 HERE]`
>
> **Explanation:** This screenshot shows the login form with email and password fields, a "Remember Me" checkbox, and a "Forgot Password" link.

The backend has no login route. All authentication is handled client-side through the Firebase Auth SDK. The login flow is as follows:

1. `signInWithEmailAndPassword(auth, email, password)` — Firebase SDK authenticates the user.
2. `user.getIdToken()` — obtains the JWT (valid for 1 hour).
3. Token storage is determined by the "Remember Me" selection: `true` stores the token in `localStorage`; `false` stores it in `sessionStorage`.
4. `isAdmin(email)` checks the `ADMIN_EMAILS` list from `adminConfig.ts` and redirects accordingly.

**Automatic token refresh** is handled by Axios interceptors in `api.ts`:

- **Request interceptor:** Always calls `auth.currentUser.getIdToken(true)` before each request to obtain a fresh token.
- **Response interceptor:** On a `401 Unauthorized` response, silently retries once with a fresh token. If the retry also returns `401`, the session is cleared and the user is redirected to `/login`.

> **Figure 6.6** — Axios interceptor flow: request token injection and automatic 401 retry logic
>
> `[INSERT FIGURE 6.6 HERE]`
>
> **Explanation:** This flowchart shows the Axios interceptor pipeline. The request interceptor always fetches a fresh JWT before injecting it into the Authorization header. The response interceptor handles 401 errors by attempting a single silent token refresh and retry; if the retry also fails, the user is logged out and redirected to the login page.

| Error Code                | Source        | Cause                         | User-facing Message                  |
| ------------------------- | ------------- | ----------------------------- | ------------------------------------ |
| `auth/user-not-found`     | Firebase Auth | Email not registered          | "Incorrect email or password"        |
| `auth/wrong-password`     | Firebase Auth | Wrong password                | "Incorrect email or password"        |
| `auth/invalid-credential` | Firebase Auth | Invalid credentials (SDK v9+) | "Incorrect email or password"        |
| `auth/too-many-requests`  | Firebase Auth | Too many failed attempts      | "Account temporarily locked"         |
| `auth/user-disabled`      | Firebase Auth | Account disabled by admin     | "This account has been suspended"    |
| `401 Unauthorized`        | Backend API   | Token expired mid-session     | Auto-refresh → if still 401 → logout |

---

#### 6.2.3 Forgot Password (UC-03)

**Key file:** `frontend/src/app/forgot-password/page.tsx`

> **Figure 6.7** — Screenshot of the Forgot Password page (email input and success state)
>
> `[INSERT FIGURE 6.7 HERE]`
>
> **Explanation:** This screenshot shows the forgot password page in two states: the initial email input state and the post-submission success confirmation state displaying the message that a reset link has been sent.

The password reset flow uses Firebase's built-in email delivery:

1. User enters their email address.
2. `sendPasswordResetEmail(auth, email)` — Firebase Auth SDK sends the reset email.
3. Firebase delivers an email containing a secure reset link to the user's inbox.
4. The user clicks the link and Firebase handles the password update directly.
5. A success confirmation screen is displayed on the frontend.

---

#### 6.2.4 Product Gallery (UC-05)

**Key files:** `frontend/src/app/gallery/page.tsx`, `backend/src/routes/products.js`, `backend/src/services/productService.js`

**API Endpoint:** `GET /api/products`

> **Figure 6.8** — Screenshot of the Gallery page with filter options and masonry product grid
>
> `[INSERT FIGURE 6.8 HERE]`
>
> **Explanation:** This screenshot shows the product gallery page with the filter panel (category dropdown, difficulty radio buttons, price range inputs, sort options) and the masonry grid layout displaying product cards with hover effects.

The API supports the following query parameters for filtering and sorting:

| Parameter    | Type   | Description                           |
| ------------ | ------ | ------------------------------------- |
| `category`   | string | Filter by category                    |
| `difficulty` | string | `"easy"` / `"medium"` / `"hard"`      |
| `minPrice`   | number | Minimum price (VND)                   |
| `maxPrice`   | number | Maximum price (VND)                   |
| `sortBy`     | string | `"price"` / `"sales"` / `"createdAt"` |
| `sortOrder`  | string | `"asc"` / `"desc"`                    |
| `page`       | number | Current page (default: 1)             |
| `limit`      | number | Items per page (default: 20)          |

**Pagination strategy:** Firestore does not efficiently support multi-field ordering without Composite Indexes. To avoid index management overhead, the system queries Firestore with basic filters and performs sorting and pagination in JavaScript memory. This is a deliberate trade-off: simpler operations at the cost of fetching more documents initially, which is acceptable for a moderate dataset size.

---

#### 6.2.5 Favourites (UC-07)

**Key file:** `frontend/src/store/favoriteStore.ts`

The favourites feature is implemented entirely on the client side using localStorage via Zustand's `persist` middleware. No backend API is required.

> **Figure 6.9** — Screenshot of the Profile page "Favourites" tab
>
> `[INSERT FIGURE 6.9 HERE]`
>
> **Explanation:** This screenshot shows the Favourites tab on the Profile page, displaying a grid of the user's saved products with remove buttons.

The Zustand store uses a multi-user keying structure: `favoritesByUser: Record<string, Product[]>`. This ensures that if multiple users log in on the same device, each user's favourites remain isolated. `setCurrentUser(uid)` reads `favoritesByUser[uid]` and loads it into the active `favorites[]` array.

---

#### 6.2.6 Shopping Cart (UC-08)

**Key files:** `frontend/src/store/cartStore.ts`, `frontend/src/app/cart/page.tsx`

The cart is stored client-side in localStorage via Zustand `persist` middleware.

> **Figure 6.10** — Screenshot of the Shopping Cart page
>
> `[INSERT FIGURE 6.10 HERE]`
>
> **Explanation:** This screenshot shows the shopping cart page with product line items, quantity controls, item selection checkboxes, subtotal calculation, and the proceed to checkout button.

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

#### 6.2.7 Checkout and Order Placement (UC-09)

**Key files:** `frontend/src/app/checkout/page.tsx`, `backend/src/routes/orders.js`, `backend/src/services/orderService.js`

**API Endpoint:** `POST /api/orders`

> **Figure 6.11** — Screenshot of the Checkout page with shipping form
>
> `[INSERT FIGURE 6.11 HERE]`
>
> **Explanation:** This screenshot shows the checkout page with the shipping address form (full name, phone number, address, city), payment method selection (COD), order summary panel, and the place order button.

> **Figure 6.12** — Screenshot of the Order Success confirmation page
>
> `[INSERT FIGURE 6.12 HERE]`
>
> **Explanation:** This screenshot shows the order success page displaying the generated order number, a summary of the placed order, and a "Continue Shopping" button.

The order placement flow:

1. Frontend validates the shipping form and calls `POST /api/orders` with Bearer token.
2. Backend calls `authenticateUser` to extract `userId` from the JWT.
3. Joi validates the request body against `createOrderSchema`.
4. `generateOrderNumber()` produces a unique order code (format: `ORD-<base36timestamp>-<random4>`).
5. Order is written to Firestore `orders/{id}` with `status: "pending"`.
6. Backend returns `201 Created` with the order object.
7. Frontend saves `lastOrder` to `localStorage`, clears the cart, and redirects to `/order-success`.

---

#### 6.2.8 AI Artwork Generation (UC-11)

**Key files:** `frontend/src/app/generate/page.tsx`, `backend/src/routes/generate.js`

**API Endpoints:**

- `POST /api/generate/paint-by-numbers` — initiate generation
- `GET /api/generate/status/:generationId` — poll for status

> **Figure 6.13** — Screenshot of the AI Generate page: prompt input area and complexity selector
>
> `[INSERT FIGURE 6.13 HERE]`
>
> **Explanation:** This screenshot shows the AI Generate page with the Vietnamese text input textarea (500-character limit with live counter), three complexity selector buttons (Easy/16 colours, Medium/28 colours, Hard/44 colours), and the Generate button with loading state.

> **Figure 6.14** — Example of a completed AI-generated paint-by-numbers image
>
> `[INSERT FIGURE 6.14 HERE]`
>
> **Explanation:** This figure shows a sample output image produced by the Gemini 2.5 Flash Image model, displaying a line-art style painting divided into numbered regions and accompanied by a colour palette reference strip at the bottom.

**Complexity levels:**

| Level    | Max Colours | Description                                                        |
| -------- | ----------- | ------------------------------------------------------------------ |
| `easy`   | 16          | Simple bold shapes, large paint regions, minimal detail            |
| `medium` | 28          | Moderate detail, medium-sized regions, balanced composition        |
| `hard`   | 44          | Highly detailed, many small intricate regions, complex composition |

**Error codes:**

| Code                 | Source    | Cause                                                       |
| -------------------- | --------- | ----------------------------------------------------------- |
| `400`                | Backend   | Missing prompt or prompt exceeds 500 characters             |
| `401`                | Backend   | User not authenticated                                      |
| `403`                | Backend   | Requesting status of another user's generation              |
| `404`                | Backend   | generationId not found in Firestore                         |
| `500`                | Backend   | Gemini API failure, Storage error, or Firestore write error |
| `RESOURCE_EXHAUSTED` | Google AI | Free-tier quota exceeded (60 req/min)                       |
| `INVALID_ARGUMENT`   | Google AI | Prompt violates content safety policy                       |

---

#### 6.2.9 Admin Dashboard (UC-13)

**Key files:** `frontend/src/app/admin/page.tsx`, `backend/src/routes/admin.js`

**API Endpoint:** `GET /api/admin/stats`

> **Figure 6.15** — Screenshot of the Admin Dashboard with statistics cards
>
> `[INSERT FIGURE 6.15 HERE]`
>
> **Explanation:** This screenshot shows the Admin Dashboard page displaying four statistics cards (Total Revenue, Total Orders, Total Products, Total Users) and an order status breakdown panel showing counts for pending, processing, shipping, and delivered orders.

The backend aggregates statistics concurrently using `Promise.all()` across three service calls: `getProductStats()`, `getOrderStats()`, and `getUserStats()`. This minimises total response time by parallelising independent Firestore queries.

---

#### 6.2.10 Admin Product Management (UC-14)

**Key files:** `frontend/src/app/admin/products/page.tsx`, `backend/src/routes/admin/products.js`

> **Figure 6.16** — Screenshot of the Admin Products page with product list and add/edit modal
>
> `[INSERT FIGURE 6.16 HERE]`
>
> **Explanation:** This screenshot shows the admin product management page with the paginated product data table (columns: title, category, price, status, actions) and the add/edit product modal overlay with form fields for all product attributes.

| Method   | Path                  | Description                              |
| -------- | --------------------- | ---------------------------------------- |
| `GET`    | `/api/admin/products` | List all products (including inactive)   |
| `POST`   | `/api/products`       | Create a new product                     |
| `PUT`    | `/api/products/:id`   | Update product details                   |
| `DELETE` | `/api/products/:id`   | Soft delete — sets `status = "inactive"` |

Product image upload is handled directly by the Firebase Storage Client SDK on the frontend, bypassing the backend. The resulting `downloadURL` is submitted with the product data.

---

### 6.3 Security Implementation

#### 6.3.1 Authentication and Authorisation

The system uses JSON Web Tokens (JWT) issued by Firebase Authentication. Each token contains the user's `uid`, `email`, and expiry timestamp (`exp`, valid for 1 hour), and is signed with RS256 to prevent forgery. The backend validates every protected request using `auth.verifyIdToken(token)`, which verifies the signature without a database lookup (Rescorla, 2015).

Admin authorisation is enforced at two independent layers:

- **Client-side guard (`adminConfig.ts`):** Checks the user's email against the `ADMIN_EMAILS` list and redirects non-admin users after login.
- **Server-side middleware (`requireAdmin`):** Returns HTTP `403 Forbidden` if the authenticated user's email is not in the `ADMIN_EMAILS` environment variable.

> **Figure 6.17** — Two-layer authorisation diagram: client-side redirect guard and server-side middleware guard
>
> `[INSERT FIGURE 6.17 HERE]`
>
> **Explanation:** This diagram illustrates the two-layer admin authorisation mechanism. Layer 1 (client-side, adminConfig.ts) prevents UI navigation by non-admin users. Layer 2 (server-side, requireAdmin middleware) enforces the restriction at the API level, returning 403 Forbidden even if the frontend guard is bypassed.

---

#### 6.3.2 OWASP Top 10 Mitigations

| OWASP Vulnerability                                  | Mitigation Applied                                                                     |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **A01 — Broken Access Control**                      | JWT verification on all protected routes; ownership checks (`userId === req.user.uid`) |
| **A02 — Cryptographic Failures**                     | HTTPS enforced end-to-end; passwords never stored (Firebase manages credentials)       |
| **A03 — Injection**                                  | Joi schema validation on all inputs; Firestore uses parameterised queries (no raw SQL) |
| **A05 — Security Misconfiguration**                  | Helmet.js automatically sets 12 HTTP security response headers                         |
| **A07 — Identification and Authentication Failures** | Firebase Auth account lock-out after repeated failed login attempts                    |
| **A09 — Security Logging and Monitoring**            | Morgan HTTP request logger enabled on all routes                                       |

#### 6.3.3 Rate Limiting

The backend applies a rate limit of 100 requests per IP address per 15-minute window across all routes. `app.set("trust proxy", 1)` is configured to correctly extract the real client IP when running behind Render's reverse proxy (Express.js, 2024).

#### 6.3.4 CORS Configuration

The CORS policy permits requests only from explicitly whitelisted origins: `localhost:3002` (development), the production Vercel domain, and the Firebase Hosting fallback domain. All `*.vercel.app` subdomains are permitted to support Vercel Preview deployments. Additional origins can be added via the `CORS_ORIGIN` and `FRONTEND_URL` environment variables.

---

### 6.4 HTTP Error Code Reference

#### 6.4.1 HTTP Status Code Groups

According to RFC 9110 (Fielding et al., 2022), HTTP status codes are grouped as follows:

| Group | Range   | Meaning           |
| ----- | ------- | ----------------- |
| 2xx   | 200–299 | Success           |
| 4xx   | 400–499 | Client-side error |
| 5xx   | 500–599 | Server-side error |

> **Figure 6.18** — Error propagation flow diagram: source → backend response → frontend user message
>
> `[INSERT FIGURE 6.18 HERE]`
>
> **Explanation:** This flowchart illustrates how errors originating from four sources (Firebase Auth, Google Gemini API, Firestore, and Joi validation) propagate through the backend HTTP response layer and are ultimately presented to the user as specific toast notifications or redirect actions on the frontend.

---

#### 6.4.2 System HTTP Error Code Reference

**2xx — Success**

| Code           | Name     | When It Occurs                                                        |
| -------------- | -------- | --------------------------------------------------------------------- |
| `200 OK`       | OK       | Reading products, viewing orders, fetching profile                    |
| `201 Created`  | Created  | Account registered; order placed successfully                         |
| `202 Accepted` | Accepted | AI generation started — request accepted, processing not yet complete |

**4xx — Client Errors**

| Code                    | Name                | Specific Cause                                                    | Related Route                                        |
| ----------------------- | ------------------- | ----------------------------------------------------------------- | ---------------------------------------------------- |
| `400 Bad Request`       | Invalid data        | Joi validation failure; empty or oversized prompt                 | `/api/auth/register`, `/api/orders`, `/api/generate` |
| `401 Unauthorized`      | Not authenticated   | Missing or expired Bearer token                                   | All protected routes                                 |
| `403 Forbidden`         | No permission       | Email not in ADMIN_EMAILS; accessing another user's resource      | `/api/admin/*`, `/api/orders/:id`                    |
| `404 Not Found`         | Resource missing    | Product deleted; unknown generationId; Firestore document missing | `/api/products/:id`, `/api/generate/status/:id`      |
| `429 Too Many Requests` | Rate limit exceeded | More than 100 requests from same IP in 15 minutes                 | All routes                                           |

**5xx — Server Errors**

| Code                        | Name         | Specific Cause                                                   | System Behaviour                                                            |
| --------------------------- | ------------ | ---------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `500 Internal Server Error` | Server error | Firestore failure; Gemini returns no image; Storage upload error | Error logged server-side; generation document updated to `status: "failed"` |

#### 6.4.3 Firebase Authentication Error Codes

| Firebase Error Code           | When It Occurs                             | User-Facing Message                          |
| ----------------------------- | ------------------------------------------ | -------------------------------------------- |
| `auth/email-already-in-use`   | Registration with an existing email        | "This email is already in use"               |
| `auth/weak-password`          | Password shorter than 6 characters         | "Password must be at least 6 characters"     |
| `auth/invalid-email`          | Malformed email address                    | "Invalid email address"                      |
| `auth/user-not-found`         | Login or password reset with unknown email | "Incorrect email or password"                |
| `auth/wrong-password`         | Wrong password entered                     | "Incorrect email or password"                |
| `auth/invalid-credential`     | Invalid credentials — Firebase SDK v9+     | "Incorrect email or password"                |
| `auth/too-many-requests`      | Too many consecutive failed login attempts | "Account temporarily locked"                 |
| `auth/user-disabled`          | Account disabled by administrator          | "This account has been suspended"            |
| `auth/network-request-failed` | No internet connection                     | "Please check your connection and try again" |

#### 6.4.4 Google Gemini API Error Codes

| Code / Type                 | Cause                                          | System Behaviour                            |
| --------------------------- | ---------------------------------------------- | ------------------------------------------- |
| `RESOURCE_EXHAUSTED`        | Free-tier API quota exceeded (60 req/min)      | Generation set to `status: "failed"`        |
| `INVALID_ARGUMENT`          | Prompt violates Google's content safety policy | Generation set to `status: "failed"`        |
| `DEADLINE_EXCEEDED`         | Axios timeout after 120 seconds                | Generation set to `status: "failed"`        |
| No `inlineData` in response | AI returned only text, no image                | `throw new Error("No image data returned")` |

---

### 6.5 Product Evaluation

The following subsections describe the key pages of the application. Screenshots of each page have been presented alongside the relevant implementation details in the sections above (Sections 6.1 – 6.4).

#### 6.5.1 Homepage (`/`)

The homepage is structured in six sections following the AIDA design pattern (Attention, Interest, Desire, Action):

1. **Hero Section:** Animated wave-effect title "Color with Pure Elegance", two CTA buttons, full-width banner with hover zoom effect.
2. **Featured Products:** Masonry grid layout displaying the eight best-selling products from the API.
3. **About Us:** Two-column layout with slide-in scroll animation.
4. **3 Simple Steps:** Three cards with step numbers and scroll-triggered fade-in animation.
5. **Why Choose Yu Ling Store:** Four feature cards with hover float effect.
6. **Final CTA:** Purple-to-pink gradient banner with two action buttons.

---

#### 6.5.2 Gallery Page (`/gallery`)

- Topbar filter panel: category dropdown, difficulty radio buttons, price range inputs.
- Sort options: Popular / Newest / Price Ascending / Price Descending.
- Masonry grid layout with lazy loading (Intersection Observer API).
- Heart/favourite toggle button on each product card with instant state update.
- Pagination via "Load More" button.

---

#### 6.5.3 AI Generate Page (`/generate`)

- Textarea for the artwork description (Vietnamese, max 500 characters with live counter).
- Three complexity selector buttons showing colour counts: Easy (16), Medium (28), Hard (44).
- Loading animation with progress messages during generation.
- Result display area with an "Add to Cart" button once the image is ready.

---

#### 6.5.4 User Profile Page (`/profile`)

| Tab            | Content                                                    |
| -------------- | ---------------------------------------------------------- |
| **My Info**    | Editable form: display name, phone, address, date of birth |
| **Favourites** | Grid of favourited products from `favoriteStore`           |
| **My Orders**  | List of the user's orders with status badges               |

---

#### 6.5.5 Admin Panel (`/admin`)

The admin panel provides four management areas:

- **Dashboard:** Statistics cards (revenue, orders, products, users) and order status breakdown.
- **Products:** Full CRUD with image upload.
- **Orders:** Order list with status filter and inline status update.
- **Users:** User search and account management.

Access is protected by the two-layer authorisation mechanism described in Section 6.3.1.

---

#### 6.5.6 Contact Page (`/contact`)

- Hero banner with gradient background.
- Left column: contact information cards (email, phone, address, working hours) and social media links.
- Right column: validated contact form with fields for Full Name, Email, Subject (dropdown), and Message (minimum 20 characters with live character counter).
- FAQ section with six common questions and concise answers.

---

### 6.6 Deployment

#### 6.6.1 Production Environment

| Component   | URL                                              | Platform     |
| ----------- | ------------------------------------------------ | ------------ |
| Frontend    | `https://happy-coloring-ai.vercel.app`           | Vercel       |
| Backend API | `https://paint-by-numbers-back-end.onrender.com` | Render       |
| Database    | Firebase Firestore                               | Google Cloud |
| Storage     | Firebase Storage                                 | Google Cloud |

#### 6.6.2 CI/CD Pipeline

**Frontend (Vercel):** A `git push` to the `main` branch triggers a Vercel webhook. Vercel runs `next build`, performs TypeScript type checking and Tailwind CSS purging, and deploys the output to the global CDN. A unique preview URL is automatically generated for every Pull Request.

**Backend (Render):** A `git push` to the `main` branch triggers the Render deploy hook. Render runs `npm install` and `npm start` to launch the Node.js service.

> **Figure 6.27** — CI/CD pipeline diagram: GitHub → Vercel (frontend) and GitHub → Render (backend)
>
> `[INSERT FIGURE 6.27 HERE]`
>
> **Explanation:** This diagram shows the CI/CD pipeline for both the frontend and backend. The developer pushes to the GitHub mono-repository. Frontend changes trigger Vercel's webhook, which builds and deploys the Next.js application. Backend changes trigger Render's deploy hook, which starts the Node.js server. Environment variables are managed separately in the Vercel and Render dashboards.

---

#### 6.6.3 Environment Variables

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

#### 6.6.4 Render Free Tier Cold Start

Render's free tier suspends the service after 15 minutes without incoming traffic. The first request after a suspension period may take 30–50 seconds for the instance to resume. This is a documented and accepted limitation for development and demonstration environments (Render, 2024).

---

## Chapter 7 — Conclusions

### 7.1 What Has Been Learned

This project provided practical experience across a broad range of full-stack web development disciplines, including:

- Designing and implementing a decoupled three-tier architecture with a React/Next.js frontend and a Node.js/Express backend.
- Integrating a generative AI API (Google Gemini 2.5 Flash Image) into a production application, including asynchronous job processing and status polling.
- Applying Firebase Authentication for secure, passwordless identity management using JWT verification.
- Implementing security controls aligned with the OWASP Top 10 (JWT, Helmet, CORS, rate limiting, Joi validation).
- Deploying a full-stack application to a cloud environment (Vercel + Render + Firebase) with automated CI/CD pipelines.

### 7.2 Project Results

| Objective                       | Result                                                |
| ------------------------------- | ----------------------------------------------------- |
| Full-featured e-commerce system | ✅ 21 features implemented                            |
| AI image generation integration | ✅ Gemini 2.5 Flash Image, 3 complexity levels        |
| Admin management system         | ✅ Dashboard, full CRUD for products / orders / users |
| Cloud deployment with CI/CD     | ✅ Vercel + Render + Firebase                         |
| OWASP security compliance       | ✅ JWT, Helmet, CORS, Rate Limiting, Joi validation   |

### 7.3 Known Limitations

- **Backend cold start:** Render free tier suspends the service after 15 minutes of inactivity, causing a 30–50 second delay on the first request following a period of inactivity.
- **AI output variability:** Gemini occasionally does not fully comply with the structured prompt template. Few-shot prompting with example images could improve output consistency.
- **Payment integration:** Only Cash on Delivery and manual bank transfer are supported. No automated payment gateway is integrated.
- **Search capability:** Product filtering uses exact-match queries only. Full-text search is not supported.

### 7.4 Further Development

The following enhancements are proposed for future development:

- Integrate an automated payment gateway (VNPay or MoMo).
- Add a product ratings and reviews system.
- Improve AI output consistency with few-shot prompt engineering.
- Replace the polling mechanism with WebSockets when upgrading to a paid Render plan.
- Add full-text search using Algolia or Typesense.
- Implement automated order status email notifications.

---

## References

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

---

## Appendices

### Appendix 1 — Survey and Results

[Insert survey instrument and summarised results here]

### Appendix 2 — Schedule of Work

[Insert Gantt chart or sprint schedule here]

### Appendix 3 — Project Proposal

[Insert approved project proposal here]
