# SkillSwap — Full-Stack Skill Exchange Platform

SkillSwap is a peer-to-peer skill exchange platform designed to connect individuals who want to learn new skills with those willing to teach skills they know.

---

## 🚀 Key Features

### Phase 1: Foundation & Authentication
* **Modern Landing Page**: High-converting, responsive landing page with Hero, How It Works, Why SkillSwap, Popular Skills, Call to Action, and Footer.
* **User Registration & Authentication**: Client-side validation, duplicate email detection, password hashing (`bcryptjs`), and JWT authentication.
* **Protected Routing**: Navigation guards ensuring private pages (`/dashboard`, `/profile`, `/my-skills`, `/matches`, `/exchange-requests`, `/my-exchanges`) require authentication.
* **User Profile**: Profile page allowing users to view & update Name, Bio, and Profile Avatar URL with MongoDB persistence.

### Phase 2: Skill Management & Skill Discovery
* **Skill Management (`/my-skills`)**:
  * **Skills I Can Teach**: Add skills you know with proficiency levels (`Beginner`, `Intermediate`, `Advanced`, `Expert`).
  * **Skills I Want to Learn**: Add target learning skills with proficiency levels.
  * **Skill Operations**: Add skills via search or custom creation, edit proficiency level, remove skills with confirmation dialogs.
* **Skill Discovery (`/skills`)**: Search skills by name, keyword, or filter by 17 categories.
* **Find People (`/find-people`)**: Discover community members teaching or learning specific skills.
* **Public User Profiles (`/user/:id`)**: Shareable public profile displaying user bio, role, and skills.

### Phase 3: Smart Skill Matching & Skill Exchange Requests
* **Smart Matching Engine (`/matches`)**:
  * **Deterministic Scoring Algorithm**: Calculates match percentage based on two-way and one-way skill overlap between users.
  * **Match Categories**: `Strong Match` (80–100%), `Good Match` (60–79%), `Possible Match` (40–59%), `Low Match` (1–39%).
  * **Two-Way Match Recognition**: Identifies mutual exchange opportunities where User A teaches User B and User B teaches User A.
  * **Match Filtering & Sorting**: Filter matches by min match percentage, category, or match type, and sort by highest match percentage or recently joined.
* **Match Breakdown View (`/matches/:userId`)**: Detailed side-by-side comparison of teaching vs learning skills with match score gauge and direct exchange request trigger.
* **Exchange Request Workflow (`/exchange-requests`)**:
  * **Send Request**: Select offered skill from your teaching portfolio and requested skill from receiver's portfolio, with a personal message up to 500 characters.
  * **Received Requests**: Review incoming proposals with `Accept` and `Reject` actions.
  * **Sent Requests**: Track sent requests with live status badges (`Pending`, `Accepted`, `Rejected`, `Cancelled`) and `Cancel` action.
  * **Request Validation**: Prevents self-requests, duplicate pending requests, or invalid skill selections.
* **Active Skill Exchanges (`/my-exchanges`)**: View accepted peer-to-peer exchange partnerships with swapper details and trade skills.
* **Real-Time Analytics & Badging**:
  * Dashboard displays live metrics for `Potential Matches`, `Pending Requests`, and `Active Exchanges`.
  * Navbar displays dynamic pending request badge (e.g. `Requests (3)`).

---

## 📐 Matching Algorithm Explanation

The matching utility (`backend/utils/matchingAlgorithm.js`) computes deterministic match scores:

1. **Forward Match Check**: Identifies skills User A wants to learn that User B teaches (`skillsYouCanLearn`).
2. **Reverse Match Check**: Identifies skills User A teaches that User B wants to learn (`skillsYouCanTeach`).
3. **Scoring Formula**:
   - **Two-Way Match (Mutual)**: Base score of `80%` + `10%` per additional matching skill up to `100%`.
   - **One-Way Match (A learns from B)**: Base score of `50%` + `10%` per additional skill up to `75%`.
   - **One-Way Match (A teaches B)**: Base score of `40%` + `10%` per additional skill up to `60%`.
   - **No Overlap**: `0%`.

---

## 🛠 Technology Stack

