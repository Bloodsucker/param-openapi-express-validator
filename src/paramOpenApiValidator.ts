import {RequestHandler, Request, Response, NextFunction, Application} from 'express';
import mainHandler from './middleware/mainHandler';
import { OpenAPIV3 } from "openapi-types";

export function paramOpenApiValidator(app: Application, openApi: OpenAPIV3.Document): RequestHandler {

    app.locals.validator = {
        spec: openApi
    };
    
    return mainHandler;
}