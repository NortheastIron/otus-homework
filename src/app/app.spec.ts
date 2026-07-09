import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
    let component: App;
    let fixture: ComponentFixture<App>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [App],
        }).compileComponents();

        fixture = TestBed.createComponent(App);
        component = fixture.componentInstance;
    });

    it('should create the app', () => {
        expect(component).toBeTruthy();
    });

    it('should have router-outlet', async () => {
        const outlet = fixture.nativeElement.querySelector('router-outlet');
        expect(outlet).toBeTruthy();
    });
});
