import React, { useState, useRef, useEffect } from 'react';

// ─── Pure local knowledge base — NO external API required ────────────────────
// All answers are derived from the Life Audit Platform project documentation.

const KB = {
  // ── Top-level topics ──────────────────────────────────────────────────────
  how_it_works: {
    answer: `The Life Audit Platform works in 3 simple stages:\n\n1️⃣ **Fill the 6-Step Form** — You answer quick questions (dropdowns, sliders, emoji cards) about your daily schedule, sleep, phone habits, energy levels, focus patterns, and personal goals. No manual time-logging needed!\n\n2️⃣ **Audit Engine Processes Your Data** — Our rule-based engine scores four dimensions: Time, Energy, Focus, and Goal Alignment — giving you an Overall Life Score.\n\n3️⃣ **View Your Dashboard** — You get an interactive results page with charts (time distribution, energy curve, focus radar), your top Time Leaks, Positive Habits, personalised Recommendations, and a "Tomorrow's 3 Actions" daily plan.`,
    followUp: [
      { id: 'form_steps',    label: '📝 Tell me about the 6 form steps' },
      { id: 'results_page',  label: '📊 What is on the results page?' },
      { id: 'back',          label: '← Back to main menu' },
    ],
  },

  form_steps: {
    answer: `The audit form has 6 short steps:\n\n**Step 1 — About You:** Your student status, wake time, and sleep time.\n\n**Step 2 — Daily Time Use:** How many hours you spend on college, studying, social media, entertainment, gaming, and commuting.\n\n**Step 3 — Habits & Distractions:** Sleep quality, exercise frequency, how often you check your phone, and whether notifications are on.\n\n**Step 4 — Energy Levels:** Sliders (1–10) for morning, afternoon, and night energy, plus how often you feel tired.\n\n**Step 5 — Focus Patterns:** How long you can focus before losing concentration, task-switching habits, and what interrupts you most.\n\n**Step 6 — Goals:** Your primary goal, how important it is (1–10), and how satisfied you are with your progress (1–10).`,
    followUp: [
      { id: 'how_it_works',  label: '← Back to "How it works"' },
      { id: 'back',          label: '← Back to main menu' },
    ],
  },

  results_page: {
    answer: `Your Results Dashboard includes:\n\n📊 **4 Score Cards** — Time Score, Energy Score, Focus Score, Goal Alignment Score, and an Overall Life Score (0–100).\n\n🍩 **Time Distribution Chart** — A doughnut chart showing your full 24-hour day breakdown across all activities.\n\n📉 **Time Leaks Chart** — A bar chart ranking your biggest time-wasting activities by estimated hours/day.\n\n⚡ **Energy Curve** — A line chart plotting your morning, afternoon, and night energy levels.\n\n🕸️ **Focus Radar** — A radar chart profiling your focus strengths and weaknesses.\n\n🚨 **Top Time Leaks** — Your biggest detected friction points with impact ratings (High/Medium/Low).\n\n✅ **Positive Habits** — Things you're already doing well.\n\n💡 **Recommendations** — Ranked, actionable suggestions.\n\n📅 **Tomorrow's 3 Actions** — A concrete 3-step daily plan with estimated hours saved.`,
    followUp: [
      { id: 'understand_scores', label: '📊 Explain my scores' },
      { id: 'back',              label: '← Back to main menu' },
    ],
  },

  what_is_audit: {
    answer: `A **Life Audit** is a structured self-assessment that helps you see clearly where your time and energy are actually going — versus where you *want* them to go.\n\nFor college students, daily hours disappear into social media, phone notifications, irregular sleep, and unplanned activities without you realising it. A Life Audit makes these patterns visible and measurable.\n\nThis platform replaces guesswork with data-driven insights:\n- 🔍 **Detects** your specific time leaks and energy drains\n- 📈 **Scores** your current habits across 4 dimensions\n- 🎯 **Aligns** your daily actions with your stated personal goals\n- 🛠️ **Gives** you a concrete 3-step plan for tomorrow\n\nThe goal is always supportive — never judgmental. Every insight is phrased as an *opportunity*, not a failure.`,
    followUp: [
      { id: 'time_leaks',        label: '⏰ What are time leaks?' },
      { id: 'understand_scores', label: '📊 Understand my scores' },
      { id: 'back',              label: '← Back to main menu' },
    ],
  },

  understand_scores: {
    answer: `Your audit generates **4 dimension scores** (each 0–100) that combine into an **Overall Life Score**.\n\nSelect a score below to learn what it means and how to improve it:`,
    followUp: [
      { id: 'score_time',   label: '⏱️ Time Score' },
      { id: 'score_energy', label: '⚡ Energy Score' },
      { id: 'score_focus',  label: '🧠 Focus Score' },
      { id: 'score_goal',   label: '🎯 Goal Alignment Score' },
      { id: 'back',         label: '← Back to main menu' },
    ],
  },

  score_time: {
    answer: `⏱️ **Time Score** measures how efficiently your day is structured.\n\n**What raises it:**\n- Balanced college + study hours (5–7h college, 2–4h study)\n- Low social media usage (under 1 hour/day)\n- Short commute time\n- Minimal entertainment overuse\n\n**What lowers it:**\n- Social media over 2 hours/day → flagged as High-Impact Time Leak\n- Entertainment over 2 hours/day → flagged as Medium-Impact Leak\n- Gaming over 1 hour/day\n- Very late wake times (after 10 AM)\n\n**Score meaning:**\n- 80–100 → Excellent time structure\n- 60–79 → Good, minor leaks present\n- 40–59 → Moderate leaks, clear room to improve\n- Below 40 → Significant time leaks detected`,
    followUp: [
      { id: 'understand_scores', label: '← Back to scores' },
      { id: 'time_leaks',        label: '⏰ What are time leaks?' },
      { id: 'back',              label: '← Back to main menu' },
    ],
  },

  score_energy: {
    answer: `⚡ **Energy Score** measures how well you maintain physical and mental energy throughout the day.\n\n**What raises it:**\n- Good or excellent sleep quality\n- Exercising 3+ days per week\n- Consistent wake time (6–8 AM)\n- Sleeping before midnight\n- Rarely or never feeling tired mid-day\n\n**What lowers it:**\n- Poor sleep quality → High-Impact Energy Drain\n- Little or no exercise (0–1 days/week)\n- Very late sleep time (after 1 AM)\n- Frequently feeling tired\n\n**Score meaning:**\n- 80–100 → Strong energy management\n- 60–79 → Adequate, some recovery gaps\n- 40–59 → Energy drains present, affecting focus\n- Below 40 → Significant sleep or lifestyle issue`,
    followUp: [
      { id: 'energy_tips',       label: '⚡ Get energy improvement tips' },
      { id: 'understand_scores', label: '← Back to scores' },
      { id: 'back',              label: '← Back to main menu' },
    ],
  },

  score_focus: {
    answer: `🧠 **Focus Score** measures how long and how deeply you can concentrate without interruption.\n\n**What raises it:**\n- Focus duration over 45 minutes per session\n- Rarely switching tasks\n- Few interruptions (none or only internal thoughts)\n- Notifications turned off while studying\n\n**What lowers it:**\n- Focus lasting under 20 minutes → High-Impact Focus Leak\n- Frequent task-switching → Medium-Impact\n- Phone + notifications as top interruptions\n- Social media as an interruption source\n\n**Score meaning:**\n- 80–100 → Deep focus capability, low distraction\n- 60–79 → Moderate focus with some interruptions\n- 40–59 → Significant distraction patterns\n- Below 40 → Chronic attention fragmentation`,
    followUp: [
      { id: 'improve_focus',     label: '🧠 How to improve my focus?' },
      { id: 'understand_scores', label: '← Back to scores' },
      { id: 'back',              label: '← Back to main menu' },
    ],
  },

  score_goal: {
    answer: `🎯 **Goal Alignment Score** measures how well your daily habits support your stated personal goal.\n\n**What raises it:**\n- High goal importance score (8–10 out of 10)\n- High goal satisfaction score (7–10 out of 10)\n- Choosing academically-focused goals (e.g. "Improve College Grades")\n- Low time leaks that directly conflict with your goal\n\n**What lowers it:**\n- Low importance score (you don't strongly care about your goal)\n- Low satisfaction score (big gap between where you are and where you want to be)\n- High social media or entertainment use when goal requires study time\n\n**Score meaning:**\n- 80–100 → Strong goal-habit alignment\n- 60–79 → Moderate alignment, some friction\n- 40–59 → Notable gap between goal and daily habits\n- Below 40 → Lifestyle significantly misaligned with stated goal`,
    followUp: [
      { id: 'goal_alignment',    label: '🎯 How to improve goal alignment?' },
      { id: 'understand_scores', label: '← Back to scores' },
      { id: 'back',              label: '← Back to main menu' },
    ],
  },

  time_leaks: {
    answer: `⏰ **Time Leaks** are activities that consume significantly more of your day than they return in value — silently draining hours you could use for study, rest, or goals.\n\nThe platform detects leaks in 4 categories:\n\n📱 **Social Media** — Flagged if over 2 hours/day (High Impact) or 1–2 hours (Medium Impact). Estimated actual usage is often 30–50% higher than reported.\n\n🎮 **Entertainment & Gaming** — Flagged if combined screen entertainment exceeds 2 hours/day on study days.\n\n😴 **Sleep Irregularity** — Late bedtimes (after 1 AM) or poor sleep quality that reduces your effective productive hours.\n\n📵 **Phone Interruptions** — Checking phone every 15 minutes or less, or having notifications always on, creates constant attention fragmentation.\n\nEach leak is rated:\n- 🔴 **High Impact** — Directly and significantly hurts your goals\n- 🟡 **Medium Impact** — Noticeable effect on productivity\n- 🟢 **Low Impact** — Minor friction, easy to adjust`,
    followUp: [
      { id: 'action_plan', label: '✅ How does the action plan fix leaks?' },
      { id: 'back',        label: '← Back to main menu' },
    ],
  },

  improve_focus: {
    answer: `🧠 Here are the platform's top focus improvement strategies:\n\n**1. Use Time Blocks (Pomodoro-style)**\nWork in 25–45 minute focused sessions with a 5-minute break. This trains your brain to sustain deeper attention over time.\n\n**2. Turn Off Notifications While Studying**\nEven *seeing* a notification breaks concentration for up to 23 minutes. Use Do Not Disturb or app blockers during study blocks.\n\n**3. Single-Task Deliberately**\nPick one task per session. Task-switching reduces efficiency by up to 40% — your brain needs time to "reload" context each time.\n\n**4. Designate a Study Space**\nYour brain builds associations between environment and behaviour. A consistent study spot trains you to enter focus mode faster.\n\n**5. Start with Your Hardest Task**\nUse your peak energy window (usually morning for most students) for the most cognitively demanding work.\n\n**6. Remove Social Media from Your Lock Screen**\nPhysical friction reduces impulsive checking. Set app time limits on study days (60 minutes max).`,
    followUp: [
      { id: 'energy_tips', label: '⚡ Energy tips to support focus' },
      { id: 'action_plan', label: '✅ See the action plan' },
      { id: 'back',        label: '← Back to main menu' },
    ],
  },

  energy_tips: {
    answer: `⚡ The platform's energy improvement recommendations for college students:\n\n**🛌 Sleep Quality**\n- Aim for 7–8 hours, consistent sleep & wake times (even weekends)\n- Stop screens 30 minutes before bed — blue light delays melatonin\n- Sleeping after 1 AM → classified as an Energy Drain leak\n\n**🏃 Exercise**\n- Even 20–30 minutes of light activity (walk, stretching) 3+ days/week significantly boosts afternoon energy and reduces tiredness\n- Morning exercise is especially effective for students with afternoon energy slumps\n\n**🍽️ Meal Timing**\n- Skipping breakfast → afternoon energy crash\n- Heavy lunches → post-lunch drowsiness that kills study sessions\n- Light, protein-rich snacks maintain steady energy\n\n**📵 Phone Breaks**\n- Constant phone checking stimulates cortisol (stress hormone), which drains energy\n- Scheduled "phone check windows" (e.g. every hour) help regulate this\n\n**💧 Hydration**\n- Even mild dehydration (1–2%) causes a measurable drop in concentration and energy. Keep water at your desk.`,
    followUp: [
      { id: 'improve_focus', label: '🧠 Focus improvement tips' },
      { id: 'action_plan',   label: '✅ See the action plan' },
      { id: 'back',          label: '← Back to main menu' },
    ],
  },

  action_plan: {
    answer: `✅ **Tomorrow's 3 Actions** is the platform's most concrete output — a personalised daily mini-plan generated from your top 3 detected issues.\n\n**What each action contains:**\n- 📝 A specific, doable instruction (e.g. "Limit social media to 60 minutes using app timer")\n- 🔖 An emoji category tag\n- ⏱️ Estimated hours recovered (e.g. "~1 hour recovered")\n\n**Why only 3 actions?**\nResearch shows that attempting too many habit changes at once leads to none sticking. Three targeted actions is the "minimum effective dose" for building momentum.\n\n**How to use it:**\n1. Read your 3 actions the night before\n2. Implement just those 3 changes tomorrow\n3. Re-run the audit in a week to track your score improvement\n\n**Example actions the platform generates:**\n- "Set a 60-min social media app limit on study days" → ~1h recovered\n- "Move bedtime 30 minutes earlier this week" → ~0.5h better sleep quality\n- "Try one 45-minute focus block before checking your phone in the morning" → ~1.5h deep work gained`,
    followUp: [
      { id: 'time_leaks',    label: '⏰ What leaks does it fix?' },
      { id: 'back',          label: '← Back to main menu' },
    ],
  },

  goal_alignment: {
    answer: `🎯 **How to improve your Goal Alignment Score:**\n\n**1. Set a Meaningful Goal**\nChoose a goal that genuinely matters to you (importance 8+/10). The engine detects low-importance goals and flags the motivation gap.\n\n**2. Reduce Conflicting Time Leaks**\nIf your goal is "Improve College Grades" but you spend 3h/day on social media — the engine flags this conflict. Reducing the leak directly raises your alignment score.\n\n**3. Increase Your Satisfaction Rating**\nA satisfaction score below 5 means a large gap between aspiration and reality. Each targeted action you take closes this gap.\n\n**4. Re-audit Weekly**\nGoal alignment improves progressively. Re-running the audit after a week of implementing the 3 Actions lets you see measurable improvement in your scores.\n\n**Available goals in the platform:**\n- 🎓 Improve College Grades\n- 💼 Land an Internship / Job\n- 🏋️ Improve Health & Fitness\n- 💰 Learn a New Skill\n- 😊 Improve Mental Well-being\n- ⚖️ Achieve Better Work-Life Balance`,
    followUp: [
      { id: 'action_plan',       label: '✅ See how the action plan helps' },
      { id: 'understand_scores', label: '📊 Back to all scores' },
      { id: 'back',              label: '← Back to main menu' },
    ],
  },
};

