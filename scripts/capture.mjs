// Dev tool: screenshots the page at several scroll positions (headless Chrome via CDP).
// Usage: node scripts/capture.mjs [url] [width] [height] [step%] [count]
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';

const [url = 'http://localhost:5194', w = '1440', h = '900', step = '50', count = '40'] = process.argv.slice(2);
const OUT = new URL('../research/qc/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9500 + Math.floor(Math.random() * 400);
const proc = spawn(CHROME, ['--headless=new', '--hide-scrollbars', `--remote-debugging-port=${port}`, `--user-data-dir=/tmp/cap-${port}`, 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let t; for (let i = 0; i < 60; i++) { try { t = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(t.find((x) => x.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let n = 0; const pend = new Map(); const logs = [];
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } if (m.method === 'Runtime.exceptionThrown') logs.push(m.params.exceptionDetails.exception?.description?.slice(0, 300)); });
const send = (method, params = {}) => new Promise((r) => { const id = ++n; pend.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: +w, height: +h, deviceScaleFactor: 1, mobile: +w < 768 });
await send('Page.navigate', { url });
await sleep(9000);
const ev = async (expr) => (await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true })).result.result.value;
const total = await ev('document.documentElement.scrollHeight');
const vh = +h;
const shots = [];
for (let i = 0; i < +count; i++) {
  const y = Math.round((i * +step / 100) * vh);
  if (y > total - vh) break;
  await ev(`(window.__lenis ? window.__lenis.scrollTo(${y}, {immediate:true, force:true}) : window.scrollTo(0, ${y}), 1)`);
  await sleep(1400);
  const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 70 });
  const f = `${OUT}${w}_${String(i).padStart(2, '0')}.jpg`;
  writeFileSync(f, Buffer.from(s.result.data, 'base64'));
  shots.push(f);
}
console.log(JSON.stringify({ total, shots: shots.length, errors: logs }));
ws.close(); proc.kill(); process.exit(0);
