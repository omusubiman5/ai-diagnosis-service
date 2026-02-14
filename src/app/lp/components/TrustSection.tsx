'use client';
import React, { useEffect } from 'react';
import styles from './TrustSection.module.css';

export default function TrustSection() {
  useEffect(() => {
    // FAQ開閉ロジック
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        if (!item) return;

        // 他の開いているFAQを閉じる
        document.querySelectorAll('.faq-item.is-open').forEach((openItem) => {
          if (openItem !== item) {
            openItem.classList.remove('is-open');
            const openBtn = openItem.querySelector('.faq-question');
            if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
          }
        });

        // 現在のFAQをトグル
        item.classList.toggle('is-open');
        btn.setAttribute(
          'aria-expanded',
          item.classList.contains('is-open').toString()
        );
      });
    });
  }, []);

  return (
    <section id="assurance" className="bg-alt">
      <div className="section-inner">
        <h2 className="fade-slide speakable">はじめ方はかんたん。ずっと無料。</h2>

        {/* 3ステップ */}
        <div className={`${styles.steps} fade-slide`}>
          <div className={styles.step}>
            <span className={styles.stepNum}>1</span>
            <p className="speakable">
              LINEで「はじめる」を押す
              <br />
              <small>LINEが開きます。新しいアプリは不要です</small>
            </p>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNum}>2</span>
            <p className="speakable">
              AIの友人と3分おしゃべり
              <br />
              <small>声で話しても、ボタンで答えてもOK</small>
            </p>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNum}>3</span>
            <p className="speakable">
              あなたの"すごいところ"がわかる
              <br />
              <small>結果はLINEでいつでも見返せます</small>
            </p>
          </div>
        </div>

        {/* 安心ポイント */}
        <div className={styles.checkList}>
          <div className="check-item">
            <span className={`${styles.checkIcon} check-icon`}>✅</span>
            <p>ずっと無料。あとから請求は一切ありません</p>
          </div>
          <div className="check-item">
            <span className={`${styles.checkIcon} check-icon`}>✅</span>
            <p>名前はニックネームでOK。住所の入力もありません</p>
          </div>
          <div className="check-item">
            <span className={`${styles.checkIcon} check-icon`}>✅</span>
            <p>LINEをブロックすればいつでもやめられます</p>
          </div>
        </div>

        {/* 信頼バッジ余白（将来の自治体導入時に使用） */}
        {/* <div className="trust-badges">導入実績・メディア掲載等を追加する場所</div> */}

        {/* FAQ */}
        <div className={styles.faqList}>
          <div className="faq-item">
            <button className="faq-question" aria-expanded="false">
              <span>本当に無料ですか？</span>
              <svg
                className="faq-toggle-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div className="faq-answer" role="region">
              <p>
                はい。おしゃべりも、結果の確認も、ずっと無料です。もっと詳しい分析がほしい方には有料のレポート（1,980円）もありますが、無料のままでも十分お使いいただけます。
              </p>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-question" aria-expanded="false">
              <span>スマホの操作が苦手でも大丈夫ですか？</span>
              <svg
                className="faq-toggle-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div className="faq-answer" role="region">
              <p>
                大丈夫です。LINEが使えれば使えます。声で話すだけなので、文字を打つ必要はありません。ボタンで答えることもできます。あなたのペースに合わせて、画面も声も自動で変わります。
              </p>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-question" aria-expanded="false">
              <span>家族に知られたくないのですが…</span>
              <svg
                className="faq-toggle-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div className="faq-answer" role="region">
              <p>
                ニックネームで利用でき、LINEのトーク画面以外に通知は出ません。ご安心ください。
              </p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '48px', textAlign: 'center' }}>
          <a href="https://line.me/R/ti/p/@skill60plus" className="cta-button">
            無料ではじめる
          </a>
          <p className="cta-sub">LINEでかんたん・3分で完了</p>
        </div>
      </div>
    </section>
  );
}
