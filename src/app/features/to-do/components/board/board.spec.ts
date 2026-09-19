import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToDoBoardComponent } from './to-do.board.component';

describe('Board', () => {
  let component: ToDoBoardComponent;
  let fixture: ComponentFixture<ToDoBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToDoBoardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToDoBoardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
