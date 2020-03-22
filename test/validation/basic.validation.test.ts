import supertest = require('supertest');
import express = require('express');
import { paramOpenApiValidator } from '../../src';
import { OpenAPIV3 } from 'openapi-types';

function getObjectController(req: express.Request, res: express.Response): void {
	res.status(200);
	res.send({});
}

const openApiBaseDocument: OpenAPIV3.Document = {
	openapi: '3.0.2',
	info: {
		title: 'API Title',
		version: '1.0',
	},
	servers: [{ url: '/api/v1' }],
	paths: {},
};

describe('Basic validation', () => {
	let app: express.Application;

	beforeEach(() => {
		app = express();
	});

	it('has path param validation', async () => {
		const serverOpenApiSpec: OpenAPIV3.Document = { ...openApiBaseDocument };
		serverOpenApiSpec.paths = {
			'/users/{id}': {
				parameters: [
					{
						in: 'path',
						name: 'id',
						required: true,
						schema: {
							type: 'string',
						},
					},
				],
			},
		};

		const api = express.Router().get('/users/:id', getObjectController);

		app.use('/api/v1', paramOpenApiValidator(app, serverOpenApiSpec), api);

		const res = await supertest(app).get(`/api/v1/users/myString`);

		expect(res.status).toBe(200);
	});

	it('fails path param validation', async () => {
		const serverOpenApiSpec: OpenAPIV3.Document = { ...openApiBaseDocument };
		serverOpenApiSpec.paths = {
			'/users/{id}': {
				parameters: [
					{
						in: 'path',
						name: 'id',
						required: true,
						schema: {
							type: 'integer',
						},
					},
				],
			},
		};

		const api = express.Router().get('/users/:id', getObjectController);

		app.use('/api/v1', paramOpenApiValidator(app, serverOpenApiSpec), api);

		const res = await supertest(app).get(`/api/v1/users/myString`); // A path argument as integer was expected

		expect(res.status).toBe(500);
	});
});
