import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperSetterComponent } from './paper-setter.component';

describe('PaperSetterComponent', () => {
  let component: PaperSetterComponent;
  let fixture: ComponentFixture<PaperSetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaperSetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaperSetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
