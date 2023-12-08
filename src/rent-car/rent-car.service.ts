import { Injectable } from '@nestjs/common';
import { CarService } from '../car/car.service';
import { TaxService } from '../tax/tax.service';
import { TransactionEntity } from '../transaction/transaction.entity';

@Injectable()
export class RentCarService {
    currencyFormat : any;
    constructor(private readonly carService: CarService) {
        this.currencyFormat = new Intl.NumberFormat('pt-br', {
            style: 'currency',
            currency: 'BRL'
        })
    }
    getRandomPositionFromArray(list) {
        const listLength = list.length
        return Math.floor(Math.random() * (listLength))
    }

    chooseRandomCar(carCategory) {
        const randomCarIndex = this.getRandomPositionFromArray(carCategory.carIds)
        const carId = carCategory.carIds[randomCarIndex]
        return carId
    }

    async getAvaliableCar(carCategory) {
        const carId = this.chooseRandomCar(carCategory)
        console.log(carId);
        const car = await this.carService.find(carId)
        return car
    }

     calculateFinalPrice(customer, carCategory, numberOfDays) {
        console.log('Customer', carCategory, numberOfDays);
        const {age} = customer
        const {price} = carCategory
        console.log('idade', age);
        const {then: tax} = TaxService.taxesBasedOnAge.find(tax=> {
            console.log('Tax', tax);
            return age>= tax.from && age<= tax.to
        })
            
        const finalPrice = ((tax * price) * (numberOfDays))
        return this.currencyFormat.format(finalPrice)
    }

    async rent(customer, carCategory, numberOfDays) {
        const car = await this.getAvaliableCar(carCategory)
        const finalPrice = this.calculateFinalPrice(customer, carCategory, numberOfDays)
        const today = new Date()
        const today1 = today
        console.log('Today', today.getTime());
        today.setDate(today.getDate() + numberOfDays)
        const options : any = {year: 'numeric', month: "long", day: "numeric"}
        const dueDate = today.toLocaleDateString("pt-br", options)
        const transaction = new TransactionEntity({customer, car, dueDate, amount: finalPrice})
        return transaction
    }
}
