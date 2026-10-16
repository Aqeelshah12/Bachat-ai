// Naming this file QWEN was a missunderstanding , I rqeuest judges to ignore it 
import OpenAI from 'openai'

const LANGUAGE_NAMES = {
  en: 'English',
  ur: 'proper Urdu script (not Roman Urdu)',
  roman: 'Roman Urdu (Urdu written in Latin/English letters)',
}

function buildSystemPrompt(language) {
  const summaryLanguage = LANGUAGE_NAMES[language] || LANGUAGE_NAMES.roman

  return `You are a financial data extraction engine for a budgeting app used by freelancers and gig workers in Pakistan. Users may write to you in English, proper Urdu script, or Roman Urdu (Urdu written in Latin letters) - handle all three correctly, even mixed within the same message.

Extract structured data from the user's message. Return ONLY valid JSON, no explanation, no markdown fences, in this exact shape:

{
  "income": [{ "amount": number, "period": string, "note": string }],
  "expenses": [{ "type": string, "amount": number, "frequency": string }],
  "summary": string
}

CLASSIFICATION IS CRITICAL - getting income vs expense backwards is a serious error. Use this vocabulary guide across all three languages:
- INCOME words (money coming IN, use the "income" array): kamaye, kamaya, kama liye, mila, milte hain, mil gaye, aaye (Roman Urdu); earned, received, got paid, income, made (English); کمائے، کمایا، ملے، آمدنی (Urdu script)
- EXPENSE words (money going OUT, use the "expenses" array): kharcha, kharch hue, istemal ho gaye, diya, kiraya, bill, udhaar diya (Roman Urdu); spent, paid, expense, cost, bill (English); خرچ، خرچہ، ادا کیے، کرایہ، بل (Urdu script)

When in doubt, ask: did money come TO the user, or did money LEAVE the user? Do not confuse these.

The "summary" must be specific, not generic, and MUST be written in ${summaryLanguage}, regardless of which language the user's own message was written in. Write 2-3 short sentences that:
1. State the exact numbers involved (income vs expenses mentioned), not just a vague statement without figures.
2. Say the exact shortfall or surplus amount, if it can be calculated from what the user gave.
3. Give one concrete, actionable suggestion tied to the actual numbers (e.g. how much to set aside next time, or what to cut) - not a generic tip.

If a field isn't mentioned, omit it from its array. Amounts should be numbers only (no currency symbols, no commas). If information is ambiguous, make a reasonable assumption and mention it plainly in the summary.`
}

let client

function getClient() {
  if (!client) {
    client = new OpenAI({
      baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
      apiKey: process.env.GEMINI_API_KEY,
    })
  }
  return client
}

export async function parseFinancialText(rawText, language = 'roman') {
  const completion = await getClient().chat.completions.create({
    model: 'gemini-3.6-flash',
    messages: [
      { role: 'system', content: buildSystemPrompt(language) },
      { role: 'user', content: rawText },
    ],
    temperature: 0.2,
  })

  const raw = completion.choices[0].message.content
  const cleaned = raw.replace(/```json|```/g, '').trim()
  return JSON.parse(cleaned)
}