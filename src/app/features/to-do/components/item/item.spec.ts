import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToDoItemComponent } from './to-do.item.component';

describe('Item', () => {
  let component: ToDoItemComponent;
  let fixture: ComponentFixture<ToDoItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToDoItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToDoItemComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
