import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarRepositoryImpl } from './car.repository';
@Module({
  providers: [CarService, {
    provide: 'CarRepository',
    useFactory: () => new CarRepositoryImpl({file: '../database/cars.json'})
  }]
})
export class CarModule {}
