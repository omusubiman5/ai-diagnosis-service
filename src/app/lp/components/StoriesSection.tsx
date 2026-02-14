'use client';
import React from 'react';
import styles from './StoriesSection.module.css';
import MemoryCards from './MemoryCards';

export default function StoriesSection() {
  return (
    <section id="stories" className={styles.stories}>
      <div className="section-inner">
        <h2 className="fade-slide speakable">こんな方が、こう変わりました。</h2>

        {/* ヨシコの思い出カード */}
        <MemoryCards onChatbotOpen={() => window.dispatchEvent(new CustomEvent('open-yoshiko-chat'))} />

        {/* 体験カード円状展開 */}
        <div className={styles.experienceSection}>
          <p className={`${styles.experienceLead} fade-slide`}>
            あなたの経験は、誰かの「助かった」になります。
          </p>
          <div className={`${styles.experienceCards} experience-cards`}>
            <div className={`${styles.experienceCard} experience-card`}>
              <span className={styles.experienceIcon}>🧮</span>
              <p className={styles.experienceText}>
                40年の経理<br />
                <small>数字を読む力</small>
              </p>
            </div>
            <div className={`${styles.experienceCard} experience-card`}>
              <span className={styles.experienceIcon}>🍳</span>
              <p className={styles.experienceText}>
                毎日の料理<br />
                <small>段取りのプロ</small>
              </p>
            </div>
            <div className={`${styles.experienceCard} experience-card`}>
              <span className={styles.experienceIcon}>🌿</span>
              <p className={styles.experienceText}>
                庭と畑仕事<br />
                <small>育てる知恵</small>
              </p>
            </div>
            <div className={`${styles.experienceCard} experience-card`}>
              <span className={styles.experienceIcon}>👶</span>
              <p className={styles.experienceText}>
                子育て・介護<br />
                <small>命を守る経験</small>
              </p>
            </div>
            <div className={`${styles.experienceCard} experience-card`}>
              <span className={styles.experienceIcon}>🔧</span>
              <p className={styles.experienceText}>
                ものづくり<br />
                <small>手が覚えた技術</small>
              </p>
            </div>
          </div>
        </div>

        {/* 物語カード3人 */}
        <div className={styles.storiesContainer}>
          {/* 物語① 伊藤節子さん — 感情: 否定→承認 */}
          <article className={`${styles.storyCard} story-card`} role="article">
            <p className={`${styles.storyBefore} story-before speakable`}>
              「お墓の掃除なんて、誰でもできることでしょう？」
            </p>
            <div className={`${styles.storyDivider} story-divider`}>▼</div>
            <p className={`${styles.storyAfter} story-after speakable`}>
              東京に住む方から、月5,000円でお墓の清掃を頼まれるようになりました。"ありがとうございます"と言われるたびに、私にもできることがあるんだと思えます。
            </p>
            <p className={styles.storyName}>伊藤 節子さん（70歳）</p>
          </article>

          {/* 物語② 上田勝さん — 感情: 偏見→逆転 */}
          <article className={`${styles.storyCard} story-card`} role="article">
            <p className={`${styles.storyBefore} story-before speakable`}>
              「自衛隊出身だと言うと、面接で微妙な顔をされました。」
            </p>
            <div className={`${styles.storyDivider} story-divider`}>▼</div>
            <p className={`${styles.storyAfter} story-after speakable`}>
              "危機管理力{' '}
              <span className="count-up score-number" data-target="94">
                0
              </span>
              点、同年代の上位2%"。
              この数字を見て、背筋が伸びました。今は企業の防災アドバイザーをしています。
            </p>
            <p className={styles.storyName}>上田 勝さん（63歳）</p>
          </article>

          {/* 物語③ 前田美智子さん — 感情: 無価値感→自己肯定 */}
          <article className={`${styles.storyCard} story-card`} role="article">
            <p className={`${styles.storyBefore} story-before speakable`}>
              「30年間、ただの主婦。スキルなんて何もありません。」
            </p>
            <div className={`${styles.storyDivider} story-divider`}>▼</div>
            <p className={`${styles.storyAfter} story-after speakable`}>
              "生活プロデュース力{' '}
              <span className="count-up score-number" data-target="78">
                0
              </span>
              点"。
              30年間の家事と育児の全てが、ちゃんと名前のついた力だったんです。初めて、自分を誇りに思えました。
            </p>
            <p className={styles.storyName}>前田 美智子さん（68歳）</p>
          </article>
        </div>

        <div style={{ marginTop: '48px', textAlign: 'center' }}>
          <a href="https://line.me/R/ti/p/@skill60plus" className="cta-button">
            私も話してみたい
          </a>
          <p className="cta-sub">LINEでかんたん・ずっと無料</p>
        </div>
      </div>
    </section>
  );
}
