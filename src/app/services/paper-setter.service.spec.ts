import { TestBed, inject } from '@angular/core/testing';

import { PaperSetterService } from './paper-setter.service';

describe('PaperSetterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaperSetterService]
    });
  });

  it('should be created', inject([PaperSetterService], (service: PaperSetterService) => {
    expect(service).toBeTruthy();
  }));
});
