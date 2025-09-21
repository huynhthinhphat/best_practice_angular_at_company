import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthRedirectPage } from './auth-redirect-page';

describe('AuthRedirectPage', () => {
  let component: AuthRedirectPage;
  let fixture: ComponentFixture<AuthRedirectPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthRedirectPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthRedirectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
