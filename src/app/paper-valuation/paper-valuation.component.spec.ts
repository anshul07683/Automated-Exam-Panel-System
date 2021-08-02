import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperValuationComponent } from './paper-valuation.component';

describe('PaperValuationComponent', () => {
  let component: PaperValuationComponent;
  let fixture: ComponentFixture<PaperValuationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaperValuationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaperValuationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
