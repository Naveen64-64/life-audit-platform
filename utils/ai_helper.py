import httpx


MAX_NOTES_CHARS = 200
MAX_OUTPUT_TOKENS = 700
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


def _safe_notes_text(notes):
    text = (notes or "None").strip()
    if len(text) <= MAX_NOTES_CHARS:
        return text
    return text[:MAX_NOTES_CHARS] + "..."


def _call_openrouter_chat(api_key, messages, model="openai/gpt-4o-mini", max_output_tokens=MAX_OUTPUT_TOKENS):
    response = httpx.post(
        OPENROUTER_URL,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        json={
            "model": model,
            "messages": messages,
            "max_tokens": max_output_tokens,
        },
        timeout=60,
    )
    response.raise_for_status()

    data = response.json()
    try:
        return data["choices"][0]["message"]["content"]
    except (KeyError, IndexError, TypeError):
        raise ValueError("AI service returned an unexpected response format.")


def get_ai_suggestions(api_key, activities):
    if not activities:
        return "No activity data found. Please add some activities first."

    if not api_key:
        raise ValueError("OPENROUTER_API_KEY is missing. Add it to your .env file.")

    activity_text = ""
    for i, activity in enumerate(activities, start=1):
        activity_text += (
            f"Entry {i}: "
            f"Sleep={activity['sleep_hours']} hours, "
            f"Work/Study={activity['work_hours']} hours, "
            f"Mobile={activity['mobile_hours']} hours, "
            f"Exercise={activity['exercise_hours']} hours, "
            f"Mood={activity['mood']}, "
            f"Notes={_safe_notes_text(activity['notes'])}\n"
        )

    prompt = f"""
You are a productivity coach.

Analyze the user's daily activity records below and give:
1. A short lifestyle audit
2. Main unproductive patterns
3. 5 practical personalized suggestions
4. A short motivational ending

User activity data:
{activity_text}
"""

    return _call_openrouter_chat(
        api_key,
        messages=[
            {"role": "system", "content": "You are a productivity coach."},
            {"role": "user", "content": prompt},
        ],
        model="openai/gpt-4o-mini",
        max_output_tokens=MAX_OUTPUT_TOKENS,
    )


def get_chat_reply(api_key, system_prompt, user_message):
    if not api_key:
        raise ValueError("OPENROUTER_API_KEY is missing. Add it to your .env file.")

    return _call_openrouter_chat(
        api_key,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
        model="openai/gpt-4o-mini",
        max_output_tokens=MAX_OUTPUT_TOKENS,
    )