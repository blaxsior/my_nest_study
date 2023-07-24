import { IsInt } from 'class-validator';

export class NumbersDTO {
  @IsInt() a: number;
  @IsInt() b: number;
}
