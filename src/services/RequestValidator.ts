import { openApiUtils } from "../utils/openapi";
import {ParameterValidatorManager} from './ParameterValidatorManager';

export class RequestValidator {
    private parameterValidatorManager: ParameterValidatorManager;

    constructor(parameterValidatorManager: ParameterValidatorManager) {
        this.parameterValidatorManager = parameterValidatorManager;
    }

    public validatePath(request: string, parsedPathItemObjects: openApiUtils.ParsedPathItemObject[]): boolean {
        const pathMatch = openApiUtils.findPathMatch(request, parsedPathItemObjects);

        if(!pathMatch) return false; // Path not found.

        for (const paramName in pathMatch.parsedPathItemObject.commonPathParameters) {
            const paramSchemaObject = pathMatch.parsedPathItemObject.commonPathParameters[paramName];

            if(!this.parameterValidatorManager.validate(pathMatch.parameters[paramName], paramSchemaObject)) return false;
        }

        return true;
    }
}
