import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSkills } from './add-skills';

describe('AddSkills', () => {
  let component: AddSkills;
  let fixture: ComponentFixture<AddSkills>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSkills]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSkills);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
