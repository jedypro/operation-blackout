/**
 * ui.js
 * -----------------------------------------------------------------------------
 * שכבת התצוגה: הופכת תמונת מצב של המנוע ל-HTML, מנהלת את ה-HUD (HP / ניקוד /
 * התקדמות) ואת מעברי ה-Fade בין המסכים. אין כאן חוקי משחק – רק רינדור.
 * -----------------------------------------------------------------------------
 */

import { assetUrl, UI_TEXT, VICTORY } from './data/game-config.js';

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const TRANSITION_MS = 220;

/** בריחת תווים ל-HTML */
const escapeHtml = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

/** פורמט זמן mm:ss */
const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

/** פורמט מספר שלב דו-ספרתי */
const pad2 = (n) => String(n).padStart(2, '0');

const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

export class GameView {
  #engine;
  #screen;
  #hud;
  #handlers;
  #renderedKey = null;
  #renderToken = 0;
  #lastScore = null;
  #lastHp = null;

  /**
   * @param {import('./engine.js').GameEngine} engine
   * @param {Object} options
   * @param {HTMLElement} options.screen
   * @param {HTMLElement} options.hud
   * @param {(index:number)=>void} options.onSelectAnswer
   * @param {()=>void} options.onRetry
   * @param {()=>void} options.onRestart
   * @param {HTMLElement} [options.liveRegion]
   */
  constructor(engine, { screen, hud, onSelectAnswer, onRetry, onRestart, liveRegion }) {
    this.#engine = engine;
    this.#screen = screen;
    this.#hud = hud;
    this.#handlers = { onSelectAnswer, onRetry, onRestart };
    this.liveRegion = liveRegion ?? null;

    this.#bindEvents();
  }

  /* ------------------------------------------------------------------ */
  /* אירועים                                                             */
  /* ------------------------------------------------------------------ */

  #bindEvents() {
    this.#screen.addEventListener('click', (event) => {
      const button = event.target.closest('[data-action]');
      if (!button || button.disabled) return;

      const { action } = button.dataset;

