import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkSkills } from './link-skills';

describe('LinkSkills', () => {
  let component: LinkSkills;
  let fixture: ComponentFixture<LinkSkills>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkSkills]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkSkills);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
