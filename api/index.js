
import { Router } from 'express'
import 'dotenv/config.js'
import {getForexFactoryData} from './forex.js';
import {getInvestingData} from './investing.js';
import {getFinancialJuiceData} from './financial.js';
import express from 'express';



const app = express();
const route = Router()



const forexData =  await getForexFactoryData()
//const investingData =  await getInvestingData()
//const financialData =  await getFinancialJuiceData()

route.get('/api/data-forex', (req, res) => {
  res.json(forexData);
});

route.get('/api/data-investing', async (req, res) => {
  res.json(investingData);

});

route.get('/api/data-financial', async (req, res) => {
  res.json(financialData);

});


app.use(route)

app.listen(process.env.PORT ? Number(process.env.PORT) : 3333, () => {
  console.log(`Servidor iniciado na porta ${process.env.PORT}`);
});