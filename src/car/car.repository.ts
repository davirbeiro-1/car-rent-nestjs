import { CarRepository } from "./car.repository.interface";

export class CarRepositoryImpl extends BaseRepository implements CarRepository{
    constructor(file: any) {
        super({ file });
    }

}