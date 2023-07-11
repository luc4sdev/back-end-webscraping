const express = require("express");
const app = express();
const http = require("http");
const {
    getForexFactoryData
} = require('./forex.js');


const {
    Server
} = require("socket.io");

const cors = require("cors");

const {
    getFinancialJuiceData
} = require("./financial.js");
const {
    getInvestingData
} = require("./investing.js");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});



io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);


    socket.on("send_forex_parameters", async (parameters) => {

        const newValue = await getForexFactoryData(parameters.tag, parameters.url);
        console.log(newValue)
        io.emit('forexData', newValue);
    });

    socket.on("send_financial_tag", async (tag) => {

        const newValue = await getFinancialJuiceData(tag);
        console.log(newValue)
        io.emit('financialData', newValue);

    });

    socket.on("send_investing_parameters", async (parameters) => {

        const newValue = await getInvestingData(parameters.tag, parameters.url);
        console.log(newValue)
        io.emit('investingData', newValue);
    });

});

server.listen(3001, () => {
    console.log("SERVER IS RUNNING");
});