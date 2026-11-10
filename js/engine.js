/**
 * engine.js
 * -----------------------------------------------------------------------------
 * מכונת המצבים של המשחק. אין כאן שום DOM ואין כאן שום טקסט תוכן –
 * רק חוקים, מעברים ונתונים. זה מה שהופך את המנוע לבדיק ולשימוש חוזר.
 *
 *   STAGE --(תשובה נכונה)--> STAGE (הבא) --...--> VICTORY
 *     |                                             ^
 *     └--(תשובה שגויה)--> FALLBACK --(חזור)--> STAGE (אותו שלב)
 * -----------------------------------------------------------------------------
 */

/** שלבי המשחק */
export const PHASE = Object.freeze({
  STAGE: 'stage',
  FALLBACK: 'fallback',
  VICTORY: 'victory',
});

/** ברירות המחדל של חוקי המשחק (ניתנות לדריסה דרך הקונסטרקטור) */
export const DEFAULT_RULES = Object.freeze({
  startHp: 100,
  startScore: 100,
  scorePerCorrect: 10,
  hpPenaltyPerMistake: 5,
  scorePenaltyPerMistake: 5,
  minHp: 0,
  minScore: 0,
});

export class GameEngine {
  #listeners = new Set();

  /**
   * @param {Array} stages רשימת השלבים (מתוך data/stages.js)
   * @param {Object} [options]
   * @param {Object} [options.rules]  דריסה חלקית של DEFAULT_RULES
   * @param {Array}  [options.ranks]  טבלת דירוגים [{ min, ... }]
   */
  constructor(stages, options = {}) {
    if (!Array.isArray(stages) || stages.length === 0) {
      throw new Error('GameEngine: stages must be a non-empty array');
    }

    this.stages = stages;
    this.rules = { ...DEFAULT_RULES, ...(options.rules ?? {}) };
    this.ranks = options.ranks ?? [];

    this.reset();
  }

  /* ------------------------------------------------------------------ */
  /* מחזור חיים                                                          */
  /* ------------------------------------------------------------------ */

  /** מאפס את המשחק למצב התחלתי */
  reset() {
    this.hp = this.rules.startHp;
    this.score = this.rules.startScore;
    this.stageIndex = 0;
    this.phase = PHASE.STAGE;
    this.mistakes = 0;
    this.correctCount = 0;
    this.startedAt = Date.now();
    this.finishedAt = null;
    /** @type {{stageId:number, answerIndex:number, correct:boolean}[]} */
    this.log = [];
    this.emit({ type: 'reset' });
    return this;
  }

  /* ------------------------------------------------------------------ */
  /* קלט מהשחקן                                                          */
  /* ------------------------------------------------------------------ */

  /**
   * השחקן בחר תשובה.
   * @param {number} answerIndex 0..3
   * @returns {{type:'correct'|'wrong'|'ignored', answer?:Object, stage?:Object, isLastStage?:boolean}}
   */
  choose(answerIndex) {
    if (this.phase !== PHASE.STAGE) return { type: 'ignored' };

    const stage = this.currentStage;
    const answer = stage?.answers?.[answerIndex];
    if (!answer) return { type: 'ignored' };

    this.log.push({ stageId: stage.id, answerIndex, correct: answer.correct });

    if (answer.correct) {
      this.score += this.rules.scorePerCorrect;
      this.correctCount += 1;

      const isLastStage = this.stageIndex >= this.stages.length - 1;
      if (isLastStage) {
        this.phase = PHASE.VICTORY;
        this.finishedAt = Date.now();
      } else {
        this.stageIndex += 1;
      }

      this.emit({ type: 'correct', stage, answer, isLastStage });
      return { type: 'correct', stage, answer, isLastStage };
    }

    // תשובה שגויה: יורדים ב-HP ובניקוד, ועוברים לעמוד השגיאה
    this.hp = Math.max(this.rules.minHp, this.hp - this.rules.hpPenaltyPerMistake);
    this.score = Math.max(this.rules.minScore, this.score - this.rules.scorePenaltyPerMistake);
    this.mistakes += 1;
    this.phase = PHASE.FALLBACK;

    this.emit({ type: 'wrong', stage, answer });
    return { type: 'wrong', stage, answer };
  }

  /** חזרה מהעמוד האדום לאותו שלב (בלי לאפס ניקוד או HP) */
  retry() {
    if (this.phase !== PHASE.FALLBACK) return false;
    this.phase = PHASE.STAGE;
    this.emit({ type: 'retry' });
    return true;
  }

  /* ------------------------------------------------------------------ */
  /* גזירות (getters)                                                    */
  /* ------------------------------------------------------------------ */

  get totalStages() {
    return this.stages.length;
  }

  /** השלב הנוכחי (בזמן FALLBACK זה עדיין אותו שלב) */
  get currentStage() {
    return this.stages[this.stageIndex] ?? null;
  }

  /** מספר השלב לתצוגה (1-based) */
  get stageNumber() {
    return Math.min(this.stageIndex + 1, this.totalStages);
  }

  get isVictory() {
    return this.phase === PHASE.VICTORY;
  }

  /** אחוז התקדמות 0..100 (מבוסס על שלבים שהושלמו) */
  get progressPercent() {
    if (this.isVictory) return 100;
    return Math.round((this.stageIndex / this.totalStages) * 100);
  }

  /** אחוז HP 0..100 */
  get hpPercent() {
    const { startHp, minHp } = this.rules;
    const range = Math.max(1, startHp - minHp);
    return Math.max(0, Math.min(100, Math.round(((this.hp - minHp) / range) * 100)));
  }

  /** אחוז דיוק (תשובות נכונות מתוך כל הניסיונות) */
  get accuracyPercent() {
    const attempts = this.correctCount + this.mistakes;
    return attempts === 0 ? 100 : Math.round((this.correctCount / attempts) * 100);
  }

  /** משך המשחק בשניות */
  get elapsedSeconds() {
    const end = this.finishedAt ?? Date.now();
    return Math.max(0, Math.round((end - this.startedAt) / 1000));
  }

  /** הדירוג המתאים לניקוד הנוכחי */
  get rank() {
    const sorted = [...this.ranks].sort((a, b) => b.min - a.min);
    return sorted.find((rank) => this.score >= rank.min) ?? sorted[sorted.length - 1] ?? null;
  }

  /** תמונת מצב קפואה (מונעת שינוי מבחוץ ומקלה על רינדור) */
  getState() {
    return Object.freeze({
      phase: this.phase,
      stageIndex: this.stageIndex,
      stageNumber: this.stageNumber,
      totalStages: this.totalStages,
      stage: this.phase === PHASE.VICTORY ? null : this.currentStage,
      hp: this.hp,
      hpPercent: this.hpPercent,
      score: this.score,
      mistakes: this.mistakes,
      correctCount: this.correctCount,
      progressPercent: this.progressPercent,
      accuracyPercent: this.accuracyPercent,
      elapsedSeconds: this.elapsedSeconds,
      rank: this.rank,
    });
  }

  /* ------------------------------------------------------------------ */
  /* אירועים                                                             */
  /* ------------------------------------------------------------------ */

  /** @param {(event:Object)=>void} listener */
  subscribe(listener) {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  emit(event) {
    for (const listener of this.#listeners) {
      try {
        listener(event, this.getState());
      } catch (error) {
        console.error('[GameEngine] listener failed:', error);
      }
    }
  }
}
