# Undergraduate Final Year Project Proposal

## Happy Coloring AI — AI-Integrated Paint-by-Numbers E-Commerce Platform

**[Your Name]**

**Information Technology**

**[Your Banner ID]**

---

## 1 Overview

Paint-by-numbers is a widely popular art activity that allows people to create detailed artwork without professional drawing skills, by following numbered colour guides printed on a canvas. However, existing products are entirely pre-designed — buyers have no way to create personalised kits based on their own ideas or descriptions. This project, **Happy Coloring AI**, solves this problem by combining a fully functional e-commerce store with an AI-powered custom image generator.

The platform operates as an online store where users can browse and purchase pre-made paint-by-numbers kits, manage a shopping cart, and place orders with Cash on Delivery or Bank Transfer payment options. The key differentiating feature is the AI generation tool: authenticated users can type a text description (in Vietnamese) of any subject they wish to paint. The backend translates the description to English using the MyMemory translation API, then sends it to the Google Gemini 2.5 Flash Image model, which generates a properly structured paint-by-numbers worksheet — a black-and-white line-art drawing with numbered colour regions and a colour palette strip at the bottom. The generated image is stored in Firebase Storage and the result is delivered to the user via a Firestore polling mechanism, keeping the interface responsive during the generation wait time.

The frontend is built with **Next.js 14** (TypeScript), **Tailwind CSS**, **Zustand** for global state management, and **Framer Motion** for animations. The backend REST API is built with **Node.js 18** and **Express**, secured with Helmet, express-rate-limit, and Joi input validation. Firebase Firestore serves as the NoSQL database, Firebase Authentication handles all user identity, and Firebase Storage holds all product and generated images. The entire application is deployed on **Vercel** (frontend) and **Render** (backend), with a CI/CD pipeline that automatically rebuilds and redeploys on every `git push` to the `main` branch.

---

## 2 Aim

To develop and deploy a full-stack e-commerce web application that enables users to purchase pre-made digital paint-by-numbers kits and to generate fully personalised paint-by-numbers worksheets on demand using AI, based on their own text descriptions.

---

## 3 Objectives

3.1 Project Requirements and Design
3.1.1 Research existing e-commerce platforms and AI image generation tools [2.0]
3.1.2 Define functional and non-functional requirements for the system [1.5]
3.1.3 Design the Firestore data model and overall system architecture [2.0]

3.2 Frontend User Interface
3.2.1 Set up the Next.js 14 (TypeScript) application with Tailwind CSS and Zustand [1.0]
3.2.2 Build the homepage, gallery, product detail, cart, and checkout pages [4.0]
3.2.3 Create the AI generation page with a polling-based loading state [2.5]
3.2.4 Implement the admin dashboard for managing products, orders, and users [3.0]

3.3 Backend API Development
3.3.1 Set up the Express server with Firebase Admin SDK, Helmet, and rate limiting [1.5]
3.3.2 Implement REST API endpoints for authentication, products, orders, and users [4.0]
3.3.3 Implement Cash on Delivery and Bank Transfer order processing [2.0]

3.4 AI Image Generation Integration
3.4.1 Integrate the MyMemory API for Vietnamese-to-English prompt translation [1.5]
3.4.2 Connect the backend to the Google Gemini 2.5 Flash Image API [2.0]
3.4.3 Implement asynchronous generation with Firestore status tracking and Storage upload [2.0]
3.4.4 Design and refine the paint-by-numbers prompt template for accurate output [2.0]

3.5 Security and API Documentation
3.5.1 Apply Joi request validation, Helmet headers, and role-based route protection [2.0]
3.5.2 Write Swagger/OpenAPI documentation for all backend endpoints [1.5]

3.6 Testing and Deployment
3.6.1 Test all backend APIs using Postman [2.0]
3.6.2 Perform end-to-end testing of frontend user flows [2.0]
3.6.3 Deploy the application to Vercel and Render with CI/CD [1.5]
3.6.4 Write the final project report and documentation [10.0]

---

## 4 Legal, Social, Ethical and Professional

**Legal Issues:** The platform stores personal user data including email addresses and delivery details. All authentication is managed through Firebase Auth, which uses industry-standard token-based security; passwords are never stored in plain text. The system does not process or store any payment card details — bank transfer payments are handled entirely offline between the buyer and the store. AI-generated images are produced by the Google Gemini API, and ownership and usage rights are governed by Google's Terms of Service; a brief disclaimer is shown to users on the generation page.

**Social Issues:** By enabling anyone to describe a subject in plain Vietnamese text and receive a ready-to-print paint-by-numbers worksheet, the platform removes the barrier of artistic skill. This makes creative art activities accessible to users of all ages and technical backgrounds. The user interface has been designed with sufficient text contrast and a clean layout to support readability.

**Ethical Issues:** AI image generation models can produce inappropriate content. To mitigate this, the backend prompt template includes explicit prohibitions against violent, adult, or disturbing content, and relies on Google Gemini's built-in content safety filters as a second layer of protection. Users are informed on the generation page that artwork is created by an AI model, maintaining transparency.

**Professional Issues:** The project follows professional software engineering practices throughout: version control via Git and GitHub with a single `main` branch and descriptive commit messages; environment variables for all secrets (API keys, Firebase credentials) stored in `.env` files excluded from the repository via `.gitignore`; input validation on all API endpoints using Joi; security headers applied via Helmet; and API documentation generated with Swagger/OpenAPI. These practices demonstrate awareness of production-grade development standards.

