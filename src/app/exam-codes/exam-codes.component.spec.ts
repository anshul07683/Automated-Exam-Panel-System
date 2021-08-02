import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamCodesComponent } from './exam-codes.component';

describe('ExamCodesComponent', () => {
  let component: ExamCodesComponent;
  let fixture: ComponentFixture<ExamCodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamCodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
