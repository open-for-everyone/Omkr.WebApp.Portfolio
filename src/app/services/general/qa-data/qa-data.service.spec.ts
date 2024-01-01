import { TestBed } from '@angular/core/testing';

import { QaDataService } from './qa-data.service';

describe('QaDataService', () => {
  let service: QaDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QaDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
