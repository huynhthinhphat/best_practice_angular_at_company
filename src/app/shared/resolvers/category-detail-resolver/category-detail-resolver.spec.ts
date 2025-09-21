import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { categoryDetailResolver } from './category-detail-resolver';
import { Category } from '../../models/category.model';

describe('categoryDetailResolver', () => {
  const executeResolver: ResolveFn<Category> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => categoryDetailResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
