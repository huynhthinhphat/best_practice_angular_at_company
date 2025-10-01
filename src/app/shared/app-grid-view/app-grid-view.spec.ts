import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppGridView } from './app-grid-view';

describe('AppGridView', () => {
    let component: AppGridView<any>;
    let fixture: ComponentFixture<AppGridView<any>>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppGridView]
        })
            .compileComponents();

        fixture = TestBed.createComponent(AppGridView);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
