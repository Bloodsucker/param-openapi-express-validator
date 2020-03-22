import { Handler } from 'express';
import { paramValidatorHandler } from './paramValidatorHandler';

export const mainHandler: Handler = (req, res, next) => {
	paramValidatorHandler(req, res, next);
};
