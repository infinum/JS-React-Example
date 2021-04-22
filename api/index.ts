import * as Knex from 'knex';
import { Application, jsonApiKoa, KnexProcessor, UserManagementAddon, UserManagementAddonOptions } from 'kurier';
import Koa from 'koa';

import Todo from './resources/todo';
import User from './resources/user';
import { userEncryptPasswordCallback, userGenerateIdCallback, userLoginCallback } from './user-callbacks';

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];

const app = new Application({
	namespace: 'api',
	types: [Todo],
	defaultProcessor: KnexProcessor,
});

// @ts-ignore
app.services.knex = Knex(configuration);

app.use(UserManagementAddon, {
	userResource: User,
	userLoginCallback,
	userEncryptPasswordCallback,
	userGenerateIdCallback,
} as UserManagementAddonOptions);

const api = new Koa();

api.use(jsonApiKoa(app));

api.listen(4000);
