/* eslint-disable no-console */
import { Request, Response } from 'express';
import { ErrorMessage } from './ErrorMessage';
import { sendErrorsToLogServer } from './sendErrorsToLogServer';

export async function errorHandler(err: Error, _req: Request, res: Response) {
  if (err instanceof ErrorMessage) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  sendErrorsToLogServer({ stack: err.stack });

  console.error('\n\n\n ❌ Error ❌ \n\n\n', 'Error Message: ', err.stack, '\n\n\n');

  return res.status(500).json({
    message: `Oops! Encontramos um problema e nossa equipe foi notificada.`,
  });
}
