import supertest = require('supertest');
import {paramOpenApiValidator} from '../src';
import express = require('express');

function getObjectController(req: express.Request, res: express.Response):void {
    res.status(200);
    res.send({});
}

describe('Test for debugging', () => {
    let app: express.Application;

    beforeEach(() => {
        app = express();
    });

    it('debugging', async () => {
        const serverOpenApiSpec = {};

        const api = express.Router()
            .get('/', getObjectController);

        app.use('/api/v1', paramOpenApiValidator(app, paramOpenApiValidator), api);

        const res = await supertest(app)
            .get(`/api/v1/`);

        expect(res.status).toBe(200);
    });
 });
