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

        <a
          href="https://line.me/R/ti/p/@skill60plus"
          className="cta-button cta-final"
          aria-label="AIの友人に会ってみる - LINEが開きます"
        >
          <span className="cta-split">AIの友人に会ってみる</span>
        </a>
        <p className="cta-sub">LINEでかんたん・3分で完了・ずっと無料</p>
      </div>
    </section>
  );
}
