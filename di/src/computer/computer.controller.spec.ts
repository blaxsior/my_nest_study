import { Test, TestingModule } from '@nestjs/testing';
import { ComputerController } from './computer.controller';
import { CpuModule } from '../cpu/cpu.module';
import { DiskModule } from '../disk/disk.module';
import { NumbersDTO } from './dto/Numbers.dto';

describe('ComputerController', () => {
  let controller: ComputerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComputerController],
      imports: [CpuModule, DiskModule],
    }).compile();

    controller = module.get<ComputerController>(ComputerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('calculate 1 + 2 = 3', () => {
    const dto: NumbersDTO = {
      a: 1,
      b: 2,
    };
    expect(controller.postCompute(dto)).toEqual(3);
  });
});
