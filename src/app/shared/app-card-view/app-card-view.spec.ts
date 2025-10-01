import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCardView } from './app-card-view';

describe('AppCardView', () => {
  let component: AppCardView;
  let fixture: ComponentFixture<AppCardView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppCardView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppCardView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
