/**
 * tests/engine.test.mjs
 * -----------------------------------------------------------------------------
 * בדיקות לוגיקה למנוע (ללא דפדפן):  node tests/engine.test.mjs
 * -----------------------------------------------------------------------------
 */

import assert from 'node:assert/strict';
import { stages } from '../js/data/stages.js';
import { RULES, RANKS } from '../js/data/game-config.js';
import { GameEngine, PHASE } from '../js/engine.js';

let passed = 0;
const test = (name, fn) => {
  fn();
  passed += 1;
  console.log(`  ✓ ${name}`);
};

console.log('\nOperation: Blackout — engine tests\n');

test('נתוני המשחק: 20 שלבים, 4 תשובות, תשובה נכונה אחת בדיוק', () => {
  assert.equal(stages.length, 20);
  stages.forEach((stage, index) => {
    assert.equal(stage.id, index + 1, `stage ${index + 1} id`);
    assert.equal(stage.answers.length, 4, `stage ${stage.id} answers`);
    assert.equal(
      stage.answers.filter((answer) => answer.correct).length,
      1,
      `stage ${stage.id} must have exactly one correct answer`
    );
    assert.ok(stage.image, `stage ${stage.id} image`);
    assert.ok(stage.fallback.image, `stage ${stage.id} fallback image`);
    assert.ok(stage.fallback.explanation, `stage ${stage.id} explanation`);
  });
});

test('מצב פתיחה: 100 HP, ניקוד 100, שלב 1', () => {
  const engine = new GameEngine(stages, { rules: RULES, ranks: RANKS });
  const state = engine.getState();
  assert.equal(state.hp, 100);
  assert.equal(state.score, 100);
  assert.equal(state.stageNumber, 1);
  assert.equal(state.phase, PHASE.STAGE);
});

test('תשובה נכונה: +10 ומעבר לשלב הבא', () => {
  const engine = new GameEngine(stages, { rules: RULES, ranks: RANKS });
  engine.choose(1); // under
  const state = engine.getState();
  assert.equal(state.score, 110);
  assert.equal(state.stageNumber, 2);
  assert.equal(state.hp, 100);
  assert.equal(state.phase, PHASE.STAGE);
});

test('תשובה שגויה: -5 HP, -5 ניקוד, מעבר ל-FALLBACK, וחזרה לאותו שלב', () => {
  const engine = new GameEngine(stages, { rules: RULES, ranks: RANKS });
  engine.choose(0); // above -> שגוי
  let state = engine.getState();
  assert.equal(state.phase, PHASE.FALLBACK);
  assert.equal(state.hp, 95);
  assert.equal(state.score, 95);
  assert.equal(state.stageNumber, 1);
  assert.equal(state.mistakes, 1);

  engine.retry();
  state = engine.getState();
  assert.equal(state.phase, PHASE.STAGE);
  assert.equal(state.stageNumber, 1);
  assert.equal(state.score, 95, 'חזרה לאותו שלב לא משנה ניקוד');

  engine.choose(1); // עכשיו נכון
  state = engine.getState();
  assert.equal(state.score, 105);
  assert.equal(state.stageNumber, 2);
});

test('מסלול מושלם: 300 נקודות ודירוג Master Cyber Agent', () => {
  const engine = new GameEngine(stages, { rules: RULES, ranks: RANKS });
  for (let i = 0; i < stages.length; i += 1) {
    const correct = engine.getState().stage.answers.findIndex((answer) => answer.correct);
    engine.choose(correct);
  }
  const state = engine.getState();
  assert.equal(state.phase, PHASE.VICTORY);
  assert.equal(state.score, 300);
  assert.equal(state.hp, 100);
  assert.equal(state.accuracyPercent, 100);
  assert.equal(state.rank.title, 'Master Cyber Agent');
});

test('4 טעויות לאורך המשימה: 280 נקודות (עדיין Master)', () => {
  const engine = new GameEngine(stages, { rules: RULES, ranks: RANKS });
  for (let i = 0; i < stages.length; i += 1) {
    const stage = engine.getState().stage;
    if (i < 4) {
      engine.choose(stage.answers.findIndex((answer) => !answer.correct));
      engine.retry();
    }
    engine.choose(engine.getState().stage.answers.findIndex((answer) => answer.correct));
  }
  const state = engine.getState();
  assert.equal(state.score, 280);
  assert.equal(state.hp, 80);
  assert.equal(state.rank.title, 'Master Cyber Agent');
});

test('HP לא יורד מתחת ל-0 והניקוד לא שלילי', () => {
  const engine = new GameEngine(stages, { rules: RULES, ranks: RANKS });
  for (let i = 0; i < 40; i += 1) {
    engine.choose(engine.getState().stage.answers.findIndex((answer) => !answer.correct));
    engine.retry();
  }
  const state = engine.getState();
  assert.equal(state.hp, 0);
  assert.equal(state.score, 0);
  assert.equal(state.rank.title, 'Agent in Training');
});

test('קלט לא חוקי מתעלם (אין שלב/תשובה כזו)', () => {
  const engine = new GameEngine(stages, { rules: RULES, ranks: RANKS });
  assert.equal(engine.choose(9).type, 'ignored');
  assert.equal(engine.choose(-1).type, 'ignored');
  assert.equal(engine.getState().score, 100);
});

test('אירועים נשלחים למנויים', () => {
  const engine = new GameEngine(stages, { rules: RULES, ranks: RANKS });
  const events = [];
  const unsubscribe = engine.subscribe((event) => events.push(event.type));
  engine.choose(1);
  engine.choose(0);
  engine.retry();
  unsubscribe();
  engine.reset();
  assert.deepEqual(events, ['correct', 'wrong', 'retry']);
});

test('איפוס מחזיר למצב התחלה', () => {
  const engine = new GameEngine(stages, { rules: RULES, ranks: RANKS });
  engine.choose(1);
  engine.choose(0);
  engine.reset();
  const state = engine.getState();
  assert.equal(state.score, 100);
  assert.equal(state.hp, 100);
  assert.equal(state.stageNumber, 1);
  assert.equal(state.mistakes, 0);
});

console.log(`\n${passed} בדיקות עברו בהצלחה.\n`);
