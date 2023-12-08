import { Injectable } from '@nestjs/common';
import { CarRepository } from './car.repository.interface';
@Injectable()
export class CarService {

    constructor(private readonly carRepository: CarRepository) {

    }

    async find(itemId : string) : Promise<string> {
        return await this.carRepository.find(itemId)
    }
}
