const { test, _electron: electron } = require('@playwright/test');

test('screenshot test', async () => {
  const electronApp = await electron.launch({ args: ['release/app/dist/main/main.js'] });
  const window = await electronApp.firstWindow();
  await window.screenshot({ path: 'jules-scratch/verification/screenshot.png' });
  await electronApp.close();
});
