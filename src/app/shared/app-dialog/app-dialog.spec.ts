import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDialog } from './app-dialog';

describe('AppDialog', () => {
  let component: AppDialog<any>;
  let fixture: ComponentFixture<AppDialog<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
