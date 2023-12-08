import { Test, TestingModule } from '@nestjs/testing';
import { RentCarService } from '../rent-car.service';
import { CarService } from '../../car/car.service';
import { TaxService } from '../../tax/tax.service';
import { TransactionEntity } from '../../transaction/transaction.entity';
const { join } = require('path');
const carDatabase = join(__dirname, '../../../database', 'cars.json');

const mocks = {
  validCarCategory: require('../../../test/mocks/valid-carCategory.json'),
  validCar: require('../../../test/mocks/valid-cars.json'),
  validCustomer: require('../../../test/mocks/valid-customer.json'),
};

describe('Rent Car Service Teste', () => {
  let rentService: RentCarService;
  let carServiceMock = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        RentCarService,
        {
          provide: CarService,
          useValue: carServiceMock,
        },
      ],
    }).compile();

    rentService = app.get<RentCarService>(RentCarService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should retrieve a random position from an array', () => {
    const data = [0, 1, 2, 3, 4];
    const result = rentService.getRandomPositionFromArray(data);
    expect(result).toBeLessThan(data.length);
  });

  it('should choose the first id form carIds in carCategory', () => {
    const carCategory = mocks.validCarCategory;
    const carIndex = 0;
    jest
      .spyOn(rentService, 'getRandomPositionFromArray')
      .mockReturnValue(carIndex);
    const result = rentService.chooseRandomCar(carCategory);
    const expected = carCategory.carIds[carIndex];
    expect(rentService.getRandomPositionFromArray).toHaveBeenCalled();
    expect(result).toBe(expected);
  });

  it('given a carCategory it should return an avaliable car', async () => {
    const car = mocks.validCar;
    const carCategory = mocks.validCarCategory;
    carCategory.carIds = [car.id];
    carServiceMock.find.mockResolvedValue(car);
    const chooseRandomCarSpy = jest.spyOn(rentService, 'chooseRandomCar');
    const result = await rentService.getAvaliableCar(carCategory);
    const expected = car;
    expect(result).toBe(expected);
    expect(chooseRandomCarSpy).toHaveBeenCalled();
    expect(carServiceMock.find).toHaveBeenCalledWith(car.id);
  });

  it('given a carCategory, customer and numberOfDays it should calculated final amount in real', async () => {
    const customer = Object.create(mocks.validCustomer);

    customer.age = 50;
    const carCategory = Object.create(mocks.validCarCategory);
    carCategory.price = 37.6;
    jest
      .spyOn(TaxService, 'taxesBasedOnAge', 'get')
      .mockReturnValue([{ from: 40, to: 50, then: 1.3 }]);
    const numberOfDays = 5;
    const expected = rentService.currencyFormat.format(244.4);
    const result = rentService.calculateFinalPrice(
      customer,
      carCategory,
      numberOfDays,
    );
    expect(result).toBe(expected);
  });

  it.only('given a customer and a car category it should return a transaction receipt', async () => {
    const car = mocks.validCar;
    const carCategory = {
      ...mocks.validCarCategory,
      price: 37.6,
      carIds: [car.id],
    };
    const customer = Object.create(mocks.validCustomer);
    customer.age = 20;
    const numberOfDays = 5;
    const dueDate = '10 de novembro de 2020';
    const now = new Date(2020, 10, 5).getTime();
    console.log(now);
    jest.useFakeTimers().setSystemTime(now);
    jest.spyOn(carServiceMock, 'find').mockResolvedValue(car);

    const expectedAmount = rentService.currencyFormat.format(206.8);
    console.log(expectedAmount);
    console.log('BEFORE FUNC', carCategory);
    const result = await rentService.rent(customer, carCategory, numberOfDays);
    const expected = new TransactionEntity({
      customer,
      car,
      dueDate,
      amount: expectedAmount,
    });
    console.log(expected);
    expect(result).toStrictEqual(expected);
  });
});
