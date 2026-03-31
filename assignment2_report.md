# COURTS Ecommerce Web Application - Assignment 2 Final Report

## Table of Contents
1. [Introduction](#1-introduction)
2. [New Web Technologies Used](#2-new-web-technologies-used)
3. [System Setup Guide](#3-system-setup-guide)
4. [System Features Explanation](#4-system-features-explanation)
5. [Screenshots](#5-screenshots)
6. [Code Explanation](#6-code-explanation)
7. [Evaluation of Technologies](#7-evaluation-of-technologies)
8. [References](#8-references)

---

## 1. Introduction
The COURTS Ecommerce Web Application is a robust, full-stack platform designed to facilitate the online purchasing of furniture and related items. Building upon the foundational frontend established in Assignment 1, this subsequent phase involves architecting and integrating a fully functional backend system. This backend incorporates secure user authentication, product management, ordering facilities, geographic shop location, and dynamically generated PDF receipts. The ultimate goal is to provide a seamless, secure, and intuitive e-commerce experience for both customers and administrators.

---

## 2. New Web Technologies Used
To transform the basic frontend prototype into a complete, full-stack application, several contemporary web technologies were leveraged. These tools establish the backend logic, database persistence, and external service integrations.

### Express.js
* **What it is:** A minimal, unopinionated, flexible web application framework for Node.js.
* **Why it is used:** Serves as the primary routing and middleware framework handling incoming HTTP requests (GET, POST, PUT, DELETE) and transmitting JSON responses to the frontend.
* **Importance:** It greatly simplifies server creation compared to pure Node.js, enabling modular API endpoint structuring (`/api/products`, `/api/auth`) keeping code maintainable and organized via the MVC architecture.

### MongoDB & Mongoose
* **What it is:** MongoDB is a scalable, NoSQL document-oriented database. Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js.
* **Why it is used:** Used to securely store all persistent platform data, including User credentials, Product catalogs, Reviews, Orders, and Shop Locations.
* **Importance:** Its flexible JSON-like schema maps elegantly to JavaScript objects. Mongoose imposes strict schemas (e.g., establishing `required` fields and validating data types), offering a crucial layer of data integrity without losing the flexibility of NoSQL.

### JSON Web Tokens (JWT)
* **What it is:** An open standard (RFC 7519) that defines a secure, compact, and self-contained method for securely transmitting information between parties as a JSON object.
* **Why it is used:** Used to authenticate users upon login and secure private API routes (e.g., creating products, retrieving order history).
* **Importance:** It provides stateless authentication. Rather than storing sessions on the server, the backend verifies the cryptographic signature of the token supplied by the client, enhancing scalability and security.

### PayPal Integration (Sandbox)
* **What it is:** A secure simulation environment provided by PayPal to test payment transactions without capturing real funds.
* **Why it is used:** Implements the final checkout and payment procedure for orders directly.
* **Importance:** By integrating a realistic mock transaction framework, it proves the viability of end-to-end commerce logic while ensuring sensitive financial operations aren't prematurely exposed.

### PDFKit
* **What it is:** A robust PDF document generation library for Node.js.
* **Why it is used:** To dynamically render a formalized PDF receipt populated with order data immediately following a successful purchase.
* **Importance:** Allows the system to meet crucial business requirements (producing verifiable transactional records for users) purely programmatically on the server side.

---

## 3. System Setup Guide

### Prerequisites
* Node.js (v16+. recommended v18+) downloaded and installed from [nodejs.org](https://nodejs.org/)
* MongoDB (Local instance or MongoDB Atlas account)

### Step-by-Step Execution
1. **Clone/Extract Project Database:** Navigate your terminal to the project's backend directory (`cd /Users/mac/Documents/courtsmalayasia/backend`).
2. **Install Dependencies:**
   Run the following command to download all required third-party node modules:
   ```bash
   npm install
   ```
3. **Environment Setup:** Ensure the localized `.env` file exists with the following configuration:
   ```env
   PORT=5050
   MONGO_URI=mongodb://localhost:27017/courts_ecommerce
   JWT_SECRET=courts_super_secret_key_123
   PAYPAL_CLIENT_ID=your_paypal_sandbox_client_id
   ```
4. **Bootstrapping the Server:** Run the backend utilizing Nodemon for live-reloading:
   ```bash
   npm run dev
   ```
   *You should see "Server running on port 5050" and "MongoDB Connected" in your terminal.*
5. **Connect Frontend:** Proceed to your frontend Angular/React code, configure the API HTTP environment variable to target `http://localhost:5000/api`, and launch the web interface.

---

## 4. System Features Explanation

The application bridges complex business logic over multiple modular backend systems.

### Customer Features
* **User Authentication:** New users can register, while existing users log in. JWT assigns unique tokens passed via HTTP Headers for protected actions. 
* **Product Discovery:** Users can GET a list of active products or append a query string (e.g., `?keyword=sofa`) to search the repository. They can navigate deeper via standard id-based routing to view product specific queries.
* **Direct Purchasing:** Rather than requiring a session-based cart, users enact a direct purchase flow mapping an array of `orderItems` tightly coupling a product document object.
* **Order History & Receipts:** Users have dedicated routes fetching historical purchases unique to their token. Once paid, the system triggers `PDFKit` constructing a receipt tied specifically to the order ID, accessible via download endpoints.
* **Review Facilities:** Authenticated users map a 1-5 star rating and comment to a product. Upon submittal, the product's overall average score dynamically recalculates using aggregation.
* **Geographical Nearest Store Locator:** Uses mathematical distance charting (Haversine formula based on spherical coordinates) computing distances relative to coordinates submitted by the front end, returning sorted arrays delineating the nearest physical COURTS branches.

### Administrator Features
* **Product Catalog Controls:** Administrators (indicated by `isAdmin` flags modeled in the database) possess permissions enabling PUT, POST, and DELETE capabilities updating the global inventory.
* **Reporting Output:** An autonomous reporting route crawls aggregate database entries (e.g. `Orders.find({isPaid: true})`) summing revenues over requested periods aiding fiscal oversight.

---

## 5. Screenshots
*(Placeholder - Insert Project Screen Captures Upon Report Submission)*

* **Figure 1:** System Registration & Login Modules.
* **Figure 2:** Advanced Product Filtering and Dashboard display.
* **Figure 3:** Product View Detail incorporating user Reviews.
* **Figure 4:** Successful Paypal Integration Sandbox response overlay.
* **Figure 5:** Sample of dynamically generated PDF Receipt.
* **Figure 6:** Administrator Panel depicting modular array adjustments.

---

## 6. Code Explanation

### Authentication Verification (JWT Middleware)
```javascript
// Located in middleware/authMiddleware.js
const protect = async (req, res, next) => {
    let token;
    // Explanitory Note: We search for the Authorization header formatted as 'Bearer <token>'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            // Decode evaluates the token against our system's secret hash
            const decoded = jwt.verify(token, process.env.JWT_SECRET); 
            // We append the verified User document to the request for succeeding controllers.
            req.user = await User.findById(decoded.id).select('-password'); 
            next();
        } catch (error) { ... throw err }
    }
};
```

### Database Operations (Create Product Review)
```javascript
// Located in controllers/reviewController.js
const createProductReview = async (req, res) => {
    const { rating, comment, productId } = req.body;
    // 1. Validating Product Existence
    const product = await Product.findById(productId); 
    
    // 2. Committing the modular review document
    const review = new Review({
        name: req.user.name, rating: Number(rating), comment,
        user: req.user._id, product: productId
    });
    await review.save();

    // 3. Mathematical Recalculation modifying core product data
    const reviews = await Review.find({ product: productId });
    product.numReviews = reviews.length;
    // Reducer accurately reformulates average ranking based on new input magnitude.
    product.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length; 
    await product.save();
};
```

### Payment and Dynamic PDF Instantiation
```javascript
// Located in controllers/orderController.js
const addOrderItems = async (req, res) => {
    // ... validation ...
    const createdOrder = await order.save(); // Model Commits

    // The logic generates a distinct filepath linking the Object ID
    const pdfPath = path.join(__dirname, '..', `receipt_${createdOrder._id}.pdf`);
    
    // An asynchronous request is launched invoking PDFKit rules establishing the document stream
    await generatePdfReceipt(createdOrder, req.user, pdfPath);
    
    // Client payload responds favorably detailing order metrics and a direct link to the resource
    res.status(201).json({ order: createdOrder, receiptUrl: `/api/orders/${createdOrder._id}/receipt` });
};
```

---

## 7. Evaluation of Technologies

The architectural stack employed—the MERN abstraction framework without React (MEAN with Angular/Plain JS)—showcased definitive strengths and localized trade-offs when facilitating ecommerce pipelines.

**Why Were They Chosen?**
Express and MongoDB harmonize tightly utilizing JavaScript primitives concurrently on both client and server domains. This removes the "context switching" overhead necessary in polyglot environments (e.g PHP/MySQL vs Frontend JS). Furthermore, Mongoose offers extreme agility when iterating schemas dynamically.

**Advantages:**
1. **Uninterrupted Scalability:** Express handles asynchronous non-blocking event loops, seamlessly handling vast amounts of simple concurrent data requests highly inherent to Ecommerce product views.
2. **Schema Flexibility & Velocity:** Adding new attributes (e.g. extending Products to include "Sizes" or "Colors") via MongoDB avoids horrific SQL alter-table bottlenecks. 
3. **Stateless Efficiency:** JWT verification drastically reduces server memory allocation commonly strained by traditional cookie-session states in massive platforms.  

**Limitations / Trade-offs:**
1. **Transaction Complexity in MongoDB:** Multi-document ACID transactions, heavily required by complex financial arrays, are intrinsically harder to architect perfectly in default MongoDB comparative to Relational Databases.
2. **PDF Computation Blocking:** Libraries like `PDFKit` execute synchronously in streams. If invoked concurrently by hundreds of successful transactions, Node's singular core can bottle-neck CPU resources, highlighting a limitation where microservice off-loading (like AWS Lambda) might be required professionally.

---

## 8. References

1. OpenJS Foundation. (2023). Node.js v18.x Documentation. Node.js. *Retrieved from: https://nodejs.org/docs/latest-v18.x/api/*
2. Express JS Foundation. (2023). Express.js Framework Guidelines. *Retrieved from: https://expressjs.com/en/guide/routing.html*
3. MongoDB Inc. (2023). MongoDB Schema Validation. *Retrieved from: https://www.mongodb.com/docs/manual/core/schema-validation/*
4. Automattic. (n.d.). Mongoose ODM v7 Documentation. *Retrieved from: https://mongoosejs.com/docs/guide.html*
5. Auth0. (n.d.). Introduction to JSON Web Tokens. JWT.io. *Retrieved from: https://jwt.io/introduction*
6. PDFKit Contributors. (2023). PDFKit Documentation. *Retrieved from: https://pdfkit.org/docs/getting_started.html*
7. Open AI Assistant / Google Gemini. (202x). Application Logic Assistance - Code review and architectural generation. *This project's code framework iteration and debugging methodology were aided utilizing large language models.*
