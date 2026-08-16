import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToDoCreateItemComponent } from './to-do.create-item.component';

describe('ToDoCreateItemComponent', () => {
  let component: ToDoCreateItemComponent;
  let fixture: ComponentFixture<ToDoCreateItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToDoCreateItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToDoCreateItemComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
