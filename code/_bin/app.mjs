import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

import OpenApiValidator from 'express-openapi-validator';
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express'
import resolver from './esmresolver.mjs';
import { JWT_SECURITY } from '../lib/security.mjs';
import { bootstrapDb } from '../lib/database.mjs';
import { isDev } from '../lib/env.mjs';
import { ServerError } from '../lib/errors.mjs';
import { runAndLog } from '../lib/logging.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

const MORGAN_FMT = isDev()? "dev":
    ":remote-addr :method :url HTTP/:http-version :status :res[content-length] - :response-time ms - :user-agent"


app.use(logger(MORGAN_FMT, {
    skip: (req,res) =>{
        (req.url.includes("healthCheck") || req.url.includes("echo")) && (res.statusCode == 200 || res.statusCode == 304)
    }
}));  //log padrão
app.use(express.json());  //get body and decodifica e envia o body na res
app.use(express.urlencoded({ extended: false })); // tira o encode da url
app.use(cookieParser()); // parse do cookies e guarda uma var cookie

// Configuração dos roteadores
// app.use('/users', userRouter); 
const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.3",
        info: {
            title: "Music Server",
            version: "1.0.0",
            description: "Music Server Authentication API"
        },
        servers: [{
            url: "http://localhost:3001/api",
            description: "Music Server"
        }]
    },
    apis: [
        __dirname + "/../components/**/*.yaml",
        __dirname + "/../components/**/*.mjs"
    ]
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
delete swaggerDocs.channels;

// confirgurando o servidor para responder a rota api-docs com todas as documentações do servidor
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(OpenApiValidator.middleware({
    apiSpec: swaggerDocs,
    validateSecurity:{
        handlers: {
            JWT: JWT_SECURITY,
        }
    },
    operationHandlers: {
        basePath: __dirname + "/../components",
        resolver
    }
}));

app.use(ServerError.HANDLERS);

// Configuração dos rotas estáticas (se for disponibilizar dados estáticos no servidor - imgs/ avatar em um link e etcs)
app.use(express.static(`${__dirname}/../public`));

runAndLog(bootstrapDb(), {origin:'bootstrap'});

export default app;