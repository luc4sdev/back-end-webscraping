
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
app.use(cors({
  origin: "http://localhost:5173",
  headers: ["Content-Type"],
  credentials: true,
}));




route.post('/api/data-forex', async (req, res) => {
  const {tag} = req.body;
  console.log(tag)
  const forexData = await getForexFactoryData(tag)
  res.json(forexData);
});

route.post('/api/data-financial', async (req, res) => {
  const {tag} = req.body;
  console.log(tag)
  const financialData = await getFinancialJuiceData(tag)
  res.json(financialData);
});

route.post('/api/data-investing', async (req, res) => {
  const {tag} = req.body;
  console.log(tag)
  const investingData = await getInvestingData(tag)
  res.json(investingData);
});





app.use(route)

app.listen(process.env.PORT ? Number(process.env.PORT) : 3333, () => {
  console.log(`Servidor iniciado na porta ${process.env.PORT}`);
});