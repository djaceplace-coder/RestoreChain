import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('response', response => {
    if (!response.ok()) console.log('NETWORK ERROR:', response.url(), response.status());
  });
  await page.goto('https://www.tracefield.co.uk/', { waitUntil: 'networkidle0' });
  await browser.close();
})();
