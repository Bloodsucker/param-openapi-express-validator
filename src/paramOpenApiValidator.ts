import {RequestHandler, Request, Response, NextFunction, Application} from 'express';
import mainHandler from './middleware/mainHandler';
import { OpenAPIV3 } from "openapi-types";
import { openApiUtils } from './utils/openapi';

export function paramOpenApiValidator(app: Application, openApiDocument: OpenAPIV3.Document): RequestHandler {
    const parsedPathItemObjects: openApiUtils.ParsedPathItemObject[] = openApiUtils.parsePathsObject(openApiDocument.paths);

    app.locals.validator = {
        openApiDocument: openApiDocument,
        parsedPathItemObjects: parsedPathItemObjects
    };
    
    return mainHandler;
}