---

## 5 Planning (see appendix A)

This project follows a simplified Agile methodology adapted for a solo developer. The 15-week schedule is divided into four phases: Proposal & Setup, Core Development, Advanced Features, and Testing & Deployment. Each phase is broken into one-week sprints with clearly defined deliverables.

Phase 1 establishes the project architecture and foundational e-commerce functionality — user authentication, product browsing, shopping cart, and the admin panel. Phase 2 adds the AI generation pipeline and the checkout/order flow. Phase 3 covers security hardening, API documentation, and responsive design refinement. The final phase is dedicated to full deployment, end-to-end testing, and writing the dissertation report. Separating core e-commerce from the AI feature ensures a demonstrable working product even if AI integration encounters difficulties.

---

## 6 Initial References

Firebase, 2024. _Firebase Documentation_. [online] Available at: <https://firebase.google.com/docs> (Accessed 15 January 2026).

Google AI for Developers, 2024. _Gemini API Reference — Image Generation_. [online] Available at: <https://ai.google.dev/docs> (Accessed 18 January 2026).

MyMemory, 2024. _MyMemory Translation API Documentation_. [online] Available at: <https://mymemory.translated.net/doc/spec.php> (Accessed 20 January 2026).

Next.js, 2024. _Next.js 14 Documentation_. [online] Available at: <https://nextjs.org/docs> (Accessed 12 January 2026).

OWASP, 2021. _Top 10 Web Application Security Risks_. [online] Available at: <https://owasp.org/www-project-top-ten/> (Accessed 20 January 2026).

Sommerville, I., 2015. _Software Engineering_. 10th ed. Pearson.

Zustand, 2024. _Zustand State Management Documentation_. [online] Available at: <https://docs.pmnd.rs/zustand> (Accessed 14 January 2026).

---

## APPENDIX A - SCHEDULE OF WORK

The table below outlines the full schedule for the 15-week project, including activity names, planned start dates, durations (in days), and the corresponding week periods to ensure steady progress up to the final demonstration.

| ACTIVITY                                               | PLAN START (DAY) | PLAN DURATION (DAYS) | WEEKS (1-15) |
| :----------------------------------------------------- | :--------------- | :------------------- | :----------- |
| **Phase 1 — Proposal & Setup**                         |                  | **13**               |              |
| Discuss proposal with supervisor                       | Mon 12/01/26     | 1                    | Week 1       |
| Write and submit project proposal                      | Tue 13/01/26     | 5                    | Week 1       |
| Set up GitHub monorepo, Next.js frontend, Node backend | Mon 19/01/26     | 3                    | Week 2       |
| Research existing systems & create UI design mockups   | Thu 22/01/26     | 3                    | Week 2       |
| **Phase 2 — Core E-Commerce Development**              |                  | **25**               |              |
| Configure Firebase Auth, Firestore schema & Storage    | Mon 26/01/26     | 3                    | Week 3       |
| Build homepage, login, register, and gallery pages     | Thu 29/01/26     | 5                    | Week 3-4     |
| Implement product detail page and REST API             | Thu 05/02/26     | 4                    | Week 4-5     |
| Develop shopping cart with Zustand persisted store     | Wed 11/02/26     | 4                    | Week 5-6     |
| Build checkout page and order creation API             | Tue 17/02/26     | 4                    | Week 6       |
| Implement admin panel (products, orders, users CRUD)   | Mon 23/02/26     | 5                    | Week 7       |
| **Phase 3 — AI Generation & Advanced Features**        |                  | **20**               |              |
| Integrate MyMemory translation API                     | Mon 02/03/26     | 2                    | Week 8       |
| Connect backend to Google Gemini Image API             | Wed 04/03/26     | 3                    | Week 8-9     |
| Implement async generation with Firestore polling      | Mon 09/03/26     | 4                    | Week 9       |
| Design and refine paint-by-numbers prompt template     | Fri 13/03/26     | 4                    | Week 9-10    |
| Build AI generation frontend page with loading state   | Thu 19/03/26     | 5                    | Week 10-11   |
| Implement user profile, favourites, and order history  | Thu 26/03/26     | 3                    | Week 11      |
| **Phase 4 — Testing, Security & Deployment**           |                  | **16**               |              |
| Apply Joi validation, Helmet headers, rate limiting    | Mon 30/03/26     | 3                    | Week 12      |
| Write Swagger/OpenAPI documentation                    | Thu 02/04/26     | 2                    | Week 12      |
| Test all API endpoints with Postman                    | Mon 06/04/26     | 3                    | Week 13      |
| Fix UI bugs and optimise responsive design             | Thu 09/04/26     | 3                    | Week 13      |
| Deploy frontend to Vercel, backend to Render           | Mon 13/04/26     | 2                    | Week 14      |
| Perform final end-to-end live testing                  | Wed 15/04/26     | 2                    | Week 14      |
| Write the final dissertation report                    | Fri 17/04/26     | 10                   | Week 14-15   |
| **Project Demonstration**                              |                  | **2**                |              |
| Prepare slides for final presentation                  | Thu 30/04/26     | 2                    | Week 15      |
