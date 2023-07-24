import { Module } from '@nestjs/common';
import { PowerService } from './power.service';

@Module({
  providers: [PowerService],
  exports: [PowerService], // 외부에서 접근하도록 명시적으로 exports에 등록
})
export class PowerModule {}
