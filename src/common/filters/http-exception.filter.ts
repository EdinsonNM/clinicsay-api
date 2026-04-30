import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status: number =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const payload =
      exception instanceof HttpException ? exception.getResponse() : null;

    response.status(status).json({
      error: exception instanceof HttpException ? exception.name : 'Error',
      message:
        typeof payload === 'object' && payload && 'message' in payload
          ? (payload as { message: string | string[] }).message
          : status === Number(HttpStatus.INTERNAL_SERVER_ERROR)
            ? 'Error inesperado'
            : payload,
    });
  }
}
