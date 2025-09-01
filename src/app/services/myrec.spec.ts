import { TestBed } from '@angular/core/testing';

import { Myrec } from './myrec';

describe('Myrec', () => {
  let service: Myrec;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Myrec);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
