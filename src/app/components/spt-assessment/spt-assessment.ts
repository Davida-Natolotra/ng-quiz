import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CurrAssmt } from '../../services/curr-assmt';
import { ExtChecklist } from '../../services/ext/ext-checklist';
import { Section, StdQuestion, DQQuestion, Label } from '../../models/chk-spt.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-spt-assessment',
  imports: [
    CommonModule,
    MatButtonModule,
    MatRadioModule,
    MatExpansionModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './spt-assessment.html',
  styleUrl: './spt-assessment.css',
})
export class SptAssessment implements OnInit {
  ou_level: number = 3;
  department: string = 'ME';
  health_area: string = 'PALU';
  ou = this.ou_level == 2 ? 'REGION' : 'DISTRICT';
  sections: Section[] | undefined;
  assessmentId: string | null = null;

  constructor(
    public CurAssmtService: CurrAssmt,
    private ChecklistService: ExtChecklist,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.ChecklistService.getChecklists().subscribe((checklists) => {
      console.log('Checklists:', checklists);
    });
  }
}
