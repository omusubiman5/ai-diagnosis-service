'use client';
import React from 'react';
import styles from './ActionSection.module.css';

export default function ActionSection() {
  return (
    <section id="action" className={styles.action}>
      <div className="section-inner" style={{ textAlign: 'center' }}>
        <h2 className="fade-slide speakable">
          あなたの60年間を、<br />
          "すごいじゃないか"と言ってくれる友人に、<br />
          会ってみませんか？
        </h2>

        <button
          onClick={() => window.dispatchEvent(new CustomEvent('start-diag'))}
          className="cta-button cta-final"
          aria-label="声でおしゃべりスキル診断を始める"
          style={{ cursor: 'pointer', border: 'none' }}
        >
          <span className="cta-split">声でおしゃべり診断を始める</span>
        </button>
        <p className="cta-sub">声で5つの質問に答えるだけ・ボタンでもOK・無料</p>

        <a
          href="https://line.me/R/ti/p/@skill60plus"
          className="cta-button cta-final"
          aria-label="AIの友人に会ってみる - LINEが開きます"
          style={{ marginTop: '16px' }}
        >
          <span className="cta-split">AIの友人に会ってみる</span>
        </a>
        <p className="cta-sub">LINEでかんたん・3分で完了・ずっと無料</p>
      </div>
    </section>
  );
}
