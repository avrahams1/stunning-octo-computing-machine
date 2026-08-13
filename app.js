// ---- Config ----
const CARD_IMAGES = [
  'images/card-1.jpg',
  'images/card-2.jpg',
  'images/card-3.jpg',
  'images/card-4.jpg',
  'images/card-5.jpg',
  'images/card-6.jpg',
  'images/card-7.jpg',
  'images/card-8.jpg',
];
// Easy to change later: swap this file, or point to a different images/card-N.jpg
const FINALE_PHOTO = 'images/finale.jpg';

// ---- Screen helpers ----
const screens = {};
document.querySelectorAll('.screen').forEach(el => screens[el.id] = el);
function showScreen(id) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[id].classList.add('active');
}

// ---- Background floating hearts ----
(function bgHearts() {
  const wrap = document.getElementById('bg-hearts');
  const emojis = ['💗', '💕', '💓', '❤️'];
  for (let i = 0; i < 14; i++) {
    const s = document.createElement('span');
    s.textContent = emojis[i % emojis.length];
    s.style.left = Math.random() * 100 + '%';
    s.style.fontSize = (14 + Math.random() * 16) + 'px';
    s.style.animationDuration = (10 + Math.random() * 12) + 's';
    s.style.animationDelay = (Math.random() * 10) + 's';
    wrap.appendChild(s);
  }
})();

// ---- Intro ----
document.getElementById('btn-start').addEventListener('click', () => {
  showScreen('screen-game');
  initGame();
});

// ---- Debug mode: ?debug=1 shows a button to skip straight to the win sequence ----
const DEBUG = new URLSearchParams(location.search).get('debug') === '1';
if (DEBUG) {
  const debugBtn = document.getElementById('btn-debug-finish');
  debugBtn.style.display = 'block';
  debugBtn.addEventListener('click', () => {
    matchedPairs = CARD_IMAGES.length;
    const pairCountEl = document.getElementById('pair-count');
    if (pairCountEl) pairCountEl.textContent = matchedPairs;
    startWinSequence();
  });
}

