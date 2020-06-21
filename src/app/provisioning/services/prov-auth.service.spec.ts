import { TestBed } from '@angular/core/testing';

import { ProvAuthService } from './prov-auth.service';

describe('ProvAuthService', () => {
  let service: ProvAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProvAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
