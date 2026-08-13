# Marriage proposal site

Client-only, static (HTML/CSS/JS, no build step, no backend). Hebrew RTL memory
game (4x4, 8 photo pairs) that leads into a loading/reveal sequence and a
proposal question. Files: `index.html`, `style.css`, `app.js`, `images/`.

## Local testing on an iPhone

Start a static server bound to all interfaces (not just localhost) so a phone
on the same Wi-Fi can reach it:

```
python3 -m http.server 8080 --bind 0.0.0.0
```

Get this Mac's LAN IP: `ipconfig getifaddr en0` (or `en1`). Open
`http://<that-ip>:8080/` in Safari on the iPhone — same Wi-Fi network required,
not cellular.

Append `?debug=1` to the URL to reveal a small debug button that skips
straight to the win sequence (loading → finale photo → question →
celebration), instead of manually matching all 8 pairs every time.

Kill the server when done: `pkill -f "http.server 8080"`.

## Browser testing (Playwright MCP)

**Always call `mcp__playwright__browser_close` (kill the Playwright session)
as soon as verification is done — never leave it running at the end of a
turn.**

## Remaining work

- Decide which photo is the finale "favorite photo" reveal. Currently a
  placeholder (`images/finale.jpg`, copied from IMG_2961). Swap that file, or
  change the `FINALE_PHOTO` constant in `app.js`, once a final choice is made.
- Polish/finalize the Hebrew wording (intro subtitle, finale sentence,
  question text, teaser lines while dodging "No", celebration text) — current
  copy is generic/placeholder phrasing.
- Deploy: connect the GitHub repo
  (avrahams1/stunning-octo-computing-machine) to Vercel, or enable GitHub
  Pages, to get a real hosted URL. Not yet done — currently only tested via
  local server.
