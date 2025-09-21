import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { orderResolver } from './order-resolver';
import { Order } from '../../models/order.model';

describe('orderResolver', () => {
  const executeResolver: ResolveFn<Order> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => orderResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
