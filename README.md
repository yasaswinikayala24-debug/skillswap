# SkillSwap — Full-Stack Skill Exchange Platform

SkillSwap is a peer-to-peer skill exchange platform designed to connect individuals who want to learn new skills with those willing to teach skills they know.

---

## 🚀 Key Features

### Phase 1: Foundation & Authentication
* **Modern Landing Page**: High-converting, responsive landing page with Hero, How It Works, Why SkillSwap, Popular Skills, Call to Action, and Footer.
* **User Registration & Authentication**: Client-side validation, duplicate email detection, password hashing (`bcryptjs`), and JWT authentication.
* **Protected Routing**: Navigation guards ensuring private pages (`/dashboard`, `/profile`, `/my-skills`) require authentication.
* **User Profile**: Profile page allowing users to view & update Name, Bio, and Profile Avatar URL with MongoDB persistence.

### Phase 2: Skill Management & Skill Discovery
* **Skill Management (`/my-skills`)**:
  * **Skills I Can Teach**: Add skills you know with proficiency levels (`Beginner`, `Intermediate`, `Advanced`, `Expert`).
  * **Skills I Want to Learn**: Add target learning skills with proficiency levels.
  * **Skill Operations**: Add skills via search or custom creation, edit proficiency level, remove skills with confirmation dialogs.
* **Skill Discovery (`/skills`)**:
  * Search skills by name or keyword.
  * Filter skills by 17 predefined categories (`Programming`, `Web Development`, `Data Science`, `UI/UX Design`, `Languages`, etc.).
  * Displays swapper count and teacher/learner statistics for each skill card.
* **Find People (`/find-people`)**:
  * Discover community members teaching or learning specific skills.
  * Filter swappers by skill name, user name, or bio keywords.
* **Public User Profiles (`/user/:id`)**:
  * Shareable public profile displaying user bio, role, skills they can teach, and skills they want to learn (excluding passwords and private tokens).
* **Dynamic Dashboard (`/dashboard`)**:
  * Live statistics showing the user's total teaching and learning skill counts.
  * Quick navigation action links to manage skills, explore categories, and find swappers.

---

## 🛠 Technology Stack

### Frontend
* **Framework**: React.js (via Vite)
* **Styling**: Tailwind CSS v4 + Glassmorphic design system
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
│   │   │   ├── AddSkillModal.jsx
│   │   │   ├── Alert.jsx
│   │   │   ├── ConfirmDeleteModal.jsx
│   │   │   ├── EditSkillModal.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── MetricCard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── PublicRoute.jsx
│   │   │   ├── SkillBadge.jsx
│   │   │   ├── SkillCard.jsx
│   │   │   └── UserSkillCard.jsx
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── FindPeople.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── MySkills.jsx
│   │   │   ├── NotFoundPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── PublicUserProfile.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── Skills.jsx
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
│   │   ├── skillController.js
│   │   ├── userController.js
│   │   └── userSkillController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── Skill.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── skillRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── seedSkills.js
│   ├── server.js
│   ├── .env
│   ├── .env.example
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

#### Skill Directory
| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/skills` | Public | List skills with search (`?search=`) and category (`?category=`) |
| `GET` | `/api/skills/:id` | Public | Retrieve single skill details |
| `POST` | `/api/skills` | Public/Private | Create a new skill in directory |

#### User Skill Management & Discovery
| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users/me/skills` | Private | Get user's `skillsToTeach` & `skillsToLearn` |
| `POST` | `/api/users/me/skills/teach` | Private | Add skill to `skillsToTeach` |
| `POST` | `/api/users/me/skills/learn` | Private | Add skill to `skillsToLearn` |
| `PUT` | `/api/users/me/skills/teach/:skillId` | Private | Update teaching skill level |
| `PUT` | `/api/users/me/skills/learn/:skillId` | Private | Update learning skill level |
| `DELETE` | `/api/users/me/skills/teach/:skillId` | Private | Delete teaching skill |
| `DELETE` | `/api/users/me/skills/learn/:skillId` | Private | Delete learning skill |
| `GET` | `/api/users/search` | Public | Search swappers by skill or name (`?skill=`) |
| `GET` | `/api/users/:id` | Public | View public user profile with teach/learn skills |

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
