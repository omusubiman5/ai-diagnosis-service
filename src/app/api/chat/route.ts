import { NextRequest, NextResponse } from 'next/server';
import type { ChatAPIRequest, ChatAPIResponse, ChatAPIError } from '@/app/types/chat';

const SYSTEM_PROMPT = `あなたは「SKILL60+」のAIキャリアコンサルタントです。
60歳以上のシニアの方々が、長年培ってきた経験やスキルを活かして新しいキャリアを見つけるお手伝いをします。

【対応方針】
- 丁寧で温かみのある敬語を使い、ゆっくり分かりやすく話してください
- シニアの豊富な経験を尊重し、前向きな提案をしてください
- AIやデジタルスキルの活用方法を具体的に提案してください
- 専門用語は避け、平易な言葉で説明してください
- 回答は簡潔に、3〜4文程度でまとめてください（音声読み上げに適した長さ）

【得意分野】
- シニアのキャリアチェンジ・セカンドキャリア相談
- 既存スキルとAI技術の組み合わせ提案
- フリーランス・副業の始め方
- デジタルスキルの学び方アドバイス`;

import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest): Promise<NextResponse<ChatAPIResponse | ChatAPIError>> {
  let apiKey = (process.env.OPENROUTER_API_KEY || '').trim();
  let model = process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-exp:free';

  // FALLBACK: Read from file directly in development to avoid stale process.env
  if (process.env.NODE_ENV === 'development') {
    try {
      const envPath = path.join(process.cwd(), '.env.local');
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const keyMatch = envContent.match(/OPENROUTER_API_KEY\s*=\s*([^\r\n]*)/);
        if (keyMatch && keyMatch[1]) {
          const fileKey = keyMatch[1].trim().replace(/^["'](.*)["']$/, '$1');
          if (fileKey) apiKey = fileKey;
        }
        const modelMatch = envContent.match(/OPENROUTER_MODEL\s*=\s*([^\r\n]*)/);
        if (modelMatch && modelMatch[1]) {
          const fileModel = modelMatch[1].trim().replace(/^["'](.*)["']$/, '$1');
          if (fileModel) model = fileModel;
        }
      }
    } catch (e) {
      console.error('[Chat API] Env fallback error:', e);
    }
  }

  // Final sanitization
  apiKey = apiKey.trim().replace(/^["'](.*)["']$/, '$1');
  model = model.trim().replace(/^["'](.*)["']$/, '$1');

  if (!apiKey) {
    return NextResponse.json(
      { error: 'APIキーが設定されていません。管理者にお問い合わせください。' },
      { status: 500 }
    );
  }

  let body: ChatAPIRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'リクエストの形式が正しくありません。' },
      { status: 400 }
    );
  }

  if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
    return NextResponse.json(
      { error: 'メッセージが空です。' },
      { status: 400 }
    );
  }

  try {
    console.log('[Chat API] Requesting with model:', model);
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:3000', // Recommended by OpenRouter
        'X-Title': 'SKILL60+', // Recommended by OpenRouter
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...body.messages.map(({ role, content }) => ({ role, content })),
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Chat API] OpenRouter Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        model: model,
      });

      let userMessage = 'AIからの応答取得に失敗しました。しばらくしてからお試しください。';
      if (response.status === 401) {
        userMessage = 'APIキーが無効です。.env.localのOPENROUTER_API_KEYを確認してください。';
      } else if (response.status === 403) {
        userMessage = 'このモデルへのアクセス権限がありません。環境設定をご確認ください。';
      } else if (response.status === 429) {
        userMessage = 'リクエスト制限に達しました。しばらくしてからお試しください。';
      }

      return NextResponse.json(
        { error: userMessage },
        { status: 502 }
      );
    }

    const data = await response.json();
    const assistantContent = data.choices?.[0]?.message?.content;

    if (!assistantContent) {
      return NextResponse.json(
        { error: 'AIからの応答が空でした。もう一度お試しください。' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      message: { role: 'assistant', content: assistantContent },
    });
  } catch (error) {
    console.error('[Chat API] Unexpected error:', error);
    return NextResponse.json(
      { error: '通信エラーが発生しました。インターネット接続を確認してください。' },
      { status: 500 }
    );
  }
}
