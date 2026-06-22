(function () {
  var KEY = 'theme';

  function getTheme() {
    return localStorage.getItem(KEY) === 'dark' ? 'dark' : 'light';
  }

  function applyTheme(t) {
    if (t === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem(KEY, t);
  }

  // ——— Subtle toggle sound (synthesized, no audio files) ———
  var audioCtx;

  function playToggle(toDark) {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    if (!audioCtx) audioCtx = new AC();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    var now = audioCtx.currentTime;

    // "Dry tock" — a tight bandpassed click transient with almost no tail,
    // plus a very short sine that glides up into light, down into dark.
    var len = Math.floor(audioCtx.sampleRate * 0.018);
    var buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    }
    var noiseSrc = audioCtx.createBufferSource();
    noiseSrc.buffer = buf;
    var noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 2900;
    noiseFilter.Q.value = 1.2;
    var noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.0001, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.16, now + 0.002);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);
    noiseSrc.connect(noiseFilter).connect(noiseGain).connect(audioCtx.destination);
    noiseSrc.start(now);
    noiseSrc.stop(now + 0.03);

    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(toDark ? 1500 : 1150, now);
    osc.frequency.exponentialRampToValueAtTime(toDark ? 900 : 1500, now + 0.025);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.06, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('theme-btn');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var next = getTheme() === 'dark' ? 'light' : 'dark';
      playToggle(next === 'dark');
      applyTheme(next);
    });
  });
})();
