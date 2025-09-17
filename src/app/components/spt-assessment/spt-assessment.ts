import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CurrAssmt } from '../../services/curr-assmt';
import { Checklist } from '../../services/checklist';
import { Section, StdQuestion, DQQuestion } from '../../models/spt.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-spt-assessment',
  imports: [CommonModule, MatButtonModule, MatRadioModule],
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
    public CurAssmtService: CurrAssmt,
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
          const initializedChecklist = this.initializeSectionMaxScores(chckl);
          this.CurAssmtService.currentAssessment.set(initializedChecklist);
          this.sections = initializedChecklist.sections;
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

  setQScore(params: {
    isStandardSection: boolean;
    sectionId: string;
    level: number;
    questionId: string;
    response: string;
  }) {
    const { isStandardSection, sectionId, level, questionId, response } = params;
    if (isStandardSection) {
      const currentAssessment = this.CurAssmtService.currentAssessment();
      if (!currentAssessment) return;

      // Calculate score based on response
      let score: number;
      if (response === 'Oui') {
        score = 1;
      } else if (response === 'Non') {
        score = 0;
      } else if (response === 'NA') {
        // For NA, we set score to 0 but mark it differently
        score = 0;
      } else {
        return; // Invalid response
      }

      // Update the assessment
      const updatedAssessment = {
        ...currentAssessment,
        sections: currentAssessment.sections.map((section) => {
          if (section.id === sectionId && this.isStandardSection(section)) {
            const updatedQuestions = section.questions.map((question) => {
              if (question.id === questionId) {
                return {
                  ...question,
                  score,
                  response: response as 'Oui' | 'Non' | 'NA',
                } as StdQuestion;
              }
              return question;
            }) as StdQuestion[];

            // Calculate section score (only count Oui responses)
            const sectionScore = updatedQuestions.reduce((sum, q) => {
              if (q.response === 'Oui') {
                return sum + 1;
              }
              return sum;
            }, 0);

            // Calculate maxScore (exclude NA responses and level 0 questions from possible maximum)
            const maxScore = updatedQuestions.filter(
              (q) => q.level !== 0 && q.response !== 'NA',
            ).length;

            return {
              ...section,
              questions: updatedQuestions,
              score: sectionScore,
              maxScore: maxScore,
            };
          }
          return section;
        }),
      };

      this.CurAssmtService.currentAssessment.set(updatedAssessment);

      // Recalculate all maxScores to ensure consistency
      this.recalculateAllMaxScores();

      console.log(
        'Updated assessment - Question:',
        questionId,
        'Response:',
        response,
        'Score:',
        score,
        'Section MaxScore:',
        this.CurAssmtService.currentAssessment().sections.find((s) => s.id === sectionId)?.maxScore,
      );
    }
  }

  // Helper method to get the current response for a question
  getQuestionResponse(sectionId: string, questionId: string): string {
    const currentAssessment = this.CurAssmtService.currentAssessment();
    if (!currentAssessment) return '';

    const section = currentAssessment.sections.find((s) => s.id === sectionId);
    if (!section || !this.isStandardSection(section)) return '';

    const question = section.questions.find((q) => q.id === questionId) as StdQuestion;
    return question?.response || '';
  }

  // Helper method to recalculate maxScore for all sections
  private recalculateAllMaxScores(): void {
    const currentAssessment = this.CurAssmtService.currentAssessment();
    if (!currentAssessment) return;

    const updatedAssessment = {
      ...currentAssessment,
      sections: currentAssessment.sections.map((section) => {
        if (this.isStandardSection(section)) {
          const eligibleQuestions = section.questions.filter((q) => {
            return q.level !== 0 && (!q.response || q.response !== 'NA');
          });
          return {
            ...section,
            maxScore: eligibleQuestions.length,
          };
        }
        return section;
      }),
    };

    this.CurAssmtService.currentAssessment.set(updatedAssessment);
  }

  // Helper method to initialize section maxScores based on question count
  private initializeSectionMaxScores(checklist: any): any {
    return {
      ...checklist,
      sections: checklist.sections.map((section: any) => {
        if (section.type === 'standard') {
          // For standard sections, maxScore is the number of questions that are not level 0 (headers)
          // and are not answered as NA
          const eligibleQuestions = section.questions.filter((q: StdQuestion) => {
            return q.level !== 0 && (!q.response || q.response !== 'NA');
          });
          return {
            ...section,
            maxScore: eligibleQuestions.length,
            score: section.score || 0,
          };
        }
        return section;
      }),
    };
  }
}
