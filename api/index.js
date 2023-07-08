const { Router } = require('express');
require('dotenv/config.js');
const express = require('express');
const cors = require('cors');
const { getForexFactoryData } = require('./forex.js');
const { getInvestingData } = require('./investing.js');
const { getFinancialJuiceData } = require('./financial.js');
const { scrapeLogic } = require('./scrapeLogic.js');



const app = express();
const route = Router();

app.use(express.json());

var allowlist = ['https://front-v0x8.onrender.com/', 'http://localhost:5173']
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

route.get("/scrape",cors(corsOptionsDelegate), (req, res) => {
  scrapeLogic(res);
});


route.get('/api', cors(corsOptionsDelegate), async (req, res) => {
  const forexData = await getForexFactoryData("[data-eventid=\"133619\"]");
  res.send(forexData);
});

route.post('/api/data-forex', cors(corsOptionsDelegate), async (req, res) => {
  const { tag } = req.body;
  console.log(tag);
  const forexData = await getForexFactoryData(tag);
  res.json(forexData);
});

route.post('/api/data-financial',cors(corsOptionsDelegate), async (req, res) => {
  const { tag } = req.body;
  console.log(tag);
  const financialData = await getFinancialJuiceData(tag);
  res.json(financialData);
});

route.post('/api/data-investing',cors(corsOptionsDelegate), async (req, res) => {
  const { tag } = req.body;
  console.log(tag);
  const investingData = await getInvestingData(tag);
  res.json(investingData);
});


app.use(route);

const port = process.env.PORT ? Number(process.env.PORT) : 3333;
app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});