// ---- Game ----
let moveCount = 0;
let matchedPairs = 0;
let lockBoard = false;
let firstCard = null;
let secondCard = null;

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function initGame() {
  moveCount = 0;
  matchedPairs = 0;
  lockBoard = false;
  firstCard = null;
  secondCard = null;
  document.getElementById('move-count').textContent = '0';
  document.getElementById('pair-count').textContent = '0';

  const deck = shuffle(CARD_IMAGES.concat(CARD_IMAGES));
  const board = document.getElementById('board');
  board.innerHTML = '';

  deck.forEach(src => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.img = src;
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-back">💗</div>
        <div class="card-face card-front"><img src="${src}" alt="" loading="lazy"></div>
      </div>`;
    card.addEventListener('click', () => onCardClick(card));
    board.appendChild(card);
  });
}

function onCardClick(card) {
  if (lockBoard) return;
  if (card === firstCard) return;
  if (card.classList.contains('matched')) return;

  card.classList.add('flipped');

  if (!firstCard) {
    firstCard = card;
    return;
  }
  secondCard = card;
  lockBoard = true;
  moveCount++;
  document.getElementById('move-count').textContent = moveCount;

  const isMatch = firstCard.dataset.img === secondCard.dataset.img;
  if (isMatch) {
    setTimeout(() => {
      firstCard.classList.add('matched');
      secondCard.classList.add('matched');
      matchedPairs++;
      document.getElementById('pair-count').textContent = matchedPairs;
      resetTurn();
      if (matchedPairs === CARD_IMAGES.length) {
        setTimeout(startWinSequence, 700);
      }
    }, 450);
  } else {
    setTimeout(() => {
      firstCard.classList.add('mismatch');
      secondCard.classList.add('mismatch');
    }, 500);
    setTimeout(() => {
      firstCard.classList.remove('flipped', 'mismatch');
      secondCard.classList.remove('flipped', 'mismatch');
      resetTurn();
    }, 1400);
  }
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

// ---- Win sequence: loading memories ----
function startWinSequence() {
  showScreen('screen-loading');

  const percentEl = document.getElementById('loading-percent');
  const fillEl = document.getElementById('loading-bar-fill');
  const doneEl = document.getElementById('loading-done');
  const heartEls = [
    document.querySelector('.lh1'),
    document.querySelector('.lh2'),
    document.querySelector('.lh3'),
  ];

  let pct = 0;
  const totalMs = 2200;
  const stepMs = 30;
  const steps = totalMs / stepMs;
  const inc = 100 / steps;

  const timer = setInterval(() => {
    pct = Math.min(100, pct + inc);
    const rounded = Math.round(pct);
    percentEl.textContent = rounded + '%';
    fillEl.style.width = rounded + '%';
    if (pct >= 100) {
      clearInterval(timer);
      revealHearts();
    }
  }, stepMs);

  function revealHearts() {
    heartEls.forEach((el, i) => {
      setTimeout(() => el.classList.add('show'), i * 550);
    });
    setTimeout(() => {
      doneEl.classList.add('show');
      setTimeout(fadeToBlackThenFinale, 900);
    }, heartEls.length * 550 + 300);
  }
}

function fadeToBlackThenFinale() {
  const blackout = document.getElementById('blackout');
  blackout.classList.add('show');
  setTimeout(() => {
    showScreen('screen-finale');
    runFinale();
    setTimeout(() => blackout.classList.remove('show'), 200);
  }, 1500);
}

function runFinale() {
  const photoWrap = document.querySelector('.finale-photo-wrap');
  const heartPath = document.getElementById('heart-path');
  const sentence = document.getElementById('finale-sentence');

  setTimeout(() => {
    photoWrap.classList.add('show');
    setTimeout(() => heartPath.classList.add('draw'), 500);
    setTimeout(() => sentence.classList.add('show'), 2200);
    setTimeout(() => {
      showScreen('screen-question');
      initDodgeButton();
    }, 5200);
  }, 400);
}

// ---- The question + dodging No button ----
const teaserLines = [
  'ברצינות?',
  'לא נראה לי...',
  'נסי שוב 😉',
  'זה לא יקרה',
  'כן זה מה שחשבתי',
  'תני לזה עוד ניסיון',
];
let dodgeCount = 0;

function initDodgeButton() {
  const noBtn = document.getElementById('btn-no');
  const yesBtn = document.getElementById('btn-yes');
  const teaser = document.getElementById('teaser-text');
  dodgeCount = 0;
  noBtn.classList.remove('dodging');
  noBtn.style.top = '';
  noBtn.style.left = '';
  noBtn.style.fontSize = '';
  yesBtn.style.fontSize = '';
  teaser.textContent = '';
  teaser.classList.remove('show');

  function dodge() {
    dodgeCount++;
    const rect = noBtn.getBoundingClientRect();
    const margin = 16;
    const maxLeft = window.innerWidth - rect.width - margin;
    const maxTop = window.innerHeight - rect.height - margin;
    const left = Math.max(margin, Math.random() * maxLeft);
    const top = Math.max(margin, Math.random() * maxTop);

    noBtn.classList.add('dodging');
    noBtn.style.left = left + 'px';
    noBtn.style.top = top + 'px';

    const shrink = Math.max(0.55, 1 - dodgeCount * 0.06);
    const grow = Math.min(1.6, 1 + dodgeCount * 0.05);
    noBtn.style.fontSize = (17 * shrink) + 'px';
    yesBtn.style.fontSize = (20 * grow) + 'px';

    teaser.textContent = teaserLines[Math.min(dodgeCount - 1, teaserLines.length - 1)];
    teaser.classList.add('show');
  }

  const dodgeHandler = (e) => {
    e.preventDefault();
    dodge();
  };
  noBtn.addEventListener('pointerenter', dodgeHandler);
  noBtn.addEventListener('pointerdown', dodgeHandler);
  noBtn.addEventListener('touchstart', dodgeHandler, { passive: false });

  yesBtn.onclick = () => {
    showScreen('screen-celebration');
    launchConfetti();
  };
}

// ---- Celebration confetti ----
function launchConfetti() {
  const layer = document.getElementById('confetti-layer');
  layer.innerHTML = '';
  const colors = ['#ffffff', '#ffd6e0', '#ffb6c9', '#ffe08a', '#c9a8ff'];
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.background = colors[i % colors.length];
    piece.style.animationDuration = (2.5 + Math.random() * 2.5) + 's';
    piece.style.animationDelay = (Math.random() * 1.5) + 's';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    layer.appendChild(piece);
  }
}
