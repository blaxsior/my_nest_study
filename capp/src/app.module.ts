import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormDevConfig } from './config/typeorm/dev.config';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    UsersModule,
    ReportsModule,
    TypeOrmModule.forRoot(typeormDevConfig),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
