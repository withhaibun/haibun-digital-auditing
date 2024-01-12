import { readFileSync } from 'fs';
import { generateHtmlDigitalAuditingReport } from './report.js';
import { TStepResult } from '@haibun/core/build/lib/defs.js';

describe('generate report', () => {
  test('generate report from digital auditing results', () => {
    const results: TStepResult[] = []; 
    const report = generateHtmlDigitalAuditingReport(results);
    expect(report).toBeDefined();
  });
});
