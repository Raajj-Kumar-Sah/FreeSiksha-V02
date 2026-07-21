<div align="center">

<!-- HERO BANNER -->
<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:1a1a2e,50:16213e,100:0f3460&height=200&section=header&text=FreeSiksha&fontSize=80&fontColor=e94560&fontAlignY=38&desc=AI-Powered%20Learning%20Management%20System&descAlignY=60&descSize=22&descColor=a8b2d8&animation=fadeIn" />

<!-- BADGES -->
<p>
  <img src="https://img.shields.io/badge/Stack-MERN-20c997?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/AI-Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/Auth-Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/Media-Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" />
  <img src="https://img.shields.io/badge/Deploy-Docker%20+%20Nginx-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
</p>

<p>
  <img src="https://img.shields.io/badge/License-MIT-e94560?style=flat-square" />
  <img src="https://img.shields.io/badge/Status-Production%20Ready-20c997?style=flat-square" />
  <img src="https://img.shields.io/badge/PRs-Welcome-a8b2d8?style=flat-square" />
</p>

<br/>

> **FreeSiksha** is a full-stack, AI-powered LMS where students find courses through natural language,  
> trainers manage content end-to-end, and admins govern everything — all in one seamless platform.

<br/>

[🚀 Live Demo](https://freesiksha-v02-frontend.onrender.com/) · [📖 API Docs](#) · [🐛 Report Bug](mailto:rajkumar68580@gmail.com) · [✨ Request Feature](mailto:rajkumar68580@gmail.com)

</div>

---

## 🖼️ Live Screenshots

> Real screens from the deployed application — every pixel built from scratch.

<br/>

### 🏠 Homepage — Clean, Fast, Welcoming
<img width="100%" src="ss1_home.png" alt="FreeSiksha Homepage" />

<br/>

### 📚 Course Detail Page — Dark Mode, Rich Content
<img width="100%" src="ss2_course.png" alt="Course Detail Page" />

<br/>

### 📊 Trainer Dashboard — Enrollment Analytics
<img width="100%" src="ss3_enrollments.png" alt="Trainer Enrollment Management" />

<br/>

### 👨‍🏫 Trainer Overview — Stats at a Glance
<img width="100%" src="ss4_trainer.png" alt="Trainer Dashboard Overview" />

<br/>

### 🛡️ Super Admin — The God Console
<img width="100%" src="ss5_admin.png" alt="Super Admin Panel" />

---

## ⚡ What Makes FreeSiksha Different

<table>
<tr>
<td width="50%">

### 🤖 Talk to Find Courses
Students don't search keywords — they describe what they want in plain English. Google Gemini AI reads the intent, extracts context, and surfaces the most relevant courses instantly.

</td>
<td width="50%">

### 🏗️ Built for Production
Not a toy project. Dockerized microservices, Nginx reverse proxy, JWT + RBAC security, rate limiting, and Cloudinary CDN — the same patterns used at scale.

</td>
</tr>
<tr>
<td width="50%">

### 🎓 Complete Learning Loop
Enroll → Watch → Track Progress → Complete → **Auto-generate Certificate**. Every step handled, every state persisted.

</td>
<td width="50%">

### 🛡️ God Console (Super Admin)
13-phase admin architecture with granular control over students, trainers, courses, content, blogs, volunteers, and system-wide reports — all in one panel.

</td>
</tr>
</table>

---

## 🏛️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser / Mobile)                     │
│                     React.js SPA  ·  Tailwind CSS                   │
└──────────────────────────────┬──────────────────────────────────────┘
                               │  HTTPS / REST (JSON)
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        NGINX  (Reverse Proxy)                        │
│              SSL Termination  ·  Static Serving  ·  Routing         │
└──────────┬────────────────────────────────────────────┬─────────────┘
           │                                            │
           ▼                                            ▼
┌──────────────────────┐                  ┌────────────────────────────┐
│  React Frontend      │                  │  Node.js + Express API     │
│  Docker Container    │                  │  Docker Container          │
│  Port 3000           │                  │  Port 5000                 │
└──────────────────────┘                  └──────────┬─────────────────┘
                                                     │
              ┌──────────────────────────────────────┼──────────────────────────┐
              │                                      │                          │
              ▼                                      ▼                          ▼
  ┌─────────────────────┐              ┌─────────────────────┐    ┌─────────────────────┐
  │   MongoDB Atlas      │              │   Google Gemini AI  │    │  Cloudinary CDN     │
  │   (Cloud Database)   │              │   (NLP Search)      │    │  (Media Storage)    │
  └─────────────────────┘              └─────────────────────┘    └─────────────────────┘

  ┌─────────────────────┐              ┌─────────────────────┐
  │   Firebase Auth      │              │  Resend / Brevo     │
  │   (Google OAuth)     │              │  (Email Service)    │
  └─────────────────────┘              └─────────────────────┘
```

---

## 🧰 Tech Stack

<div align="center">

### Frontend
![React](https://img.shields.io/badge/React.js-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

### Database & Storage
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

### AI & Auth
![Google Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

### DevOps
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

</div>

---

## ✨ Features

<details>
<summary><b>🎓 For Students</b></summary>
<br/>

- 🔍 **AI-Powered Search** — type what you *want to learn*, not what to search for
- 📚 **Smart Enrollment** — one click, instant access, email confirmation
- 📊 **Progress Tracking** — lecture-by-lecture completion, visual progress bars
- 🏆 **Auto Certificates** — PDF certificate generated automatically at 100% completion
- 📖 **Blog Feed** — curated learning articles from trainers and platform team
- 🌙 **Dark / Light Mode** — full theme toggle across all pages

</details>

<details>
<summary><b>🧑‍🏫 For Trainers</b></summary>
<br/>

- ✍️ **Course Builder** — create courses with rich descriptions, categories, pricing, and thumbnails
- 🎬 **Video Upload** — direct Cloudinary integration; no file size headaches
- 📋 **Lecture Manager** — drag-and-drop ordering, per-lecture metadata
- 📈 **Enrollment Analytics** — enrollment trend charts + gender demographics
- 📤 **Export Reports** — download student lists as CSV or PDF
- ✅ **Approval Workflow** — submit for review, get notified on approval or rejection
- 📝 **Manage Blogs** — publish educational content to the platform

</details>

<details>
<summary><b>🛡️ For Super Admin — The God Console</b></summary>
<br/>

- 👥 **Manage Students** — view, suspend, or delete student accounts
- 🧑‍🏫 **Manage Trainers** — review and manage all trainer accounts
- 🙋 **Manage Volunteers** — volunteer inbox and custom form builder
- 📋 **Trainer Applications** — review trainer applications with a form builder
- ✅ **Course Approval** — approve or reject submitted courses
- 🌐 **Global Enrollments** — view every enrollment across all courses
- 🛑 **Content Moderation** — moderate blogs, lectures, and course content
- 📊 **Export System Report** — full-platform data export
- 🏠 **CMS Controls** — edit homepage and about sections live
- ⚡ **Platform Status** — real-time ONLINE / OFFLINE indicator
- 🔒 **13-Phase Architecture** — granular control at every layer

</details>

<details>
<summary><b>🔐 Security</b></summary>
<br/>

- 🔑 JWT authentication with 24-hour expiry
- 🔒 bcrypt password hashing (salt factor: 10)
- 🛡️ RBAC enforced at every API middleware
- 🚦 Rate limiting: 100 req / 15 min per IP
- 🪖 Helmet.js security headers (XSS, HSTS, CSP)
- 🌐 HTTPS-only via Nginx SSL termination

</details>

---

## 📁 Project Structure

```
freesiksha/
├── client/                      # React.js Frontend
│   ├── public/
│   └── src/
│       ├── components/          # Reusable UI components
│       ├── pages/               # Route-level pages
│       │   ├── student/         # Dashboard, Search, Course Player
│       │   ├── trainer/         # Course Builder, Lecture Manager
│       │   └── admin/           # God Console, User Manager
│       ├── redux/               # State management (slices)
│       ├── hooks/               # Custom React hooks
│       └── utils/               # API helpers, constants
│
├── server/                      # Node.js + Express Backend
│   ├── config/                  # DB, Firebase, Cloudinary config
│   ├── controllers/             # Business logic per resource
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── enrollmentController.js
│   │   ├── certificateController.js
│   │   └── aiSearchController.js
│   ├── models/                  # Mongoose schemas
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Lecture.js           # Weak entity — depends on Course
│   │   ├── Enrollment.js        # Weak entity — depends on User + Course
│   │   ├── Certificate.js       # Weak entity — depends on Enrollment
│   │   └── Blog.js
│   ├── routes/                  # Express route definitions
│   ├── middleware/              # Auth, RBAC, rate-limiter, error handler
│   └── utils/                   # Email service, AI prompt builder
│
├── nginx/                       # Nginx reverse proxy config
├── docker-compose.yml           # Full-stack orchestration
└── .env.example                 # Required environment variables
```

---

## 🚀 Getting Started

### Prerequisites

```bash
node >= 18.0.0
npm >= 9.0.0
docker >= 24.0.0     # optional, for containerized setup
```

### Option A — Docker (Recommended)

```bash
# 1. Clone
git clone https://github.com/Raajj-Kumar-Sah/FreeSiksha-V02
cd freesiksha

# 2. Set environment variables
cp .env.example .env
# Fill in your keys (see Environment Variables section below)

# 3. Start everything
docker-compose up --build

# App running at https://localhost
```

### Option B — Manual Setup

```bash
# ── Backend ──────────────────────────────────────────
cd server
npm install
npm run dev          # Starts on http://localhost:5000

# ── Frontend (new terminal) ───────────────────────────
cd client
npm install
npm start            # Starts on http://localhost:3000
```

### Environment Variables

```env
# ── Server (.env) ────────────────────────────────────
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/freesiksha

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=24h

# Firebase (Google OAuth)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Resend or Brevo)
RESEND_API_KEY=your_resend_key
FROM_EMAIL=noreply@freesiksha.com

# ── Client (.env) ────────────────────────────────────
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
```

---

## 📡 API Reference

<details>
<summary><b>Auth Routes</b>  <code>/api/auth</code></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | ❌ | Register new user |
| `POST` | `/login` | ❌ | Login with email/password |
| `POST` | `/google` | ❌ | Google OAuth via Firebase |
| `POST` | `/forgot-password` | ❌ | Send OTP to email |
| `POST` | `/reset-password` | ❌ | Reset with OTP |
| `GET`  | `/me` | ✅ | Get current user profile |

</details>

<details>
<summary><b>Course Routes</b>  <code>/api/courses</code></summary>

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `GET` | `/` | ❌ | Any | Get all published courses |
| `GET` | `/:id` | ❌ | Any | Get course details |
| `POST` | `/` | ✅ | Trainer | Create new course |
| `PUT` | `/:id` | ✅ | Trainer | Update course |
| `DELETE` | `/:id` | ✅ | Trainer/Admin | Delete course |
| `POST` | `/:id/submit` | ✅ | Trainer | Submit for approval |
| `POST` | `/:id/approve` | ✅ | Admin | Approve course |
| `POST` | `/:id/reject` | ✅ | Admin | Reject with reason |

</details>

<details>
<summary><b>Enrollment Routes</b>  <code>/api/enrollments</code></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/:courseId` | ✅ | Enroll in a course |
| `GET` | `/my` | ✅ | Get my enrollments |
| `POST` | `/:courseId/lectures/:lectureId/complete` | ✅ | Mark lecture complete |
| `GET` | `/:courseId/progress` | ✅ | Get progress for a course |

</details>

<details>
<summary><b>AI Search Route</b>  <code>/api/search</code></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/?q=your+natural+language+query` | ❌ | AI-powered course search |

**Example:**
```bash
GET /api/search?q=I want to learn React for beginners

# Response
{
  "query": "I want to learn React for beginners",
  "aiExtracted": { "keywords": ["React", "frontend", "beginner"], "intent": "learn" },
  "results": [ { "title": "React From Zero", "trainer": "...", "rating": 4.8 } ]
}
```

</details>

---

## 🗂️ Data Models

```javascript
// User
{ name, email, password, role: ['student','trainer','admin'],
  avatar, isVerified, googleId, createdAt }

// Course  (Strong Entity)
{ title, description, category, price, status: ['draft','pending','live','archived'],
  trainerId → User, thumbnail, createdAt }

// Lecture  (Weak Entity — identity depends on Course)
{ courseId → Course, title, videoUrl, duration, order }

// Enrollment  (Weak Entity — identity depends on User + Course)
{ studentId → User, courseId → Course,
  completedLectures: [lectureId], progress: 0–100, isCompleted, enrolledAt }

// Certificate  (Weak Entity — identity depends on Enrollment)
{ enrollmentId → Enrollment, studentId, courseId,
  certificateUrl, issuedAt }

// Blog
{ title, content, authorId → User, tags: [], status, publishedAt }
```

---

## 🔄 Key Workflows

```
STUDENT ENROLLMENT FLOW
━━━━━━━━━━━━━━━━━━━━━━
Search (AI) → View Course → Enroll → Watch Lectures
→ Mark Complete → 100% → Certificate Generated → Email Sent

COURSE PUBLICATION FLOW
━━━━━━━━━━━━━━━━━━━━━━
Trainer Creates → Uploads Lectures → Submits for Review
→ Admin Reviews → Approves → Goes LIVE → Students See It

AI SEARCH FLOW
━━━━━━━━━━━━━━
Student Query → Backend → Gemini API (intent extract)
→ MongoDB Query (AI keywords) → Ranked Results → UI
```

---

## 🗺️ Roadmap

- [x] AI-powered course search (Gemini)
- [x] Role-based access control (Student / Trainer / Super Admin)
- [x] Video lectures via Cloudinary
- [x] Auto certificate generation
- [x] Email notifications (Resend / Brevo)
- [x] Docker + Nginx deployment
- [x] Enrollment trend & demographics analytics
- [x] CSV / PDF export for trainers
- [x] Dark / Light mode toggle
- [x] 13-phase Super Admin God Console
- [ ] 💳 Payment gateway (Razorpay / Stripe)
- [ ] 🤖 AI Tutor (real-time Gemini chat per course)
- [ ] 📱 Mobile app (React Native)
- [ ] 🌐 Multi-language support (Hindi, regional languages)
- [ ] 🎥 Live classes (Zoom / Jitsi integration)
- [ ] 🔤 Video auto-subtitles (AI transcription)

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn and build.

```bash
# 1. Fork the project
# 2. Create your feature branch
git checkout -b feature/AmazingFeature

# 3. Commit your changes
git commit -m 'Add AmazingFeature'

# 4. Push to the branch
git push origin feature/AmazingFeature

# 5. Open a Pull Request
```

---

## 👨‍💻 Author

<div align="center">

### RAJ KUMAR SAH
**Full Stack Developer · MERN · AI Integration**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/raj-kumar-sah-470323308/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Raajj-Kumar-Sah)
[![Portfolio](https://img.shields.io/badge/Portfolio-e94560?style=for-the-badge&logo=vercel&logoColor=white)](https://rajkumar-dev-b6ci.vercel.app/)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:rajkumar68580@gmail.com)

</div>

---

## 💼 Skills Demonstrated in This Project

<div align="center">

| Domain | Technologies |
|--------|-------------|
| **Frontend** | React.js, Redux, Tailwind CSS, Recharts, Dark/Light Mode |
| **Backend** | Node.js, Express.js, REST API Design, MVC Architecture |
| **Database** | MongoDB, Mongoose ODM, Schema Design, Indexing |
| **AI Integration** | Google Gemini API, Prompt Engineering, NLP Search |
| **Authentication** | JWT, bcrypt, Firebase OAuth2, RBAC Middleware |
| **Cloud & Media** | Cloudinary SDK, CDN Delivery, Signed Uploads |
| **Email Services** | Resend API, Transactional Email, HTML Templates |
| **DevOps** | Docker, Docker Compose, Nginx, Environment Config |
| **Security** | Helmet.js, Rate Limiting, Input Validation, HTTPS |
| **Analytics** | Enrollment Trend Charts, Demographics, CSV/PDF Export |


</div>

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:0f3460,50:16213e,100:1a1a2e&height=120&section=footer&animation=fadeIn" />

**⭐ If FreeSiksha helped you learn something or impressed you — drop a star. It means a lot.**

*Built with ❤️ using the MERN Stack *

</div>
