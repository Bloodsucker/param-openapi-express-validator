import {RequestHandler, Request, Response, NextFunction, Application} from 'express';
import mainhandler from './middleware/mainHandler';

export function paramOpenApiValidator(app: Application, openApi: object /*TODO*/): RequestHandler {

    app.locals.validator = {
        spec: openApi
    };
    
    return mainhandler;
}