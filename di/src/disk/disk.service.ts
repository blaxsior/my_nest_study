import { Injectable } from '@nestjs/common';
import { PowerService } from '../power/power.service';

@Injectable()
export class DiskService {
  constructor(private powerService: PowerService) {}

  getData(id: number) {
    console.log('데이터 읽는데 20와트 사용');
    this.powerService.supplyPower(20);
    return `data id: ${id}`;
  }
}
