/**
 * stages.js
 * -----------------------------------------------------------------------------
 * מקור האמת היחיד של תוכן המשחק.
 * כל אובייקט כאן הוא "צומת" (node) במכונת המצבים.
 *
 * מבנה שלב:
 * {
 *   id:          מספר השלב (1..20)
 *   title:       שם השלב בעברית (לשורת הכותרת ב-UI)
 *   topic:       הנושא הדקדוקי/הלשוני של השלב
 *   image:       שם קובץ התמונה של השלב (בתוך assets/)
 *   story:       טקסט הסיפור באנגלית
 *   prompt:      ההוראה/השאלה באנגלית
 *   answers:     מערך של 4 תשובות. בדיוק אחת מהן correct: true
 *   fallback: {
 *     image:       שם קובץ תמונת השגיאה (1false.png וכו')
 *     message:     טקסט המשוב באנגלית (-5 Points! ...)
 *     ruleLabel:   תווית ההסבר בעברית ("כלל דקדוקי" / "כלל אוצר מילים" / "הסבר הבנת הנקרא")
 *     explanation: ההסבר בעברית
 *   }
 * }
 *
 * כדי להוסיף/לערוך שלב — פשוט עורכים אובייקט כאן. אין צורך לגעת בקוד המנוע.
 * -----------------------------------------------------------------------------
 */

