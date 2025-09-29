import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSptQuiz } from './new-spt-quiz';

describe('NewSptQuiz', () => {
  let component: NewSptQuiz;
  let fixture: ComponentFixture<NewSptQuiz>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewSptQuiz]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewSptQuiz);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
