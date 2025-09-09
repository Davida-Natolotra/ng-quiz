import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CurrAssmt } from '../../services/curr-assmt';
import { Checklist } from '../../services/checklist';
import { Section, StdQuestion, DQQuestion } from '../../models/spt.interface';

@Component({
  selector: 'app-spt-assessment',
  imports: [CommonModule],
  templateUrl: './spt-assessment.html',
  styleUrl: './spt-assessment.css',
})
export class SptAssessment implements OnInit {
  ou_level: number = 2;
  department: string = 'ME';
  health_area: string = 'PALU';
  ou = this.ou_level == 2 ? 'REGION' : 'DISTRICT';
  sections: Section[] | undefined;
  assessmentId: string | null = null;

  constructor(
    private CurAssmtService: CurrAssmt,
    private ChecklistService: Checklist,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // Get the assessment ID from route parameters if available
    this.assessmentId = this.route.snapshot.paramMap.get('id');

    this.ChecklistService.getChecklist({
      ou_level: Number(this.ou_level),
      department: this.department,
      health_area: this.health_area,
    }).subscribe({
      next: (chckl) => {
        if (chckl) {
          this.CurAssmtService.currentAssessment.set(chckl);
          this.sections = chckl.sections;
        }
        console.log('Loaded checklist:', chckl);
      },
      error: (error) => {
        console.error('Error loading checklist:', error);
      },
    });
  }

  // Type guard methods for template
  isStandardSection(section: Section): section is Section & { questions: StdQuestion[] } {
    return section.type === 'standard';
  }

  isDQSection(section: Section): section is Section & { questions: DQQuestion[] } {
    return section.type === 'dq';
  }

  getStandardQuestions(section: Section): StdQuestion[] {
    return this.isStandardSection(section) ? section.questions : [];
  }

  getDQQuestions(section: Section): DQQuestion[] {
    return this.isDQSection(section) ? section.questions : [];
  }
}