      if (action === 'answer') {
        const index = Number(button.dataset.index);
        const stage = this.#engine.currentStage;
        const answer = stage?.answers?.[index];

        // פידבק ויזואלי קצר לפני המעבר
        button.classList.add(answer?.correct ? 'is-correct' : 'is-wrong');
        this.#screen
          .querySelectorAll('.answer')
          .forEach((el) => el.classList.add('is-locked'));

        window.setTimeout(() => this.#handlers.onSelectAnswer(index), REDUCED_MOTION ? 0 : 260);
        return;
      }

      if (action === 'retry') {
        this.#handlers.onRetry();
        return;
      }

      if (action === 'restart') {
        this.#handlers.onRestart();
      }
    });

    this.#hud.addEventListener('click', (event) => {
      const button = event.target.closest('[data-action="restart"]');
      if (button) this.#handlers.onRestart();
    });
  }

  /* ------------------------------------------------------------------ */
  /* רינדור ראשי                                                         */
  /* ------------------------------------------------------------------ */

  /**
   * מרנדר את המסך לפי תמונת המצב. אם אותו מסך כבר מוצג – מעדכן רק HUD.
   * @param {Object} state
   */
  async render(state) {
    const key = `${state.phase}:${state.stageNumber}`;
    this.updateHud(state);

    if (key === this.#renderedKey) return;

    const isFirstRender = this.#renderedKey === null;
    const token = ++this.#renderToken;
    this.#renderedKey = key;

    // fade-out של המסך הקודם (לא ברינדור הראשון – אין עדיין תוכן להעלים)
    if (!REDUCED_MOTION && !isFirstRender) {
      this.#screen.classList.add('is-fading-out');
      await wait(TRANSITION_MS);
      if (token !== this.#renderToken) return; // רינדור חדש עקף אותנו
    }

    this.#screen.innerHTML = this.#template(state);
    this.#screen.classList.remove('is-fading-out');
    this.#hydrateImages();
    this.updateHud(state);

    this.#announce(state);
    this.#scrollToTop();
    this.#preloadUpcoming(state);
  }

  /** עדכון ה-HUD (HP, ניקוד, שלב, התקדמות) */
  updateHud(state) {
    const { hpBarFill, hpValue, hpTrack, scoreValue, stageValue, progressFill } = this.#hudEls();

    if (hpBarFill) hpBarFill.style.width = `${state.hpPercent}%`;
    if (hpValue) hpValue.textContent = String(state.hp);
    if (progressFill) progressFill.style.width = `${state.progressPercent}%`;
    if (stageValue) {
      stageValue.textContent =
        state.phase === 'victory'
          ? `${state.totalStages}/${state.totalStages}`
          : `${state.stageNumber}/${state.totalStages}`;
    }

    if (hpTrack) {
      hpTrack.classList.toggle('is-warning', state.hpPercent <= 40 && state.hpPercent > 20);
      hpTrack.classList.toggle('is-critical', state.hpPercent <= 20);
      hpTrack.setAttribute('aria-valuenow', String(state.hp));
    }

    if (scoreValue) {
      scoreValue.textContent = String(state.score);
      if (this.#lastScore !== null && state.score !== this.#lastScore) {
        scoreValue.classList.remove('is-bumped');
        void scoreValue.offsetWidth; // restart animation
        scoreValue.classList.add('is-bumped');
      }
    }

    if (this.#lastHp !== null && state.hp !== this.#lastHp) {
      this.#hud.classList.remove('hud--hit');
      void this.#hud.offsetWidth;
      this.#hud.classList.add('hud--hit');
    }

    this.#lastScore = state.score;
    this.#lastHp = state.hp;
  }

  #hudEls() {
    return {
      hpBarFill: this.#hud.querySelector('[data-hp-fill]'),
      hpValue: this.#hud.querySelector('[data-hp-value]'),
      hpTrack: this.#hud.querySelector('[data-hp-track]'),
      scoreValue: this.#hud.querySelector('[data-score-value]'),
      stageValue: this.#hud.querySelector('[data-stage-value]'),
      progressFill: this.#hud.querySelector('[data-progress-fill]'),
    };
  }

  /* ------------------------------------------------------------------ */
  /* תבניות                                                              */
  /* ------------------------------------------------------------------ */

  #template(state) {
    switch (state.phase) {
      case 'fallback':
        return this.#fallbackTemplate(state);
      case 'victory':
        return this.#victoryTemplate(state);
      case 'stage':
      default:
        return this.#stageTemplate(state);
    }
  }

  #stageTemplate(state) {
    const stage = state.stage;
    const answers = stage.answers
      .map(
        (answer, index) => `
          <button
            class="answer"
            type="button"
            data-action="answer"
            data-index="${index}"
            aria-label="תשובה ${index + 1}: ${escapeHtml(answer.text)}"
          >
            <span class="answer__key" aria-hidden="true">${index + 1}</span>
            <span class="answer__text" dir="ltr">${escapeHtml(answer.text)}</span>
          </button>`
      )
      .join('');

    return `
      <article class="card card--stage" aria-labelledby="stage-title">
        ${this.#mediaTemplate(stage.image, `שלב ${stage.id}: ${stage.title}`, `STAGE ${pad2(stage.id)}`)}
        <div class="card__body">
          <header class="card__head">
            <h2 class="card__title" id="stage-title">
              ${escapeHtml(stage.title)}
              <span class="card__topic" dir="ltr">${escapeHtml(stage.topic)}</span>
            </h2>
          </header>

          <p class="story" dir="ltr">${escapeHtml(stage.story).replace(/\n/g, '<br />')}</p>

          <div class="prompt">
            <span class="prompt__tag" aria-hidden="true">?</span>
            <p class="prompt__text" dir="ltr">${escapeHtml(stage.prompt)}</p>
          </div>

          <div class="answers" role="group" aria-label="אפשרויות תשובה" dir="ltr">
            ${answers}
          </div>

          <p class="hint">${escapeHtml(UI_TEXT.keyboardHint)}</p>
        </div>
      </article>
    `;
  }

  #fallbackTemplate(state) {
    const stage = state.stage;
    const fallback = stage.fallback;

    return `
      <article class="card card--fallback" aria-labelledby="fallback-title">
        <div class="breach-bar" role="alert">
          <span class="breach-bar__dot" aria-hidden="true"></span>
          ${escapeHtml(UI_TEXT.fallbackHeading)}
          <span class="breach-bar__stage" dir="ltr">STAGE ${pad2(stage.id)}</span>
        </div>

        ${this.#mediaTemplate(fallback.image, `תמונת שגיאה לשלב ${stage.id}`, 'ALERT')}

        <div class="card__body">
          <h2 class="card__title card__title--alert" id="fallback-title" dir="ltr">
            ${escapeHtml(fallback.message)}
          </h2>

          <div class="rule">
            <span class="rule__label">${escapeHtml(fallback.ruleLabel ?? 'כלל')}</span>
            <p class="rule__text">${escapeHtml(fallback.explanation)}</p>
          </div>

          <button class="btn btn--primary btn--wide" type="button" data-action="retry">
            ${escapeHtml(UI_TEXT.fallbackButton(stage.id))}
            <span class="btn__icon" aria-hidden="true">↩</span>
          </button>
        </div>
      </article>
    `;
  }

  #victoryTemplate(state) {
    const rank = state.rank;

    const rankRows = [...(this.#engine.ranks ?? [])]
      .sort((a, b) => b.min - a.min)
      .map(
        (row) => `
          <tr class="${rank && row.min === rank.min ? 'is-current' : ''}">
            <td><span class="rank-icon" aria-hidden="true">${row.icon ?? '◆'}</span> ${escapeHtml(row.title)}</td>
            <td dir="ltr">${row.min}+</td>
          </tr>`
      )
      .join('');

    return `
      <article class="card card--victory" aria-labelledby="victory-title">
        ${this.#mediaTemplate(VICTORY.image, VICTORY.alt, 'COMPLETE')}

        <div class="card__body">
          <h2 class="victory__title" id="victory-title" dir="ltr">${escapeHtml(VICTORY.title)}</h2>
          <p class="story story--victory" dir="ltr">${escapeHtml(VICTORY.message)}</p>

          <div class="scoreboard">
            <div class="scoreboard__main">
              <span class="scoreboard__label">${escapeHtml(UI_TEXT.victoryScoreLabel)}</span>
              <span class="scoreboard__value">${state.score}</span>
            </div>

            <div class="scoreboard__stats">
              <div class="stat">
                <span class="stat__value">${state.mistakes}</span>
                <span class="stat__label">${escapeHtml(UI_TEXT.victoryMistakesLabel)}</span>
              </div>
              <div class="stat">
                <span class="stat__value">${state.accuracyPercent}%</span>
                <span class="stat__label">${escapeHtml(UI_TEXT.victoryAccuracyLabel)}</span>
              </div>
              <div class="stat">
                <span class="stat__value" dir="ltr">${formatTime(state.elapsedSeconds)}</span>
                <span class="stat__label">${escapeHtml(UI_TEXT.victoryTimeLabel)}</span>
              </div>
            </div>
          </div>

          ${
            rank
              ? `<div class="rank-card">
                   <span class="rank-card__icon" aria-hidden="true">${rank.icon ?? '★'}</span>
                   <div class="rank-card__body">
                     <span class="rank-card__label">${escapeHtml(UI_TEXT.victoryRankLabel)}</span>
                     <h3 class="rank-card__title" dir="ltr">${escapeHtml(rank.title)}</h3>
                     <p class="rank-card__desc">${escapeHtml(rank.label ?? '')} — ${escapeHtml(rank.description ?? '')}</p>
                   </div>
                 </div>`
              : ''
          }

          <table class="rank-table">
            <caption>${escapeHtml(UI_TEXT.tableHeading)}</caption>
            <thead>
              <tr><th scope="col">דירוג</th><th scope="col">ניקוד</th></tr>
            </thead>
            <tbody>${rankRows}</tbody>
          </table>

          <button class="btn btn--primary btn--wide" type="button" data-action="restart">
            ${escapeHtml(UI_TEXT.playAgain)}
            <span class="btn__icon" aria-hidden="true">⟳</span>
          </button>
        </div>
      </article>
    `;
  }

  #mediaTemplate(fileName, alt, chip) {
    return `
      <div class="card__media">
        <img
          class="card__img"
          src="${escapeHtml(assetUrl(fileName))}"
          alt="${escapeHtml(alt)}"
          loading="eager"
          decoding="async"
        />
        <div class="card__scan" aria-hidden="true"></div>
        <span class="card__chip" dir="ltr">${escapeHtml(chip)}</span>
        <span class="card__missing">${escapeHtml(UI_TEXT.imageMissing)}<br /><code dir="ltr">assets/${escapeHtml(fileName)}</code></span>
      </div>
    `;
  }

  /* ------------------------------------------------------------------ */
  /* עזרים                                                               */
  /* ------------------------------------------------------------------ */

  /** תמונות חסרות לא ישברו את העיצוב – מוצג placeholder נקי */
  #hydrateImages() {
    this.#screen.querySelectorAll('.card__img').forEach((img) => {
      const markMissing = () => img.closest('.card__media')?.classList.add('is-missing');
      if (img.complete && img.naturalWidth === 0) markMissing();
      img.addEventListener('error', markMissing, { once: true });
    });
  }

  /** טעינה מוקדמת של התמונות של השלב הבא */
  #preloadUpcoming(state) {
    if (state.phase !== 'stage') return;

    const next = this.#engine.stages[state.stageIndex + 1];
    if (!next) return;

    [next.image, next.fallback?.image].filter(Boolean).forEach((file) => {
      const img = new Image();
      img.src = assetUrl(file);
    });
  }

  #announce(state) {
    if (!this.liveRegion) return;

    let message = '';
    if (state.phase === 'stage') {
      message = `שלב ${state.stageNumber} מתוך ${state.totalStages}. ${state.stage.title}. ${state.stage.prompt}`;
    } else if (state.phase === 'fallback') {
      message = `תשובה שגויה. ${state.stage.fallback.message}. ${state.stage.fallback.explanation}`;
    } else {
      message = `המשימה הושלמה. הניקוד שלך ${state.score}.`;
    }

    this.liveRegion.textContent = message;
  }

  #scrollToTop() {
    const behavior = REDUCED_MOTION ? 'auto' : 'smooth';
    window.scrollTo({ top: 0, behavior });
  }
}
