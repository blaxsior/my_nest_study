import {
  NestInterceptor,
  CallHandler,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { Reflector } from '@nestjs/core';
import { ClassType } from 'src/types/index.types';

@Injectable()
export class SerializeInterceptor1 implements NestInterceptor {
  constructor(private reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const Dto = this.reflector.getAllAndOverride<ClassType>('dto', [
      context.getHandler(),
      context.getClass(),
    ]);
    // https://docs.nestjs.com/fundamentals/execution-context#reflection-and-metadata
    // // run something before a request is handled
    // console.log('im running before handler', context);

    return next.handle().pipe(
      map((data: any) => {
        // // run something before response is sent out
        // console.log('im running after handler', data);
        // return data;
        return plainToClass(Dto, data, {
          excludeExtraneousValues: true, // 이외의 값은 무시
        });
      }),
    );
  }
}
