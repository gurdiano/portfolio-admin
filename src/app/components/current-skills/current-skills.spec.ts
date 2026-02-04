import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentSkills } from './current-skills';

describe('CurrentSkills', () => {
  let component: CurrentSkills;
  let fixture: ComponentFixture<CurrentSkills>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentSkills]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentSkills);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
