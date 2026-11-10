/**
 * game-config.js
 * -----------------------------------------------------------------------------
 * כל מה שהוא "קונפיגורציה" ולא "תוכן שלב": נתיב תמונות, חוקי ניקוד, דירוגים
 * ומיתוג המסכים. שינוי כאן = שינוי התנהגות המשחק בלי לגעת במנוע.
 * -----------------------------------------------------------------------------
 */

/** תיקיית התמונות היחסית לשורש האתר */
export const ASSETS_DIR = './assets/';

/** בונה נתיב מלא לקובץ תמונה מתוך assets/ */
export const assetUrl = (fileName) => `${ASSETS_DIR}${fileName}`;

/** חוקי המשחק */
export const RULES = {
  startHp: 100,
  startScore: 100,
  scorePerCorrect: 10,
  hpPenaltyPerMistake: 5,
  scorePenaltyPerMistake: 5,
  minHp: 0,
  minScore: 0,
};

/**
 * טבלת דירוגים. ההשוואה היא מהגבוה לנמוך (min inclusively).
 * הניקוד תמיד מכפלה של 5, ולכן הטווחים מכסים כל תוצאה אפשרית.
 */
export const RANKS = [
  {
    min: 280,
    title: 'Master Cyber Agent',
    label: 'סוכן סייבר מומחה',
    description: 'שליטה מעולה באנגלית, כמעט ללא טעויות!',
    icon: '◈',
  },
  {
    min: 240,
    title: 'Senior Field Agent',
    label: 'סוכן שטח בכיר',
    description: 'עבודה טובה מאוד, התגברת על המלכודות בהצלחה.',
    icon: '★',
  },
  {
    min: 200,
    title: 'Junior Agent',
    label: 'סוכן זוטר',
    description: 'השלמת את המשימה! כדאי לחזור על כללי הדקדוק שבהם נעזרת ברמזים.',
    icon: '◆',
  },
  {
    min: 0,
    title: 'Agent in Training',
    label: 'סוכן בהכשרה',
    description: 'המשימה הושלמה, אבל הדרך הייתה רטובה בגשם של טעויות. שווה סבב חוזר!',
    icon: '◇',
  },
];

/** תוכן מסך הניצחון */
export const VICTORY = {
  title: 'MISSION ACCOMPLISHED!',
  image: 'victory.png',
  alt: 'תג סוכן סייבר מוזהב עם הכיתוב TOP AGENT',
  message:
    'Congratulations, Agent! You shut down A.R.E.S, unlocked the laboratory, and escaped safely!',
};

/** טקסטים של ממשק המשתמש (עברית) */
export const UI_TEXT = {
  gameTitle: 'Operation: Blackout',
  gameSubtitle: 'סוכן, חדור למעבדת הבינה המלאכותית',
  hpLabel: 'HP',
  scoreLabel: 'ניקוד',
  stageLabel: 'שלב',
  ofLabel: 'מתוך',
  restart: 'איפוס משימה',
  restartConfirm: 'לאפס את המשימה ולחזור לשלב 1?',
  fallbackHeading: 'SECURITY BREACH',
  fallbackButton: (stageNumber) => `הבנתי – חזור לשלב ${stageNumber}`,
  victoryScoreLabel: 'ניקוד סופי',
  victoryRankLabel: 'דירוג הסוכן',
  victoryMistakesLabel: 'טעויות',
  victoryAccuracyLabel: 'דיוק',
  victoryTimeLabel: 'זמן משימה',
  playAgain: 'משימה חדשה',
  tableHeading: 'טבלת דירוג הסוכנים',
  keyboardHint: 'אפשר גם לבחור עם המקשים 1–4',
  imageMissing: 'התמונה חסרה ב-assets',
};
