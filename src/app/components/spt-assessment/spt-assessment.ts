import { Component, OnInit } from '@angular/core';
import { CurrAssmt } from '../../services/curr-assmt';
import { Checklist } from '../../services/checklist';
import { Section } from '../../models/spt.interface';

@Component({
  selector: 'app-spt-assessment',
  imports: [],
  templateUrl: './spt-assessment.html',
  styleUrl: './spt-assessment.css',
})
export class SptAssessment implements OnInit {
  ou_level: number = 2;
  department: string = 'ME';
  health_area: string = 'PALU';
  ou = this.ou_level == 2 ? 'REGION' : 'DITRICT';
  sections: Section[] | undefined;

  constructor(
    private CurAssmtService: CurrAssmt,
    private ChecklistService: Checklist,
  ) {}

  ngOnInit(): void {
    this.ChecklistService.getChecklist({
      ou_level: Number(this.ou_level),
      department: this.department,
      health_area: this.health_area,
    }).subscribe((chckl) => {
      if (chckl) {
        this.CurAssmtService.currentAssessment.set(chckl);
      }
      console.log(chckl);
      this.sections = this.CurAssmtService.currentAssessment().sections;
    });
  }
}
