# VOICEVOX音声生成指示書

## 概要

SKILL60+ LPで使用する**ヨシコの声**（8本の音声ファイル）の生成手順

**使用技術**: VOICEVOX（無料・商用可・API連携可）
**キャラクター**: **波音リツ** ★第1選択
**合計サイズ**: 約156KB（全て遅延ロード）

---

## VOICEVOX設定パラメータ（ヨシコ＝波音リツ）

```yaml
キャラクター: 波音リツ
速度: 0.85（通常より15%ゆっくり。シニア対応）
ピッチ: -0.05（やや低め。安心感）
イントネーション: 1.2（自然な抑揚。棒読み禁止）
ポーズ長: 1.2倍（文の切れ目にゆとり）
音量: 1.0（標準）
出力: WAV → MP3変換（24kbps mono）
```

---

## 生成する8本の音声ファイル

### 1. yoshiko-welcome.mp3 (5秒 / 15KB)
**用途**: ウェルカム
**台詞**:
```
はじめまして。私はヨシコ。あなたと同い年の68歳よ。何が得意か、ゆっくり教えてくれない？
```

---

### 2. yoshiko-section1.mp3 (15秒 / 25KB)
**用途**: Section 1 ナレーション（ヒーローコピー読み上げ）
**台詞**:
```
60年間、頑張ってきたあなたへ。
定年後、こんなモヤモヤを抱えていませんか？
"自分の経験なんて、もう誰にも必要とされない"
——そんなことはありません。
3分で、あなたの"すごいところ"がわかります。
```

---

### 3. yoshiko-section2.mp3 (15秒 / 25KB)
**用途**: Section 2 ナレーション（出会いセクション読み上げ）
**台詞**:
```
あなたと同い年の"AIの友人"ができます。
声で話すだけ。入力は不要です。
話すのが苦手なら、ボタンで答えるだけでもOK。
あなたのペースに合わせます。
```

---

### 4. yoshiko-section3.mp3 (20秒 / 30KB)
**用途**: Section 3 ナレーション（物語セクション読み上げ）
**台詞**:
```
こんな方が、こう変わりました。
あなたの経験は、誰かの「助かった」になります。
お墓の掃除、料理、自衛隊の経験、主婦30年。
どんな経験も、ちゃんと名前のついた力なんです。
```

---

### 5. yoshiko-section4.mp3 (15秒 / 25KB)
**用途**: Section 4 ナレーション（安心セクション読み上げ）
**台詞**:
```
はじめ方はかんたん。ずっと無料。
LINEで「はじめる」を押す。
AIの友人と3分おしゃべり。
あなたの"すごいところ"がわかる。
ずっと無料。あとから請求は一切ありません。
```

---

### 6. yoshiko-section5.mp3 (10秒 / 20KB)
**用途**: Section 5 ナレーション（行動セクション読み上げ）
**台詞**:
```
あなたの60年間を、
"すごいじゃないか"と言ってくれる友人に、
会ってみませんか？
```

---

### 7. yoshiko-sugoi.mp3 (3秒 / 8KB)
**用途**: 体験カード展開時
**台詞**:
```
素敵ね。こんなにたくさんの経験があるのよ。
```

---

### 8. yoshiko-line.mp3 (3秒 / 8KB)
**用途**: LINE誘導
**台詞**:
```
LINEでもっと詳しくお話ししない？
```

---

## 生成手順

### 方法1: VOICEVOX デスクトップアプリ（推奨）

1. **VOICEVOXをダウンロード**:
   - https://voicevox.hiroshiba.jp/
   - Windows / Mac / Linux対応

2. **設定**:
   - キャラクター: 波音リツを選択
   - 速度: 0.85
   - ピッチ: -0.05（スライダーで調整）
   - イントネーション: 1.2

3. **台詞入力**:
   - 上記の8本の台詞をそれぞれ入力
   - 「再生」で確認

4. **音声出力**:
   - 「音声書き出し」→ WAV形式で保存

5. **MP3変換**（ファイルサイズ削減）:
   ```bash
   # ffmpegを使用（事前にインストール必要）
   ffmpeg -i yoshiko-welcome.wav -ar 22050 -ac 1 -b:a 24k yoshiko-welcome.mp3
   ```

6. **配置**:
   ```bash
   mv yoshiko-*.mp3 public/audio/
   ```

---

### 方法2: VOICEVOX Engine（Docker / API）

**将来的なリアルタイム音声化用（別タスク）**

```bash
# VOICEVOX Engine起動
docker pull voicevox/voicevox_engine:latest
docker run -p 50021:50021 voicevox/voicevox_engine

# 音声生成APIリクエスト
curl -X POST "http://localhost:50021/audio_query?text=こんにちは&speaker=1" \
  -H "Content-Type: application/json" \
  -o query.json

curl -X POST "http://localhost:50021/synthesis?speaker=1" \
  -H "Content-Type: application/json" \
  -d @query.json \
  --output yoshiko-test.wav
```

**注**: LP制作Phase 1では**デスクトップアプリ使用**を推奨。API版は将来のCHATBOT音声リアルタイム化で使用。

---

## 代替TTS技術（参考）

### ElevenLabs（さらに高品質）
- 多言語対応
- プロガイド品質
- フリーミアム（月10,000文字無料）
- https://elevenlabs.io/

### CoeFont（声優品質）
- 10,000種以上のボイス
- 商用可
- https://coefont.studio/

**判断**: VOICEVOXで品質不足と感じた場合のみ、ElevenLabsやCoeFontを検討。

---

## 配置先

```
public/audio/
├── yoshiko-welcome.mp3    (15KB)
├── yoshiko-section1.mp3   (25KB)
├── yoshiko-section2.mp3   (25KB)
├── yoshiko-section3.mp3   (30KB)
├── yoshiko-section4.mp3   (25KB)
├── yoshiko-section5.mp3   (20KB)
├── yoshiko-sugoi.mp3      (8KB)
└── yoshiko-line.mp3       (8KB)

合計: 156KB（遅延ロード。初期ロードに含めない）
```

---

## 動作確認

```bash
# 開発サーバー起動
npm run dev

# LP表示
open http://localhost:3000/lp

# 確認項目
- 5秒後にヨシコのウェルカム音声が再生される
- 「声で聞く」ボタンでSection 1〜5のナレーションが順に再生される
- 体験カードが展開されるとヨシコの声「素敵ね...」が再生される
```

---

## トラブルシューティング

**問題**: 音声ファイルが404エラー
→ **解決**: `public/audio/` ディレクトリを作成。ファイル名が正確か確認。

**問題**: 音声が再生されない
→ **解決**: ブラウザの自動再生ポリシー。ユーザー操作後に再生されます。

**問題**: 音声が途切れる
→ **解決**: ネットワーク速度確認。ファイルサイズが大きすぎる場合はビットレート削減。

**問題**: 声が機械的すぎる
→ **解決**: VOICEVOXのイントネーション調整。ElevenLabsで再生成を検討。

---

## 完了チェックリスト

- [ ] VOICEVOXデスクトップアプリをインストール
- [ ] 波音リツキャラクターを選択
- [ ] パラメータ設定（速度0.85、ピッチ-0.05、イントネーション1.2）
- [ ] 8本の台詞を入力・音声生成
- [ ] WAV → MP3変換（24kbps mono）
- [ ] `public/audio/` に配置
- [ ] 開発サーバーで動作確認
- [ ] 音声が温かい68歳女性の声であることを確認
- [ ] 合計ファイルサイズが160KB以下であることを確認
