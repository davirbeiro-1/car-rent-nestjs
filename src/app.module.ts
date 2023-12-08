import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RentCarModule } from './rent-car/rent-car.module';
import { CarModule } from './car/car.module';
import { TaxModule } from './tax/tax.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [RentCarModule, CarModule, TaxModule, TransactionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
