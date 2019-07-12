import { TestBed } from '@angular/core/testing';

import { UsermanagerService } from './usermanager.service';

describe('UsermanagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UsermanagerService = TestBed.get(UsermanagerService);
    expect(service).toBeTruthy();
  });
});
