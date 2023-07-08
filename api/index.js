import { Router } from 'express';
import 'dotenv/config.js';
import express from 'express';
import { getForexFactoryData } from './forex.js';
import { getInvestingData } from './investing.js';
import { getFinancialJuiceData } from './financial.js';

const app = express();
const route = Router();

app.use(express.json());
app.use(express.static('dist'))



route.post('/api/data-forex', async (req, res) => {
  const { tag } = req.body;
  console.log(tag);
  const forexData = await getForexFactoryData(tag);
  res.json(forexData);
});

route.post('/api/data-financial', async (req, res) => {
  const { tag } = req.body;
  console.log(tag);
  const financialData = await getFinancialJuiceData(tag);
  res.json(financialData);
});

route.post('/api/data-investing', async (req, res) => {
  const { tag } = req.body;
  console.log(tag);
  const investingData = await getInvestingData(tag);
  res.json(investingData);
});

route.post('/api/data-economics', async (req, res) => {
  const { tag } = req.body;
  console.log(tag);
  const economicsData = await getInvestingData(tag);
  res.json(economicsData);
});

app.use(route);

const port = process.env.PORT ? Number(process.env.PORT) : 3333;
app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});
