import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartListPage } from './cart-list-page';

describe('CartListPage', () => {
  let component: CartListPage;
  let fixture: ComponentFixture<CartListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartListPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
