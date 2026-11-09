# QUIET BATTLES™
> **Brand:** QUIET BATTLES™  
> **Tagline:** WEAR YOUR BATTLES.  
> **Demo Collection:** SERIES 01 – THE GENTLE ARMOR™  
> **"Armor is not forged from iron alone. It is woven from intention, memory, and silence."**

A luxury fashion storytelling and e-commerce experience showcasing **SERIES 01 – THE GENTLE ARMOR™**. Designed as a cinematic, editorial digital flagship for an independent luxury fashion house.

---

## 1. PROJECT OVERVIEW

**QUIET BATTLES™** (Tagline: **WEAR YOUR BATTLES.**) challenges conventional, cookie-cutter e-commerce paradigms by merging brutalist restraint, high-contrast typography, and episodic narrative storytelling with a production-ready shopping architecture. 

### Core Color Palette:
- **Primary background:** `#171717` (Deep Charcoal)
- **Secondary dark:** `#222222` (Dark Surface)
- **Primary light background:** `#F3EFE7` (Clean Ivory)
- **Card background:** `#E8E1D6` (Warm Card Surface)
- **Primary text on dark:** `#F3EFE7`
- **Primary text on light:** `#171717`
- **Accent (Antique Gold):** `#B49A70`
- **Secondary text:** `#77736C`
- **Border:** `#D8D0C3` (Light) / `rgba(243, 239, 231, 0.12)` (Dark) 

### Core Highlights:
- **Cinematic Public Experience:** Full-screen hero sections, asymmetric lookbooks, chronological chapter storytelling, and architectural product displays.
- **Episodic Collection Structure:** Five interconnected narrative chapters leading up to the flagship commercial artifact (**THE GENTLE ARMOR – OVERSIZED TEE** @ ₹1,999.00).
- **Interactive Atelier Fitting Matrix:** Comprehensive size guide with exact measurements across 6 sizes (`XS`, `S`, `M`, `L`, `XL`, `XXL`).
- **Persistent Bag & Checkout Architecture:** Real-time stock reservation, quantity steppers, slide-over bag drawer, and localStorage persistence.
- **Restricted Administrative CMS Portal (`/admin`):** Fully integrated Content Management System powered by JWT authentication and relational MySQL persistence for Series, Chapters, Products, and Image Assets.

---

## 2. TECHNOLOGY STACK

### Frontend
- **Framework:** React 19 + Vite 6
- **Language:** Modern JavaScript ES6+
- **Styling:** Tailwind CSS v4 (with custom luxury `@theme` design tokens)
- **Typography:** Google Fonts (`Cinzel`, `Cormorant Garamond`, `Plus Jakarta Sans`)
- **Routing:** React Router DOM v7 (with SPA URL rewrites for production)
- **State Management:** React Context API (`CartContext`, `AuthContext`) with `localStorage`
- **Animations:** Framer Motion v12
- **Icons:** Lucide React
- **HTTP Client:** Axios (configured with base URL and JWT request interceptors)

### Backend
- **Runtime:** Node.js (v20+ / v22+)
- **Server:** Express.js REST API
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs salted password hashing
- **File Uploads:** Multer with file type filtering & 10MB limit
- **Asset Storage:** Hybrid Cloudinary integration with automatic local disk storage fallback (`/uploads`)
- **Security:** Parameterized SQL queries preventing SQL injection, CORS policy, centralized error handlers

### Database
- **Engine:** MySQL 8.0 (MySQL Community Server)
- **Driver:** `mysql2` with Promise-based connection pooling
- **Architecture:** Normalized 3NF relational design with foreign key cascades and indexed slugs

### Deployment Ready
- **Frontend:** Vercel (`vercel.json` SPA routing)
- **Backend:** Render (`render.yaml`)
- **Database:** Managed MySQL (PlanetScale, Aiven, or Railway MySQL)

---

## 3. PROJECT ARCHITECTURE & REPOSITORY STRUCTURE

