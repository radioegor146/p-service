import dotenv from "dotenv";
import express from "express";
import {getLogger} from "./logger";
import bodyParser from "body-parser";

const logger = getLogger();

dotenv.config();

const FRONTEND_PORT = parseInt(process.env.FRONTEND_PORT ?? "0");

if (!FRONTEND_PORT) {
    throw new Error("FRONTEND_PORT environment variable is required");
}

const LISTENER_PORT = parseInt(process.env.LISTENER_PORT ?? "0");

if (!LISTENER_PORT) {
    throw new Error("LISTENER_PORT environment variable is required");
}

const listenerApp = express();

listenerApp.use(bodyParser.raw({
    type: () => true
}));

listenerApp.use('/', (req, res) => {
    const url = req.url;
    const host = req.hostname;
    const realIp = req.headers["x-real-ip"] ?? req.ip;
    const body = req.body;
    const method = req.method;

    console.info(`${method} ${host}${url} ${body.toString()}`);

    for (const header of Object.keys(req.headers)) {
        console.info(`    ${header}: ${Array.isArray(req.headers[header]) ? req.headers[header].join(";") : req.headers[header]}`)
    }

    res.status(500).end('nope');
});

listenerApp.listen(LISTENER_PORT, () => {
    logger.info(`Listener started on :${LISTENER_PORT}`);
})

const frontendApp = express();

frontendApp.listen(FRONTEND_PORT, () => {
    logger.info(`Frontend started on :${FRONTEND_PORT}`);
});