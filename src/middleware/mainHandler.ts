import { NextFunction, Request, Response } from "express";
import paramValidatorHandler from "./paramValidatorHandler";

export default function mainHandler(req: Request, res: Response, next: NextFunction) {
    paramValidatorHandler(req, res, next);
}
