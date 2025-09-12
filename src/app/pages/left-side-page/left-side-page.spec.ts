import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftSidePage } from './left-side-page';

describe('LeftSidePage', () => {
  let component: LeftSidePage;
  let fixture: ComponentFixture<LeftSidePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeftSidePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeftSidePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
