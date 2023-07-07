import puppeteer from 'puppeteer';



export async function getTrandingEconomicsData(tag) {

  const dataTrandingEconomics = {
    name: 'economics',
    url: 'https://tradingeconomics.com/calendar',
    mainTag: tag,
    row: 'calendar-item',
    timeTag: 'calendar__time',
    currecyTag: 'calendar__currency',
    eventTag: 'calendar-event',
    actualTag: '',
    forecastTag: '',
    previousTag: '',
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
    await page.goto(dataTrandingEconomics.url);


    const tagSelector = tag;
    await page.waitForSelector(tagSelector);


    const trs = await page.$$(`${tag} .${dataTrandingEconomics.row}`);
    
    if (trs.length >= 3) {
      const primeiraDiv = divs[0];
      const segundaDiv = divs[1];
      const quartaDiv = divs[3];


      const actualTag = await primeiraDiv.$(`a span`);
      if (actualTag) {
          const textActual = await page.evaluate((el) => el.textContent, actualTag);
          const partes = textActual.split(' ');
          const p1 = partes[0];
          dataTrandingEconomics.actual = p1;
      
      }

      const previousTag = await segundaDiv.$(`span`);
      if (previousTag) {
          const textPrevious = await page.evaluate((el) => el.textContent, previousTag);
          const partes = textPrevious.split(' ');
          const p1 = partes[0];
          dataTrandingEconomics.previous = p1;
      
      }

      const forecastTag = await quartaDiv.$(`a span`);
      if (forecastTag) {
          const textForecast = await page.evaluate((el) => el.textContent, forecastTag);
          const partes = textForecast.split(' ');
          const p1 = partes[0];
          dataTrandingEconomics.forecast = p1;
      
      }

    }

    await browser.close();


    return dataTrandingEconomics;

  } catch (error) {
    console.error('Erro na raspagem:', error);
    res.status(500).json({
      error: 'Ocorreu um erro na raspagem de dados'
    });
  }
};