import * as Knex from 'knex';
import { Application, jsonApiKoa, KnexProcessor } from 'kurier';
import Koa from 'koa';
import * as cors from '@koa/cors';
import jsonApiWebSocket from './middlewares/json-api-websockets';
import { Server as WebSocketServer } from 'ws';

import Todo from './resources/todo';
import Message from './resources/message';

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];

const app = new Application({
	namespace: 'api',
	types: [Todo, Message],
	defaultProcessor: KnexProcessor,
});

// @ts-ignore
app.services.knex = Knex(configuration);

const api = new Koa();

api.use(cors());
api.use(jsonApiKoa(app));

// ws
const ws = new WebSocketServer({ port: 8080, server: api });
jsonApiWebSocket(ws, app);

api.listen(4000);
