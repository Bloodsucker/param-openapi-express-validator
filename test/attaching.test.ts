import supertest = require('supertest');
import {paramOpenApiValidator} from '../src';
import express = require('express');
import { OpenAPIV3 } from 'openapi-types';
import paramValidatorHandler from '../src/middleware/paramValidatorHandler';

function getObjectController(req: express.Request, res: express.Response):void {
    res.status(200);
    res.send({});
}

const openApiBaseDocument: OpenAPIV3.Document = {
    openapi: '3.0.2',
    info: {
        title: 'API Title',
        version: '1.0'
    },
    paths: {}
};

describe('Attaching middleware', () => {
    let app: express.Application;

    beforeEach(() => {
        app = express();
    });

    it('attaches on top of everything', async () => {
        const serverOpenApiSpec: OpenAPIV3.Document = {... openApiBaseDocument};
        serverOpenApiSpec.paths = {
            "/": {
            }
        }

        const api = express.Router()
            .get('/', getObjectController);

        app.use('/api/v1', paramOpenApiValidator(app, serverOpenApiSpec), api);

        const res = await supertest(app)
            .get(`/api/v1/`);

        expect(res.status).toBe(200);
    });

    it('attaches the validator pointer', async() => {
        const serverOpenApiSpec: OpenAPIV3.Document = {... openApiBaseDocument};
        serverOpenApiSpec.paths = {
            "/": {
            }
        }

        const api = express.Router()
            .get('/', paramValidatorHandler, getObjectController);

        app.use('/api/v1', paramOpenApiValidator(app, serverOpenApiSpec), api);

        const res = await supertest(app)
            .get(`/api/v1/`);

        expect(res.status).toBe(200);
    });
 });
