import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SptAssessment } from './spt-assessment';

describe('SptAssessment', () => {
  let component: SptAssessment;
  let fixture: ComponentFixture<SptAssessment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SptAssessment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SptAssessment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
