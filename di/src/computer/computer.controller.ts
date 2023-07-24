import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { NumbersDTO } from './dto/Numbers.dto';
import { CpuService } from '../cpu/cpu.service';
import { DiskService } from '../disk/disk.service';

@Controller('computer')
export class ComputerController {
  constructor(
    private cpuService: CpuService,
    private diskService: DiskService,
  ) {}
  @Post('calculate')
  postCompute(@Body() numbersDTO: NumbersDTO) {
    return this.cpuService.compute(numbersDTO.a, numbersDTO.b);
  }

  @Get('data/:id')
  getData(@Param('id', ParseIntPipe) id: number) {
    return this.diskService.getData(id);
  }

  @Post('run/:id')
  run(@Body() numbersDTO: NumbersDTO, @Param('id', ParseIntPipe) id: number) {
    return [
      this.cpuService.compute(numbersDTO.a, numbersDTO.b),
      this.diskService.getData(id),
    ];
  }
}
