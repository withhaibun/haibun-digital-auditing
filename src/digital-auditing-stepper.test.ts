import { testWithDefaults } from '@haibun/core/build/lib/test/lib.js';
import WebPlaywright from '@haibun/web-playwright';
import { BrowserFactory } from '@haibun/web-playwright/build/BrowserFactory.js';
import StorageMem from '@haibun/storage-mem/build/storage-mem.js';
import DigitalAuditingStepper from './digital-auditing-stepper.js';

const options = {};
const extraOptions = {
  'WebPlaywright.HEADLESS': 'true',
};

afterAll(async () => {
  await BrowserFactory.closeBrowsers();
});

describe('digital auditing test', () => {
  it('runs digital auditing successfully', async () => {
    const res = await testWithDefaults([], [DigitalAuditingStepper, WebPlaywright, StorageMem], { options, extraOptions });
    expect(res.ok).toBe(true);
  });
});
