import { TestBed } from '@angular/core/testing';

import { CelebrationCardDialogService } from './celebration-card-dialog.service';

describe('CelebrationCardDialogService', () => {
  let service: CelebrationCardDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CelebrationCardDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
