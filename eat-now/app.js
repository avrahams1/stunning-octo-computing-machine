// ---- Background floating food emojis ----
(function bgFood() {
  const wrap = document.getElementById('bg-food');
  const emojis = ['🍕', '🍔', '🌭', '🍟', '🍩', '🌮'];
  for (let i = 0; i < 14; i++) {
    const s = document.createElement('span');
    s.textContent = emojis[i % emojis.length];
    s.style.left = Math.random() * 100 + '%';
    s.style.fontSize = (18 + Math.random() * 18) + 'px';
    s.style.animationDuration = (9 + Math.random() * 10) + 's';
    s.style.animationDelay = (Math.random() * 8) + 's';
    wrap.appendChild(s);
  }
})();

// ---- The question + dodging No button ----
const teaserLines = [
  'בטוחה?? 😳',
  'הבטן שלי כבר בוכה 😭',
  'שומעת את זה? קרררר... 👂',
  'לא, זו לא אופציה 🚫',
  'גם ה"לא" רעב, בגלל זה הוא בורח 🏃💨',
  'תפסיקי לרדוף אחרי ה"לא" ותרדפי אחרי אוכל 🍕',
];
let dodgeCount = 0;

function initDodgeButton() {
  const noBtn = document.getElementById('btn-no');
  const yesBtn = document.getElementById('btn-yes');
  const teaser = document.getElementById('teaser-text');

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

    const shrink = Math.max(0.5, 1 - dodgeCount * 0.06);
    const grow = Math.min(1.7, 1 + dodgeCount * 0.06);
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
    document.getElementById('screen-question').classList.remove('active');
    document.getElementById('screen-celebration').classList.add('active');
    launchConfetti();
  };
}
initDodgeButton();

// ---- Celebration confetti (food emoji) ----
function launchConfetti() {
  const layer = document.getElementById('confetti-layer');
  layer.innerHTML = '';
  const emojis = ['🍕', '🍔', '🌭', '🍟', '🍩', '🎉'];
  for (let i = 0; i < 50; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.textContent = emojis[i % emojis.length];
    piece.style.left = Math.random() * 100 + '%';
    piece.style.fontSize = (16 + Math.random() * 14) + 'px';
    piece.style.animationDuration = (2.2 + Math.random() * 2.2) + 's';
    piece.style.animationDelay = (Math.random() * 1.2) + 's';
    layer.appendChild(piece);
  }
}
