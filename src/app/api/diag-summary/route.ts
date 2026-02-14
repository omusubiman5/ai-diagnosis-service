import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const SUMMARY_PROMPT = `あなたはヨシコ。68歳の女性。SKILL60+のAIの友人です。
以下はユーザーとの「おしゃべりスキル診断」の結果です。
5つの質問への回答を分析して、その人の「隠れたスキル」「強み」「向いている活動」を温かく伝えてください。

【ルール】
- 3〜5文で簡潔に
- 具体的な回答内容を拾って褒める
- 難しい言葉を使わない
- 「スキル」→「得意なこと」、「マッチング」→「お仕事の紹介」等の言い換えを守る
- 最後に「SKILL60+であなたの得意なことを活かしてみませんか？」的な一言を添える`;

interface DiagAnswer {
  questionId: string;
  question: string;
  answer: string;
}

export async function POST(request: NextRequest) {
  try {
    const { answers } = (await request.json()) as { answers: DiagAnswer[] };

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json({ error: 'answers are required' }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      // Fallback: generate a simple summary without AI
      const fallback = generateFallbackSummary(answers);
      return NextResponse.json({ summary: fallback });
    }

    const answersText = answers
      .map((a, i) => `Q${i + 1}: ${a.question}\nA${i + 1}: ${a.answer}`)
      .join('\n\n');

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'z-ai/glm-4.5-air:free',
        messages: [
          { role: 'system', content: SUMMARY_PROMPT },
          { role: 'user', content: `診断結果:\n\n${answersText}` },
        ],
        max_tokens: 400,
        temperature: 0.8,
      }),
      signal: AbortSignal.timeout(30000),
    });

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      error?: { message?: string };
    };

    if (data.error) {
      const fallback = generateFallbackSummary(answers);
      return NextResponse.json({ summary: fallback });
    }

    const summary =
      data.choices?.[0]?.message?.content ||
      generateFallbackSummary(answers);

    return NextResponse.json({ summary });
  } catch (err) {
    console.error('[DiagSummary] Error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateFallbackSummary(answers: DiagAnswer[]): string {
  const lines = answers.map(
    (a) => `${a.question.split('\n')[0]} → 「${a.answer}」`
  );
  return (
    'おつかれさまでした！あなたのことが少しわかった気がするわ。\n\n' +
    lines.join('\n') +
    '\n\nあなたの経験は、きっと誰かの役に立つわよ。\nSKILL60+で、あなたの得意なことを活かしてみませんか？'
  );
}
