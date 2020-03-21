import { NextFunction, Request, Response } from "express";
import { RequestValidator } from "../services/RequestValidator";
import { ParameterValidatorManager } from "../services/ParameterValidatorManager";
import { integerSchemaObjectValidator, stringSchemaObjectValidator } from "openapi-data-type-validators";

const requestValidator = new RequestValidator(new ParameterValidatorManager({
    integerSchemaObjectValidator: integerSchemaObjectValidator,
    stringSchemaObjectValidator: stringSchemaObjectValidator
}))

export default function paramValidatorHandler(req: Request, res: Response, next: NextFunction) {
    const validationOk = requestValidator.validatePath(req.path, req.app.locals.validator.parsedPathItemObjects);

    if(!validationOk) next('validationError TODO');
    else next();
}