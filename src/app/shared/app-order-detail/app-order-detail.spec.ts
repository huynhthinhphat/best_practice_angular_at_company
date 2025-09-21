import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppOrderDetail } from './app-order-detail';

describe('AppOrderDetail', () => {
  let component: AppOrderDetail;
  let fixture: ComponentFixture<AppOrderDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppOrderDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppOrderDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
