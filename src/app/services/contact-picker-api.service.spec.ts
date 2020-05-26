import { TestBed } from '@angular/core/testing';

import { ContactPickerApiService } from './contact-picker-api.service';

describe('ContactPickerApiService', () => {
  let service: ContactPickerApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactPickerApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
