const path = require('node:path');
const { chromium } = require('../../temp/marketing-tools/node_modules/playwright');

const root = path.resolve(__dirname, '../..');
const out = path.join(root, 'temp', 'proposals', 'skylimit');

async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    for (const stem of ['360Vision-SkyLimit-Proposal', '360Vision-Real-Estate-Proposal-Template']) {
      const page = await browser.newPage({ viewport: { width: 850, height: 1100 }, deviceScaleFactor: 1 });
      try {
        await page.goto(`file:///${path.join(out, stem + '.html').replaceAll('\\', '/')}`, { waitUntil: 'load' });
        await page.evaluate(() => document.fonts.ready);
        const problems = await page.locator('.content').evaluateAll(nodes => nodes.map((node, index) => ({
          page: index + 2,
          visible: node.clientHeight,
          needed: node.scrollHeight,
        })).filter(item => item.needed > item.visible + 2));
        if (problems.length) throw new Error(`${stem} content overflow: ${JSON.stringify(problems)}`);
        await page.pdf({ path: path.join(out, stem + '.pdf'), width: '8.5in', height: '11in', margin: { top: 0, right: 0, bottom: 0, left: 0 }, printBackground: true, preferCSSPageSize: true });
        const count = await page.locator('.page').count();
        if (stem === '360Vision-SkyLimit-Proposal') {
          for (let i = 0; i < count; i++) {
            await page.locator('.page').nth(i).screenshot({ path: path.join(out, `pdf-page-${i + 1}.png`) });
          }
        }
        console.log(`${stem}.pdf: ${count} pages`);
      } finally { await page.close(); }
    }
  } finally { await browser.close(); }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
