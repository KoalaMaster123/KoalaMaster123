/**
 * Systime Capture bookmarklet.
 *
 * Run this on a Systime i-bog page you've just finished reading. It grabs the
 * main text content, tries to download any illustrations on the page, and
 * stores the page's notes in localStorage so multiple pages accumulate
 * before you export them all as one file with export.js.
 */
(async function () {
  var STORAGE_KEY = 'systimeCaptureNotes';

  var CONTENT_SELECTORS = [
    'article',
    'main',
    '[role="main"]',
    '.content',
    '#content',
    '.book-content',
    '.ibog-content',
    '.page-content'
  ];

  function findContent() {
    for (var i = 0; i < CONTENT_SELECTORS.length; i++) {
      var el = document.querySelector(CONTENT_SELECTORS[i]);
      if (el && el.innerText && el.innerText.trim().length > 200) {
        return el;
      }
    }
    return document.body;
  }

  function sanitizeFilename(name) {
    return name.replace(/[^a-z0-9\-_. ]/gi, '_').slice(0, 60);
  }

  function downloadBlob(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 5000);
  }

  async function captureImages(images, pageTitle) {
    var notes = [];
    for (var i = 0; i < images.length; i++) {
      var img = images[i];
      var alt = img.alt || 'figure ' + (i + 1);
      var filename = sanitizeFilename(pageTitle) + '_img' + (i + 1) + '.png';
      try {
        var resp = await fetch(img.src, { mode: 'cors' });
        if (!resp.ok) {
          throw new Error('bad response');
        }
        var blob = await resp.blob();
        downloadBlob(blob, filename);
        notes.push('[Image ' + (i + 1) + ': ' + filename + ' — ' + alt + ']');
      } catch (e) {
        notes.push(
          '[Image ' + (i + 1) + ' could not be auto-downloaded (' + alt + '): ' + img.src + ']'
        );
      }
    }
    return notes;
  }

  function getExisting() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function save(pages) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
  }

  var content = findContent();
  var title = document.title || location.href;
  var text = content.innerText.trim();

  var images = Array.prototype.slice
    .call(content.querySelectorAll('img'))
    .filter(function (img) {
      return img.naturalWidth > 80 && img.naturalHeight > 80;
    });

  var imageNotes = await captureImages(images, title);

  var pages = getExisting();
  pages.push({
    title: title,
    url: location.href,
    text: text,
    images: imageNotes,
    capturedAt: new Date().toISOString()
  });
  save(pages);

  alert(
    'Captured "' +
      title +
      '"\n' +
      pages.length +
      ' page(s) saved so far.\n\nGo to the next page and click Capture again, or click Export when you\'re done.'
  );
})();
