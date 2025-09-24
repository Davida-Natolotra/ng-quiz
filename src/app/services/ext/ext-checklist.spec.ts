import { TestBed } from '@angular/core/testing';

import { ExtChecklist } from './ext-checklist';

describe('ExtChecklist', () => {
  let service: ExtChecklist;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExtChecklist);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
