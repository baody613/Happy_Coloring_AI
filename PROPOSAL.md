# Undergraduate Final Year Project Proposal

## [Your Project Title]

**[Your Name]**

**[Your Programme of Study]**

**[Your Banner ID]**

---

## 1 Overview

Currently, people who enjoy digital coloring paint usually only have one option: buying pre-made designs from stores. There is no easy way for them to turn their personal ideas or photos into a real numbered canvas toolkit. This project, called Happy Coloring AI, aims to solve this problem by combining a standard e-commerce website with an artificial intelligence image generator.

The project will function as a full online store where users can browse existing products, add items to a shopping cart, and check out using standard payment methods like VNPay, MoMo, or regular Cash on Delivery. However, the main feature is the AI generation tool. By connecting the system to the Google Gemini API, registered users can simply type a text description of what they want. The system will process this request and automatically generate a custom, black-and-white outline with numbers and a color palette, which is ready to be printed and painted.

To build this platform, I will use Next.js and Tailwind CSS for the frontend to make it fast and look good on mobile devices. The backend API will run on Node.js and Express. For the database and user authentication, I chose Firebase because it provides a secure NoSQL structure and handles image storage well. Because generating AI images takes time, the system will use a polling structure so the user interface does not freeze. Overall, this project will demonstrate how web development and AI can work together to create a useful and fun business application.

---

## 2 Aim

To develop a full-stack e-commerce web application that allows users to buy pre-made digital coloring paint kits and use an integrated AI generator to create custom coloring artworks based on their own text descriptions.

---

## 3 Objectives

3.1 Project Requirements and Design
3.1.1 Research existing e-commerce systems and AI image tools [2.0]
3.1.2 Define the main features and software requirements [1.5]
3.1.3 Design the database schema and system architecture [2.0]
3.2 Frontend User Interface
3.2.1 Setup the Next.js application with Tailwind CSS [1.0]
3.2.2 Build the home, product gallery, and shopping cart pages [4.0]
3.2.3 Create the AI generation page with a loading state [2.5]
3.2.4 Implement the admin dashboard for managing data [3.0]
3.3 Backend API Development
3.3.1 Setup the Express server and Firebase Admin connection [1.5]
3.3.2 Write API endpoints for user login, products, and orders [4.0]
3.3.3 Integrate VNPay and MoMo payment gateways [3.5]
3.4 AI System Integration
3.4.1 Connect the backend to the Google Gemini API [2.0]
3.4.2 Write the logic to upload AI images to Firebase Storage [1.5]
3.4.3 Integrate an AI chatbot to help users find products [2.0]
3.5 System Testing and Deployment
3.5.1 Test the backend APIs using Postman [2.0]
3.5.2 Perform user testing on the frontend features [2.0]
3.5.3 Deploy the application to Vercel and Render [1.5]
3.5.4 Write the final project report and documentation [10.0]

---

## 4 Legal, Social, Ethical and Professional

**Legal Issues:** Since this is an e-commerce website, I will be storing user information such as email addresses and delivery details. The platform needs to comply with basic data protection laws by keeping passwords secure using Firebase Auth and keeping database records private. For payments, I am connecting to VNPay and MoMo, so my website will not store any credit card numbers directly. Additionally, AI-generated images might have copyright issues, so I will include a Terms of Service page explaining the rules about image ownership.

**Social Issues:** This project is designed to be accessible so that anyone, even those without technical or drawing skills, can create their own art. It encourages creativity and provides a relaxing hobby for users of different ages. I will also make sure the user interface is clear with good text contrast so it is easy to read.

**Ethical Issues:** AI tools can sometimes generate inappropriate or restricted content. To handle this, I will add strict instructions in the backend AI prompt to prevent it from creating violent or 18+ images. I also need to be transparent with users by clearly labeling that the chatbot and the image generators are powered by AI, and not by a real human.

**Professional Issues:** As a student developer, I will follow professional coding standards. This includes writing clean and understandable code, using version control (Git/GitHub) properly, and protecting the web app against common security threats. I will use rate limiting and basic headers to stop spam and simple attacks, showing that I take user security seriously.

---

## 5 Planning (see appendix A)

My approach for this project is to use a simplified Agile methodology. Since I am working alone, I will break the project down into manageable weekly sprints. I will use a Kanban board on GitHub Projects to track my tasks under "To Do", "In Progress", and "Done".

