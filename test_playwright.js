import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('ERROR:', error.message));
  await page.goto('https://www.tracefield.co.uk/');
  setTimeout(async () => {
    console.log('HTML:', await page.content());
    await browser.close();
  }, 5000);
})();
