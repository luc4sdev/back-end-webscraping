import puppeteer from 'puppeteer';

const dataInvesting = {
    name: 'investing',
    url: 'https://br.investing.com/economic-calendar',
    mainTag: '[event_attr_id="1"]',
    timeTag: 'js-time',
    currecyTag: 'flagCur',
    eventTag: 'event',
    actualTag: 'event-477008-actual',
    forecastTag: 'event-477008-forecast',
    previousTag: 'event-477008-previous',
    time: '',
    currency: '',
    event: '',
    actual: '',
    forecast: '',
    previous: '',
  }

  export async function getInvestingData() {
    try {
  
      const browser = await puppeteer.launch({
        headless: 'new',
      });
  
      const page = await browser.newPage();
      await page.goto(dataInvesting.url);
  
      // Aguarda o carregamento de elementos específicos (se necessário)
      const tagSelector = dataInvesting.mainTag;
      await page.waitForSelector(tagSelector);
  
      // Extrai o valor da tag usando o Puppeteer
      const time = await page.$eval(
        `tr${dataInvesting.mainTag} td.${dataInvesting.timeTag}`,
        (element) => element.textContent.trim().replace(/^\s+|\n/g, '')
      );
      const currency = await page.$eval(
        `tr${dataInvesting.mainTag} td.${dataInvesting.currecyTag}`,
        (element) => element.textContent.trim().replace(/^\s+|\n/g, '')
      );
      const event = await page.$eval(
        `tr${dataInvesting.mainTag} td.${dataInvesting.eventTag} a`,
        (element) => element.textContent
      );
      const actual = await page.$eval(
        `tr${dataInvesting.mainTag} td.${dataInvesting.actualTag}`,
        (element) => element.textContent
      );
      const forecast = await page.$eval(
        `tr${dataInvesting.mainTag} td.${dataInvesting.forecastTag}`,
        (element) => element.textContent
      );
      const previous = await page.$eval(
        `tr${dataInvesting.mainTag} td.${dataInvesting.previousTag} span`,
        (element) => element.textContent
      );
  
  
      await browser.close();
  
      dataInvesting.time = time;
      dataInvesting.time = time;
      dataInvesting.currency = currency;
      dataInvesting.event = event;
      dataInvesting.actual = actual;
      dataInvesting.forecast = forecast;
      dataInvesting.previous = previous;

      return dataInvesting;

  
  
    } catch (error) {
      console.error('Erro na raspagem:', error);
      res.status(500).json({
        error: 'Ocorreu um erro na raspagem de dados'
      });
    }
  };