```
QUIET BATTLES/
├── backend/
│   ├── config/
│   │   ├── db.js                 # MySQL2 connection pool
│   │   └── cloudinary.js         # Cloudinary configuration & fallback
│   ├── controllers/
│   │   ├── authController.js     # Admin login & profile validation
│   │   ├── seriesController.js   # Series CRUD operations
│   │   ├── chapterController.js  # Chapter CRUD operations & joins
│   │   ├── productController.js  # Product CRUD & size/inventory transactions
│   │   └── uploadController.js   # File upload & media catalog management
│   ├── database/
│   │   ├── schema.sql            # DDL MySQL relational schema
│   │   ├── initDb.js             # Automated database creation script
│   │   └── seedDb.js             # Automated seed execution script
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification & RBAC guard
│   │   ├── uploadMiddleware.js   # Multer file storage & type filter
│   │   └── errorMiddleware.js    # 404 & Centralized error handler
│   ├── routes/
│   │   ├── authRoutes.js         # /api/admin/*
│   │   ├── seriesRoutes.js       # /api/series/*
│   │   ├── chapterRoutes.js      # /api/chapters/*
│   │   ├── productRoutes.js      # /api/products/*
│   │   └── uploadRoutes.js       # /api/upload/*
│   ├── uploads/                  # Local media storage directory
│   ├── .env                      # Local environment variables
│   ├── .env.example              # Environment template
│   ├── package.json
│   ├── render.yaml               # Render deployment blueprint
│   ├── server.js                 # Express server bootstrap
│   └── testApi.js                # Automated end-to-end API test script
├── frontend/
│   ├── public/
│   │   └── favicon.svg           # Brand luxury monogram SVG
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx    # Sticky editorial header & mobile drawer
│   │   │   │   ├── Footer.jsx    # Dispatch newsletter & concierge links
│   │   │   │   ├── ScrollToTop.jsx
│   │   │   │   └── ToastNotification.jsx
│   │   │   ├── cart/
│   │   │   │   └── CartDrawer.jsx# Slide-over shopping bag
│   │   │   └── admin/
│   │   │       └── AdminLayout.jsx# CMS dark luxury sidebar workspace
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Admin authentication session
│   │   │   └── CartContext.jsx   # Bag state, quantities, localStorage
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Cinematic hero, philosophy, chapter deck
│   │   │   ├── Archive.jsx       # Series 01 catalog & chapter cards
│   │   │   ├── ChapterDetail.jsx # Dynamic /chapters/:slug editorial essay
│   │   │   ├── ProductDetail.jsx # Dynamic /products/:slug interactive gallery
│   │   │   ├── Shop.jsx          # Complete collection catalogue
│   │   │   ├── About.jsx         # Atelier manifesto & 3 pillars
│   │   │   ├── Cart.jsx          # Two-step checkout & order confirmation
│   │   │   ├── NotFound.jsx      # Minimal luxury 404
│   │   │   └── admin/
│   │   │       ├── AdminLogin.jsx
│   │   │       ├── Dashboard.jsx
│   │   │       ├── SeriesManager.jsx
│   │   │       ├── ChapterManager.jsx
│   │   │       ├── ProductManager.jsx
│   │   │       └── MediaLibrary.jsx
│   │   ├── services/
│   │   │   └── api.js            # Axios client with fallback data
│   │   ├── App.jsx               # Application routes
│   │   ├── index.css             # Tailwind v4 configuration
│   │   └── main.jsx
│   ├── index.html                # SEO metadata & Google Fonts
│   ├── package.json
│   ├── vercel.json               # Vercel SPA rewrite configuration
│   └── vite.config.js            # Vite build & proxy settings
├── docs/
│   ├── PHASE_1_SUMMARY.md        # Phase 1 Execution Report
│   ├── PHASE_2_SUMMARY.md        # Phase 2 Execution Report
│   ├── PHASE_3_SUMMARY.md        # Phase 3 Execution Report
│   └── PHASE_4_SUMMARY.md        # Phase 4 Execution Report
├── package.json                  # Root orchestration scripts
└── README.md
```

---

## 4. DATABASE RELATIONAL SCHEMA

