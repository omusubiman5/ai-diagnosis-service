document.addEventListener('DOMContentLoaded', () => {

  // ═══ IntersectionObserver: アニメーション発火 ═══
  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        animObserver.unobserve(e.target);
        // カウントアップ対象があれば発火
        e.target.querySelectorAll('.count-up').forEach(el => {
          countUp(el, parseInt(el.dataset.target), 1200);
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll(
    '.fade-slide, .chat-container, .story-card, .check-item, #action'
  ).forEach(el => animObserver.observe(el));

  // ═══ 数字カウントアップ（ANIM-11）═══
  function countUp(el, target, duration) {
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // ═══ スクロール: ヘッダー影 + トップボタン ═══
  const header = document.querySelector('.site-header');
  const scrollBtn = document.querySelector('.scroll-top-btn');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        header.classList.toggle('is-scrolled', scrollY > 0);
        scrollBtn.classList.toggle('is-shown', scrollY > innerHeight);
        ticking = false;
      });
      ticking = true;
    }
  });
  scrollBtn.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  // ═══ FAQ開閉 ═══
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      document.querySelectorAll('.faq-item.is-open').forEach(o => {
        if (o !== item) o.classList.remove('is-open');
      });
      item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', item.classList.contains('is-open'));
    });
  });

  // ═══ Web Speech API: 読み上げ（CHATBOT「声で聞く」から呼び出し可能）═══
  window.speakSection = function(sectionId) {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const texts = document.querySelectorAll('#' + sectionId + ' .speakable');
    let fullText = '';
    texts.forEach(el => { fullText += el.textContent + '。'; });
    const u = new SpeechSynthesisUtterance(fullText);
    u.lang = 'ja-JP';
    u.rate = 0.85;
    u.pitch = 0.95;
    speechSynthesis.speak(u);
  };

  // ═══ AIの友人の声（事前録音・任意）═══
  window.playAiFriendVoice = function() {
    const a = new Audio('audio/yoshiko-greeting.mp3');
    a.play().catch(() => {});
  };

  // ═══ GA4: dataLayer ═══
  window.dataLayer = window.dataLayer || [];

  // セクション表示
  const gaObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        dataLayer.push({ event: 'section_view', section_id: e.target.id });
        gaObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('section[id]').forEach(s => gaObserver.observe(s));

  // CTAクリック
  document.querySelectorAll('.cta-button').forEach(btn => {
    btn.addEventListener('click', () => {
      dataLayer.push({
        event: 'cta_click',
        cta_section: btn.closest('section')?.id || 'unknown',
        cta_text: btn.textContent.trim()
      });
    });
  });

  // 電話番号タップ
  document.querySelectorAll('a[href^="tel:"]').forEach(t => {
    t.addEventListener('click', () => dataLayer.push({ event: 'phone_tap' }));
  });

  // ═══ CHATBOT連携 ═══
  const chatbotChoices = document.querySelectorAll('.chatbot-choice');
  chatbotChoices.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      dataLayer.push({ event: 'chatbot_click', action: action });

      if (action === 'voice') {
        // 「声で聞く」→ 各セクションを順に読み上げ（CHATBOTは表示継続）
        ['hero', 'encounter', 'stories', 'assurance', 'action'].forEach((id, i) => {
          setTimeout(() => speakSection(id), i * 3000);
        });
      } else if (action === 'ask') {
        // 「質問がある」→ FAQ セクションへスクロール（CHATBOTは表示継続）
        document.querySelector('#assurance').scrollIntoView({ behavior: 'smooth' });
      } else if (action === 'try') {
        // 「試してみたい」→ ミニ診断モーダル表示（CHATBOTは表示継続）
        showMiniDiagnosis();
      }
    });
  });

  // CHATBOT閉じるボタン
  const chatbotClose = document.querySelector('.chatbot-close');
  if (chatbotClose) {
    chatbotClose.addEventListener('click', () => {
      document.getElementById('chatbot-welcome').style.display = 'none';
      dataLayer.push({ event: 'chatbot_close' });
    });
  }

  // ═══ ミニ診断体験（3分岐の肯定メッセージ）═══
  window.showMiniDiagnosis = function() {
    const modal = document.createElement('div');
    modal.className = 'mini-diagnosis';
    modal.innerHTML = `
      <div class="mini-diagnosis-inner">
        <div style="text-align:center; margin-bottom:16px;">
          <img src="img/yoshiko-avatar.svg" alt="ヨシコ" width="48" height="48"
               style="border-radius:50%;">
          <p style="font-size:var(--fs-small); color:var(--c-text-sub); margin-top:4px;">
            ヨシコ（68歳）
          </p>
        </div>
        <p style="font-size:var(--fs-body); line-height:var(--lh-body); margin-bottom:20px;">
          1つだけ教えてください。<br>
          これまでのお仕事や生活で、<br>
          一番長く続けたことは何ですか？
        </p>
        <input type="text" class="mini-input" placeholder="例: 経理を40年、料理、庭いじり"
               style="width:100%; padding:14px 16px; font-size:var(--fs-body);
                      border:1px solid var(--c-border); border-radius:8px;
                      font-family:var(--font-body);">
        <button class="mini-submit cta-button" style="margin-top:16px; width:100%;">
          答える
        </button>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.mini-submit').addEventListener('click', () => {
      const answer = modal.querySelector('.mini-input').value.trim();
      if (!answer) return;

      // 3分岐の肯定メッセージ（即時カスタム思想の反映）
      const workWords = ['経理','営業','運転','教師','看護','医','事務','工場','自衛','管理','建設','大工','漁','農','銀行','公務'];
      const lifeWords = ['料理','掃除','介護','育児','家事','洗濯','買い物','お墓','子育','看病','世話'];
      const lowerAnswer = answer;

      let message = '';
      if (workWords.some(w => lowerAnswer.includes(w))) {
        message = 'すごいですね！<br>その経験、今とても求められているんですよ。<br>詳しくお話ししませんか？';
      } else if (lifeWords.some(w => lowerAnswer.includes(w))) {
        message = 'それって、立派な得意なことなんですよ。<br>名前をつけたら、きっと驚きますよ。<br>一緒に見つけてみませんか？';
      } else {
        message = '素敵ですね！<br>それを教えてほしいという方が<br>たくさんいるんですよ。<br>もっと詳しくお話ししませんか？';
      }

      modal.querySelector('.mini-diagnosis-inner').innerHTML = `
        <div style="text-align:center; margin-bottom:16px;">
          <img src="img/yoshiko-avatar.svg" alt="ヨシコ" width="48" height="48" style="border-radius:50%;">
        </div>
        <p style="font-size:var(--fs-heading); font-weight:700; text-align:center; color:var(--c-primary); margin-bottom:12px;">
          ${answer}！
        </p>
        <p style="font-size:var(--fs-body); line-height:var(--lh-body); text-align:center; margin-bottom:24px;">
          ${message}
        </p>
        <a href="https://line.me/R/ti/p/@skill60plus" class="cta-button"
           style="display:block; text-align:center; width:100%;">
          LINEで詳しく話す
        </a>
        <p class="cta-sub" style="text-align:center;">ずっと無料</p>
        <button class="mini-close" style="display:block; margin:16px auto 0;
                background:none; border:none; color:var(--c-text-sub);
                font-size:var(--fs-small); cursor:pointer;">
          閉じる
        </button>
      `;

      modal.querySelector('.mini-close')?.addEventListener('click', () => modal.remove());
      dataLayer.push({ event: 'mini_diagnosis_complete', answer: answer });
    });

    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    dataLayer.push({ event: 'mini_diagnosis_open' });
  };

});
