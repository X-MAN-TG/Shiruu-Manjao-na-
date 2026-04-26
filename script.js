// ═══════════════════════════════════
//  FLOATING PETALS
// ═══════════════════════════════════
const petalsContainer = document.querySelector('.petals-bg');
const petalEmojis = ['🌸','🌺','💮','🌷','💝','💖','✨','🌼','💗','🌹','🫧','💫'];

function createPetal() {
  const p = document.createElement('div');
  p.classList.add('petal');
  p.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
  p.style.left = Math.random() * 100 + 'vw';
  const dur = 6 + Math.random() * 9;
  const del = Math.random() * 4;
  p.style.animationDuration = dur + 's';
  p.style.animationDelay   = del + 's';
  p.style.fontSize = (1 + Math.random() * .9) + 'rem';
  petalsContainer.appendChild(p);
  setTimeout(() => p.remove(), (dur + del) * 1000);
}
setInterval(createPetal, 550);
for (let i = 0; i < 10; i++) setTimeout(createPetal, i * 350);


// ═══════════════════════════════════
//  ENVELOPE OPEN LOGIC
// ═══════════════════════════════════
const waxSeal        = document.getElementById('waxSeal');
const envFlap        = document.getElementById('envFlap');
const envScene       = document.getElementById('envScene');
const envelopeScreen = document.getElementById('envelopeScreen');
const mainPage       = document.getElementById('mainPage');
const tapHint        = document.getElementById('tapHint');

let opened = false;

waxSeal.addEventListener('click', openEnvelope);
waxSeal.addEventListener('touchstart', (e) => { e.preventDefault(); openEnvelope(); }, { passive: false });

function openEnvelope() {
  if (opened) return;
  opened = true;

  waxSeal.classList.add('cracking');
  tapHint.style.opacity = '0';

  setTimeout(() => {
    envFlap.classList.add('open');
    envScene.style.transition = 'transform .3s ease';
    envScene.style.transform  = 'scale(1.04)';
    setTimeout(() => { envScene.style.transform = 'scale(1)'; }, 300);
  }, 450);

  setTimeout(() => {
    envelopeScreen.style.transition = 'opacity .7s ease, transform .7s ease';
    envelopeScreen.style.transform  = 'translateY(-40px) scale(.95)';
    envelopeScreen.style.opacity    = '0';
  }, 1300);

  setTimeout(() => {
    envelopeScreen.style.display = 'none';
    mainPage.classList.remove('hidden');
    mainPage.classList.add('reveal-in');
    initScrollReveal();
    initVinylPlayer();
  }, 2000);
}


// ═══════════════════════════════════
//  SCROLL REVEAL
// ═══════════════════════════════════
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}


// ═══════════════════════════════════
//  VINYL PLAYER — BULLETPROOF VERSION
// ═══════════════════════════════════
function initVinylPlayer() {
  const playBtn      = document.getElementById('playBtn');
  const playIcon     = document.getElementById('playIcon');
  const vinylDisk    = document.getElementById('vinylDisk');
  const vinylGlow    = document.getElementById('vinylGlow');
  const progressFill = document.getElementById('progressFill');
  const progressWrap = document.getElementById('progressWrap');
  const bars         = document.querySelectorAll('.bar');
  const vnTip        = document.getElementById('vnTip');

  // JUGAD: Create Audio object directly in JS — bypasses all HTML src issues
  const audio = new Audio('voicenote.mp3');
  audio.preload = 'auto';

  let isPlaying = false;
  let barInterval;

  function startBars() {
    bars.forEach(b => b.classList.add('active'));
    barInterval = setInterval(() => {
      bars.forEach(b => { b.style.height = (5 + Math.random() * 46) + 'px'; });
    }, 140);
  }

  function stopBars() {
    clearInterval(barInterval);
    bars.forEach(b => { b.classList.remove('active'); b.style.height = '5px'; });
  }

  audio.addEventListener('play', () => {
    isPlaying = true;
    playIcon.textContent = '⏸';
    playIcon.classList.remove('paused');
    vinylDisk.classList.add('spinning');
    vinylGlow.classList.add('active');
    startBars();
    vnTip.textContent = '🎧 Sun rahi ho na Shriuu... 🥺💖';
  });

  audio.addEventListener('pause', () => {
    isPlaying = false;
    playIcon.textContent = '▶';
    playIcon.classList.add('paused');
    vinylDisk.classList.remove('spinning');
    vinylGlow.classList.remove('active');
    stopBars();
    vnTip.textContent = '▶ Play karo na princess... Billu ka dil bol raha hai 🥺';
  });

  audio.addEventListener('ended', () => {
    isPlaying = false;
    playIcon.textContent = '▶';
    playIcon.classList.add('paused');
    vinylDisk.classList.remove('spinning');
    vinylGlow.classList.remove('active');
    stopBars();
    progressFill.style.width = '0%';
    vnTip.textContent = '💝 Suna? Dil se tha... Man jao ab Shriuu 🥺👉🏻👈🏻';
  });

  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      progressFill.style.width = (audio.currentTime / audio.duration * 100) + '%';
    }
  });

  // Play button — direct user tap, browser always allows this
  playBtn.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => {
        vnTip.textContent = '⚠️ File mil nahi rahi — voicenote.mp3 same folder mein hai? 🥺';
        vnTip.style.color = 'var(--rose)';
        console.error('Audio error:', err);
      });
    }
  });

  // Progress bar scrubbing
  progressWrap.addEventListener('click', (e) => {
    const r = progressWrap.getBoundingClientRect();
    if (audio.duration) {
      audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
    }
  });
}
