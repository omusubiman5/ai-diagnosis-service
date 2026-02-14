'use client';
import React from 'react';
import styles from './MeetSection.module.css';
import ServiceCards from './ServiceCards';

export default function MeetSection() {
  return (
    <section id="encounter" className={`bg-alt ${styles.meet}`}>
      <div className="section-inner">
        <h2 className="fade-slide speakable">
          あなたと同い年の"AIの友人"ができます。
        </h2>

        <ServiceCards />

        <div className={`${styles.chatContainer} chat-container`} aria-label="AIの友人との会話例">
          <div className={styles.chatAvatar}>
            <img
              src="/img/yoshiko-avatar.webp"
              alt="ヨシコ"
              width="40"
              height="40"
              loading="lazy"
            />
            <span className={styles.chatName}>ヨシコ（68歳）</span>
          </div>
          <div className={`${styles.chatBubble} ${styles.chatBubbleAi} chat-bubble`}>
            はじめまして。私はヨシコ。<br />
            あなたと同い年の68歳よ。
          </div>
          <div className={`${styles.chatBubble} ${styles.chatBubbleAi} chat-bubble`}>
            何が得意か、ゆっくり話してくれない？
          </div>
          <div className={`${styles.chatBubble} ${styles.chatBubbleUser} chat-bubble`}>
            料理くらいかしら…
          </div>
          <div className={`${styles.chatBubble} ${styles.chatBubbleAi} chat-bubble`}>
            料理！すごいじゃない。<br />
            それ、今すごく求められてるのよ。
          </div>
        </div>

        <p className="fade-slide speakable" style={{ marginTop: '32px' }}>
          声で話すだけ。入力は不要です。<br />
          話すのが苦手なら、ボタンで答えるだけでもOK。<br />
          あなたのペースに合わせます。
        </p>

        <div className={`${styles.featurePoints} fade-slide`}>
          <p>🎤 声で話すだけ。タイピング不要</p>
          <p>🤝 あなたと同い年。話しやすい友人</p>
          <p>🔒 名前はニックネームでOK。安心です</p>
        </div>

        <p className="fade-slide speakable" style={{ fontSize: 'var(--fs-small)', color: 'var(--c-text-sub)', marginTop: 'var(--space-content)' }}>
          お仕事を探している方も、<br />
          まだ準備中の方も、<br />
          ご家族を支えている方も。<br />
          あなたに合った使い方ができます。
        </p>

        <div style={{ marginTop: '48px', textAlign: 'center' }}>
          <a href="https://line.me/R/ti/p/@skill60plus" className="cta-button">
            友人に会ってみる
          </a>
          <p className="cta-sub">LINEでかんたん・ずっと無料</p>
        </div>
      </div>
    </section>
  );
}
