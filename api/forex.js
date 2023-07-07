import puppeteer from 'puppeteer';



export async function getForexFactoryData(tag) {

  const dataForexFactory = {
    name: 'forexfactory',
    url: 'https://www.forexfactory.com/calendar',
    mainTag: tag,
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
  try {

    const browser = await puppeteer.launch({
      // teste
      headless: 'new',
      args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote",
      ],
      executablePath: process.env.NODE_ENV === "production" ?
        process.env.PUPPETEER_EXECUTABLE_PATH :
        puppeteer.executablePath(),
    });

    const page = await browser.newPage();
    await page.goto(dataForexFactory.url);


    const tagSelector = tag;
    await page.waitForSelector(tagSelector);


    const time = await page.$eval(
      `tr${tag} td.${dataForexFactory.timeTag} div`,
      (element) => element.textContent.trim().replace(/^\s+|\n/g, '')
    );
    const currency = await page.$eval(
      `tr${tag} td.${dataForexFactory.currecyTag}`,
      (element) => element.textContent.trim().replace(/^\s+|\n/g, '')
    );
    const event = await page.$eval(
      `tr${tag} td.${dataForexFactory.eventTag} div span`,
      (element) => element.textContent.trim().replace(/^\s+|\n/g, '')
    );

    const actual = await page.$eval(
      `tr${tag} td.${dataForexFactory.actualTag} span`,
      (spanElement) => spanElement.textContent.trim().replace(/^\s+|\n/g, '')
    ).catch(() => {
      return page.$eval(
        `tr${tag} td.${dataForexFactory.actualTag}`,
        (tdElement) => tdElement.textContent.trim().replace(/^\s+|\n/g, '')
      );
    });

    const forecast = await page.$eval(
      `tr${tag} td.${dataForexFactory.forecastTag} span`,
      (spanElement) => spanElement.textContent.trim().replace(/^\s+|\n/g, '')
    ).catch(() => {
      return page.$eval(
        `tr${tag} td.${dataForexFactory.forecastTag}`,
        (tdElement) => tdElement.textContent.trim().replace(/^\s+|\n/g, '')
      );
    });

    const previous = await page.$eval(
      `tr${tag} td.${dataForexFactory.previousTag} span`,
      (spanElement) => spanElement.textContent.trim().replace(/^\s+|\n/g, '')
    ).catch(() => {
      return page.$eval(
        `tr${tag} td.${dataForexFactory.previousTag}`,
        (tdElement) => tdElement.textContent.trim().replace(/^\s+|\n/g, '')
      );
    });


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