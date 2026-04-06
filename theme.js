(function () {
  var KEY = 'theme';

  function getTheme() {
    return localStorage.getItem(KEY) || 'light';
  }

  function applyTheme(t) {
    if (t === 'light') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', t);
    }
    localStorage.setItem(KEY, t);
    updateActive(t);
  }

  function updateActive(t) {
    document.querySelectorAll('.theme-option').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.theme === t);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('theme-btn');
    var dropdown = document.getElementById('theme-dropdown');
    if (!btn || !dropdown) return;

    updateActive(getTheme());

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });

    dropdown.querySelectorAll('.theme-option').forEach(function (opt) {
      opt.addEventListener('click', function () {
        applyTheme(opt.dataset.theme);
        dropdown.classList.remove('open');
      });
    });

    document.addEventListener('click', function () {
      dropdown.classList.remove('open');
    });

    dropdown.addEventListener('click', function (e) {
      e.stopPropagation();
    });

    var CYCLE = ['light', 'grey', 'dark', 'retro', 'amber'];
    document.addEventListener('keydown', function (e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
      if (e.code === 'KeyC' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        var current = getTheme();
        var idx = CYCLE.indexOf(current);
        applyTheme(CYCLE[(idx + 1) % CYCLE.length]);
        dropdown.classList.remove('open');
      }
    });
  });
})();
