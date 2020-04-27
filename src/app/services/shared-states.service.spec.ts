import { TestBed } from '@angular/core/testing';

import { SharedStatesService } from './shared-states.service';

describe('SharedStatesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SharedStatesService = TestBed.get(SharedStatesService);
    expect(service).toBeTruthy();
  });
});
