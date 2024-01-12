import { AStepper, TWorld, TNamed, IHasOptions, OK, TVStep } from '@haibun/core/build/lib/defs.js';
import { actionNotOK, findStepper, findStepperFromOption, stringOrError } from '@haibun/core/build/lib/util/index.js';
import { Page } from 'playwright';
import { getDigitalAuditingResults } from './lib/digital-auditing.js';
import { generateHTMLDigitalAuditingReport } from './lib/report.ts';
import { AStorage } from '@haibun/domain-storage/build/AStorage.js';
import { EMediaTypes } from '@haibun/domain-storage/build/domain-storage.js';

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
    checkDigitalAuditing: {
      gwta: `run digital auditing on the page`,
      action: async (named: TNamed, step: TVStep) => {
        const page = await this.pageGetter?.getPage();
        if (!page) {
          return actionNotOK(`no page in runtime`);
        }
        return await this.checkDigitalAuditing(page, step);
      },
    },
  };

  async checkDigitalAuditing(page: Page, step: TVStep) {
    try {
      const digitalAuditingResults = await getDigitalAuditingResults(page);
      const report = generateHTMLDigitalAuditingReport(digitalAuditingResults);
      await this.saveReportToStorage(report);
      return OK;
    } catch (e) {
      const { message } = { message: 'test' };
      return actionNotOK(message, {
        topics: { exception: { summary: message, details: e } },
      });
    }
  }

  async saveReportToStorage(report: string) {
    const storage = findStepperFromOption<AStorage>(this.steppers, this, this.getWorld().extraOptions, DigitalAuditingStepper.STORAGE);
    await storage.writeFile('digital-auditing-report.html', report, EMediaTypes.html);
  }
}

export default DigitalAuditingStepper;
