import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SptAssessment } from './spt-assessment';

describe('SptAssessment', () => {
  let component: SptAssessment;
  let fixture: ComponentFixture<SptAssessment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SptAssessment],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(SptAssessment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should identify standard sections correctly', () => {
    const standardSection = {
      id: '1',
      title: 'Test',
      maxScore: 10,
      type: 'standard' as const,
      questions: [],
    };
    expect(component.isStandardSection(standardSection)).toBeTruthy();
  });

  it('should identify DQ sections correctly', () => {
    const dqSection = {
      id: '1',
      title: 'Test',
      maxScore: 10,
      type: 'dq' as const,
      questions: [],
    };
    expect(component.isDQSection(dqSection)).toBeTruthy();
  });
});
