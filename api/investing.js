require('dotenv').config();
const puppeteer = require('puppeteer');



const getInvestingData = async (tag, url) => {

  const dataInvesting = {
    name: 'investing',
    url: url,
    mainTag: tag,
    timeTag: 'col-time',
    currecyTag: 'col-country',
    eventTag: 'col-event',
    actualTag: 'col-actual ',
    forecastTag: 'col-forecast',
    previousTag: 'col-previous',
    time: '',
    currency: '',
    event: '',
    actual: '',
    forecast: '',
    previous: '',
  }


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
      process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath(),
  });

  try {

    const page = await browser.newPage();
    await page.goto(url);


    const tagSelector = tag;
    await page.waitForSelector(tagSelector);


    const time = await page.$eval(
      `tr${tag} td.${dataInvesting.timeTag} span`,
      (element) => element.textContent.trim().replace(/^\s+|\n/g, '')
    );

    const spans = await page.$$(`tr${tag} td.${dataInvesting.currecyTag} div span`);

    if (spans.length >= 2) {
      const segundaDiv = spans[1];


      if (segundaDiv) {
        const textoCurrency = await page.evaluate((el) => el.textContent, segundaDiv);
        const partes = textoCurrency.split(' ');
        const p1 = partes[0];
        dataInvesting.currency = p1;

      }
    }

    const event = await page.$eval(
      `tr${tag} td.${dataInvesting.eventTag} span a`,
      (element) => element.textContent
    );

    const divs = await page.$$(`tr${tag} td.${dataInvesting.actualTag} span`);

    if (divs.length >= 2) {
      const segundaDiv = divs[1];


      if (segundaDiv) {
        const textActual = await page.evaluate((el) => el.textContent, segundaDiv);
        const partes = textActual.split(' ');
        const p1 = partes[0];
        dataInvesting.actual = p1;

      }
    }


    const divs2 = await page.$$(`tr${tag} td.${dataInvesting.forecastTag} span`);

    if (divs2.length >= 2) {
      const segundaDiv = divs2[1];


      if (segundaDiv) {
        const textForecast = await page.evaluate((el) => el.textContent, segundaDiv);
        const partes = textForecast.split(' ');
        const p1 = partes[0];
        dataInvesting.forecast = p1;

      }
    }
    const previous = await page.$eval(
      `tr${tag} td.${dataInvesting.previousTag} div span`,
      (element) => element.textContent
    );


    dataInvesting.time = time;
    dataInvesting.event = event;
    dataInvesting.previous = previous;

    return dataInvesting;



  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
};
module.exports = {
  getInvestingData
};