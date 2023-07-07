
import { Router } from 'express'
import 'dotenv/config.js'
import {getForexFactoryData} from './forex.js';
import {getInvestingData} from './investing.js';
import {getFinancialJuiceData} from './financial.js';
import express from 'express';



const app = express();
const route = Router()





route.get('/api/data-forex', async (req, res) => {
  const data = await getForexFactoryData();
  res.json({
    dados: data
  });
});

route.get('/api/data-investing', async (req, res) => {
  const data = await getInvestingData();
  res.json({
    dados: data
  });
});

route.get('/api/data-financial', async (req, res) => {
  const data = await getFinancialJuiceData();
  res.json({
    dados: data
  });
});

app.use(route)

app.listen(process.env.PORT ? Number(process.env.PORT) : 3333, () => {
  console.log(`Servidor iniciado na porta ${process.env.PORT}`);
});