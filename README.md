#  Learnify — Full-Stack Learning Management System

React 18 + Bootstrap 5 + Zustand · Node.js + Express · MongoDB Atlas

---

##  Project Structure

```
learnify/
├── backend/    Node.js + Express REST API + MongoDB Atlas
└── frontend/   React 18 + Bootstrap 5 + Zustand auth
```

---

##  Quick Start

### 1 — Backend

```bash
cd backend
npm install
cp .env.example .env
#   Paste your MongoDB Atlas URI in .env
npm run seed        # seeds 6 courses + admin user
npm run dev         # → http://localhost:5000
```

### 2 — Frontend _(new terminal)_

```bash
cd frontend
npm install
npm start           # → http://localhost:3000
```

---

##  Demo Login

| Role    | Email                | Password  |
|---------|----------------------|-----------|
| Admin   | admin@learnify.com   | admin123  |
| Student | Register at /signup  | any (≥6)  |

---

##  MongoDB Atlas Setup

1. Visit https://cloud.mongodb.com → create a free M0 cluster
2. **Connect** → **Drivers** → copy the connection URI
3. Replace `<username>` and `<password>` in your `backend/.env`
4. **Network Access** → Add IP → Allow from Anywhere (`0.0.0.0/0`)
5. Run `npm run seed` to populate the database

---

##  Features

### Student Side
| Page | Description |
|------|-------------|
| `/` | Browse, search & filter all courses |
| `/course/:id` | Course details, enroll |
| `/my-courses` | Enrolled courses with progress dashboard |
| `/player/:id` | Video player with lesson sidebar, mark-complete |
| `/login` `/signup` | JWT authentication |

### Admin Panel (`/admin`)
| Section | Description |
|---------|-------------|
| Dashboard | Stats cards + recent courses & enrollments |
| Courses | Table with search · Create / Edit / Delete · Lesson builder |
| Users | View all users · Edit role/status · Delete |
| Enrollments | All student enrollments · Progress bars · Status |

---

##  API Reference

```
POST   /api/auth/signup
POST   /api/auth/login
GET    /api/auth/me                        (protected)

GET    /api/courses                        public
GET    /api/courses/:id                    public
GET    /api/courses/meta/categories        public
GET    /api/courses/admin/all              admin
POST   /api/courses                        admin
PUT    /api/courses/:id                    admin
DELETE /api/courses/:id                    admin

POST   /api/enrollments                    student
GET    /api/enrollments/my                 student
GET    /api/enrollments/check/:courseId    student
PUT    /api/enrollments/:courseId/progress student
GET    /api/enrollments/admin/all          admin

GET    /api/users/stats                    admin
GET    /api/users                          admin
PUT    /api/users/:id                      admin
DELETE /api/users/:id                      admin
```

---

##  Tech Stack

| Layer     | Tech |
|-----------|------|
| Frontend  | React 18, React Router v6, Zustand, Bootstrap 5, Bootstrap Icons |
| Backend   | Node.js, Express 4, Mongoose 8 |
| Database  | MongoDB Atlas |
| Auth      | JWT (stored in localStorage) |
| Fonts     | DM Sans (Google Fonts) |
