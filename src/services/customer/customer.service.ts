import { BaseService } from "../base.service";
import { Customer } from "@/types/api/customer.types";


export default class CustomerService extends BaseService {
    constructor() {
        super();
    }

    async getCustomers(): Promise<Customer[]> {
        const response = await this.api.get('/customer/list');
        return response.data.customers;
    }
}