```sql
CREATE DATABASE `wear_your_battles` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `wear_your_battles`;

-- 1. Admin Users
CREATE TABLE `admin_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Series (e.g. SERIES 01 – THE GENTLE ARMOR™)
CREATE TABLE `series` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `tagline` VARCHAR(255) DEFAULT NULL,
  `description` TEXT,
  `cover_image` VARCHAR(500) NOT NULL,
  `status` ENUM('draft', 'published') NOT NULL DEFAULT 'published',
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_series_slug` (`slug`),
  INDEX `idx_series_status` (`status`)
) ENGINE=InnoDB;

-- 3. Chapters
CREATE TABLE `chapters` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `series_id` INT NOT NULL,
  `chapter_number` INT NOT NULL DEFAULT 1,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `subtitle` VARCHAR(255) DEFAULT NULL,
  `description` TEXT,
  `content` LONGTEXT,
  `cover_image` VARCHAR(500) NOT NULL,
  `secondary_image` VARCHAR(500) DEFAULT NULL,
  `design_philosophy` TEXT DEFAULT NULL,
  `sort_order` INT DEFAULT 0,
  `status` ENUM('draft', 'published') NOT NULL DEFAULT 'published',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`series_id`) REFERENCES `series`(`id`) ON DELETE CASCADE,
  INDEX `idx_chapters_slug` (`slug`),
  INDEX `idx_chapters_series` (`series_id`)
) ENGINE=InnoDB;

-- 4. Products
CREATE TABLE `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `chapter_id` INT DEFAULT NULL,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `tagline` VARCHAR(255) DEFAULT NULL,
  `description` TEXT,
  `details` TEXT DEFAULT NULL,
  `composition` VARCHAR(255) DEFAULT '100% Heavyweight French Terry Cotton (320 GSM)',
  `care_instructions` VARCHAR(255) DEFAULT 'Hand wash cold or gentle cycle. Dry flat in shade.',
  `price` DECIMAL(10,2) NOT NULL DEFAULT 1999.00,
  `stock` INT NOT NULL DEFAULT 60,
  `status` ENUM('draft', 'published') NOT NULL DEFAULT 'published',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`chapter_id`) REFERENCES `chapters`(`id`) ON DELETE SET NULL,
  INDEX `idx_products_slug` (`slug`)
) ENGINE=InnoDB;

-- 5. Product Images (Gallery)
CREATE TABLE `product_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `caption` VARCHAR(255) DEFAULT NULL,
  `is_primary` BOOLEAN NOT NULL DEFAULT FALSE,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Product Sizes & Stock
CREATE TABLE `product_sizes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `size` VARCHAR(10) NOT NULL,
  `stock` INT NOT NULL DEFAULT 10,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `uniq_product_size` (`product_id`, `size`)
) ENGINE=InnoDB;

-- 7. Media Library Catalog
CREATE TABLE `media_library` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `original_name` VARCHAR(255) NOT NULL,
  `filename` VARCHAR(255) NOT NULL,
  `file_url` VARCHAR(500) NOT NULL,
  `mimetype` VARCHAR(100),
  `size_bytes` INT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
```

---

## 5. REST API SPECIFICATION

All endpoints adhere to consistent JSON envelope responses:
```json
{
  "success": true,
  "data": {},
  "message": "Operation description"
}
```

### 1. Authentication
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/admin/login` | Public | Authenticates admin using email & password; returns signed JWT. |
| `GET` | `/api/admin/profile` | Protected | Retrieves authenticated admin session information. |

### 2. Series (Collections)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/series` | Public / Admin | Returns published series (or all series if admin token supplied). |
| `GET` | `/api/series/:slug` | Public | Returns series metadata and child chapter array. |
| `POST` | `/api/series` | Protected | Creates a new series collection. |
| `PUT` | `/api/series/:id` | Protected | Updates series details. |
| `DELETE` | `/api/series/:id` | Protected | Cascades removal of series and associated chapters. |

### 3. Chapters (Storytelling Episodes)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/chapters` | Public / Admin | Returns all chapters ordered chronologically. |
| `GET` | `/api/chapters/:slug` | Public | Returns chapter essay, secondary image, design philosophy, and dynamically joined product. |
| `GET` | `/api/chapters/series/:seriesId` | Public | Returns chapters belonging to specific series. |
| `POST` | `/api/chapters` | Protected | Creates new chapter. |
| `PUT` | `/api/chapters/:id` | Protected | Updates chapter content and status. |
| `DELETE` | `/api/chapters/:id` | Protected | Deletes chapter. |

### 4. Products (Artifacts)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Public / Admin | Lists all commercial products with cover image and sizes. |
| `GET` | `/api/products/:slug` | Public | Returns product details, gallery images, size inventory, and origin chapter. |
| `POST` | `/api/products` | Protected | Creates product, initializes sizes (XS–XXL), and saves images in a transaction. |
| `PUT` | `/api/products/:id` | Protected | Updates price, stock matrix, description, and images. |
| `DELETE` | `/api/products/:id` | Protected | Removes product and associated sizes/images. |

