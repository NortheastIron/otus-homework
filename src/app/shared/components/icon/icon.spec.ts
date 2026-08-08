import { ComponentFixture, TestBed } from '@angular/core/testing';
import { inputBinding } from '@angular/core';

import { IconComponent } from './icon.component';


describe('Icon', () => {
  let component: IconComponent;
  let fixture: ComponentFixture<IconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconComponent, {
            bindings: [
                inputBinding('iconType', () => 'INFO'),
            ],
        });
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
