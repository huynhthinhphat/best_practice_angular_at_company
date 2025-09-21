import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryEditPage } from './category-edit-page';

describe('CategoryEditPage', () => {
  let component: CategoryEditPage;
  let fixture: ComponentFixture<CategoryEditPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryEditPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
