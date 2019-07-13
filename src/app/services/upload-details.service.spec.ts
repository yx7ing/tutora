import { TestBed } from '@angular/core/testing';

import { UploadDetailsService } from './upload-details.service';

describe('UploadDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UploadDetailsService = TestBed.get(UploadDetailsService);
    expect(service).toBeTruthy();
  });
});
