
import { Router } from 'express'
import 'dotenv/config.js'
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'
import { getForexFactoryData } from './forex.js';
import { getInvestingData } from './investing.js';
import { getFinancialJuiceData } from './financial.js';


const app = express();
const route = Router()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const whitelist = ["http://localhost:5173","https://front-end-webscraping-7yputwlhw-luc4sdev.vercel.app"]
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}
app.use(cors(corsOptions))
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');

  next();
});


route.get('/api/data-forex', async (req, res) => {
  const forexData = await getForexFactoryData('[data-eventid="129141"]')
  res.header("Access-Control-Allow-Origin", "*");
  res.json(forexData);
});

route.post('/api/data-forex', async (req, res) => {
  const {tag} = req.body;
  console.log(tag)
  const forexData = await getForexFactoryData(tag)
  res.header("Access-Control-Allow-Origin", "*");
  res.json(forexData);
});

route.post('/api/data-financial', async (req, res) => {
  const {tag} = req.body;
  console.log(tag)
  const financialData = await getFinancialJuiceData(tag)
  res.header("Access-Control-Allow-Origin", "*");
  res.json(financialData);
});

route.post('/api/data-investing', async (req, res) => {
  const {tag} = req.body;
  console.log(tag)
  const investingData = await getInvestingData(tag)
  res.header("Access-Control-Allow-Origin", "*");
  res.json(investingData);
});

route.post('/api/data-economics', async (req, res) => {
  const {tag} = req.body;
  console.log(tag)
  const investingData = await getInvestingData(tag)
  res.header("Access-Control-Allow-Origin", "*");
  res.json(investingData);
});





app.use(route)

app.listen(process.env.PORT ? Number(process.env.PORT) : 3333, () => {
  console.log(`Servidor iniciado na porta ${process.env.PORT}`);
});