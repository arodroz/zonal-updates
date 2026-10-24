/*
  Zonal user site: helpers for pages with an "On this page" list or FAQ questions. Local only, no requests.
  - A link to a question (#id on its <details>) opens that question.
  - The list marks the section being read with aria-current="location" (styled when it sits in the margin).
*/
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    function openTarget() {
      var target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target && target.tagName === 'DETAILS') target.open = true;
    }
    openTarget();
    window.addEventListener('hashchange', openTarget);

    var links = Array.prototype.slice.call(document.querySelectorAll('.toc a[href^="#"]'));
    var sections = links.map(function (a) { return document.getElementById(a.hash.slice(1)); });
    if (!links.length || sections.indexOf(null) !== -1) return;
    var queued = false;
    function mark() {
      queued = false;
      var current = 0;                 // the last section whose heading is above the line under the header
      for (var i = 0; i < sections.length; i++) if (sections[i].getBoundingClientRect().top <= 120) current = i;
      for (var j = 0; j < links.length; j++) {
        if (j === current) links[j].setAttribute('aria-current', 'location'); else links[j].removeAttribute('aria-current');
      }
    }
    window.addEventListener('scroll', function () { if (!queued) { queued = true; requestAnimationFrame(mark); } }, { passive: true });
    mark();
  });
})();