// ─── Main menu options ────────────────────────────────────────────────────────
const MAIN_MENU = [
  { id: 'how_it_works',      label: '🔍 How does this platform work?' },
  { id: 'what_is_audit',     label: '📋 What is a Life Audit?' },
  { id: 'understand_scores', label: '📊 Understand my scores' },
  { id: 'time_leaks',        label: '⏰ What are time leaks?' },
  { id: 'improve_focus',     label: '🧠 How to improve my focus?' },
  { id: 'energy_tips',       label: '⚡ Energy & sleep tips' },
  { id: 'action_plan',       label: '✅ About the action plan' },
  { id: 'goal_alignment',    label: '🎯 Improve goal alignment' },
];

const WELCOME = "Hi! I'm AuditBot 🤖 I know everything about this Life Audit Platform. Select a topic below — no typing needed!";

// ─── Simulated typing effect ──────────────────────────────────────────────────
function useTyping(text, speed = 12) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!text) return;
    setDisplayed('');
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayed, done };
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg }) {
  return (
    <div className={`bot-message ${msg.role}`}>
      {msg.role === 'bot' && <div className="bot-avatar-sm">🤖</div>}
      <div className="bot-bubble" style={{ whiteSpace: 'pre-wrap' }}>
        {msg.content}
        {msg.typing && <span className="cursor-blink">▌</span>}
      </div>
    </div>
  );
}