### Frontend
* **Framework**: React.js (via Vite)
* **Styling**: Tailwind CSS v4 + Glassmorphic UI design system
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
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddSkillModal.jsx
│   │   │   ├── Alert.jsx
│   │   │   ├── ConfirmDeleteModal.jsx
│   │   │   ├── EditSkillModal.jsx
│   │   │   ├── ExchangeRequestModal.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── MatchCard.jsx
│   │   │   ├── MetricCard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── PublicRoute.jsx
│   │   │   ├── RequestStatusBadge.jsx
│   │   │   ├── SkillBadge.jsx
│   │   │   ├── SkillCard.jsx
│   │   │   └── UserSkillCard.jsx
│   │   ├── pages/
│   │   │   ├── ActiveExchanges.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ExchangeRequests.jsx
│   │   │   ├── FindPeople.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── MatchDetails.jsx
│   │   │   ├── Matches.jsx
│   │   │   ├── MySkills.jsx
│   │   │   ├── NotFoundPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── PublicUserProfile.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── Skills.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── exchangeRequestController.js
│   │   ├── matchController.js
│   │   ├── skillController.js
│   │   ├── userController.js
│   │   └── userSkillController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── ExchangeRequest.js
│   │   ├── Skill.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── exchangeRequestRoutes.js
│   │   ├── matchRoutes.js
│   │   ├── skillRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── matchingAlgorithm.js
│   │   └── seedSkills.js
│   ├── server.js
│   └── package.json
│
├── api/
│   └── index.js
├── vercel.json
└── README.md
```

---

## 📡 Complete REST API Reference

### Base URL: `/api`

#### Authentication & User Profiles
| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | API Health Check |
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT |
| `POST` | `/api/auth/logout` | Public | Logout current user session |
| `GET` | `/api/auth/me` | Private | Retrieve authenticated user session |
| `GET` | `/api/users/profile` | Private | Retrieve private user profile |
| `PUT` | `/api/users/profile` | Private | Update user Name, Bio, & Profile Image |

#### Skill Directory & User Skills
| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/skills` | Public | List skills with search & category filter |
| `GET` | `/api/skills/:id` | Public | Retrieve single skill details |
| `POST` | `/api/skills` | Public/Private | Create a new skill in directory |
| `GET` | `/api/users/me/skills` | Private | Get user's `skillsToTeach` & `skillsToLearn` |
| `POST` | `/api/users/me/skills/teach` | Private | Add skill to `skillsToTeach` |
| `POST` | `/api/users/me/skills/learn` | Private | Add skill to `skillsToLearn` |
| `PUT` | `/api/users/me/skills/teach/:skillId` | Private | Update teaching skill level |
| `PUT` | `/api/users/me/skills/learn/:skillId` | Private | Update learning skill level |
| `DELETE` | `/api/users/me/skills/teach/:skillId` | Private | Delete teaching skill |
| `DELETE` | `/api/users/me/skills/learn/:skillId` | Private | Delete learning skill |
| `GET` | `/api/users/search` | Public | Search swappers by skill or name |
| `GET` | `/api/users/:id` | Public | View public user profile |

#### Smart Matching & Exchange Requests (Phase 3)
| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/matches` | Private | Get recommended matches sorted by match percentage |
| `GET` | `/api/matches/:userId` | Private | Get detailed match breakdown between current & target user |
| `POST` | `/api/exchange-requests` | Private | Send a new skill exchange request |
| `GET` | `/api/exchange-requests/received` | Private | List received exchange requests |
| `GET` | `/api/exchange-requests/sent` | Private | List sent exchange requests |
| `GET` | `/api/exchange-requests/pending-count` | Private | Get count of pending received requests |
| `PUT` | `/api/exchange-requests/:id/accept` | Private | Accept an exchange request |
| `PUT` | `/api/exchange-requests/:id/reject` | Private | Reject an exchange request |
| `PUT` | `/api/exchange-requests/:id/cancel` | Private | Cancel a sent request |
| `GET` | `/api/exchange-requests/active` | Private | List accepted active skill exchanges |

---

## 🏃 How to Run

### Run Backend Server
```bash
cd backend
npm run dev
```
> Server running at `http://localhost:5000`

### Run Frontend Development Client
```bash
cd frontend
npm run dev
```
> Web App running at `http://localhost:5173`
