import puppeteer from 'puppeteer';




export async function getFinancialJuiceData(tag) {

  const dataFinancialJuice = {
    name: 'financial',
    url: 'https://www.financialjuice.com/home',
    mainTag: tag,
    row: 'div-table-row',
    timeTag: 'event-time',
    currecyTag: 'event-title',
    eventTag: 'event-title',
    actualTag: 'event-actual',
    forecastTag: 'event-forcast',
    previousTag: 'event-previous',
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
        process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath(),
    });

    const page = await browser.newPage();
    await page.goto(dataFinancialJuice.url);

    const tagSelector = tag;
    await page.waitForSelector(tagSelector);

    const divs = await page.$$(`${tag} .${dataFinancialJuice.row}`);
    

    if (divs.length >= 2) {
      const primeiraDiv = divs[0];
      const segundaDiv = divs[1];

      const time = await primeiraDiv.$(`.${dataFinancialJuice.timeTag}`);
      if (time) {
        const textoEventTime = await page.evaluate((el) => el.textContent, time);
        dataFinancialJuice.time = textoEventTime;
      }

      const currency = await primeiraDiv.$(`.${dataFinancialJuice.currecyTag}`);
      if (currency) {
        const link = await currency.$('a');
        if (link) {
          const textoCurrency = await page.evaluate((el) => el.textContent, link);
          const partes = textoCurrency.split(' ');
          const p1 = partes[0];
          dataFinancialJuice.currency = p1;
        } else {
          const textoCurrency = await page.evaluate((el) => el.textContent, currency);
          const partes = textoCurrency.split(' ');
          const p1 = partes[0];
          dataFinancialJuice.currency = p1;
        }
      }

      const event = await primeiraDiv.$(`.${dataFinancialJuice.eventTag}`);
      if (event) {
        const link = await currency.$('a');
        if (link) {
          const textoEvent = await page.evaluate((el) => el.textContent, link);
          const partes = textoEvent.split(' ');
          const p = partes[0];
          const rest = textoEvent.slice(p.length + 1);
          dataFinancialJuice.event = rest;
        } else {
          const textoEvent = await page.evaluate((el) => el.textContent, event);
          const partes = textoEvent.split(' ');
          const p = partes[0];
          const rest = textoEvent.slice(p.length + 1);
          dataFinancialJuice.event = rest;
        }

      }

      const actual = await segundaDiv.$(`.${dataFinancialJuice.actualTag}`);
      if (actual) {
        const textActual = await page.evaluate((el) => el.textContent, actual);
        dataFinancialJuice.actual = textActual;
      }

      const forecast = await segundaDiv.$(`.${dataFinancialJuice.forecastTag}`);
      if (forecast) {
        const textForecast = await page.evaluate((el) => el.textContent, forecast);
        dataFinancialJuice.forecast = textForecast;
      }

      const previous = await segundaDiv.$(`.${dataFinancialJuice.previousTag}`);
      if (previous) {
        const textPrevious = await page.evaluate((el) => el.textContent, previous);
        dataFinancialJuice.previous = textPrevious;
      }
    }



    

    await browser.close();
    
    return dataFinancialJuice;



  } catch (error) {
    console.error('Erro na raspagem:', error);
    res.status(500).json({
      error: 'Ocorreu um erro na raspagem de dados'
    });
  }
};