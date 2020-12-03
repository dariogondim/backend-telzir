import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CostController } from './cost/cost.controller';
import { CostService } from './cost/cost.service';

@Module({
  imports: [],
  controllers: [AppController, CostController],
  providers: [AppService, CostService],
})
export class AppModule {}
