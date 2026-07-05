import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToDoPageComponent } from './to-do.page.component';

describe('Page', () => {
  let component: ToDoPageComponent;
  let fixture: ComponentFixture<ToDoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToDoPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToDoPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
