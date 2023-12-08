export interface CarRepository {
    find(itemId: string): Promise<any>;
}