// ─── AuditBot component ───────────────────────────────────────────────────────
export default function AuditBot() {
  const [isOpen, setIsOpen]         = useState(false);
  const [messages, setMessages]     = useState([{ role: 'bot', content: WELCOME }]);
  const [options, setOptions]       = useState(MAIN_MENU);
  const [isTyping, setIsTyping]     = useState(false);
  const messagesEndRef              = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSelect = (option) => {
    if (isTyping) return;

    // "Back" always goes to main menu
    if (option.id === 'back') {
      setMessages(prev => [...prev,
        { role: 'user', content: option.label },
        { role: 'bot',  content: '👋 Back to the main menu! Choose another topic:' },
      ]);
      setOptions(MAIN_MENU);
      return;
    }

    const entry = KB[option.id];
    if (!entry) return;

    // Add user selection immediately
    setMessages(prev => [...prev, { role: 'user', content: option.label }]);
    setOptions([]);
    setIsTyping(true);

    // Simulate typing delay then reveal answer
    const words   = entry.answer.split(' ').length;
    const delay   = Math.min(Math.max(words * 18, 600), 1800); // 600–1800ms

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', content: entry.answer }]);
      setIsTyping(false);
      // Show follow-up options
      setTimeout(() => {
        setOptions(entry.followUp || MAIN_MENU);
      }, 300);
    }, delay);
  };

  const handleReset = () => {
    setMessages([{ role: 'bot', content: WELCOME }]);
    setOptions(MAIN_MENU);
    setIsTyping(false);
  };

  return (
    <div className="auditbot-root">
      {/* ── Chat Panel ───────────────────────────────────── */}
      {isOpen && (
        <div className="auditbot-panel" role="dialog" aria-label="AuditBot">

          {/* Header */}
          <div className="auditbot-header">
            <div className="auditbot-header-info">
              <div className="auditbot-header-avatar">🤖</div>
              <div>
                <div className="auditbot-header-name">AuditBot</div>
                <div className="auditbot-header-status">
                  <span className="status-dot" />
                  Life Audit Assistant
                </div>
              </div>
            </div>
            <div className="auditbot-header-actions">
              <button
                className="auditbot-icon-btn"
                onClick={handleReset}
                title="Restart"
                aria-label="Restart conversation"
                id="auditbot-reset-btn"
              >↺</button>
              <button
                className="auditbot-icon-btn"
                onClick={() => setIsOpen(false)}
                title="Close"
                aria-label="Close chatbot"
                id="auditbot-close-btn"
              >✕</button>
            </div>
          </div>

          {/* Messages */}
          <div className="auditbot-messages" role="log" aria-live="polite">
            {messages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} />
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="bot-message bot">
                <div className="bot-avatar-sm">🤖</div>
                <div className="bot-typing-indicator">
                  <span /><span /><span />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Options */}
          {!isTyping && options.length > 0 && (
            <div className="auditbot-options">
              <p className="auditbot-options-label">💬 Choose a topic:</p>
              <div className="auditbot-options-grid">
                {options.map(opt => (
                  <button
                    key={opt.id}
                    id={`auditbot-opt-${opt.id}`}
                    className={`auditbot-option-btn ${opt.id === 'back' ? 'back-btn' : ''}`}
                    onClick={() => handleSelect(opt)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── FAB Button ───────────────────────────────────── */}
      <button
        className={`auditbot-fab ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(prev => !prev)}
        aria-label={isOpen ? 'Close AuditBot' : 'Open AuditBot'}
        id="auditbot-fab-btn"
      >
        {isOpen ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <>
            <span className="fab-emoji">🤖</span>
            <span className="fab-label">AuditBot</span>
          </>
        )}
      </button>
    </div>
  );
}
