"""
/api/chat  — Groq proxy route with Server-Sent Events streaming.
Keeps the API key server-side and avoids browser CORS restrictions.
"""
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import httpx
import os
import json

# Ensure .env is loaded (safe to call multiple times)
from dotenv import load_dotenv
load_dotenv()

router = APIRouter(prefix="/api", tags=["chat"])

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

SYSTEM_PROMPT = """You are "AuditBot" — a friendly, supportive AI assistant embedded inside the Life Audit Platform, a web app designed for college students to identify time/energy waste patterns and get actionable productivity recommendations.

About this platform:
- Users fill out a 6-step questionnaire covering sleep, time usage, energy levels, focus patterns, and goals.
- The backend (FastAPI + Python) runs a rule-based audit engine to score four dimensions: Time Score, Energy Score, Focus Score, and Goal Alignment Score.
- Results include: Detected Time Leaks, Positive Habits, Top Recommendations, and a Tomorrow's 3 Actions plan.
- Charts shown: 24-hour Time Distribution (doughnut), Time Leaks Breakdown (bar), Energy Curve (line), Focus Radar.
- Tech stack: React.js (Vite) frontend, FastAPI backend, MongoDB Atlas, Chart.js.

You can ONLY answer questions about:
1. How to use this Life Audit Platform (navigation, steps, form fields).
2. What the scores and results mean (Time, Energy, Focus, Goal Alignment).
3. The detected leaks, recommendations, and action plans the platform generates.
4. Time management, productivity, energy, and focus improvement tips for college students.
5. Technical FAQs about this platform specifically.

If asked about anything outside this scope, politely redirect: "I am here specifically to help you make the most of your Life Audit results. Ask me about your scores, leaks, or how to use the platform!"

Keep responses concise (2-4 sentences max), warm, and non-judgmental. Use an occasional relevant emoji."""


class ChatRequest(BaseModel):
    question: str


async def stream_groq(question: str):
    """Generator that proxies Groq SSE chunks. Reads key at request time (not import time)."""
    # IMPORTANT: read at request time so dotenv has already populated os.environ
    api_key = os.getenv("GROQ_API_KEY", "").strip()

    if not api_key:
        yield f"data: {json.dumps({'error': 'GROQ_API_KEY not configured on server.'})}\n\n"
        return

    payload = {
        "model": "gemma2-9b-it",   # active free-tier model; alt: llama-3.1-8b-instant
        "stream": True,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user",   "content": question},
        ],
        "temperature": 0.7,
        "max_tokens": 400,
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "Accept": "text/event-stream",
    }

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            async with client.stream("POST", GROQ_API_URL, json=payload, headers=headers) as resp:
                if resp.status_code != 200:
                    body = await resp.aread()
                    error_msg = f"Groq returned {resp.status_code}: {body.decode()}"
                    yield f"data: {json.dumps({'error': error_msg})}\n\n"
                    return

                async for raw_line in resp.aiter_lines():
                    line = raw_line.strip()
                    if not line or line == "data: [DONE]":
                        continue
                    if line.startswith("data: "):
                        yield f"{line}\n\n"

    except httpx.TimeoutException:
        yield f"data: {json.dumps({'error': 'Request timed out. Please try again.'})}\n\n"
    except Exception as exc:
        yield f"data: {json.dumps({'error': str(exc)})}\n\n"


@router.post("/chat")
async def chat_proxy(req: ChatRequest):
    """Stream a Groq response as Server-Sent Events."""
    return StreamingResponse(
        stream_groq(req.question),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


@router.get("/chat/health")
async def chat_health():
    """Quick diagnostic: confirms whether GROQ_API_KEY is loaded."""
    key = os.getenv("GROQ_API_KEY", "").strip()
    return {
        "groq_key_loaded": bool(key),
        "key_preview": (key[:8] + "...") if key else "NOT SET",
    }
