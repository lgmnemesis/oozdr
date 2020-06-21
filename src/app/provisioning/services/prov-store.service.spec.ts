import { TestBed } from '@angular/core/testing';

import { ProvStoreService } from './prov-store.service';

describe('ProvStoreService', () => {
  let service: ProvStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProvStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
