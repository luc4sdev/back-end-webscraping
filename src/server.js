require('dotenv').config();
const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
app.use(cors());

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

const dataFinancialJuice = {
  name: 'financial juice',
  url: 'https://www.financialjuice.com/home',
  mainTag: '[data-id="06072023ADPNationalEmploymentUS"]',
  firstRow: 'div-table-row',
  timeTag: 'event-time',
  currecyTag: 'event-title',
  eventTag: 'event-title',
  secondRow: 'div-table-row',
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

const getForexFactoryData = async () => {
  try {

    const browser = await puppeteer.launch({
      headless: 'new',
    });

    const page = await browser.newPage();
    await page.goto(dataForexFactory.url);

    // Aguarda o carregamento de elementos específicos (se necessário)
    const tagSelector = dataForexFactory.mainTag;
    await page.waitForSelector(tagSelector);

    // Extrai o valor da tag usando o Puppeteer
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

  } catch (error) {
    console.error('Erro na raspagem:', error);
    res.status(500).json({
      error: 'Ocorreu um erro na raspagem de dados'
    });
  }
};

const getInvestingData = async () => {
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


  } catch (error) {
    console.error('Erro na raspagem:', error);
    res.status(500).json({
      error: 'Ocorreu um erro na raspagem de dados'
    });
  }
};

const getFinancialJuiceData = async () => {
  try {

    const browser = await puppeteer.launch({
      headless: 'new',
    });

    const page = await browser.newPage();
    await page.goto(dataFinancialJuice.url);

    const tagSelector = dataFinancialJuice.mainTag;
    await page.waitForSelector(tagSelector);

    const divs = await page.$$(`${dataFinancialJuice.mainTag} .${dataFinancialJuice.firstRow}`);


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
        const textoCurrency = await page.evaluate((el) => el.textContent, currency);
        const partes = textoCurrency.split(' ');
        const p1 = partes[0];
        dataFinancialJuice.currency = p1;
      }

      const event = await primeiraDiv.$(`.${dataFinancialJuice.eventTag}`);
      if (event) {
        const textoEvent = await page.evaluate((el) => el.textContent, event);
        const partes = textoEvent.split(' ');
        const p = partes[0];
        const rest = textoEvent.slice(p.length + 1);
        dataFinancialJuice.event = rest;
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



  } catch (error) {
    console.error('Erro na raspagem:', error);
    res.status(500).json({
      error: 'Ocorreu um erro na raspagem de dados'
    });
  }
};


app.get('/api/data-forex', async (req, res) => {
  await getForexFactoryData();
  res.json({
    dados: dataForexFactory
  });
});

app.get('/api/data-investing', async (req, res) => {
  await getInvestingData();
  res.json({
    dados: dataInvesting
  });
});

app.get('/api/data-financial', async (req, res) => {
  await getFinancialJuiceData();
  res.json({
    dados: dataFinancialJuice
  });
});



app.listen(process.env.PORT || 3333, () => {
  console.log(`Servidor iniciado na porta ${process.env.PORT}`);
});