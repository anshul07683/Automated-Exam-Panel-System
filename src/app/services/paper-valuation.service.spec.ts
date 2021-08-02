import { TestBed, inject } from '@angular/core/testing';

import { PaperValuationService } from './paper-valuation.service';

describe('PaperValuationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaperValuationService]
    });
  });

  it('should be created', inject([PaperValuationService], (service: PaperValuationService) => {
    expect(service).toBeTruthy();
  }));
});
