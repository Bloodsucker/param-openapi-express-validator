import { Application, RequestHandler } from 'express';
import { mainHandler } from './middleware/mainHandler';
import { OpenAPIV3 } from 'openapi-types';
import { ParsedPathItemObject, parsePathsObject } from './utils/openApiUtils';

export function paramOpenApiValidator(app: Application, openApiDocument: OpenAPIV3.Document): RequestHandler {
	const parsedPathItemObjects: ParsedPathItemObject[] = parsePathsObject(openApiDocument.paths);

	app.locals.validator = {
		openApiDocument: openApiDocument,
		parsedPathItemObjects: parsedPathItemObjects,
	};

	return mainHandler;
}
