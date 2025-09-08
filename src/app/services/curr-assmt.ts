import { Injectable, signal } from '@angular/core';
import { ChecklistBase } from '../models/spt.interface';

@Injectable({
  providedIn: 'root',
})
export class CurrAssmt {
  currentAssessment = signal<ChecklistBase>({
    id: '',
    ou_level: 0,
    department: '',
    health_area: '',
    sections: [
      {
        id: '',
        title: '',
        maxScore: 0,
        type: 'standard',
        questions: [
          {
            id: '',
            subject: '',
            level: 0,
            parentId: '',
            score: 0,
          },
        ],
      },
    ],
  });

  assessmentList = signal<ChecklistBase[]>([]);
}
