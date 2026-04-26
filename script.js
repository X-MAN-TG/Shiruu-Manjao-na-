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
const waxSeal       = document.getElementById('waxSeal');
const envFlap       = document.getElementById('envFlap');
const envScene      = document.getElementById('envScene');
const envelopeScreen= document.getElementById('envelopeScreen');
const mainPage      = document.getElementById('mainPage');
const tapHint       = document.getElementById('tapHint');

let opened = false;

// Shimmer hint on seal
setTimeout(() => {
  waxSeal.style.boxShadow = '0 0 0 0 rgba(255,107,138,0)';
}, 200);

waxSeal.addEventListener('click', openEnvelope);
waxSeal.addEventListener('touchstart', (e) => { e.preventDefault(); openEnvelope(); }, { passive: false });

function openEnvelope() {
  if (opened) return;
  opened = true;

  // 1. Crack the wax seal
  waxSeal.classList.add('cracking');
  tapHint.style.opacity = '0';

  // 2. After seal is gone, flip the flap
  setTimeout(() => {
    envFlap.classList.add('open');
    // subtle bounce on envelope
    envScene.style.transition = 'transform .3s ease';
    envScene.style.transform  = 'scale(1.04)';
    setTimeout(() => { envScene.style.transform = 'scale(1)'; }, 300);
  }, 450);

  // 3. Envelope rises up and fades
  setTimeout(() => {
    envelopeScreen.style.transition = 'opacity .7s ease, transform .7s ease';
    envelopeScreen.style.transform  = 'translateY(-40px) scale(.95)';
    envelopeScreen.style.opacity    = '0';
  }, 1300);

  // 4. Reveal main page
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
        // stagger
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}


// ═══════════════════════════════════
//  VINYL PLAYER
// ═══════════════════════════════════
function initVinylPlayer() {
  const audioEl      = document.getElementById('voice-note');
  const playBtn      = document.getElementById('playBtn');
  const playIcon     = document.getElementById('playIcon');
  const vinylDisk    = document.getElementById('vinylDisk');
  const vinylGlow    = document.getElementById('vinylGlow');
  const progressFill = document.getElementById('progressFill');
  const progressWrap = document.getElementById('progressWrap');
  const bars         = document.querySelectorAll('.bar');
  const vnTip        = document.getElementById('vnTip');

  let isPlaying  = false;
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

  playBtn.addEventListener('click', () => {
    if (!audioEl.src || audioEl.src === window.location.href) {
      vnTip.textContent = '🎵 voicenote.mp3 file same folder mein daalo, Ayush!';
      vnTip.style.color = 'var(--rose)';
      return;
    }
    isPlaying ? audioEl.pause() : audioEl.play().catch(() => {
      vnTip.textContent = '⚠️ Audio load nahi hua — file path check karo 🥺';
    });
  });

  audioEl.addEventListener('play', () => {
    isPlaying = true;
    playIcon.textContent = '⏸';
    playIcon.classList.remove('paused');
    vinylDisk.classList.add('spinning');
    vinylGlow.classList.add('active');
    startBars();
    vnTip.textContent = '🎧 Sun rahi ho na Shriuu... 🥺💖';
  });

  audioEl.addEventListener('pause', () => {
    isPlaying = false;
    playIcon.textContent = '▶';
    playIcon.classList.add('paused');
    vinylDisk.classList.remove('spinning');
    vinylGlow.classList.remove('active');
    stopBars();
    vnTip.textContent = '▶ Play karo na princess... Billu ka dil bol raha hai 🥺';
  });

  audioEl.addEventListener('ended', () => {
    isPlaying = false;
    playIcon.textContent = '▶';
    playIcon.classList.add('paused');
    vinylDisk.classList.remove('spinning');
    vinylGlow.classList.remove('active');
    stopBars();
    progressFill.style.width = '0%';
    vnTip.textContent = '💝 Suna? Dil se tha... Man jao ab Shriuu 🥺👉🏻👈🏻';
  });

  audioEl.addEventListener('timeupdate', () => {
    if (audioEl.duration) {
      progressFill.style.width = (audioEl.currentTime / audioEl.duration * 100) + '%';
    }
  });

  progressWrap.addEventListener('click', (e) => {
    const r = progressWrap.getBoundingClientRect();
    if (audioEl.duration) audioEl.currentTime = ((e.clientX - r.left) / r.width) * audioEl.duration;
  });

  // Auto-play when vinyl section enters viewport
  let autoPlayed = false;
  const vnSection = document.querySelector('.vn-section');
  const vnObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !autoPlayed) {
        autoPlayed = true;
        setTimeout(() => {
          if (!isPlaying && audioEl.src && audioEl.src !== window.location.href) {
            audioEl.play().catch(() => {});
          }
        }, 700);
      }
    });
  }, { threshold: 0.55 });
  vnObs.observe(vnSection);
}
