import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Report } from 'src/reports/report.entity';
import { User } from 'src/users/user.entity';

export const typeormDevConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'db.sqlite',
  entities: [User, Report],
  // 실행마다 환경 초기화
  synchronize: true,
  // 로그 출력. 배열 전달해서 원하는 로그만 고르기 가능
  logging: true,
};
