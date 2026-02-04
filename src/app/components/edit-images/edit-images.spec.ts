import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditImages } from './edit-images';

describe('EditImages', () => {
  let component: EditImages;
  let fixture: ComponentFixture<EditImages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditImages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditImages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