The project is split into phases. First, I will focus on building the fundamental e-commerce parts (user login, product display, and shopping cart). Once those work smoothly, I will move on to the more complex features like the AI image generation API and payment gateways. Finally, the last few weeks will be dedicated mainly to bug fixing, overall system testing, and writing my final dissertation report. This way, if the AI part takes more time than expected, I will still have a working shopping website that I can demonstrate.

---

## 6 Initial References

Firebase, 2024. _Firebase Documentation_. [online] Available at: <https://firebase.google.com/docs> (Accessed 15 January 2026).

Google AI for Developers, 2024. _Gemini API Reference_. [online] Available at: <https://ai.google.dev/docs> (Accessed 18 January 2026).

Next.js, 2024. _Next.js Documentation_. [online] Available at: <https://nextjs.org/docs> (Accessed 12 January 2026).

OWASP, 2021. _Top 10 Web Application Security Risks_. [online] Available at: <https://owasp.org/www-project-top-ten/> (Accessed 20 January 2026).

Sommerville, I., 2015. _Software Engineering_. 10th ed. Pearson.

VNPay, 2024. _VNPay Payment Gateway Integration_. [online] Available at: <https://sandbox.vnpayment.vn/apis/docs/> (Accessed 22 January 2026).

---

## APPENDIX A - SCHEDULE OF WORK

The table below outlines the full schedule for the 15-week project, including activity names, planned start dates, durations (in days), and the corresponding week periods to ensure steady progress up to the final demonstration.

| ACTIVITY                                      | PLAN START (DAY) | PLAN DURATION (DAYS) | WEEKS (1-15) |
| :-------------------------------------------- | :--------------- | :------------------- | :----------- |
| **Project Proposal & Setup**                  |                  | **13**               |              |
| Discuss proposal with supervisor              | Mon 12/01/26     | 1                    | Week 1       |
| Write project proposal                        | Tue 13/01/26     | 5                    | Week 1       |
| Upload project proposal                       | Mon 19/01/26     | 1                    | Week 2       |
| Setup GitHub, Next.js frontend, Node backend  | Tue 20/01/26     | 3                    | Week 2       |
| Research existing systems & UI design mockups | Fri 23/01/26     | 3                    | Week 2       |
| **Product Development - Phase 1 (Core)**      |                  | **25**               |              |
| Setup Firebase Authentication & DB schema     | Mon 26/01/26     | 3                    | Week 3       |
| Build homepage & login pages                  | Thu 29/01/26     | 4                    | Week 3-4     |
| Create API to fetch & display products        | Wed 04/02/26     | 5                    | Week 4-5     |
| Develop shopping cart (local storage)         | Wed 11/02/26     | 5                    | Week 5-6     |
| Build checkout page & order logic             | Wed 18/02/26     | 4                    | Week 6       |
| Implement Admin dashboard (products/orders)   | Tue 24/02/26     | 4                    | Week 7       |
| **Product Development - Phase 2 (Advanced)**  |                  | **20**               |              |
| Integrate VNPay & MoMo payment gateways       | Mon 02/03/26     | 5                    | Week 8       |
| Connect backend to Google Gemini AI API       | Mon 09/03/26     | 3                    | Week 9       |
| Refine AI prompts & set up Firebase Storage   | Thu 12/03/26     | 4                    | Week 9 -10   |
| Develop "Generate" page with loading handle   | Wed 18/03/26     | 5                    | Week 10-11   |
| Integrate AI Chatbot feature                  | Wed 25/03/26     | 3                    | Week 11      |
| **Testing & Refinement**                      |                  | **10**               |              |
| Conduct API testing via Postman               | Mon 30/03/26     | 3                    | Week 12      |
| Fix UI bugs & optimize responsive design      | Thu 02/04/26     | 4                    | Week 12-13   |
| Implement database security rules             | Wed 08/04/26     | 3                    | Week 13      |
| **Final Deployment & Report**                 |                  | **16**               |              |
| Deploy frontend to Vercel, backend to Render  | Mon 13/04/26     | 2                    | Week 14      |
| Perform final live end-to-end testing         | Wed 15/04/26     | 2                    | Week 14      |
| Write the final dissertation report           | Fri 17/04/26     | 10                   | Week 14-15   |
| **Project Demonstration**                     |                  | **2**                |              |
| Prepare slides for final presentation         | Thu 30/04/26     | 2                    | Week 15      |
