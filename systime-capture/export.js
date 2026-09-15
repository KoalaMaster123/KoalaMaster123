/**
 * Systime Export bookmarklet.
 *
 * Run this once you've captured all the pages you want (with capture.js).
 * It bundles everything saved in localStorage into one .txt file, downloads
 * it, and optionally clears the saved pages so the next study session
 * starts fresh.
 */
(function () {
  var STORAGE_KEY = 'systimeCaptureNotes';

  var raw = localStorage.getItem(STORAGE_KEY);
  var pages = raw ? JSON.parse(raw) : [];

  if (!pages.length) {
    alert('No captured pages found yet. Use the Capture bookmarklet on a page first.');
    return;
  }

  var lines = [];
  pages.forEach(function (p, i) {
    lines.push('===== Page ' + (i + 1) + ': ' + p.title + ' =====');
    lines.push('URL: ' + p.url);
    lines.push('');
    lines.push(p.text);
    if (p.images && p.images.length) {
      lines.push('');
      lines.push('Illustrations on this page:');
      p.images.forEach(function (note) {
        lines.push(note);
      });
    }
    lines.push('');
    lines.push('');
  });

  var blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'systime-notes.txt';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(function () {
    URL.revokeObjectURL(url);
  }, 5000);

  if (
    confirm(
      'Downloaded systime-notes.txt with ' +
        pages.length +
        ' page(s).\n\nClear saved pages now to start fresh next time?'
    )
  ) {
    localStorage.removeItem(STORAGE_KEY);
  }
})();
