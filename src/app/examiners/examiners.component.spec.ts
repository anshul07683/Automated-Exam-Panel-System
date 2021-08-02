import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExaminersComponent } from './examiners.component';

describe('ExaminersComponent', () => {
  let component: ExaminersComponent;
  let fixture: ComponentFixture<ExaminersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExaminersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExaminersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
