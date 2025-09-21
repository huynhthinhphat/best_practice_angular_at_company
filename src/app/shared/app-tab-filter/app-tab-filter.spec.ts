import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFilter } from './app-tab-filter';

describe('AppFilter', () => {
  let component: AppFilter;
  let fixture: ComponentFixture<AppFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppFilter]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AppFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
