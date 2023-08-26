import {
  NestInterceptor,
  CallHandler,
  ExecutionContext,
  Injectable,
  UseInterceptors,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { ClassType } from '../types/index.types';

export function SerializeDTO(dto: ClassType) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassType) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // // run something before a request is handled
    // console.log('im running before handler', context);

    return next.handle().pipe(
      map((data: any) => {
        // // run something before response is sent out
        // console.log('im running after handler', data);
        // return data;
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true, // 이외의 값은 무시
        });
      }),
    );
  }
}
