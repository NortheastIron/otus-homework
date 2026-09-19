import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToDoBacklogComponent } from './to-do.backlog.component';

describe('Backlog', () => {
  let component: ToDoBacklogComponent;
  let fixture: ComponentFixture<ToDoBacklogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToDoBacklogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToDoBacklogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
