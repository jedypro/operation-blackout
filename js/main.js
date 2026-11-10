/**
 * main.js
 * -----------------------------------------------------------------------------
 * נקודת החיבור: מחברת נתונים + מנוע + תצוגה, וממפה קלט (עכבר/מקלדת) לפעולות.
 * -----------------------------------------------------------------------------
 */

import { stages } from './data/stages.js';
import { RULES, RANKS } from './data/game-config.js';
import { GameEngine } from './engine.js';
import { GameView } from './ui.js';

const engine = new GameEngine(stages, { rules: RULES, ranks: RANKS });

const view = new GameView(engine, {
  screen: document.getElementById('screen'),
  hud: document.querySelector('.hud'),
  liveRegion: document.getElementById('sr-status'),
  onSelectAnswer: (index) => engine.choose(index),
  onRetry: () => engine.retry(),
  onRestart: () => {
    if (window.confirm('לאפס את המשימה ולחזור לשלב 1?')) engine.reset();
  },
});

// כל שינוי במנוע מרנדר מחדש את המסך
engine.subscribe((_event, state) => view.render(state));

// מקלדת: 1-4 לבחירת תשובה, Enter/Backspace לחזרה משלב השגיאה
document.addEventListener('keydown', (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey) return;

  const state = engine.getState();

  if (state.phase === 'stage' && /^[1-4]$/.test(event.key)) {
    event.preventDefault();
    const index = Number(event.key) - 1;
    const button = document.querySelector(`[data-action="answer"][data-index="${index}"]`);
    if (button && !button.classList.contains('is-locked')) button.click();
    return;
  }

  if (state.phase === 'fallback' && (event.key === 'Enter' || event.key === 'Backspace')) {
    event.preventDefault();
    engine.retry();
    return;
  }

  if (state.phase === 'victory' && event.key === 'Enter') {
    event.preventDefault();
    engine.reset();
  }
});

// התחלה
view.render(engine.getState());

// חשיפה לניפוי באגים מהקונסול (לא חובה לשימוש)
window.__blackout = { engine, stages };
