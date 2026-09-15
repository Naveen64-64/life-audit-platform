# ⏱️ Life Audit Platform

A simple, modern, responsive full-stack web application designed for college students to identify where their **time and energy are being wasted**, understand focus patterns, and receive practical, non-judgmental recommendations to elevate daily productivity.

---

## 🌟 Key Features & Philosophy

* **Minimum User Input**: No tedious time logging or manual calculations. All inputs use intuitive dropdowns, emoji radio cards, interactive sliders (1–10), and multi-select checkboxes.
* **Empathetic & Non-Judgmental Guidance**: Never shames the user. Uses supportive phrasing like *"appears to be a time leak"* or *"opportunity to optimize routine"*.
* **Rule-Based Life Audit Engine**: Uses transparent logical scoring rules (~75% practical accuracy target) for Time Leaks, Energy Slumps, Focus Stamina, and Goal Alignment.
* **Interactive Visual Dashboard**: Chart.js doughnut chart for 24-hour time distribution, bar charts for leak breakdown, line chart for energy curves, and radar profile.
* **Top 3 Leaks & Positive Habits**: Highlights top friction points alongside positive habits ("What You're Doing Well").
* **Actionable 3-Step Daily Plan**: Generates "Tomorrow's 3 Actions" with estimated hours saved.

---

## 🛠️ Tech Stack

### Frontend
* **React.js** (Vite, JavaScript, JSX)
* **React Router DOM** (Multi-page SPA navigation)
* **Chart.js & react-chartjs-2** (Interactive data visualization)
* **Vanilla CSS** (Custom dark glassmorphic design system with CSS variables)

### Backend
* **Python** & **FastAPI**
* **Pydantic** (Validation & schemas)
* **Motor** (Async MongoDB Atlas driver) with in-memory fallback for offline development

### Database
* **MongoDB Atlas** (Cloud NoSQL database)

---

## 📁 Project Structure

```text
life-audit-platform/
├── backend/
│   ├── app/
│   │   ├── main.py                    # FastAPI entrypoint & middleware
│   │   ├── config.py                  # Environment settings
│   │   ├── database.py                # Motor MongoDB & fallback memory DB
│   │   ├── models/                    # Data models
│   │   ├── schemas/                   # Pydantic schemas (AuditSubmission, AuditResponse)
│   │   ├── routes/
│   │   │   ├── audit.py               # /api/audit endpoints
│   │   │   └── health.py              # /api/health endpoint
│   │   └── services/
│   │       ├── audit_engine.py        # Rule-based calculation & scoring logic
│   │       └── recommendation_engine.py # Recommendation & action plan generator
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── ScoreCard.jsx
│   │   │   ├── TimeLeaksSection.jsx
│   │   │   ├── PositiveHabitsSection.jsx
│   │   │   ├── RecommendationsSection.jsx
│   │   │   ├── ActionPlanSection.jsx
│   │   │   └── Charts/
│   │   │       ├── TimeDistributionChart.jsx
│   │   │       ├── TimeLeaksChart.jsx
│   │   │       ├── EnergyChart.jsx
│   │   │       └── FocusChart.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── AuditPage.jsx          # 6-step form
│   │   │   ├── ResultsPage.jsx        # Detailed dashboard
│   │   │   └── AboutPage.jsx
│   │   ├── services/
│   │   │   └── api.js                 # API client with fallback
│   │   ├── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .env.example
└── README.md
```

---

## 🚀 Setup & Installation

### 1. Environment Configuration

Create a `.env` file in the root directory (or inside `backend/`):

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=life_audit
PORT=8000
HOST=0.0.0.0
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

> **Note**: If `MONGODB_URI` is omitted or invalid during initial local setup, the backend automatically operates with an in-memory fallback database so you can test immediately!

---

### 2. Backend Setup (FastAPI)

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the backend server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   API interactive docs will be available at: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### 3. Frontend Setup (React / Vite)

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install Node packages:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open your browser at [http://localhost:5173](http://localhost:5173)

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service and Database health check |
| `POST` | `/api/audit` | Submits 6-step questionnaire, processes score & stores report |
| `GET` | `/api/audit/{id}` | Retrieves stored audit result |
| `GET` | `/api/audit/{id}/recommendations` | Retrieves recommendations and daily action plan |
| `GET` | `/api/audit/{id}/report` | Retrieves complete consolidated dashboard report |

### Example API Request (`POST /api/audit`)

```json
{
  "step1": {
    "student_status": "College Student",
    "wake_time": "7–8 AM",
    "sleep_time": "11 PM–12 AM"
  },
  "step2": {
    "college_time": "5–7 hours",
    "study_time": "2–3 hours",
    "social_media": "2–3 hours",
    "entertainment": "1–2 hours",
    "gaming": "Less than 30 minutes",
    "commute": "30–60 minutes"
  },
  "step3": {
    "sleep_quality": "Average",
    "exercise": "1–2 days/week",
    "phone_check_frequency": "Every 30–60 minutes",
    "notifications_enabled": "Yes"
  },
  "step4": {
    "morning_energy": 7,
    "afternoon_energy": 4,
    "night_energy": 6,
    "tired_frequency": "Sometimes"
  },
  "step5": {
    "focus_duration": "20–30 minutes",
    "task_switching": "Sometimes",
    "interruptions": ["Phone", "Notifications", "Social media"]
  },
  "step6": {
    "main_goal": "Improve College Grades",
    "goal_importance": 9,
    "goal_satisfaction": 5
  }
}
```

### Example API Response

```json
{
  "id": "e8a93a1f-829d-4886-b4d2-d1123456789a",
  "created_at": "2026-09-08T00:21:00.000Z",
  "overall_score": 67,
  "time_score": 58,
  "energy_score": 72,
  "focus_score": 61,
  "goal_alignment_score": 77,
  "time_distribution": {
    "College / Classes": 6.0,
    "Productive Study": 2.5,
    "Social Media": 2.5,
    "Entertainment": 1.5,
    "Gaming": 0.3,
    "Commute": 0.75,
    "Sleep & Rest": 7.5,
    "Other / Unplanned": 2.95
  },
  "detected_leaks": [
    {
      "title": "Social Media Usage",
      "category": "Time",
      "estimate": "Est. 2–3 hours / day",
      "impact": "Medium",
      "description": "Social media appears to be one of your biggest daily time sinks.",
      "icon": "📱"
    }
  ],
  "positive_habits": [
    "You consistently dedicate time each day to focused study.",
    "High clarity & motivation for your primary goal: 'Improve College Grades'."
  ],
  "recommendations": [
    {
      "title": "Set a 60-Minute Social Media App Limit",
      "description": "Use built-in screen time limits on study days.",
      "category": "Time Management",
      "priority": 1
    }
  ],
  "daily_action_plan": {
    "title": "Tomorrow's 3 Actions",
    "actions": [
      {
        "text": "Limit social media usage to 60 minutes on study days.",
        "icon": "📱",
        "estimated_hours_saved": "~1 hour recovered"
      }
    ],
    "estimated_recovery": "Small daily tweaks like these can help recover an estimated 1 to 2 hours of useful focus time."
  }
}
```

---

## 🔮 Future Improvements

* **Weekly Trend Audits**: Compare audit scores over time with historical progress charts.
* **Export PDF Summary**: Download a 1-page printable summary for personal goal tracking.
* **Custom Time Block Calendar Integration**: Sync recommended study blocks directly to Google Calendar.
