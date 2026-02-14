'use client';
import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { useTTS } from '../../hooks/useTTS';

declare global {
  interface Window {
    botpress?: {
      open: () => void;
      close: () => void;
      toggle: () => void;
      on: (event: string, callback: (data: unknown) => void) => void;
      sendEvent: (payload: Record<string, unknown>) => Promise<void>;
    };
    botpressReady?: boolean;
    diagBridge?: {
      sendToBot: (text: string, meta?: Record<string, unknown>) => Promise<void>;
    };
  }
}

// ── アクセシビリティ: BotのFAQ応答テキストからCSS変更を発火 ──
type FontSize = 'standard' | 'large' | 'xlarge';
const SIZES: FontSize[] = ['standard', 'large', 'xlarge'];

// Bot FAQ応答のトリガーフレーズ（bot側のFAQ answerと一致させる）
const BOT_FONT_LARGE_TRIGGER = '文字の大きさを変えたわよ';
const BOT_FONT_STANDARD_TRIGGER = '標準の大きさに戻したわよ';
const BOT_TEXT_ONLY_TRIGGER = '音声を止めて、文字だけにしたわよ';

function getCurrentFontSize(): FontSize {
  try {
    const s = sessionStorage.getItem('skill60-accessibility');
    if (s) {
      const p = JSON.parse(s);
      if (SIZES.includes(p.fontSize)) return p.fontSize;
    }
  } catch { /* ignore */ }
  return 'standard';
}

function applyFontSize(size: FontSize) {
  document.body.classList.remove('font-large', 'font-xlarge');
  if (size === 'large') document.body.classList.add('font-large');
  if (size === 'xlarge') document.body.classList.add('font-xlarge');
  try {
    const s = sessionStorage.getItem('skill60-accessibility');
    const p = s ? JSON.parse(s) : {};
    p.fontSize = size;
    sessionStorage.setItem('skill60-accessibility', JSON.stringify(p));
  } catch { /* ignore */ }
  // FontSizeControlコンポーネントにも通知
  window.dispatchEvent(new CustomEvent('font-size-changed', { detail: { size } }));
}

function applyTextOnly() {
  try {
    const s = sessionStorage.getItem('skill60-accessibility');
    const p = s ? JSON.parse(s) : {};
    p.textOnly = true;
    sessionStorage.setItem('skill60-accessibility', JSON.stringify(p));
  } catch { /* ignore */ }
}

/** BotのFAQ応答テキストを検出してCSS変更 */
function handleBotAccessibilityResponse(text: string): void {
  if (text.includes(BOT_FONT_LARGE_TRIGGER)) {
    const current = getCurrentFontSize();
    const nextIdx = Math.min(SIZES.indexOf(current) + 1, SIZES.length - 1);
    applyFontSize(SIZES[nextIdx]);
    return;
  }
  if (text.includes(BOT_FONT_STANDARD_TRIGGER)) {
    applyFontSize('standard');
    return;
  }
  if (text.includes(BOT_TEXT_ONLY_TRIGGER)) {
    applyTextOnly();
    return;
  }
}

export default function LpChatbot() {
  const readyRef = useRef(false);
  const botUserIdRef = useRef<string | null>(null);

  // TTS: Botの返答を音声で読み上げ
  const tts = useTTS({ pitch: -3.0, rate: 0.85 });
  const ttsRef = useRef(tts);
  ttsRef.current = tts;

  // MemoryCards全めくり完了からのイベント受信 → Botpress webchat を開く
  useEffect(() => {
    const handler = () => {
      if (window.botpress) {
        window.botpress.open();
      }
    };
    window.addEventListener('open-yoshiko-chat', handler);
    return () => window.removeEventListener('open-yoshiko-chat', handler);
  }, []);

  // Bridge setup: Botpress ↔ VoiceDiagOverlay + アクセシビリティ
  useEffect(() => {
    const setupBridge = () => {
      if (!window.botpress) return false;

      // Botpress webchat v3.6 メッセージ構造:
      // { id, conversationId, authorId, timestamp, block: { block: { type, text }, type } }
      // ユーザーとBotは異なるauthorIdで区別する
      let userAuthorId: string | null = null;

      window.botpress.on('message', (data: unknown) => {
        const msg = data as Record<string, unknown>;
        if (!msg) return;

        // v3.6: テキストは block.block.text にある
        const block = msg.block as Record<string, unknown> | undefined;
        const innerBlock = block?.block as Record<string, unknown> | undefined;
        const text = (innerBlock?.text as string) || '';
        if (!text) return;

        const authorId = msg.authorId as string | undefined;
        const hasClientMeta = !!(msg.metadata as Record<string, unknown>)?.clientMessageId;

        // ユーザーメッセージにはmetadata.clientMessageIdがある
        if (hasClientMeta && authorId) {
          userAuthorId = authorId;
        }

        const isBot = authorId && authorId !== userAuthorId;

        if (isBot) {
          // ── Botメッセージ ──
          if (!botUserIdRef.current) botUserIdRef.current = authorId;
          // アクセシビリティ: FAQ応答からCSS変更発火
          handleBotAccessibilityResponse(text);
          // DIAG Overlayへ転送
          window.dispatchEvent(
            new CustomEvent('diag-bot-message', {
              detail: { text, raw: msg },
            })
          );

          // TTS: Botの返答を音声で読み上げ（textOnlyモード時はスキップ）
          let isTextOnly = false;
          try {
            const s = sessionStorage.getItem('skill60-accessibility');
            if (s) isTextOnly = !!JSON.parse(s).textOnly;
          } catch { /* ignore */ }
          if (!isTextOnly) {
            ttsRef.current.speak(text);
          }
        }
        // ユーザーメッセージはスルー（Botpress側で処理）
      });

      // Expose sendToBot for VoiceDiagOverlay
      window.diagBridge = {
        sendToBot: async (text, meta) => {
          if (window.botpress?.sendEvent) {
            await window.botpress.sendEvent({
              type: 'diagUserMessage',
              text,
              ...meta,
            });
          }
        },
      };

      return true;
    };

    // Poll until botpress is ready
    const interval = setInterval(() => {
      if (setupBridge()) {
        clearInterval(interval);
      }
    }, 500);

    return () => {
      clearInterval(interval);
      delete window.diagBridge;
    };
  }, []);

  const handleBotScriptLoad = () => {
    if (readyRef.current) return;
    readyRef.current = true;
  };

  return (
    <>
      <Script
        src="https://cdn.botpress.cloud/webchat/v3.6/inject.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://files.bpcontent.cloud/2026/02/14/07/20260214072048-SMJ9JAOA.js"
        strategy="afterInteractive"
        onLoad={handleBotScriptLoad}
      />
    </>
  );
}
