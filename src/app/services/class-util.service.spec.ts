import { TestBed } from '@angular/core/testing';

import { ClassUtilService } from './class-util.service';

describe('ClassUtilService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClassUtilService = TestBed.get(ClassUtilService);
    expect(service).toBeTruthy();
  });
});
