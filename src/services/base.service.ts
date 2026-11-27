import { AxiosInstance } from 'axios';
import { ApiService } from '../config/api';

export abstract class BaseService {
    protected readonly api: AxiosInstance;

    constructor() {
        this.api = ApiService.getInstance();
    }
}