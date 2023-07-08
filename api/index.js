const { Router } = require('express');
require('dotenv').config();
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
  getForexFactoryData(res,"[data-eventid=\"133619\"]");
});

route.post('/api/data-forex', cors(corsOptionsDelegate), async (req, res) => {
  const { tag } = req.body;
  console.log(tag);
  getForexFactoryData(res, tag);
});

route.post('/api/data-financial',cors(corsOptionsDelegate), async (req, res) => {
  const { tag } = req.body;
  console.log(tag);
  getFinancialJuiceData(res, tag);
});

route.post('/api/data-investing',cors(corsOptionsDelegate), async (req, res) => {
  const { tag } = req.body;
  console.log(tag);
 getInvestingData(res, tag);
});


app.use(route);

const port = process.env.PORT ? Number(process.env.PORT) : 3333;
app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});
