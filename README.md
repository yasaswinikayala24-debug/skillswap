# SkillSwap — Phase 1: Foundation & Authentication

SkillSwap is a peer-to-peer skill exchange platform designed to connect individuals who want to learn new skills with those willing to teach skills they know.

This repository contains **Phase 1: Foundation & Authentication**, implementing the landing page, user registration, authentication flow, protected routing, user dashboard, profile management, and database persistence.

---

## 🚀 Features (Phase 1)

* **Modern Landing Page**: High-converting, responsive landing page with Hero, How It Works, Why SkillSwap, Popular Skills, Call to Action, and Footer.
* **User Registration**: Client-side validation (name, valid email, min 8-char password, matching passwords), duplicate email detection, password hashing, and user creation in MongoDB.
* **Secure Authentication**: JWT-based login with password verification using `bcryptjs` and session persistence.
* **Protected Routes**: Navigation guards ensuring `/dashboard` and `/profile` are accessible only by authenticated users, with automatic redirection for unauthenticated visitors.
* **Interactive Dashboard**: Welcomes logged-in users with zero-state metric cards and profile setup prompts.
* **Profile Management**: Profile page allowing users to view their details, update their Full Name, Bio, and Profile Avatar URL with real-time MongoDB persistence.
* **Responsive Navigation**: State-aware navbar displaying `Home`, `Login`, `Register` for guests, and `Dashboard`, `Profile`, `Logout` for authenticated users with mobile drawer support.

---

## 🛠 Technology Stack

### Frontend
* **Framework**: React.js (via Vite)
* **Styling**: Tailwind CSS v4 + Vanilla CSS glassmorphism
* **Routing**: React Router DOM (v6)
* **Icons**: Lucide React

### Backend
* **Runtime**: Node.js
* **Framework**: Express.js REST API
* **Database**: MongoDB (via Mongoose ORM)
* **Authentication**: JSON Web Tokens (`jsonwebtoken`) & Password Hashing (`bcryptjs`)

---

## 📂 Project Structure

```text
SkillSwap/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Alert.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── MetricCard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── PublicRoute.jsx
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── NotFoundPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── utils/
│   │   │   └── validators.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── .env
│   ├── .env.example
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── server.js
│   ├── .env
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## 💻 Installation & Setup

### Prerequisites
* **Node.js**: v18 or higher
* **npm**: v9 or higher
* **MongoDB**: Local MongoDB instance (e.g. `mongodb://127.0.0.1:27017/skillswap`) OR MongoDB Atlas URI. (*Note: MongoMemoryServer fallback is included for isolated local environments*).

### 1. Clone & Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

---

## ⚙️ Environment Variables

### Backend `.env` (`backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/skillswap
JWT_SECRET=skillswap_super_secret_jwt_key_2026_phase1
USE_IN_MEMORY_DB=true
```

### Frontend `.env` (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🏃 How to Run

### Run Backend API Server
```bash
cd backend
npm run dev
# Server will start at http://localhost:5000
```

### Run Frontend Development Client
```bash
cd frontend
npm run dev
# Frontend will start at http://localhost:5173
```

---

## 📡 API Endpoints

### Base URL: `/api`

| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | API Health Check |
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT |
| `POST` | `/api/auth/logout` | Public | Logout current user session |
| `GET` | `/api/auth/me` | Private | Retrieve authenticated user session |
| `GET` | `/api/users/profile` | Private | Retrieve user profile details |
| `PUT` | `/api/users/profile` | Private | Update user Name, Bio, & Profile Image |

---

## 🔒 Authentication Flow

1. **User Registration**: Client validates form fields → sends `POST /api/auth/register` → Password hashed via `bcrypt.hash(10)` → User stored in MongoDB → Client redirects to `/login`.
2. **User Login**: Client sends `POST /api/auth/login` → Server compares password hash → Server generates JWT → Client stores token in `localStorage` & Context state → Client redirects to `/dashboard`.
3. **Protected Requests**: Client passes `Authorization: Bearer <token>` in headers → `authMiddleware.js` verifies token using `JWT_SECRET` → Attaches `req.user` → Controller executes request.
4. **Logout**: Token removed from `localStorage` & Context → State cleared → User redirected to `/login`.

---

## 🔮 Future Phases

* **Phase 2**: Skill Listing & Skill Directory (Teach / Learn skill tags).
* **Phase 3**: Peer Matching System & Exchange Requests.
* **Phase 4**: Real-time Chat & Session Scheduling.
* **Phase 5**: Ratings, Reviews, and Progression System.
