import { NextFunction, Request, Response } from "express";
import paramValidatorHandler from "./paramValidatorHandler";
import {routesUtils} from '../utils/routes';

function isValidatorPointerFound(req: Request): boolean {
    routesUtils.forEachPath(req, () => {

    });
    return false;
}

export default function mainHandler(req: Request, res: Response, next: NextFunction) {
    if(isValidatorPointerFound(req)) next();

    paramValidatorHandler(req, res, next);
}
