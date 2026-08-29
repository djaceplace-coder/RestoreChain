import { JSDOM } from 'jsdom';
import fs from 'fs';

JSDOM.fromURL('https://www.tracefield.co.uk/', {
  runScripts: 'dangerously',
  resources: 'usable'
}).then(dom => {
  dom.window.document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      console.log('HTML:', dom.window.document.body.innerHTML.substring(0, 500));
      console.log('ERRORS:', dom.window._errors || 'No captured errors');
    }, 2000);
  });
}).catch(err => {
  console.error(err);
});
