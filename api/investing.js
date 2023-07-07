import puppeteer from 'puppeteer';



  export async function getInvestingData(tag) {

    const dataInvesting = {
      name: 'investing',
      url: 'https://br.investing.com/economic-calendar/',
      mainTag: tag,
      timeTag: 'js-time',
      currecyTag: 'flagCur',
      eventTag: 'event',
      actualTag: 'act ',
      forecastTag: 'fore',
      previousTag: 'prev',
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
      await page.goto(dataInvesting.url);
  

      const tagSelector = tag;
      await page.waitForSelector(tagSelector);
  

      const time = await page.$eval(
        `tr${tag} td.${dataInvesting.timeTag}`,
        (element) => element.textContent.trim().replace(/^\s+|\n/g, '')
      );
      const currency = await page.$eval(
        `tr${tag} td.${dataInvesting.currecyTag}`,
        (element) => element.textContent.trim().replace(/^\s+|\n/g, '')
      );
      const event = await page.$eval(
        `tr${tag} td.${dataInvesting.eventTag} a`,
        (element) => element.textContent
      );
      const actual = await page.$eval(
        `tr${tag} td.${dataInvesting.actualTag}`,
        (element) => element.textContent
      );
      const forecast = await page.$eval(
        `tr${tag} td.${dataInvesting.forecastTag}`,
        (element) => element.textContent
      );
      const previous = await page.$eval(
        `tr${tag} td.${dataInvesting.previousTag} span`,
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