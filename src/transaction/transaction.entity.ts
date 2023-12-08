import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionEntity {
    private customer : any
    private car : any
    private amount : any
    private dueDate : any
    
    constructor({customer, car, amount, dueDate}) {
        this.customer = customer
        this.car = car
        this.amount = amount
        this.dueDate = dueDate
    }
}

