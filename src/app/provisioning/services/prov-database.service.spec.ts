import { TestBed } from '@angular/core/testing';

import { ProvDatabaseService } from './prov-database.service';

describe('ProvDatabaseService', () => {
  let service: ProvDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProvDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
