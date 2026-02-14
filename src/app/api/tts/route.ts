import { NextRequest, NextResponse } from 'next/server';
import { SignJWT, importPKCS8 } from 'jose';

// Module-level token cache
let cachedToken: string | null = null;
let cachedTokenExpiry = 0;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedTokenExpiry > Date.now()) return cachedToken;

  const saJson = process.env.GOOGLE_TTS_SERVICE_ACCOUNT;
  if (!saJson) {
    throw new Error('GOOGLE_TTS_SERVICE_ACCOUNT env var is not set');
  }

  const sa = JSON.parse(saJson);
  const privateKey = await importPKCS8(sa.private_key, 'RS256');

  const jwt = await new SignJWT({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    aud: 'https://oauth2.googleapis.com/token',
  })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(privateKey);

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    throw new Error(`Token exchange failed: ${err}`);
  }

  const { access_token } = await tokenRes.json();
  cachedToken = access_token;
  cachedTokenExpiry = Date.now() + 55 * 60 * 1000; // 55 minutes
  return access_token;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      text,
      pitch = -3.0,
      speakingRate = 0.85,
      voiceName = 'ja-JP-Neural2-B',
    } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'text is required' }, { status: 400 });
    }

    // Limit text length for cost control
    if (text.length > 500) {
      return NextResponse.json(
        { error: 'text exceeds 500 character limit' },
        { status: 400 }
      );
    }

    const accessToken = await getAccessToken();

    const ttsRes = await fetch(
      'https://texttospeech.googleapis.com/v1/text:synthesize',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: 'ja-JP',
            name: voiceName,
            ssmlGender: 'FEMALE',
          },
          audioConfig: {
            audioEncoding: 'MP3',
            pitch,
            speakingRate,
            sampleRateHertz: 24000,
          },
        }),
      }
    );

    if (!ttsRes.ok) {
      const errText = await ttsRes.text();
      console.error('[TTS] Google API error:', errText);
      return NextResponse.json(
        { error: 'TTS synthesis failed' },
        { status: 502 }
      );
    }

    const data = await ttsRes.json();
    // Google returns base64 audioContent
    const audioBuffer = Buffer.from(data.audioContent, 'base64');

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(audioBuffer.length),
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err) {
    console.error('[TTS] Error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
