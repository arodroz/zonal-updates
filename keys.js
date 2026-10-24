/*
  Zonal user site: key-label switch. Local only, no libraries, no requests.
  Modifier keys are written as symbols, one per <kbd>. This script gives each one
  a name and lets the header switch show either the symbol or the name.
    <html data-keys="names">   Names mode (absent = Symbols, the default)
  The choice is kept in localStorage; storage can throw or be empty, so every access is guarded.
*/
(function () {
  var root = document.documentElement, KEY = 'zonal-key-labels';
  var NAMES = { '⌃': ['Control', 'Control'], '⌥': ['Option', 'Option (Alt)'], '⇧': ['Shift', 'Shift'], '⌘': ['Command', 'Command (Win)'] };

  function show(mode) {              // mode: 'symbols' | 'names'
    if (mode === 'names') root.setAttribute('data-keys', 'names'); else root.removeAttribute('data-keys');
    var buttons = document.querySelectorAll('.keys-toggle button');
    for (var i = 0; i < buttons.length; i++) buttons[i].setAttribute('aria-pressed', String(buttons[i].getAttribute('data-keys') === mode));
  }

  var saved = 'symbols';
  try { if (localStorage.getItem(KEY) === 'names') saved = 'names'; } catch (e) {}
  show(saved);                       // runs in <head>, before first paint

  document.addEventListener('DOMContentLoaded', function () {
    var keys = document.querySelectorAll('kbd');
    for (var i = 0; i < keys.length; i++) {
      var n = NAMES[keys[i].textContent];
      if (!n) continue;
      // Both labels as spans (CSS shows one); the kbd is an image with the plain name, so it is read once.
      keys[i].innerHTML = '<span class="k-sym" aria-hidden="true">' + keys[i].textContent + '</span><span class="k-name" aria-hidden="true">' + n[1] + '</span>';
      keys[i].setAttribute('role', 'img');
      keys[i].setAttribute('aria-label', n[0]);
    }
    var switches = document.querySelectorAll('.js-only');
    for (var j = 0; j < switches.length; j++) switches[j].hidden = false;
    var buttons = document.querySelectorAll('.keys-toggle button');
    for (var b = 0; b < buttons.length; b++) buttons[b].addEventListener('click', function () {
      var mode = this.getAttribute('data-keys');
      show(mode);
      try { localStorage.setItem(KEY, mode); } catch (e) {}
    });
    show(saved);
  });
})();
