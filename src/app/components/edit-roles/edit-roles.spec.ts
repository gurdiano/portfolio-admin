import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRoles } from './edit-roles';

describe('EditRoles', () => {
  let component: EditRoles;
  let fixture: ComponentFixture<EditRoles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditRoles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditRoles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
