import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTechnologies } from './create-technologies';

describe('CreateTechnologies', () => {
  let component: CreateTechnologies;
  let fixture: ComponentFixture<CreateTechnologies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTechnologies]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTechnologies);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
