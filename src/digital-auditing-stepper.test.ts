import { testWithDefaults } from '@haibun/core/build/lib/test/lib.js';
import WebPlaywright from '@haibun/web-playwright';
import StorageMem from '@haibun/storage-mem/build/storage-mem.js';
import DigitalAuditingStepper from './digital-auditing-stepper.js';
import { getStepperOptionName } from '@haibun/core/build/lib/util/index.js';
import { BrowserFactory } from '@haibun/web-playwright/build/BrowserFactory.js';
import { DEFAULT_DEST } from '@haibun/core/build/lib/defs.js';
import { readFileSync } from 'fs';
import DomainWebPage from '@haibun/domain-webpage';

const PASSES_URI = 'http://localhost:8123/static/passes.html';
const FAILS_URI = 'http://localhost:8123/static/passes.html';

const options = {
  DEST: DEFAULT_DEST
};

const extraOptions = {
  [getStepperOptionName(WebPlaywright, 'STORAGE')]: 'StorageMem',
  [getStepperOptionName(WebPlaywright, 'HEADLESS')]: 'true'
};

afterAll(async () => {
  await BrowserFactory.closeBrowsers();
});

describe('Digital Auditing tests', () => {
  it('passes', async () => {
    const features = [{
      path: '/features/test.feature', content: `
        serve files at /static from test
        Go to the ${PASSES_URI} webpage
        page is sustainable accepting audits server 90 and design 90
      `}];

    const res = await testWithDefaults(features, [DigitalAuditingStepper, WebPlaywright, DomainWebPage], { options, extraOptions });
    expect(res.ok).toBe(true);
  });

  it('fails', async () => {
    const features = [{
      path: '/features/test.feature', content: `
        serve files at /static from test
        Go to the ${FAILS_URI} webpage
        page is sustainable accepting audits server 90 and design 90
      `}];

    const res = await testWithDefaults(features, [DigitalAuditingStepper, WebPlaywright, DomainWebPage], { options, extraOptions });
    expect(res.ok).toBe(false);
  });
});

// run time tests are skipped for now

describe('generate report', () => {
  test('generates a report from failures.json', async () => {
    StorageMem.BASE_FS = {
      'failures.json': readFileSync('./test/failures.json', 'utf-8')
    }
    const features = [{ path: '/features/test.feature', content: `extract HTML report from failures.json to /report.html\nstorage entry /report.html exists` }];
    const res = await testWithDefaults(features, [DigitalAuditingStepper, WebPlaywright, DomainWebPage], { options, extraOptions: { ...extraOptions, [getStepperOptionName(DigitalAuditingStepper, DigitalAuditingStepper.STORAGE)]: 'StorageMem' } });
    expect(res.ok).toBe(true);
  })
})
