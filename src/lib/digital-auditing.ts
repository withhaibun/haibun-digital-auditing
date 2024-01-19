import { Page } from "playwright";

export async function getDigitalAuditingResults(page: Page) {

  const serverAuditResults = await runServerAudits(page);
  const designAuditResults = await runDesignAudits(page);
  return {
    server: serverAuditResults,
    design: designAuditResults
  };
}

async function runServerAudits(page: Page) {
  const renewableEnergy = await checkRenewableEnergy(page);
  const carbonFootprint = await checkCarbonFootprint(page);
  const httpProtocol = await checkHttpProtocol (page);
  const textCompression = await checkTextCompression (page);
  const botTraffic = await checkBotTraffic(page);
  const cookieOptimization = await checkCookieOptimization(page);
  const browserCachine = await checkBrowserCaching (page);
  const urlRedirects = await checkURLRedirects (page);

  return {
    renewableEnergy: await renewableEnergy,
    carbonFootprint: await carbonFootprint,
    httpProtocol: await httpProtocol,
    textCompression: await textCompression,
    botTraffic: await botTraffic,
    cookieOptimization: await cookieOptimization,
    browserCachine: await browserCachine,
    urlRedirects: await urlRedirects
  };
}

async function runDesignAudits(page: Page) {
  const webP = await checkWebP(page);
  const webM = await checkWebM(page);
  const lazyLoading = await checkLazyLoading (page);
  const fontSubsetting = await checkFontSubsetting (page);
  const consoleLogs = await checkConsoleLogs(page);
  const pixelEnergyEfficiency = await checkPixelEnergyEfficiency(page);
  const darkMode = await checkDarkMode (page);
  const reactiveCSS = await checkReactiveCSS (page);
  const inlineAssets = await checkInlineAssets (page);


  return {
    webP: await webP,
    webM: await webM,
    lazyLoading: await lazyLoading,
    fontSubsetting: await fontSubsetting,
    consoleLogs: await consoleLogs,
    pixelEnergyEfficiency: await pixelEnergyEfficiency,
    darkMode: await darkMode,
    reactiveCSS: await reactiveCSS,
    inlineAssets: await inlineAssets
  };
}

async function checkRenewableEnergy(page: Page) {
  const isRenewableWebsite = await page.$('.renewable-energy-website') !== null;
  return {
    result: isRenewableWebsite
  };
}

async function checkCarbonFootprint(page: Page) {
  const isLowCarbonleWebsite = await page.$('.low-carbon-website') !== null;
  return {
    result: isLowCarbonleWebsite
  };
}

async function checkHttpProtocol(page: Page) {
  
}

async function checkTextCompression(page: Page) {
  
}

async function checkBotTraffic(page: Page) {
  const isBotTraffic = (await page.evaluate(() => navigator.userAgent.toLowerCase())).includes('bot');
  return {
    result: !isBotTraffic
  };
}

async function checkCookieOptimization(page: Page) {
  
}

async function checkBrowserCaching(page: Page) {
  
}

async function checkURLRedirects(page: Page) {
  
}

async function checkWebP(page: Page) {
  const usesWebPImages = (await page.$$eval('img', images => images.every(img => img.src.endsWith('.webp'))));
  return {
    result: usesWebPImages
  };
}

async function checkWebM(page: Page) {
  const usesWebMVideos = (await page.$$eval('video', videos => videos.every(video => video.src.endsWith('.webm'))));
  return {
    result: usesWebMVideos
  };
}

async function checkLazyLoading(page: Page) {
  const hasLazyLoading = (await page.$$eval('img', images => images.every(img => img.hasAttribute('loading') && img.getAttribute('loading') === 'lazy')));
  return {
    result: hasLazyLoading
  };
}

async function checkFontSubsetting(page: Page) {
  
}

async function checkConsoleLogs(page: Page) {
  const consoleLogs = await page.evaluate(() => console.log('test message'));
  return {
    result: consoleLogs
  };
}

async function checkPixelEnergyEfficiency(page: Page) {
  const optimizedPixelDensity = (await page.$$eval('img', images => images.every(img => img.naturalWidth / img.width > 1)));
  return {
    result: optimizedPixelDensity
  };
}

async function checkDarkMode(page: Page) {
  const hasDarkMode = (await page.$('body.dark-mode')) !== null;
  return {
    result: hasDarkMode
  };
}

async function checkReactiveCSS(page: Page) {
  const hasInlineStyles = (await page.$$eval('style', styles => styles.length > 0));
  const hasInlineScripts = (await page.$$eval('script', scripts => scripts.length > 0));
  return {
    result: hasInlineStyles && hasInlineScripts
  };
}

async function checkInlineAssets(page: Page) {
  
}