import { TestBed } from '@angular/core/testing';

import { CurrAssmt } from './curr-assmt';

describe('CurrAssmt', () => {
  let service: CurrAssmt;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrAssmt);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
