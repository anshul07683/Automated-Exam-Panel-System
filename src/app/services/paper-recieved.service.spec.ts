import { TestBed, inject } from '@angular/core/testing';

import { PaperRecievedService } from './paper-recieved.service';

describe('PaperRecievedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaperRecievedService]
    });
  });

  it('should be created', inject([PaperRecievedService], (service: PaperRecievedService) => {
    expect(service).toBeTruthy();
  }));
});
