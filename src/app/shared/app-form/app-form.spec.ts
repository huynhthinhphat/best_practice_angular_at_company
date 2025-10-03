import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppForm } from './app-form';

describe('AppForm', () => {
  let component: AppForm<any>;
  let fixture: ComponentFixture<AppForm<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
