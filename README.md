# AI-Based Employee Performance Analytics & Recommendation System

A modern full-stack web application designed for HR departments to manage employees and utilize AI to generate performance insights, promotion recommendations, and training suggestions.

## Features

- **Authentication System**: Secure signup and login with JWT and bcrypt password hashing.
- **Employee Management**: Complete CRUD operations for employees with rich data fields (skills, experience, performance score).
- **Advanced Data Table**: Pagination, sorting by performance, searching, and filtering by department.
- **Analytics Dashboard**: Real-time aggregation of metrics (Total Employees, Avg Performance, Top Performers) and interactive Bar charts for average scores per department.
- **AI Recommendations**: OpenRouter integration (Mistral-7b-instruct) providing JSON-structured AI feedback.
- **Modern UI**: Built with React, Tailwind CSS, Lucide icons, Recharts, and Framer-like polish (glassmorphism, subtle animations).

## Tech Stack

**Backend:**
- Node.js 20+, Express 4.x
- MongoDB Atlas & Mongoose 7.x
- JWT (jsonwebtoken 9.x), bcryptjs 2.x
- Security: helmet, express-rate-limit, cors
- Validation: express-validator

**Frontend:**
- React 18 (Vite 5)
- React Router DOM 6.x
- Tailwind CSS 3.x
- Axios 1.x
- Recharts (Interactive charts)
- react-hot-toast (Notifications)

## Local Setup

### 1. Clone the repository
\`\`\`bash
git clone <your-repo-url>
cd <repo-folder>
\`\`\`

### 2. Configure Environment Variables
You need two `.env` files. We have already generated skeletons for you.
**Backend (`server/.env`)**
\`\`\`env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/employee_analytics
JWT_SECRET=supersecretjwtkey_with_at_least_32_chars_for_security
OPENROUTER_API_KEY=your_openrouter_api_key
CLIENT_URL=http://localhost:5173
\`\`\`
**Frontend (`client/.env`)**
\`\`\`env
VITE_API_URL=http://localhost:5000/api
\`\`\`

### 3. Run the Backend
\`\`\`bash
cd server
npm install
npm run dev # or node server.js
\`\`\`

### 4. Run the Frontend
In a new terminal:
\`\`\`bash
cd client
npm install
npm run dev
\`\`\`

## Obtaining an OpenRouter API Key

1. Go to [OpenRouter.ai](https://openrouter.ai/)
2. Sign up or log in.
3. Go to "Keys" in your dashboard and create a new API key.
4. Add credits to your account (or use free tier models if available).
5. Copy the key and place it in your `server/.env` file as `OPENROUTER_API_KEY`.

## API Reference Table

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| POST | `/api/auth/signup` | Register a new HR user | No |
| POST | `/api/auth/login` | Login and receive JWT | No |
| POST | `/api/employees` | Create a new employee record | Yes |
| GET | `/api/employees` | Fetch employees (paginated/filtered) | Yes |
| GET | `/api/employees/:id` | Get details of a single employee | Yes |
| PUT | `/api/employees/:id` | Update employee information | Yes |
| DELETE | `/api/employees/:id` | Remove an employee record | Yes |
| POST | `/api/ai/recommend` | Generate AI insights for employee | Yes |

## Render Deployment Steps

### Backend Deployment (Web Service)
1. In Render, select "New Web Service".
2. Connect your GitHub repository.
3. Root Directory: `server`
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Environment Variables:
   - Add all variables from `server/.env`
   - Set `CLIENT_URL` to your future frontend URL (e.g. `https://my-app.onrender.com`)

### Frontend Deployment (Static Site)
1. In Render, select "New Static Site".
2. Connect your GitHub repository.
3. Root Directory: `client`
4. Build Command: `npm install && npm run build`
5. Publish Directory: `dist`
6. Environment Variables:
   - Add `VITE_API_URL` pointing to your deployed backend (e.g. `https://my-api.onrender.com/api`)

## Future Improvements

- Add bulk upload (CSV/Excel) for employees.
- Advanced RBAC (Role-Based Access Control) for multiple HR tiers.
- Export AI recommendations as PDF.
- Dark mode toggle implementation.
