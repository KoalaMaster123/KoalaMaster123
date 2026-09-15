# Systime Capture

Two browser bookmarklets for pulling your own study notes out of Systime
i-bøger pages you've read, one page at a time, so you can hand a single
combined file to a Claude Project.

This only ever captures the page you're currently on when you click it —
nothing crawls or navigates automatically. You go through the pages
yourself, clicking **Capture** on each one you've read, then click
**Export** once at the end to get a single `.txt` file.

## What it does

- **Capture** (`capture.js`): reads the main text content of the current
  page, tries to download any illustrations on the page as separate image
  files, and stores everything in your browser's local storage (per site),
  building up a list as you visit more pages.
- **Export** (`export.js`): bundles everything captured so far into one
  `systime-notes.txt` file (with markers showing where each illustration
  belongs) and downloads it. It'll ask if you want to clear the saved
  pages afterwards so your next study session starts fresh.

Because illustrations can't live inside a `.txt` file, captured images are
downloaded next to it as their own files (e.g. `page-title_img1.png`), and
referenced by filename in the text. If an image can't be downloaded
automatically (some sites block this), the note falls back to just listing
its URL so you can grab it by hand if you want it.

## Install (one-time, ~2 minutes)

1. Make sure your browser's bookmarks bar is visible (Ctrl+Shift+B in
   Chrome/Edge, Ctrl+Shift+B in Firefox).
2. Right-click the bookmarks bar → **Add page** / **New bookmark**.
3. For the first bookmark:
   - Name: `Capture`
   - URL: paste the entire contents of [`capture.bookmarklet.txt`](./capture.bookmarklet.txt)
4. For the second bookmark:
   - Name: `Export`
   - URL: paste the entire contents of [`export.bookmarklet.txt`](./export.bookmarklet.txt)
5. Save both. You should now see **Capture** and **Export** buttons on
   your bookmarks bar.

## Using it

1. Go to a Systime page and read it as normal.
2. Click **Capture**. You'll get a small popup confirming how many pages
   you've saved so far, and any illustrations will start downloading.
3. Move to the next page, read it, click **Capture** again. Repeat for as
   many pages as you want.
4. When you're done for the session, click **Export**. This downloads
   `systime-notes.txt` (and you'll already have the image files from step 2
   in your Downloads folder).
5. Upload `systime-notes.txt` (and any image files you want to keep) to
   your Claude Project.

## Notes / limitations

- The content detector uses common selectors (`article`, `main`,
  `.content`, etc.) and falls back to the whole page if none match. If it
  grabs the wrong section (e.g. includes a sidebar or misses the actual
  text), tell me what the page's HTML structure looks like and I'll adjust
  the selector list.
- Captured data lives in that browser's local storage until you export and
  clear it, so use the same browser/profile for a whole capture session.
- This is meant for your own study use with content you have licensed
  access to — it only captures pages you personally visit and click on.
