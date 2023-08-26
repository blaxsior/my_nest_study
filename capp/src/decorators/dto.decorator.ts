import { SetMetadata } from '@nestjs/common';
import { ClassType } from '../types/index.types';

export function UseDto<T extends ClassType>(dto: T) {
  return SetMetadata('dto', dto);
}
