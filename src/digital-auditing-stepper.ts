import { AStepper, TWorld, TNamed, IHasOptions, OK, TVStep } from '@haibun/core/build/lib/defs.js';
import { actionNotOK, findStepper, findStepperFromOption, stringOrError } from '@haibun/core/build/lib/util/index.js';
import { Page, chromium } from 'playwright';
import { getDigitalAuditingResults } from './lib/digital-auditing.js';
import { generateHTMLDigitalAuditingReport } from './lib/report.js'; // to be added in report.ts 
import { AStorage } from '@haibun/domain-storage/build/AStorage.js';
import { EMediaTypes } from '@haibun/domain-storage/build/domain-storage.js';
import { TArtifactMessageContext } from '@haibun/core/build/lib/interfaces/logger.js';

type TGetsPage = { getPage: () => Promise<Page> };

class DigitalAuditingStepper extends AStepper implements IHasOptions {
  static STORAGE = 'STORAGE';
  options = {
    [DigitalAuditingStepper.STORAGE]: {
      desc: 'Storage for results',
      parse: (input: string) => stringOrError(input),
    },
  };
  pageGetter?: TGetsPage;
  steppers: AStepper[] = [];
  async setWorld(world: TWorld, steppers: AStepper[]) {
    await super.setWorld(world, steppers);
    this.pageGetter = findStepper<TGetsPage>(steppers, 'WebPlaywright');
    this.steppers = steppers;
  }

  steps = {
    checkDigitalSustainabilityRuntime: {
      gwta: `page is sustainable accepting server {90} and design {90}`,
      action: async ({ server, design }: TNamed, step: TVStep) => {
        const page = await this.pageGetter?.getPage();
        if (!page) {
          return actionNotOK(`no page in runtime`);
        }
        return await this.checkDigitalSustainability(page, server!, design!, step);
      },
    },

    checkDigitalSustainableWithUri: {
      gwta: `page at {uri} is  sustainable accepting server {90} and design {90}`,
      action: async ({ uri, server, design }: TNamed, step: TVStep) => {
        const browser = await chromium.launch();
        const page: Page = await browser.newPage();
        await page.goto(uri!);
        const result = await this.checkDigitalSustainability(page, server!, design!, step);

        //can be added in later
        //page.close();
        //browser.close();
        return result;
      },
    },
    generateHTMLReport: {
      gwta: `extract HTML report from {source} to {dest}`,
      action: async ({ source, dest }: TNamed) => {
        const storage = findStepperFromOption<AStorage>(this.steppers, this, this.getWorld().extraOptions, DigitalAuditingStepper.STORAGE);
        const json = JSON.parse(storage.readFile(source!));
        const report = generateHTMLDigitalAuditingReport(json);
        await storage.writeFile(dest!, report, EMediaTypes.html);
        return OK;
      },
    },
  };

async checkDigitalSustainability(page: Page, server: string, design: string, step: TVStep) {
  try {
    const digitalAuditingResults = await getDigitalAuditingResults(page);
    const report = generateHTMLDigitalAuditingReport(digitalAuditingResults, {
      server: parseFloat(server!) || 0,
      design: parseFloat(design!) || 0
    });
    if (report.ok) {
      return OK;
    }
    const message = 'not acceptable';
    const html = generateHTMLDigitalAuditingReportFromtBrowserResult(digitalAuditingResults);
    this.getWorld().logger.error(message, <TArtifactMessageContext>{ topic: { step, event: 'failure', stage: 'action' }, artifact: { type: 'html', content: html, }, tag: this.getWorld().tag });
    return actionNotOK(message, {
      topics: {
        axeFailure: {
          summary: message,
          report: { html },
          details: { digitalAuditingResults, res: report },
        },
      },
    });
  } catch(e) {
    const { message } = { message: 'test' };
      return actionNotOK(message, {
        topics: { exception: { summary: message, details: e } },
      });
    }
  }
}

export default DigitalAuditingStepper;
