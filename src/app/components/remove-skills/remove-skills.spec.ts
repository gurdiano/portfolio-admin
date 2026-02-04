import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveSkills } from './remove-skills';

describe('RemoveSkills', () => {
  let component: RemoveSkills;
  let fixture: ComponentFixture<RemoveSkills>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveSkills]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoveSkills);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
