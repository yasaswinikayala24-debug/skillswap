# SkillSwap — Full-Stack Skill Exchange Platform

SkillSwap is a peer-to-peer skill exchange platform designed to connect individuals who want to learn new skills with those willing to teach skills they know.

---

## 🚀 Key Features

### Phase 1: Foundation & Authentication
* **Modern Landing Page**: High-converting, responsive landing page with Hero, How It Works, Why SkillSwap, Popular Skills, Call to Action, and Footer.
* **User Registration & Authentication**: Client-side validation, duplicate email detection, password hashing (`bcryptjs`), and JWT authentication.
* **Protected Routing**: Navigation guards ensuring private pages (`/dashboard`, `/profile`, `/my-skills`, `/matches`, `/exchange-requests`, `/my-exchanges`, `/chat`, `/my-sessions`, `/notifications`) require authentication.
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

### Phase 4: Real-Time Communication, Sessions & Notifications
* **Real-Time 1-on-1 Chat (`/chat`)**:
  * **Access Control**: Communication is strictly enabled between users who have an **accepted** exchange request.
  * **Persistent Messaging**: Messages stored in MongoDB with full history, pagination, and real-time delivery via Socket.IO.
  * **Online/Offline Status**: Live connection status dots and indicators.
  * **Typing Indicators**: Real-time debounced typing alerts (`Rahul is typing...`).
  * **Read/Unread Status**: Automatic and manual message read confirmation with checkmarks.
* **Skill Exchange Sessions (`/my-sessions`)**:
  * **Session Scheduling**: Schedule 1-on-1 learning sessions with duration options (`30m`, `45m`, `60m`, `90m`, `120m`).
  * **Session Operations**: Reschedule, Cancel, or Mark Completed.
  * **Session Validation**: Prevents scheduling in the past.
  * **Tabbed Views**: Organized into `Upcoming`, `Completed`, and `Cancelled` tabs.
* **Notification System (`/notifications`)**:
  * **Real-Time Socket Notifications**: Instant alerts when receiving exchange requests, request acceptances/rejections, new chat messages, and session schedules.
  * **Notification Persistence**: Alerts saved to MongoDB and viewable in Notification Center with "Mark all as read" capability.
* **Navbar Badges**: Dynamic badges for `Requests`, `Messages`, and `Notifications`.

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
* **Styling**: Vanilla CSS & Tailwind CSS v4
* **Icons**: Lucide React
* **Routing**: React Router DOM v7
* **Real-Time Client**: Socket.IO Client v4

### Backend
* **Server**: Node.js & Express.js
* **Database**: MongoDB & Mongoose
* **Real-Time WebSockets**: Socket.IO v4
* **Authentication**: JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`

---

## 💾 Database Schema Overview

* **`User`**: `name`, `email`, `password`, `bio`, `profileImage`, `role`, `skillsToTeach[]`, `skillsToLearn[]`.
* **`Skill`**: `name`, `category`, `description`.
* **`ExchangeRequest`**: `sender`, `receiver`, `offeredSkill`, `requestedSkill`, `message`, `status` (`pending`, `accepted`, `rejected`, `cancelled`).
* **`Conversation`**: `participants[]`, `exchangeRequest`, `lastMessage`, `lastMessageAt`.
* **`Message`**: `conversation`, `sender`, `receiver`, `text`, `read`.
* **`Session`**: `exchangeRequest`, `organizer`, `participant`, `title`, `description`, `scheduledAt`, `duration`, `status` (`scheduled`, `completed`, `cancelled`).
* **`Notification`**: `recipient`, `sender`, `type` (`exchange_request`, `request_accepted`, `request_rejected`, `new_message`, `session_created`, `session_updated`, `session_cancelled`), `title`, `message`, `relatedId`, `read`.

---

## 🔌 API Endpoints Reference

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

#### Smart Matching & Exchange Requests (Phase 3)
| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/matches` | Private | Get recommended matches sorted by match percentage |
| `GET` | `/api/matches/:userId` | Private | Get detailed match breakdown |
| `POST` | `/api/exchange-requests` | Private | Send a new skill exchange request |
| `GET` | `/api/exchange-requests/received` | Private | List received exchange requests |
| `GET` | `/api/exchange-requests/sent` | Private | List sent exchange requests |
| `GET` | `/api/exchange-requests/pending-count` | Private | Get count of pending received requests |
| `PUT` | `/api/exchange-requests/:id/accept` | Private | Accept an exchange request |
| `PUT` | `/api/exchange-requests/:id/reject` | Private | Reject an exchange request |
| `PUT` | `/api/exchange-requests/:id/cancel` | Private | Cancel a sent request |
| `GET` | `/api/exchange-requests/active` | Private | List accepted active skill exchanges |

#### Real-Time Chat, Sessions & Notifications (Phase 4)
| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/conversations` | Private | List authenticated user conversations |
| `GET` | `/api/conversations/:id` | Private | Get single conversation details |
| `GET` | `/api/conversations/:id/messages` | Private | Get conversation messages with pagination |
| `POST` | `/api/conversations/:id/messages` | Private | Send message in conversation |
| `PUT` | `/api/messages/:id/read` | Private | Mark message as read |
| `POST` | `/api/sessions` | Private | Schedule a new skill exchange session |
| `GET` | `/api/sessions` | Private | List user sessions |
| `GET` | `/api/sessions/:id` | Private | Get single session details |
| `PUT` | `/api/sessions/:id` | Private | Reschedule a session |
| `PUT` | `/api/sessions/:id/cancel` | Private | Cancel a session |
| `PUT` | `/api/sessions/:id/complete` | Private | Mark session as completed |
| `GET` | `/api/notifications` | Private | Get user notifications with pagination |
| `GET` | `/api/notifications/unread-count` | Private | Get count of unread notifications |
| `PUT` | `/api/notifications/:id/read` | Private | Mark a notification as read |
| `PUT` | `/api/notifications/read-all` | Private | Mark all user notifications as read |

---

## ⚡ Socket.IO Events Reference

| Event Name | Direction | Payload | Description |
| :--- | :--- | :--- | :--- |
| `connection` | Client → Server | Auth Token | Authenticate socket connection |
| `user_online` | Server → Client | `{ userId, status }` | Broadcast user online status |
| `user_offline` | Server → Client | `{ userId, status }` | Broadcast user offline status |
| `join_conversation` | Client → Server | `{ conversationId }` | Join specific chat room |
| `leave_conversation` | Client → Server | `{ conversationId }` | Leave chat room |
| `typing_start` | Client → Server → Client | `{ conversationId, name }` | Relays typing indicator |
| `typing_stop` | Client → Server → Client | `{ conversationId }` | Relays typing stop |
| `receive_message` | Server → Client | `Message` Object | Real-time chat message delivery |
| `message_read` | Server → Client | `{ messageId, conversationId }` | Real-time read checkmark update |
| `notification` | Server → Client | `Notification` Object | Real-time alert delivery |

---

## 🏃 How to Run

### Run Backend Server
```bash
cd backend
npm run dev
```
> Server running at `http://localhost:5000` (Socket.IO enabled)

### Run Frontend Development Client
```bash
cd frontend
npm run dev
```
> Web App running at `http://localhost:5173`
