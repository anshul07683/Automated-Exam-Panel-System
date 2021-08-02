import { TestBed, inject } from '@angular/core/testing';

import { ExaminerService } from './examiner.service';

describe('ExaminerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExaminerService]
    });
  });

  it('should be created', inject([ExaminerService], (service: ExaminerService) => {
    expect(service).toBeTruthy();
  }));
});
