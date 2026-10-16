import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const scripts = [...html.matchAll(/<script\\b([^>]*)>([\\s\\S]*?)<\\/script>/gi)]
  .filter(([, attrs, body]) => !/\\bsrc\\s*=/.test(attrs) && body.trim());

assert.ok(scripts.length > 0, 'Expected at least one inline JavaScript block');
for (const [, attrs, body] of scripts) {
  new vm.Script(body, { filename: 'index.html:inline-script' });
}

const required = [
  'function isValidDateKey(value)',
  'function validateBackup(data)',
  'function importBackup(event)',
  'function getChartData(period=chartPeriod)',
  'function saveDashboardWidgetOrderFromDOM()',
  'function renderCashflowForecast()',
  'data-widget="forecast"',
  'function ensurePdfJsLoaded()',
];
for (const token of required) assert.ok(html.includes(token), `Missing expected app feature: ${token}`);

console.log(`FinTrack syntax check passed (${scripts.length} inline script block(s)).`);
