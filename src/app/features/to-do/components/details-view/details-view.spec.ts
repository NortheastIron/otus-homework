import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToDoDetailsViewComponent } from './to-do.details-view.component';

describe('DetailsView', () => {
  let component: ToDoDetailsViewComponent;
  let fixture: ComponentFixture<ToDoDetailsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToDoDetailsViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToDoDetailsViewComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
