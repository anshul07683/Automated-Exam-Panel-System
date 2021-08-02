import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllotedComponent } from './alloted.component';

describe('AllotedComponent', () => {
  let component: AllotedComponent;
  let fixture: ComponentFixture<AllotedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllotedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllotedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