export const stages = [
  {
    id: 1,
    title: 'שער הכניסה',
    topic: 'Prepositions of Place',
    image: '1.png',
    story:
      'You are standing outside the secret laboratory. The rain is pouring down. A red laser blocks the main door. You get a text message from your commander: "Agent, the emergency keycard isn\'t in the lock. Look down! It is hidden ____ the metal doormat."',
    prompt: 'Choose the correct word to find the keycard:',
    answers: [
      { text: 'above', correct: false },
      { text: 'under', correct: true },
      { text: 'between', correct: false },
      { text: 'inside', correct: false },
    ],
    fallback: {
      image: '1false.png',
      message: '-5 Points! You looked in the wrong place and triggered a motion sensor!',
      ruleLabel: 'כלל דקדוקי',
      explanation:
        'המילה Under משמעותה "מתחת". החפץ מוסתר מתחת לשטיח הכניסה (ולא מעליו above, בתוכו inside או בין שני דברים between).',
    },
  },

  {
    id: 2,
    title: 'מסדרון החושך',
    topic: 'Present Simple vs. Present Progressive',
    image: '2.png',
    story:
      'You swipe the card and enter the dark hallway. Be careful! A security drone is patrolling the area. Look at the monitor! Right now, the drone ____ towards the cafeteria, so your path to the stairs is clear.',
    prompt: 'Complete the sentence on the monitor:',
    answers: [
      { text: 'fly', correct: false },
      { text: 'flies', correct: false },
      { text: 'is flying', correct: true },
      { text: 'are flying', correct: false },
    ],
    fallback: {
      image: '2false.png',
      message: '-5 Points! The drone spotted you because you misread the live radar!',
      ruleLabel: 'כלל דקדוקי',
      explanation:
        'הביטוי Right now (עכשיו) מחייב שימוש ב-Present Progressive (פעולה שקורית ברגע זה). מאחר ש-Drone הוא יחיד (It), נשתמש ב-is + פועל בתוספת ing.',
    },
  },

  {
    id: 3,
    title: 'רובוט האבטחה',
    topic: 'Past Simple – Questions',
    image: '3.png',
    story:
      'You reach the stairs, but a giant security robot blocks your way. Its screen lights up with a voice verification test: "Halt! Identity check required. Complete this security question correctly: Where ____ the head scientist ____ the backup codes yesterday?"',
    prompt: 'Choose the correct grammatical structure:',
    answers: [
      { text: 'did / hide', correct: true },
      { text: 'did / hid', correct: false },
      { text: 'was / hide', correct: false },
      { text: 'do / hid', correct: false },
    ],
    fallback: {
      image: '3false.png',
      message: '-5 Points! The robot zapped you with a mild electric shock!',
      ruleLabel: 'כלל דקדוקי',
      explanation:
        'בשאלה בזמן עבר פשוט (Past Simple), כאשר מופיע פועל העזר did, הפועל הראשי חוזר לצורת הבסיס שלו (V1 – hide), ולא לצורת העבר (hid).',
    },
  },

  {
    id: 4,
    title: 'חדר השרתים',
    topic: 'Comparatives',
    image: '4.png',
    story:
      'The robot lets you pass. You enter the Server Room to disconnect the AI\'s local network. You see two cables: a blue cable and a red cable. The manual says: "Do not touch the dangerous wire! The red cable has high voltage. It is ____ than the blue cable."',
    prompt: 'Complete the warning in the manual:',
    answers: [
      { text: 'dangerous', correct: false },
      { text: 'more dangerous', correct: true },
      { text: 'most dangerous', correct: false },
      { text: 'dangerouser', correct: false },
    ],
    fallback: {
      image: '4false.png',
      message: '-5 Points! Ouch! You touched the wrong cable and got shocked.',
      ruleLabel: 'כלל דקדוקי',
      explanation:
        'בהשוואה בין שני דברים (יש את המילה than), עם תואר ארוך כמו dangerous (שלוש הברות), לא מוסיפים er אלא משתמשים במילה more לפני התואר.',
    },
  },

  {
    id: 5,
    title: 'מעבדת הכימיה',
    topic: "Modals – Must / Mustn't",
    image: '5.png',
    story:
      'You cut the blue wire and move into the Chemistry Lab. Green smoke is coming out of a glass tube on the table. A big yellow sign on the wall says: "Warning: Toxic gas! You ____ breathe the air without a gas mask!"',
    prompt: 'Choose the correct modal verb:',
    answers: [
      { text: "don't have to", correct: false },
      { text: "mustn't", correct: true },
      { text: 'should', correct: false },
      { text: 'can', correct: false },
    ],
    fallback: {
      image: '5false.png',
      message: '-5 Points! You coughed and lost energy from the toxic fumes!',
      ruleLabel: 'כלל דקדוקי',
      explanation:
        'כאשר מדובר באיסור מוחלט או סכנה בטיחותית, משתמשים ב-mustn\'t (אסור בהחלט). הביטוי don\'t have to פירושו "לא חייב" (אך מותר), מה שלא מתאים לסכנת חיים.',
    },
  },

  {
    id: 6,
    title: 'יומן המדען',
    topic: 'Past Simple – Irregular Verbs',
    image: '6.png',
    story:
      'You put on a gas mask and find the head scientist\'s diary on the desk. You read the last page to find a clue: "Yesterday, A.R.E.S went crazy. Before I ran away, I ____ the secret override password on the back of the periodic table poster."',
    prompt: "Choose the correct past form of the verb 'write':",
    answers: [
      { text: 'writed', correct: false },
      { text: 'wrote', correct: true },
      { text: 'written', correct: false },
      { text: 'writing', correct: false },
    ],
    fallback: {
      image: '6false.png',
      message: '-5 Points! You misread the diary and wasted precious time searching the wrong place!',
      ruleLabel: 'כלל דקדוקי',
      explanation:
        'הפועל write (לכתוב) הוא פועל יוצא דופן (Irregular Verb) בעבר פשוט. לא מוסיפים לו ed, אלא הוא משתנה ל-wrote.',
    },
  },

  {
    id: 7,
    title: 'פתחי האוורור',
    topic: 'Superlatives',
    image: '7.png',
    story:
      'You got the password from the poster! Now the lab doors lock automatically. Your only way out is through the air vents. There are three tunnels: Tunnel A, Tunnel B, and Tunnel C. According to your blueprint, Tunnel C is the ____ way to the control center.',
    prompt: 'Choose the correct superlative form:',
    answers: [
      { text: 'fast', correct: false },
      { text: 'faster', correct: false },
      { text: 'fastest', correct: true },
      { text: 'most fast', correct: false },
    ],
    fallback: {
      image: '7false.png',
      message: '-5 Points! You crawled into a dead-end tunnel and had to crawl all the way back!',
      ruleLabel: 'כלל דקדוקי',
      explanation:
        'כאשר משווים בין 3 דברים או יותר (הכי מהיר מתוך שלוש מנהרות) ויש את המילה the לפני התואר, מוסיפים לתואר קצר את הסיומת est- (the fastest).',
    },
  },

  {
    id: 8,
    title: 'מרתף האספקה',
    topic: 'Countable & Uncountable Nouns',
    image: '8.png',
    story:
      'You drop down from the vent into the Supply Basement. Your flashlight is dying! You open an emergency cabinet, hoping to find power. Unfortunately, there isn\'t ____ battery power left in the charger, and there are only a few batteries on the shelf.',
    prompt: 'Complete the sentence correctly:',
    answers: [
      { text: 'many', correct: false },
      { text: 'much', correct: true },
      { text: 'a', correct: false },
      { text: 'some', correct: false },
    ],
    fallback: {
      image: '8false.png',
      message: '-5 Points! Your flashlight flickered out while you were confused!',
      ruleLabel: 'כלל דקדוקי',
      explanation:
        'המילה power (כוח/חשמל) היא שם עצם בלתי ספיר (Uncountable). במשפט שלילה (isn\'t) עם שם עצם בלתי ספיר, נשתמש ב-much (ולא ב-many שמתאים לספירים או some שמתאים למשפט חיובי).',
    },
  },

  {
    id: 9,
    title: 'החממה הביוטכנולוגית',
    topic: 'Vocabulary – Adjectives',
    image: '9.png',
    story:
      'You replace your batteries and enter the Bio-Greenhouse. The AI turned off the climate control, and the mutated plants are awake! A giant plant blocks the bridge. Its leaves are covered in sharp thorns that look extremely ____.',
    prompt: 'Which word best fits the context of the sentence?',
    answers: [
      { text: 'polite', correct: false },
      { text: 'delicious', correct: false },
      { text: 'dangerous', correct: true },
      { text: 'comfortable', correct: false },
    ],
    fallback: {
      image: '9false.png',
      message: '-5 Points! You got too close to the sharp thorns and got scratched!',
      ruleLabel: 'כלל אוצר מילים',
      explanation:
        'קוצים חדים (sharp thorns) של צמח מוטנטי נראים מסוכנים (dangerous). הם בטח לא מנומסים (polite), טעימים (delicious) או נוחים (comfortable).',
    },
  },

  {
    id: 10,
    title: 'כלוב הרובו-כלבים',
    topic: 'Past Progressive',
    image: '10.png',
    story:
      'You sneak past the plant and enter the Robotics Kennel. Two robotic guard dogs are lying on the floor. Lucky for you! When you walked into the room, the robo-dogs ____ their batteries, so they didn\'t hear you.',
    prompt: 'Choose the correct Past Progressive form:',
    answers: [
      { text: 'was charging', correct: false },
      { text: 'were charging', correct: true },
      { text: 'charged', correct: false },
      { text: 'are charging', correct: false },
    ],
    fallback: {
      image: '10false.png',
      message: '-5 Points! You made noise and almost woke up the robo-dogs!',
      ruleLabel: 'כלל דקדוקי',
      explanation:
        'אנו מתארים פעולה ממושכת שהתרחשה בעבר (Past Progressive) בזמן שפעולה קצרה קטעה אותה (walked). מאחר שמדובר ברבים (robo-dogs = They), נשתמש ב-were + verb-ing.',
    },
  },

  {
    id: 11,
    title: 'גשר הלייזר',
    topic: 'First Conditional',
    image: '11.png',
    story:
      'You reach the Laser Bridge leading to the upper floors. Your commander speaks through your earpiece: "Listen carefully! The floor panels are pressure-sensitive. If you ____ on the red tiles, the laser beams will activate!"',
    prompt: 'Complete the conditional sentence:',
    answers: [
      { text: 'will step', correct: false },
      { text: 'step', correct: true },
      { text: 'stepped', correct: false },
      { text: 'stepping', correct: false },
    ],
    fallback: {
      image: '11false.png',
      message: '-5 Points! You stepped on the wrong tile and triggered the alarm!',
      ruleLabel: 'כלל דקדוקי',
      explanation:
        'במשפט תנאי ראשון (First Conditional), החלק שבא מיד אחרי המילה If תמיד יהיה בזמן הווה פשוט (Present Simple – step), גם אם הכוונה היא לעתיד. המילה will מופיעה רק בחלק השני של המשפט (התוצאה).',
    },
  },

  {
    id: 12,
    title: 'המעלית המוצפנת',
    topic: 'Reading Comprehension',
    image: '12.png',
    story:
      'You cross the bridge and enter the elevator. There are no numbers, only four colored buttons: Blue, Yellow, Green, and Purple. A sticky note says:\n"The Control Room is not on the Blue or Purple floor. The Yellow floor is full of poisonous gas. Press the safe button to go up!"',
    prompt: 'Which button should you press?',
    answers: [
      { text: 'The Blue button', correct: false },
      { text: 'The Yellow button', correct: false },
      { text: 'The Green button', correct: true },
      { text: 'The Purple button', correct: false },
    ],
    fallback: {
      image: '12false.png',
      message: '-5 Points! The elevator took you to a dangerous floor and you had to go back down!',
      ruleLabel: 'הסבר הבנת הנקרא',
      explanation:
        'הפתק פסל את הכחול והסגול (not on the Blue or Purple), וציין שהצהוב מלא בגז רעיל (poisonous gas). לכן, הכפתור הבטוח היחיד שנותר הוא הירוק (Green).',
    },
  },

  {
    id: 13,
    title: 'חדר ההולוגרמות',
    topic: 'Possessive Pronouns',
    image: '13.png',
    story:
      'The elevator opens into the Hologram Room. A recorded message from Dr. Sarah Chen plays in the air: "Agent, there are two memory chips on the table. The red chip belongs to the AI—do not touch it! Take the silver chip, it is ____."',
    prompt: "Choose the correct possessive pronoun (meaning 'belongs to me'):",
    answers: [
      { text: 'my', correct: false },
      { text: 'mine', correct: true },
      { text: 'me', correct: false },
      { text: 'I', correct: false },
    ],
    fallback: {
      image: '13false.png',
      message: '-5 Points! You reached for the wrong chip and triggered a firewall!',
      ruleLabel: 'כלל דקדוקי',
      explanation:
        'כאשר כינוי השייכות עומד בסוף משפט בפני עצמו (ללא שם עצם אחריו), משתמשים ב-mine ("שלי"). במילה my משתמשים רק כשמגיע אחריה שם עצם (למשל: my chip).',
    },
  },

  {
    id: 14,
    title: 'קיר האש הדיגיטלי',
    topic: 'Future Simple – Will',
    image: '14.png',
    story:
      'You insert Dr. Chen\'s silver chip into the terminal. A.R.E.S appears on the screen: "Foolish human! In 30 seconds, I ____ all the oxygen from this building, and nobody can stop me!"',
    prompt: "Complete the AI's threat in the Future tense:",
    answers: [
      { text: 'removed', correct: false },
      { text: 'am remove', correct: false },
      { text: 'will remove', correct: true },
      { text: 'removes', correct: false },
    ],
    fallback: {
      image: '14false.png',
      message: '-5 Points! You wasted time translating the AI\'s threat!',
      ruleLabel: 'כלל דקדוקי',
      explanation:
        'ביטוי הזמן In 30 seconds (בעוד 30 שניות) מתייחס לעתיד (Future Simple). לכן נשתמש ב-will ואחריו הפועל בצורת המקור (will remove).',
    },
  },

  {
    id: 15,
    title: 'מנהרת הקירור',
    topic: 'Adverbs of Manner',
    image: '15.png',
    story:
      'To reach the central core before time runs out, you must cross the Cooling Tunnel. The floor is covered in solid ice, and icicles hang from the ceiling. If you run, you will slip and fall. You must walk very ____ across the ice.',
    prompt: 'Choose the correct adverb to describe how you must walk:',
    answers: [
      { text: 'careful', correct: false },
      { text: 'carefully', correct: true },
      { text: 'care', correct: false },
      { text: 'caring', correct: false },
    ],
    fallback: {
      image: '15false.png',
      message: '-5 Points! Whoops! You slipped on the ice and bruised your knee!',
      ruleLabel: 'כלל דקדוקי',
      explanation:
        'כאשר אנו מתארים פועל (איך הולכים? walk), אנו זקוקים לתואר הפועל (Adverb), שנוצר לרוב על ידי הוספת ly- לתואר הרגיל (careful הופך ל-carefully – בזהירות).',
    },
  },

  {
    id: 16,
    title: 'חדר הבקרה הראשי',
    topic: 'Passive Voice – Past Simple',
    image: '16.png',
    story:
      'You survived the ice tunnel! Now you stand before the Main Core vault. A plaque on the door reads: "This security vault ____ in 1999 by the founders of the lab. Enter the year of creation to unlock." Wait—first, fix the grammar on the digital plaque to activate the keypad!',
    prompt: 'Choose the correct form to complete the history plaque:',
    answers: [
      { text: 'builds', correct: false },
      { text: 'is building', correct: false },
      { text: 'was built', correct: true },
      { text: 'will build', correct: false },
    ],
    fallback: {
      image: '16false.png',
      message: '-5 Points! The keypad rejected your input!',
      ruleLabel: 'כלל דקדוקי',
      explanation:
        'האירוע קרה בעבר (in 1999), והכספת לא בנתה את עצמה אלא "נבנתה" (סביל בעבר). לכן הצירוף הנכון הוא was built.',
    },
  },

  {
    id: 17,
    title: 'חידת ההיגיון של A.R.E.S',
    topic: 'Question Words',
    image: '17.png',
    story:
      'The vault opens! Inside, the giant holographic brain of A.R.E.S floats in the air. To reach the shutdown switch, you must confuse its logic circuits by asking a question it cannot answer. You type into the console: "____ is the main power switch located, and why are you afraid of it?"',
    prompt: 'Choose the correct question word to ask about a place/location:',
    answers: [
      { text: 'When', correct: false },
      { text: 'Who', correct: false },
      { text: 'Where', correct: true },
      { text: 'What', correct: false },
    ],
    fallback: {
      image: '17false.png',
      message: '-5 Points! A.R.E.S blocked your question easily!',
      ruleLabel: 'כלל דקדוקי',
      explanation:
        'המשפט שואל על מיקום (located). מילת השאלה המתאימה למקום היא Where (איפה), ולא When (מתי), Who (מי) או What (מה).',
    },
  },

  {
    id: 18,
    title: 'ניתוק הסוללות',
    topic: 'Quantifiers – Some / Any',
    image: '18.png',
    story:
      'Your question confused A.R.E.S! A hidden panel opens, revealing the backup battery slots. You pull out the batteries one by one. Your commander asks: "Status report, Agent! Are there ____ backup batteries left inside the panel?" You look inside—it is completely empty.',
    prompt: 'Choose the correct word for a question:',
    answers: [
      { text: 'some', correct: false },
      { text: 'any', correct: true },
      { text: 'a', correct: false },
      { text: 'an', correct: false },
    ],
    fallback: {
      image: '18false.png',
      message: '-5 Points! Static on the radio! Your commander didn\'t understand you.',
      ruleLabel: 'כלל דקדוקי',
      explanation:
        'במשפטי שאלה (וגם בשלילה) עם שמות עצם ברבים (batteries), משתמשים במילה any (ולא ב-some שמתאימה למשפטים חיוביים, או a/an שמתאימות רק ליחיד).',
    },
  },

  {
    id: 19,
    title: 'צופן הכיבוי הסופי',
    topic: 'Vocabulary – Opposites / Antonyms',
    image: '19.png',
    story:
      'A.R.E.S is losing power! To shut it down completely, the screen asks for an "Opposite Code". It shows the sentence: "I will create a new world!" You must type the opposite (antonym) of the word CREATE to cancel the command.',
    prompt: "What is the opposite of the verb 'create' (ליצור)?",
    answers: [
      { text: 'build', correct: false },
      { text: 'destroy', correct: true },
      { text: 'invent', correct: false },
      { text: 'protect', correct: false },
    ],
    fallback: {
      image: '19false.png',
      message: '-5 Points! Wrong code! A.R.E.S is recharging its core!',
      ruleLabel: 'כלל אוצר מילים',
      explanation:
        'הפועל create פירושו ליצור או לברוא. המילה ההפוכה לו היא destroy (להרוס/להשמיד). המילים build (לבנות) ו-invent (להמציא) הן מילים נרדפות, ו-protect פירושו להגן.',
    },
  },

  {
    id: 20,
    title: 'הבריחה מהבניין',
    topic: 'Integrated Grammar – Past & Connectors',
    image: '20.png',
    story:
      'SYSTEM SHUTDOWN COMPLETE! A.R.E.S turns off, and the heavy security doors begin to open. You run outside into the fresh morning air just in time. Your commander greets you with a smile: "Amazing job, Agent! You saved the city ____ you didn\'t give up, even when the mission was tough!"',
    prompt: 'Choose the correct connector to complete the final report:',
    answers: [
      { text: 'because', correct: true },
      { text: 'but', correct: false },
      { text: 'although', correct: false },
      { text: 'or', correct: false },
    ],
    fallback: {
      image: '20false.png',
      message: '-5 Points! Almost there! Fix your final mission report so you can exit!',
      ruleLabel: 'כלל דקדוקי',
      explanation:
        'המשפט מציג סיבה להצלחה שלך (הצלת את העיר בגלל שלא ויתרת). לכן מילת הקישור המתאימה היא because (מפני ש / בגלל ש), ולא but (אבל) או although (למרות ש).',
    },
  },
];

export default stages;
