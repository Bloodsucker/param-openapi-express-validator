import { NextFunction, Request, Response } from "express";
import validateRequest from "../validators/validateRequest";

export default function mainHandler(req: Request, res: Response, next: NextFunction) {
    if( !validateRequest(req) ) next('validationError TODO');
    else next();
}
