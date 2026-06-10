import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToDoListComponent } from './to-do.list.component';

describe('List', () => {
  let component: ToDoListComponent;
  let fixture: ComponentFixture<ToDoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToDoListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToDoListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
