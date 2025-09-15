import { TestBed } from '@angular/core/testing';

import { OuSignals } from './ou-signals';

describe('OuSignals', () => {
  let service: OuSignals;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OuSignals);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
