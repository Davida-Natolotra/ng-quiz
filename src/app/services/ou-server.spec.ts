import { TestBed } from '@angular/core/testing';

import { OuServer } from './ou-server';

describe('OuServer', () => {
  let service: OuServer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OuServer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
