import { Injectable, signal } from '@angular/core';
import { ChecklistBase } from '../models/chk-spt.interface';

@Injectable({
  providedIn: 'root',
})
export class CurrAssmt {
  currentAssessment = signal<ChecklistBase>({
    id: '',
    ou_level: 0,
    department: '',
    health_area: '',
    sections: [],
  });

  assessmentList = signal<ChecklistBase[]>([]);
}
