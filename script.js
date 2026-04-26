// ── Floating Petals ──
const petalsContainer = document.querySelector('.petals-bg');
const petalEmojis = ['🌸', '🌺', '💮', '🌷', '💝', '💖', '✨', '🌼', '💗', '🌹'];

function createPetal() {
  const petal = document.createElement('div');
  petal.classList.add('petal');
  petal.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
  petal.style.left = Math.random() * 100 + 'vw';
  const duration = 6 + Math.random() * 8;
  const delay = Math.random() * 5;
  petal.style.animationDuration = duration + 's';
  petal.style.animationDelay = delay + 's';
  petal.style.fontSize = (1 + Math.random() * 0.8) + 'rem';
  petalsContainer.appendChild(petal);
  setTimeout(() => petal.remove(), (duration + delay) * 1000);
}

setInterval(createPetal, 600);
for (let i = 0; i < 8; i++) setTimeout(createPetal, i * 400);

// ── Scroll Reveal ──
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObs.observe(el));

// ── Vinyl Player ──
const audioEl       = document.getElementById('voice-note');
const playBtn       = document.getElementById('playBtn');
const playIcon      = document.getElementById('playIcon');
const vinylDisk     = document.getElementById('vinylDisk');
const progressFill  = document.getElementById('progressFill');
const progressWrap  = document.getElementById('progressWrap');
const bars          = document.querySelectorAll('.bar');
const vnTip         = document.getElementById('vnTip');

let isPlaying = false;

function startBars() {
  bars.forEach(b => {
    b.classList.add('active');
    const heights = [14, 28, 36, 22, 40, 48, 32, 44, 20, 36, 26, 42, 18, 30];
    const idx = Array.from(bars).indexOf(b);
    b.style.height = heights[idx] + 'px';
  });
}

function stopBars() {
  bars.forEach(b => {
    b.classList.remove('active');
    b.style.height = '5px';
  });
}

// Animate bars with random heights while playing
let barInterval;
function animateBars() {
  barInterval = setInterval(() => {
    bars.forEach(b => {
      const h = 6 + Math.random() * 44;
      b.style.height = h + 'px';
    });
  }, 150);
}

playBtn.addEventListener('click', () => {
  if (!audioEl.src || audioEl.src === window.location.href) {
    vnTip.textContent = '🎵 Upar voice note file link daalo pehle, Ayush!';
    vnTip.style.color = '#FF6B8A';
    return;
  }
  if (isPlaying) {
    audioEl.pause();
  } else {
    audioEl.play().catch(() => {
      vnTip.textContent = '⚠️ Voice note load nahi ho paa raha, file path check karo 🥺';
    });
  }
});

audioEl.addEventListener('play', () => {
  isPlaying = true;
  playIcon.textContent = '⏸';
  playIcon.classList.remove('paused');
  vinylDisk.classList.add('spinning');
  startBars();
  animateBars();
  vnTip.textContent = '🎧 Sun rahi ho na Shriuu... 🥺💖';
});

audioEl.addEventListener('pause', () => {
  isPlaying = false;
  playIcon.textContent = '▶';
  playIcon.classList.add('paused');
  vinylDisk.classList.remove('spinning');
  stopBars();
  clearInterval(barInterval);
  vnTip.textContent = '▶ Play karo na princess... Ayush ka dil bol raha hai 🥺';
});

audioEl.addEventListener('ended', () => {
  isPlaying = false;
  playIcon.textContent = '▶';
  playIcon.classList.add('paused');
  vinylDisk.classList.remove('spinning');
  stopBars();
  clearInterval(barInterval);
  progressFill.style.width = '0%';
  vnTip.textContent = '💝 Suna? Dil se bola tha... Man jao ab 🥺👉🏻👈🏻';
});

audioEl.addEventListener('timeupdate', () => {
  if (audioEl.duration) {
    const pct = (audioEl.currentTime / audioEl.duration) * 100;
    progressFill.style.width = pct + '%';
  }
});

progressWrap.addEventListener('click', (e) => {
  const rect = progressWrap.getBoundingClientRect();
  const ratio = (e.clientX - rect.left) / rect.width;
  if (audioEl.duration) audioEl.currentTime = ratio * audioEl.duration;
});

// ── Auto-play vinyl when section enters viewport ──
const vnSection = document.querySelector('.vn-section');
let autoPlayed = false;

const vnObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && !autoPlayed) {
      autoPlayed = true;
      // Gently start spinning disk visual even before play
      setTimeout(() => {
        if (!isPlaying && audioEl.src && audioEl.src !== window.location.href) {
          audioEl.play().catch(() => {});
        }
      }, 800);
    }
  });
}, { threshold: 0.5 });

vnObs.observe(vnSection);

// ── Tag hover sparkle ──
document.querySelectorAll('.tag').forEach(tag => {
  tag.addEventListener('mouseenter', () => {
    tag.style.background = 'linear-gradient(135deg, #fff0f3, #f9ecff)';
  });
  tag.addEventListener('mouseleave', () => {
    tag.style.background = 'white';
  });
});
