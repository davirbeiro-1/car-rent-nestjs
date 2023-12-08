import { Module } from '@nestjs/common';
import { RentCarService } from './rent-car.service';
import { CarModule } from 'src/car/car.module';
import { TaxModule } from 'src/tax/tax.module';

@Module({
  providers: [RentCarService],
  imports: [CarModule, TaxModule]
})
export class RentCarModule {}
