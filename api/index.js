import { Router } from 'express';
import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import { getForexFactoryData } from './forex.js';
import { getInvestingData } from './investing.js';
import { getFinancialJuiceData } from './financial.js';

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


route.get('/api', cors(corsOptionsDelegate), async (req, res) => {
  const forexData = getForexFactoryData('[data-eventid="133619"]);
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
