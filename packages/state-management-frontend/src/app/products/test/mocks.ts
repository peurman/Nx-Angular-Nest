import {
  ClappButtonModule,
  ClappCardModule,
  ClappPaginationModule,
  ClappSearchModule,
} from '@clapp1/clapp-angular';
import { Observable } from 'rxjs';

export const CLAPP_MODULES = [
  ClappPaginationModule,
  ClappButtonModule,
  ClappSearchModule,
  ClappCardModule,
];

export interface MockHttpClient {
  get: () => Observable<any>;
}

export const API_URL = 'http://domain.com/api';

export const MOCK_PRODUCTS_DATA = [
  {
    idProduct: '1',
    productName: 'name1',
    description: 'description1',
    price: 1,
    discount: 5,
    stock: 500,
    status: 'available',
  },
  {
    idProduct: '2',
    productName: 'name2',
    description: 'description2',
    price: 6,
    discount: 12,
    stock: 400,
    status: 'available',
  },
  {
    idProduct: '3',
    productName: 'name3',
    description: 'description3',
    price: 30,
    discount: 20,
    stock: 10,
    status: 'available',
  },
];
