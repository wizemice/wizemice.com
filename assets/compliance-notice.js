/**
 * First-visit notice: links to Privacy Policy; stores dismissal in localStorage only.
 */
(function () {
  var KEY = 'wizemice_compliance_notice_v1';
  var wrap = document.getElementById('site-compliance-notice');
  var btn = document.getElementById('site-compliance-notice-ok');
  if (!wrap || !btn) return;

  try {
    if (window.localStorage && window.localStorage.getItem(KEY) === '1') return;
  } catch (_e) {
    /** Private mode etc.: show notice every visit */
  }

  wrap.removeAttribute('hidden');

  btn.addEventListener('click', function () {
    wrap.setAttribute('hidden', '');
    try {
      if (window.localStorage) window.localStorage.setItem(KEY, '1');
    } catch (_e) {}
  });
})();
