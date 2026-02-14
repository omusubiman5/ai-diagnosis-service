# VOICEVOX 音声ファイル生成手順（思い出カード用）

## 概要

ヨシコの思い出カード機能で使用する9本の音声ファイルを生成します。

## 音声ファイル一覧

| # | ファイル名 | 台詞 | 秒数 | 用途 |
|:--|:--|:--|:--|:--|
| 1 | yoshiko-memory-1.mp3 | 「昭和39年の10月10日。6歳だったのよ、あの日」 | 3秒 | カード① 幼少期 |
| 2 | yoshiko-memory-2.mp3 | 「15歳で並んで、17歳で簿記に受かったの」 | 3秒 | カード② 学生時代 |
| 3 | yoshiko-memory-3.mp3 | 「昭和51年4月1日。18歳で社会に出たの」 | 3秒 | カード③ 就職 |
| 4 | yoshiko-memory-4.mp3 | 「昭和58年7月15日。25歳で母になったわ」 | 3秒 | カード④ 結婚・出産 |
| 5 | yoshiko-memory-5.mp3 | 「平成3年4月1日。33歳で社会に戻ったの」 | 3秒 | カード⑤ バブル崩壊 |
| 6 | yoshiko-memory-6.mp3 | 「36歳と52歳。二度、世界が壊れた。でも人は強い」 | 4秒 | カード⑥ 試練 |
| 7 | yoshiko-memory-7.mp3 | 「令和2年5月4日。62歳でLINEデビュー。遅くないわよね」 | 4秒 | カード⑦ 再出発 |
| 8 | yoshiko-memory-8.mp3 | 「令和7年3月14日、67歳の誕生日。ね、あなたの話も聞かせて」 | 4秒 | カード⑧ 現在 |
| 9 | yoshiko-memory-complete.mp3 | 「全部めくってくれたのね。ありがとう。ね、今度はあなたの番よ」 | 4秒 | 全8枚めくり完了時 |

**合計**: 9ファイル

## VOICEVOX 設定

- **キャラクター**: 波音リツ（Nami Ritsu）
- **速度**: 0.85
- **ピッチ**: -0.05
- **イントネーション**: 1.2
- **ポーズ長**: 1.2倍

## 生成手順

### 1. VOICEVOX起動

```bash
# VOICEVOX を起動
# キャラクター「波音リツ」を選択
```

### 2. 各台詞を入力

上記の表の台詞を1つずつVOICEVOXに入力し、パラメータを設定します。

### 3. WAV出力

各台詞をWAVファイルとして出力します。

### 4. MP3変換

```bash
# FFmpegでWAVをMP3に変換（24kbps mono）
for i in {1..8}; do
  ffmpeg -i yoshiko-memory-$i.wav -b:a 24k -ac 1 yoshiko-memory-$i.mp3
done

# 完了時音声
ffmpeg -i yoshiko-memory-complete.wav -b:a 24k -ac 1 yoshiko-memory-complete.mp3
```

### 5. ファイル配置

```bash
# public/audio/ ディレクトリに配置
mv yoshiko-memory-*.mp3 public/audio/
```

## 推定ファイルサイズ

- 3秒音声（24kbps mono）: 約9KB
- 4秒音声（24kbps mono）: 約12KB
- **合計**: 約102KB（9ファイル）

## 確認方法

ブラウザで `localhost:3000/lp` にアクセスし、Section 3「こんな方が、こう変わりました。」のヨシコの思い出カードをクリックして音声が再生されることを確認します。

## トラブルシューティング

### 音声が再生されない

1. ブラウザのコンソールで404エラーが出ていないか確認
2. `public/audio/yoshiko-memory-*.mp3` が存在するか確認
3. ファイル名が正確か確認（yoshiko-memory-1.mp3 〜 yoshiko-memory-8.mp3 + yoshiko-memory-complete.mp3）

### 音声の品質が悪い

- ビットレートを32kbps または 48kbps に上げる
- モノラル（-ac 1）をステレオ（-ac 2）に変更

## 参考

- VOICEVOX: https://voicevox.hiroshiba.jp/
- 波音リツキャラクター情報: https://voicevox.hiroshiba.jp/
