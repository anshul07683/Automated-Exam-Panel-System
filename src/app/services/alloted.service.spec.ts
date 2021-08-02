import { TestBed, inject } from '@angular/core/testing';

import { AllotedService } from './alloted.service';

describe('AllotedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AllotedService]
    });
  });

  it('should be created', inject([AllotedService], (service: AllotedService) => {
    expect(service).toBeTruthy();
  }));
});
