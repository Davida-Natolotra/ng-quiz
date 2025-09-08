import { Component, OnInit } from '@angular/core';
import { CurrAssmt } from '../../services/curr-assmt';
import { Checklist } from '../../services/checklist';
import { inject } from '@angular/core/primitives/di';

@Component({
  selector: 'app-spt-assessment',
  imports: [],
  templateUrl: './spt-assessment.html',
  styleUrl: './spt-assessment.css',
})
export class SptAssessment implements OnInit {
  CurAssmtService = inject(CurrAssmt);
  ChecklistService = inject(Checklist);

  constructor() {}

  ngOnInit(): void {
    this.ChecklistService.getChecklists().subscribe((checklist) => {
      this.CurAssmtService.assessmentList.set(checklist);
      console.log(checklist);
    });
  }
}
