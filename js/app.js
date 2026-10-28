// 화면 예시: 탭·이전/다음 단추로 앱 화면을 바꿔 보여 줍니다.
(function () {
  var viewer = document.querySelector('[data-viewer]');
  if (!viewer) return;
  var tabs = Array.prototype.slice.call(viewer.querySelectorAll('[role="tab"]'));
  var shots = Array.prototype.slice.call(viewer.querySelectorAll('.shot'));
  var panel = document.getElementById('viewer-panel');
  var img = document.getElementById('viewer-img');
  var count = document.getElementById('viewer-count');
  var current = 0;

  function show(i, focus) {
    current = (i + tabs.length) % tabs.length;
    var key = tabs[current].dataset.shot;
    tabs.forEach(function (t, n) {
      var on = n === current;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    shots.forEach(function (s) {
      var on = s.dataset.for === key;
      s.hidden = !on;
      if (on) {
        img.src = s.dataset.img;
        img.alt = s.dataset.alt;
      }
    });
    panel.setAttribute('aria-labelledby', tabs[current].id);
    count.textContent = (current + 1) + ' / ' + tabs.length;
    if (focus) tabs[current].focus();
  }

  tabs.forEach(function (t, n) {
    t.addEventListener('click', function () { show(n); });
    t.addEventListener('keydown', function (e) {
      var to = { ArrowRight: current + 1, ArrowLeft: current - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (to === undefined) return;
      e.preventDefault();
      show(to, true);
    });
  });
  viewer.querySelectorAll('[data-step]').forEach(function (b) {
    b.addEventListener('click', function () { show(current + Number(b.dataset.step)); });
  });

  // 처음 그린 뒤 나머지 화면을 미리 받아 두어 바꿀 때 깜박이지 않게 합니다.
  window.addEventListener('load', function () {
    shots.forEach(function (s) { new Image().src = s.dataset.img; });
  });
})();
