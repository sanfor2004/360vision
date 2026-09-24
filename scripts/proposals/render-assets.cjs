const fs = require('node:fs/promises');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { chromium } = require('../../temp/marketing-tools/node_modules/playwright');
const ffmpeg = require('../../temp/marketing-tools/node_modules/ffmpeg-static');

const root = path.resolve(__dirname, '../..');
const out = path.join(root, 'temp', 'proposals', 'skylimit');
const marketing = path.join(root, 'public', 'markting');

async function dataUri(filename) {
  const bytes = await fs.readFile(filename);
  const mime = filename.endsWith('.png') ? 'image/png' : 'image/webp';
  return `data:${mime};base64,${bytes.toString('base64')}`;
}

function coverHtml(viewer, lifestyle, format, generic = false) {
  const preview = format === 'preview';
  const width = preview ? 1080 : 1700;
  const height = preview ? 1350 : 2200;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    *{box-sizing:border-box}html,body{margin:0;width:${width}px;height:${height}px}
    body{font-family:Arial,Helvetica,sans-serif;background:#071a33;color:#f5fbff;overflow:hidden}
    .page{position:relative;width:100%;height:100%;overflow:hidden;background:radial-gradient(circle at 83% 17%,#164b62 0,#071a33 43%,#06111f 100%)}
    .photo{position:absolute;inset:0 0 auto 0;height:${preview ? 650 : 1080}px;background-image:linear-gradient(180deg,rgba(7,26,51,.07),#071a33 92%),linear-gradient(90deg,#071a33 3%,rgba(7,26,51,.2) 75%),url('${lifestyle}');background-position:center;background-size:cover;opacity:.72}
    .orbit{position:absolute;width:${preview ? 900 : 1450}px;height:${preview ? 900 : 1450}px;left:${preview ? 505 : 785}px;top:${preview ? -420 : -680}px;border:2px solid rgba(22,199,232,.22);border-radius:50%}
    .top{position:absolute;top:${preview ? 62 : 125}px;left:${preview ? 60 : 110}px;right:${preview ? 60 : 110}px;display:flex;justify-content:space-between;align-items:center}
    .brand{font-size:${preview ? 33 : 47}px;font-weight:800;letter-spacing:-1.8px}.brand b{color:#75e5f4}.eyebrow{font-size:${preview ? 15 : 21}px;letter-spacing:4px;color:#93c4d6;font-weight:700}
    .copy{position:absolute;left:${preview ? 60 : 110}px;right:${preview ? 60 : 110}px;top:${preview ? 250 : 400}px}
    .kicker{font-size:${preview ? 19 : 26}px;letter-spacing:4px;color:#78deef;font-weight:800;text-transform:uppercase}
    h1{font-size:${preview ? 77 : 116}px;line-height:.99;letter-spacing:-5px;margin:${preview ? 29 : 47}px 0 ${preview ? 31 : 48}px;font-weight:800;max-width:1450px}
    h1 em{color:#83e7f3;font-style:normal}
    .sub{font-size:${preview ? 27 : 39}px;line-height:1.36;color:#d7eaf0;max-width:1280px;margin:0}
    .screen{position:absolute;left:${preview ? 60 : 110}px;right:${preview ? 310 : 300}px;top:${preview ? 690 : 1030}px;border:2px solid rgba(185,236,245,.56);box-shadow:0 35px 90px rgba(0,0,0,.45);border-radius:${preview ? 22 : 32}px;overflow:hidden;background:#0d2e5f}
    .screen img{width:100%;display:block}.screen small{display:block;padding:${preview ? 13 : 20}px ${preview ? 22 : 32}px;background:#0a223e;color:#c7e1ea;font-size:${preview ? 15 : 23}px;letter-spacing:1.3px;text-transform:uppercase}
    .bottom{position:absolute;left:${preview ? 60 : 110}px;right:${preview ? 60 : 110}px;bottom:${preview ? 55 : 124}px;display:flex;justify-content:space-between;align-items:end;border-top:2px solid rgba(146,202,219,.42);padding-top:${preview ? 23 : 38}px}
    .bottom strong{display:block;font-size:${preview ? 23 : 34}px}.bottom span{display:block;color:#aac5d5;font-size:${preview ? 17 : 27}px;margin-top:11px}.bottom .right{text-align:right}
    </style></head><body><div class="page"><div class="photo"></div><div class="orbit"></div><div class="top"><div class="brand"><b>360</b>Vision</div><div class="eyebrow">PRIVATE PROPOSAL</div></div><div class="copy"><div class="kicker">A real-estate growth opportunity</div><h1>Show the space.<br><em>Start the conversation.</em></h1><p class="sub">A funded build proposal for turning immersive property tours into a practical path from buyer interest to agent follow-up.</p></div><div class="screen"><img src="${viewer}" alt="Real 360Vision viewer"><small>Working 360Vision viewer · Cedar House demonstration</small></div><div class="bottom"><div><strong>${generic ? 'Prepared for property teams' : 'Prepared for Orel David'}</strong><span>${generic ? 'Real-estate growth proposal' : 'SkyLimit LLC'} · September 2026</span></div><div class="right"><strong>Ahmed Abdelaziz</strong><span>Creator of 360Vision</span></div></div></div></body></html>`;
}

function endHtml(viewer) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  *{box-sizing:border-box}html,body{margin:0;width:1080px;height:1920px}body{font-family:Arial,Helvetica,sans-serif;color:#f5fbff;background:radial-gradient(circle at 85% 15%,#145369,#071a33 48%,#06121f)}.wrap{padding:100px 78px;height:100%;position:relative}.brand{font-weight:800;font-size:47px}.brand b{color:#80e6f3}.line{height:5px;width:165px;background:#16c7e8;margin:185px 0 55px}h1{font-size:91px;line-height:1.05;letter-spacing:-4px;margin:0}h1 em{color:#8cebf4;font-style:normal}p{font-size:37px;line-height:1.35;color:#d1e8ed;margin:54px 0}.screen{margin-top:80px;border:2px solid #79b9c7;border-radius:20px;overflow:hidden;box-shadow:0 35px 80px #0008}.screen img{width:100%;display:block}.footer{position:absolute;left:78px;right:78px;bottom:105px;border-top:2px solid #467383;padding-top:35px;font-size:32px}.footer strong{color:#8cebf4}
  </style></head><body><div class="wrap"><div class="brand"><b>360</b>Vision</div><div class="line"></div><h1>Let’s build the next way to <em>show property.</em></h1><p>Orel, let’s meet this week about a funded real-estate pilot for SkyLimit.</p><div class="screen"><img src="${viewer}" alt="Real 360Vision viewer"></div><div class="footer">Ahmed Abdelaziz · <strong>360Vision</strong></div></div></body></html>`;
}

async function screenshot(browser, html, target, width, height) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  try {
    await page.setContent(html, { waitUntil: 'load' });
    await page.screenshot({ path: target });
  } finally { await page.close(); }
}

async function main() {
  await fs.mkdir(out, { recursive: true });
  const viewer = await dataUri(path.join(marketing, 'screenshots', 'viewer-desktop.png'));
  const lifestyle = await dataUri(path.join(marketing, 'images', 'lifestyle-original.png'));
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    await screenshot(browser, coverHtml(viewer, lifestyle, 'letter'), path.join(out, 'cover-letter.png'), 1700, 2200);
    await screenshot(browser, coverHtml(viewer, lifestyle, 'letter', true), path.join(out, 'cover-generic-letter.png'), 1700, 2200);
    await screenshot(browser, coverHtml(viewer, lifestyle, 'preview'), path.join(out, 'whatsapp-cover.png'), 1080, 1350);
    await screenshot(browser, endHtml(viewer), path.join(out, 'video-endcard.png'), 1080, 1920);
  } finally { await browser.close(); }
  const source = path.join(marketing, 'video', '360vision-portrait.mp4');
  const video = path.join(out, '360vision-skylimit-preview.mp4');
  const run = spawnSync(ffmpeg, [
    '-hide_banner', '-loglevel', 'error', '-y',
    '-i', source, '-loop', '1', '-t', '4', '-i', path.join(out, 'video-endcard.png'),
    '-filter_complex', '[0:v]trim=duration=20,setpts=PTS-STARTPTS[v0];[1:v]fps=24,format=yuv420p,setpts=PTS-STARTPTS[v1];[v0][v1]concat=n=2:v=1:a=0[out]',
    '-map', '[out]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '23', '-pix_fmt', 'yuv420p', '-r', '24', '-movflags', '+faststart', '-an', video,
  ], { encoding: 'utf8', maxBuffer: 1024 * 1024 * 8 });
  if (run.status !== 0) throw new Error(run.stderr || `ffmpeg failed: ${run.status}`);
  console.log(out);
}

main().catch(error => { console.error(error); process.exitCode = 1; });
