import * as Knex from 'knex';
import { Application, jsonApiKoa, KnexProcessor } from 'kurier';
import Koa from 'koa';
import * as cors from '@koa/cors';

import Todo from './resources/todo';

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];

const app = new Application({
	namespace: 'api',
	types: [Todo],
	defaultProcessor: KnexProcessor,
});

// @ts-ignore
app.services.knex = Knex(configuration);

const api = new Koa();

api.use(cors());
api.use(jsonApiKoa(app));

api.listen(4000);
