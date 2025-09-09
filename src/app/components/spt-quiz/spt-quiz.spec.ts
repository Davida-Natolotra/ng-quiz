import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SptQuiz } from './spt-quiz';

describe('SptQuiz', () => {
  let component: SptQuiz;
  let fixture: ComponentFixture<SptQuiz>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SptQuiz]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SptQuiz);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
