import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseMsg } from './response-msg';

describe('ResponseMsg', () => {
  let component: ResponseMsg;
  let fixture: ComponentFixture<ResponseMsg>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponseMsg]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponseMsg);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
