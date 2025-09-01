import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QuestionInterface } from '../models/question.interface';

@Injectable({
  providedIn: 'root',
})
export class Question {
  constructor(private http: HttpClient) {}

  getQuestions(): Observable<QuestionInterface[]> {
    return this.http.get<QuestionInterface[]>('/assets/questions.json');
  }
}
