import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpStatusMessage } from '@/utils/constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  private readonly API_ROOT_URL: string;
  private readonly NODE_ENV: string;

  constructor() {
    this.API_ROOT_URL = new ConfigService().get('API_ROOT_URL');
    this.NODE_ENV = new ConfigService().get('NODE_ENV');
  }
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((res: unknown) => this.responseHandler(res, context)),
      catchError((execution: HttpException) =>
        throwError(() => this.errorHandler(execution, context)),
      ),
    );
  }

  responseHandler(res: any, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const statusCode = response.statusCode;

    const path = `${this.API_ROOT_URL}${request.url}`;
    return {
      status: HttpStatusMessage.SUCCESS,
      statusCode,
      response: res,
      // path,
    };
  }

  errorHandler(execution: HttpException, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status =
      execution instanceof HttpException
        ? execution.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorStack = execution?.stack;
    const path = `${this.API_ROOT_URL}${request.url}`;

    if (this.NODE_ENV === 'production') {
      response.status(status).json({
        status: HttpStatusMessage.FAILED,
        statusCode: status,
        response: [],
        message: execution.message,
        // path,
      });
    } else {
      // console.log(execution);
      response.status(status).json({
        status: HttpStatusMessage.FAILED,
        statusCode: status,
        response: { ...execution }, //TODO change this in case of error in production
        message: execution.message,
        // errorStack,
        // path,
      });
    }
  }
}
