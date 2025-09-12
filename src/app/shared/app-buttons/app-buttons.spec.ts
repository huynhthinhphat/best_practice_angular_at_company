import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppButtons } from './app-buttons';

describe('AppButtons', () => {
  let component: AppButtons;
  let fixture: ComponentFixture<AppButtons>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppButtons]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppButtons);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
