import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperRecievedComponent } from './paper-recieved.component';

describe('PaperRecievedComponent', () => {
  let component: PaperRecievedComponent;
  let fixture: ComponentFixture<PaperRecievedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaperRecievedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaperRecievedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
