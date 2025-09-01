import { Injectable, signal } from '@angular/core';
import { QuestionInterface } from '../models/question.interface';

@Injectable({
  providedIn: 'root',
})
export class Myrec {
  myrecs = signal<QuestionInterface[]>([]);
}
