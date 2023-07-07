import puppeteer from 'puppeteer';

const dataForexFactory = {
    name: 'forexfactory',
    url: 'https://www.forexfactory.com/calendar',
    mainTag: '[data-eventid="133619"]',
    timeTag: 'calendar__time',
    currecyTag: 'calendar__currency',
    eventTag: 'calendar__event',
    actualTag: 'calendar__actual',
    forecastTag: 'calendar__forecast',
    previousTag: 'calendar__previous',
    time: '',
    currency: '',
    event: '',
    actual: '',
    forecast: '',
    previous: '',
  }

  export async function getForexFactoryData() {
    try {
  
      const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  
      const page = await browser.newPage();
      await page.goto(dataForexFactory.url);
  
     
      const tagSelector = dataForexFactory.mainTag;
      await page.waitForSelector(tagSelector);
  
      
      const time = await page.$eval(
        `tr${dataForexFactory.mainTag} td.${dataForexFactory.timeTag} div`,
        (element) => element.textContent.trim().replace(/^\s+|\n/g, '')
      );
      const currency = await page.$eval(
        `tr${dataForexFactory.mainTag} td.${dataForexFactory.currecyTag}`,
        (element) => element.textContent.trim().replace(/^\s+|\n/g, '')
      );
      const event = await page.$eval(
        `tr${dataForexFactory.mainTag} td.${dataForexFactory.eventTag} div span`,
        (element) => element.textContent
      );
      const actual = await page.$eval(
        `tr${dataForexFactory.mainTag} td.${dataForexFactory.actualTag} span`,
        (element) => element.textContent
      );
      const forecast = await page.$eval(
        `tr${dataForexFactory.mainTag} td.${dataForexFactory.forecastTag} span`,
        (element) => element.textContent
      );
      const previous = await page.$eval(
        `tr${dataForexFactory.mainTag} td.${dataForexFactory.previousTag} span`,
        (element) => element.textContent
      );
  
      await browser.close();
  
      dataForexFactory.time = time;
      dataForexFactory.currency = currency;
      dataForexFactory.event = event;
      dataForexFactory.actual = actual;
      dataForexFactory.forecast = forecast;
      dataForexFactory.previous = previous;

      return dataForexFactory;
  
    } catch (error) {
      console.error('Erro na raspagem:', error);
      res.status(500).json({
        error: 'Ocorreu um erro na raspagem de dados'
      });
    }
  };
