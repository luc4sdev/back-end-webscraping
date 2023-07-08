require('dotenv').config();
const puppeteer = require('puppeteer');



const getForexFactoryData async (res, tag) => {

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

  const browser = await puppeteer.launch({
      headless: 'new',
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
  
  try {

    const page = await browser.newPage();
    await page.goto(dataForexFactory.url, { waitUntil: 'domcontentloaded' });

    const tagSelector = tag;
    await page.waitForSelector(tagSelector);

    const [time, currency, event, actual, forecast, previous] =
      await page.$$eval(tagSelector, (rows) => {
        const row = rows[0];
        return [
          row.querySelector('.calendar__time div').textContent.trim().replace(/^\s+|\n/g, ''),
          row.querySelector('.calendar__currency').textContent.trim().replace(/^\s+|\n/g, ''),
          row.querySelector('.calendar__event div span').textContent.trim().replace(/^\s+|\n/g, ''),
          row.querySelector('.calendar__actual span')?.textContent?.trim().replace(/^\s+|\n/g, '') || row.querySelector('.calendar__actual').textContent.trim().replace(/^\s+|\n/g, ''),
          row.querySelector('.calendar__forecast span')?.textContent?.trim().replace(/^\s+|\n/g, '') || row.querySelector('.calendar__forecast').textContent.trim().replace(/^\s+|\n/g, ''),
          row.querySelector('.calendar__previous span')?.textContent?.trim().replace(/^\s+|\n/g, '') || row.querySelector('.calendar__previous').textContent.trim().replace(/^\s+|\n/g, ''),
        ];
      });



    dataForexFactory.time = time;
    dataForexFactory.currency = currency;
    dataForexFactory.event = event;
    dataForexFactory.actual = actual;
    dataForexFactory.forecast = forecast;
    dataForexFactory.previous = previous;

    res.send(dataForexFactory)
    
  }  catch (e) {
    console.error(e);
    res.send(`Something went wrong while running Puppeteer: ${e}`);
  } finally {
    await browser.close();
  }
};
module.exports = { getForexFactoryData };

