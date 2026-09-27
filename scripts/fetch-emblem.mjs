// Dev tool: loads the official Foursquare Nigeria site in a real (windowed) Chrome with a
// throwaway profile, waits for its bot check to clear, then saves the official emblem PNG.
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9800 + Math.floor(Math.random() * 100);
const proc = spawn(CHROME, [`--remote-debugging-port=${port}`, `--user-data-dir=/tmp/emb-${port}`, '--window-size=500,400', '--no-first-run', '--no-default-browser-check', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let t; for (let i = 0; i < 80; i++) { try { t = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); if (t.find((x) => x.type === 'page')) break; } catch {} await sleep(250); }
const ws = new WebSocket(t.find((x) => x.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let n = 0; const pend = new Map();
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } });
const send = (method, params = {}) => new Promise((r) => { const id = ++n; pend.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const ev = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result.result?.value;
await send('Page.navigate', { url: 'https://foursquare.org.ng/' });
let ok = false;
for (let i = 0; i < 60; i++) { await sleep(1000); const title = await ev('document.title'); if (title && !/moment/i.test(title)) { ok = true; break; } }
console.log('passed check:', ok);
const b64 = await ev(`(async()=>{const img=new Image(); img.src='/site/cms/uploads/58629369_footer-logo.png'; await img.decode();
  const c=document.createElement('canvas'); c.width=img.naturalWidth; c.height=img.naturalHeight; c.getContext('2d').drawImage(img,0,0);
  return c.toDataURL('image/png').split(',')[1];})()`);
if (b64) { writeFileSync(new URL('../research/foursquare-logo-official-full.png', import.meta.url), Buffer.from(b64, 'base64')); console.log('saved', b64.length); }
ws.close(); proc.kill(); process.exit(0);
