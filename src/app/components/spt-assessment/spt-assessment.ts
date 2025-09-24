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
    // Get the assessment ID from route parameters if available
    this.assessmentId = this.route.snapshot.paramMap.get('id');

    this.ChecklistService.getChecklist({
      ou_level: Number(this.ou_level),
      department: this.department,
      health_area: this.health_area,
    }).subscribe({
      next: (chckl) => {
        if (chckl) {
          // const initializedChecklist = this.initializeSectionMaxScores(chckl);
          // this.CurAssmtService.currentAssessment.set(initializedChecklist);
          // this.sections = initializedChecklist.sections;
          console.log('Checklist loaded and initialized:', chckl);
        }
        console.log('Loaded checklist:', chckl);
      },
      error: (error) => {
        console.error('Error loading checklist:', error);
      },
    });
  }

  // Updated type guard methods
  isStandardSection(section: Section): section is Section & { contents: StdQuestion[] } {
    return section.type === 'standard';
  }

  isDQSection(section: Section): section is Section & { contents: DQQuestion[] } {
    return section.type === 'dq';
  }

  isLabelSection(section: Section): section is Section & { contents: Label[] } {
    return section.type === 'label';
  }

  getStandardQuestions(section: Section): StdQuestion[] {
    return this.isStandardSection(section) ? section.contents : [];
  }

  getDQQuestions(section: Section): DQQuestion[] {
    return this.isDQSection(section) ? section.contents : [];
  }

  getLabelContents(section: Section): Label[] {
    return this.isLabelSection(section) ? section.contents : [];
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
            const updatedContents = section.contents.map((question) => {
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
            const sectionScore = updatedContents.reduce((sum, q) => {
              if (q.response === 'Oui') {
                return sum + 1;
              }
              return sum;
            }, 0);

            // Calculate maxScore (exclude NA responses)
            const maxScore = updatedContents.filter((q) => q.response !== 'NA').length;

            return {
              ...section,
              contents: updatedContents,
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
        this.CurAssmtService.currentAssessment().sections.find((s) => s.id === sectionId)?.maxScore
      );
    }
  }

  // Add these methods to the SptAssessment class
  setObservation(params: { sectionId: string; questionId: string; observation: string }) {
    const currentAssessment = this.CurAssmtService.currentAssessment();
    if (!currentAssessment) return;

    const updatedAssessment = {
      ...currentAssessment,
      sections: currentAssessment.sections.map((section) => {
        if (section.id === params.sectionId && this.isStandardSection(section)) {
          return {
            ...section,
            contents: section.contents.map((question) => {
              if (question.id === params.questionId) {
                return {
                  ...question,
                  observation: params.observation,
                } as StdQuestion;
              }
              return question;
            }),
          };
        }
        return section;
      }),
    };

    this.CurAssmtService.currentAssessment.set(updatedAssessment);
  }

  saveAssessment() {
    const current = this.CurAssmtService.currentAssessment();
    if (!current) return;

    this.CurAssmtService.assessmentList.update((list) => {
      const index = list.findIndex((a) => a.id === current.id);
      if (index !== -1) {
        const newList = [...list];
        newList[index] = current;
        return newList;
      }
      return [...list, current];
    });

    console.log('Assessment saved successfully');
  }

  getObservation(sectionId: string, questionId: string): string {
    const currentAssessment = this.CurAssmtService.currentAssessment();
    if (!currentAssessment) return '';

    const section = currentAssessment.sections.find((s) => s.id === sectionId);
    if (!section || !this.isStandardSection(section)) return '';

    const question = section.contents.find((q) => q.id === questionId) as StdQuestion;
    return question?.observation || '';
  }

  // Helper method to get the current response for a question
  getQuestionResponse(sectionId: string, questionId: string): string {
    const currentAssessment = this.CurAssmtService.currentAssessment();
    if (!currentAssessment) return '';

    const section = currentAssessment.sections.find((s) => s.id === sectionId);
    if (!section || !this.isStandardSection(section)) return '';

    const question = section.contents.find((q) => q.id === questionId) as StdQuestion;
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
          const eligibleQuestions = section.contents.filter((q) => {
            return !q.response || q.response !== 'NA';
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
          const eligibleQuestions = section.contents.filter((q: StdQuestion) => {
            return !q.response || q.response !== 'NA';
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
