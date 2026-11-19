/*
  Zonal user site: the guide's looping clips (figure.clip video). Local only, no libraries, no requests beyond the clips.
  A clip plays only while at least half of it is in view. With prefers-reduced-motion: reduce it never starts by itself;
  a click, or Enter or Space when it has the focus, plays or pauses it.
*/
(function () {
  var videos = document.querySelectorAll('figure.clip video');
  if (!videos.length) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function play(video) {
    var started = video.play();
    if (started && started.catch) started.catch(function () {});
  }
  function toggle(video) { if (video.paused) play(video); else video.pause(); }

  for (var i = 0; i < videos.length; i++) {
    (function (video) {
      video.addEventListener('click', function () { toggle(video); });
      if (reduce) {
        video.setAttribute('tabindex', '0');
        video.setAttribute('role', 'button');
        video.addEventListener('keydown', function (event) {
          if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(video); }
        });
      }
    })(videos[i]);
  }

  if (reduce || !('IntersectionObserver' in window)) return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) play(entry.target); else entry.target.pause();
    });
  }, { threshold: 0.5 });
  for (var j = 0; j < videos.length; j++) observer.observe(videos[j]);
})();