### 5. Media & Uploads
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/upload` | Public / Admin | Multer file upload. Stores locally in `/uploads` or Cloudinary. |
| `GET` | `/api/upload` | Public | Lists all registered assets in media library. |
| `DELETE` | `/api/upload/:id` | Protected | Deletes media asset from storage and catalog. |

---

## 6. PRE-SEEDED DEMO CREDENTIALS

The database seed script sets up a ready-to-test Superadmin account:

- **Portal URL:** `http://localhost:5173/admin/login`
- **Email:** `admin@wearyourbattles.com`
- **Password:** `admin123`
- **Role:** `superadmin`

---

## 7. INSTALLATION & LOCAL SETUP

### Prerequisites
1. **Node.js** v20.x or higher (`node -v`)
2. **npm** v10.x or higher (`npm -v`)
3. **MySQL Server** 8.x running locally (`mysql --version`)

### Step 1: Clone or Navigate to Directory
```bash
cd "d:\python FullStack\QUIET BATTLES"
```

### Step 2: Configure Environment Variables
Inside `backend/.env`:
```env
PORT=5000
NODE_ENV=development

# MySQL Database Connection
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=12345
DB_NAME=wear_your_battles
DB_PORT=3306

# JWT Security
JWT_SECRET=wear_your_battles_secret_jwt_token_2026_luxury_key
JWT_EXPIRES_IN=7d

# Admin Seed Account
ADMIN_NAME=Creative Director
ADMIN_EMAIL=admin@wearyourbattles.com
ADMIN_PASSWORD=admin123

# Cloudinary (Optional - leaves blank for local /uploads fallback)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# CORS
CLIENT_URL=http://localhost:5173
```

### Step 3: Initialize & Seed MySQL Database
Run the automated schema and seeding scripts:
```bash
npm run db:init
npm run db:seed
```
*Output will confirm creation of 7 tables, 1 admin user, 1 series, 5 chapters, and 1 product with 6 sizes and 4 images.*

### Step 4: Start Backend REST API Server
```bash
npm run dev:backend
```
Server starts on `http://localhost:5000`.

### Step 5: Verify Backend APIs (Optional automated test)
In a separate terminal:
```bash
npm run test:api
```

### Step 6: Start Frontend Development Server
In a separate terminal:
```bash
npm run dev:frontend
```
Frontend launches at `http://localhost:5173`.

---

## 8. PRODUCTION DEPLOYMENT GUIDE

### Frontend (Vercel)
1. Push repository to GitHub.
2. Link repository in Vercel.
3. Configure settings:
   - **Root Directory:** `frontend`
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Set Environment Variable in Vercel:
   - `VITE_API_URL` = `https://your-backend-api.onrender.com/api`
5. Deploy. The included `vercel.json` guarantees smooth SPA client-side routing.

### Backend (Render)
1. Create a **Web Service** on Render.
2. Point to the `backend/` folder (or use `backend/render.yaml`).
3. Set Environment Variables:
   - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT` (from managed MySQL host).
   - `JWT_SECRET` = `<secure-secret-key>`
   - `CLIENT_URL` = `https://your-frontend.vercel.app`
4. Build Command: `npm install`
5. Start Command: `node server.js`

---

## 9. ASSESSMENT VERIFICATION CHECKLIST

- [x] **Homepage Loads Correctly:** Full-bleed photographic hero, typography, scroll indicator, brand manifesto, 5 chapter deck.
- [x] **Navigation Works:** Sticky header, active indicator, cart counter, responsive mobile drawer.
- [x] **Archive Page:** Displays SERIES 01 dynamically with 5 chapter cards.
- [x] **Chapter Detail Pages:** Dynamic retrieval by slug (`/chapters/chapter-01-the-beginning`), storytelling content, design philosophy, related product card.
- [x] **Product Detail Page:** Multi-angle gallery switcher, price (₹1,999.00), size picker (XS to XXL), quantity selector, stock count, architectural size guide.
- [x] **Add to Bag Validation:** Size selection enforced; prevents adding without size; updates cart count.
- [x] **Cart Drawer & Bag Persistence:** Slide-over drawer, quantity controls, localStorage persistence, two-step checkout review.
- [x] **Admin Authentication:** Protected login (`/admin/login`), bcrypt hash verification, JWT token issuance.
- [x] **Admin CMS Operations:** Complete CRUD for Series, Chapters, Products, and Media Assets.
- [x] **Image Management:** Hybrid Cloudinary & local `/uploads` storage fallback with file validation.
- [x] **Responsive Design:** Optimized across Desktop, Tablet, and Mobile viewport breakpoints.

