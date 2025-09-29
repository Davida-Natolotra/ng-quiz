import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  Section,
  StdQuestion,
  DQQuestion,
  Label,
  DataMonth,
  LM,
  IndMois,
} from '../../models/chk-spt.interface';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  AbstractControl,
  FormControl,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { CurrAssmt } from '../../services/curr-assmt';
import { ExtChecklist } from '../../services/ext/ext-checklist';

// Angular Material
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-spt-quiz',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    FormsModule,
    MatProgressSpinner,
    MatSlideToggleModule,
    MatChipsModule,
    MatListModule,
    MatDividerModule,
  ],
  templateUrl: './spt-quiz.html',
  styleUrls: ['./spt-quiz.scss'],
})
export class SptQuiz implements OnInit, OnDestroy {
  ou_level: number = 3;
  department: string = 'DPAL';
  health_area: string = 'PALU';
  quizForm: FormGroup;
  isLoading = true;
  private formSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private curAssmtService: CurrAssmt,
    private ExtChecklistService: ExtChecklist,
  ) {
    this.quizForm = this.fb.group({
      sections: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.loadChecklist();
  }

  ngOnDestroy() {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  private loadChecklist(): void {
    this.ExtChecklistService.getChecklist({
      ou_level: this.ou_level,
      department: this.department,
      health_area: this.health_area,
    }).subscribe({
      next: (checklist) => {
        if (checklist) {
          this.curAssmtService.currentAssessment.set(checklist);
          this.initializeForm();
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
      },
    });
  }

  private initializeForm(): void {
    const sectionsArray = this.quizForm.get('sections') as FormArray;
    sectionsArray.clear();
    const currentAssessment = this.curAssmtService.currentAssessment();

    if (!currentAssessment) {
      return;
    }

    this.curAssmtService
      .currentAssessment()
      .sections.forEach((section: Section, sectionIndex: number) => {
        const sectionGroup = this.fb.group({
          id: [section.id],
          title: [section.title],
          maxScore: [section.maxScore],
          type: [section.type], // This should be 'standard' or 'dq'
          score: [section.score || 0],
          contents: this.fb.array([]),
        });

        // Add section to form array
        sectionsArray.push(sectionGroup);

        // Get the contents form array for this section
        const contentsArray = sectionGroup.get('contents') as FormArray;

        // Process each content item based on its type
        section.contents.forEach((content, contentIndex) => {
          if (content.type === 'question') {
            contentsArray.push(this.createStdQuestionGroup(content as StdQuestion));
          } else if (content.type === 'label') {
            contentsArray.push(this.createLabelGroup(content as Label));
          } else if ('ind_mois' in content) {
            // This is a DQ question (doesn't have a type field, but has ind_mois)
            contentsArray.push(this.createDQQuestionGroup(content as DQQuestion));
          }
        });

        // Calculate maxScore based on eligible questions (those not marked as "NA")
        const maxScore = this.calculateMaxScore(contentsArray);
        sectionGroup.patchValue({ maxScore });

        // Set up reactive calculations for DQ questions
        this.setupDQCalculations(contentsArray);
      });

    // Subscribe to form value changes to update scores dynamically
    this.formSubscription = this.quizForm.valueChanges.subscribe(() => {
      this.updateAllSectionScores();
    });
  }

  private createStdQuestionGroup(question: StdQuestion): FormGroup {
    return this.fb.group({
      id: [question.id],
      type: ['question'], // Match the JSON structure
      subject: [question.subject],
      score: [question.score],
      response: [question.response || ''],
      observation: [question.observation || ''],
      parentId: [question.parentId || ''],
    });
  }

  private createDQQuestionGroup(question: DQQuestion): FormGroup {
    return this.fb.group({
      id: [question.id],
      type: ['dq'], // Set type for identification
      ind_mois: this.fb.array(question.ind_mois.map((ind) => this.createIndMoisGroup(ind))),
      lqas: this.fb.array(question.lqas.map((lqas) => this.createLMGroup(lqas))),
      score: [question.score || 0],
    });
  }

  private createIndMoisGroup(indMois: any): FormGroup {
    return this.fb.group({
      id: [indMois.id],
      indicator_name: [indMois.indicator_name],
      dataMonths: this.fb.array(
        indMois.dataMonths.map((month: any) => this.createDataMonthGroup(month)),
      ),
    });
  }

  private createDataMonthGroup(month: DataMonth): FormGroup {
    return this.fb.group({
      id: [month.id],
      mois: [month.mois],
      base_name: [month.base_name],
      base_data: [month.base_data, [Validators.min(0)]],
      recount_source: [month.recount_source],
      recount_data: [month.recount_data, [Validators.min(0)]],
      rate: [month.rate],
      concordance: [month.concordance],
      enabled: [false], // Add toggle control for editing protection
    });
  }

  private createLMGroup(lm: any): FormGroup {
    return this.fb.group({
      id: [lm.id],
      mois: [lm.mois],
      total: [lm.total],
    });
  }

  private createLabelGroup(label: Label): FormGroup {
    return this.fb.group({
      id: [label.id],
      type: ['label'], // Match the JSON structure
      name: [label.name],
      level: [label.level],
    });
  }

  // Helper methods for template with proper typing
  get sectionsArray(): FormArray<FormGroup> {
    return this.quizForm.get('sections') as FormArray<FormGroup>;
  }

  getContentsArray(section: FormGroup): FormArray<FormGroup> {
    return section.get('contents') as FormArray<FormGroup>;
  }

  getIndMoisArray(content: FormGroup): FormArray<FormGroup> {
    return content.get('ind_mois') as FormArray<FormGroup>;
  }

  getDataMonthsArray(indicator: FormGroup): FormArray<FormGroup> {
    return indicator.get('dataMonths') as FormArray<FormGroup>;
  }

  getLqasArray(content: FormGroup): FormArray<FormGroup> {
    return content.get('lqas') as FormArray<FormGroup>;
  }

  // Type guards for template with proper typing
  isStandardQuestion(content: AbstractControl): content is FormGroup {
    if (!(content instanceof FormGroup)) return false;
    const type = content.get('type')?.value;
    return type === 'question';
  }

  isDataQualityQuestion(content: AbstractControl): content is FormGroup {
    if (!(content instanceof FormGroup)) return false;
    const type = content.get('type')?.value;
    return type === 'dq';
  }

  isLabelContent(content: AbstractControl): content is FormGroup {
    if (!(content instanceof FormGroup)) return false;
    const type = content.get('type')?.value;
    return type === 'label';
  }

  calculateSectionScore(section: any): number {
    const contentsArray = section.get('contents') as FormArray;
    if (!contentsArray) return 0;

    const sectionType = section.get('type')?.value;

    if (sectionType === 'dq') {
      // For DQ sections, calculate score as average of LQAS totals divided by 3
      let totalLqasSum = 0;
      let lqasCount = 0;

      contentsArray.controls.forEach((content: AbstractControl) => {
        if (this.isDataQualityQuestion(content)) {
          const lqasArray = this.getLqasArray(content as FormGroup);
          if (lqasArray) {
            lqasArray.controls.forEach((lqas: AbstractControl) => {
              const lqasGroup = lqas as FormGroup;
              const total = lqasGroup.get('total')?.value || 0;
              totalLqasSum += total;
              lqasCount++;
            });
          }
        }
      });

      if (lqasCount === 0) return 100; // 100% if no data quality issues
      const averageLqas = totalLqasSum / lqasCount;
      // Convert to percentage: lower LQAS (fewer discordant indicators) = higher percentage
      const percentage = Math.max(0, ((3 - averageLqas) / 3) * 100);
      return Math.round(percentage * 100) / 100; // Round to 2 decimal places
    } else {
      // For standard sections, calculate percentage based on score/maxScore
      const currentScore = contentsArray.controls.reduce(
        (sum: number, content: AbstractControl) => {
          if (this.isStandardQuestion(content)) {
            const response = content.get('response')?.value;
            if (response === 'Oui') return sum + 1;
            if (response === 'Non') return sum + 0;
            // If response is 'NA' or empty, don't add to score (excluded from calculation)
            return sum;
          }
          return sum;
        },
        0,
      );

      const maxScore = this.calculateMaxScore(contentsArray);
      if (maxScore === 0) return 0;

      const percentage = (currentScore / maxScore) * 100;
      return Math.round(percentage * 100) / 100; // Round to 2 decimal places
    }
  }

  private calculateMaxScore(contentsArray: FormArray): number {
    return contentsArray.controls.reduce((max: number, content: AbstractControl) => {
      if (this.isStandardQuestion(content)) {
        const response = content.get('response')?.value;
        // Only count questions that are not marked as "NA"
        if (response !== 'NA') {
          return max + 1;
        }
      }
      return max;
    }, 0);
  }

  private updateAllSectionScores(): void {
    const sectionsArray = this.sectionsArray;

    sectionsArray.controls.forEach((section: FormGroup, index: number) => {
      const contentsArray = section.get('contents') as FormArray;
      if (contentsArray) {
        // Recalculate maxScore based on current responses
        const maxScore = this.calculateMaxScore(contentsArray);
        const currentScore = this.calculateSectionScore(section);

        // Update the section's maxScore and score
        section.patchValue(
          {
            maxScore: maxScore,
            score: currentScore,
          },
          { emitEvent: false },
        );
      }
    });
  }

  private setupDQCalculations(contentsArray: FormArray): void {
    contentsArray.controls.forEach((content: AbstractControl) => {
      if (this.isDataQualityQuestion(content)) {
        const dqGroup = content as FormGroup;
        const indMoisArray = dqGroup.get('ind_mois') as FormArray;

        if (indMoisArray) {
          indMoisArray.controls.forEach((indicator: AbstractControl) => {
            const indicatorGroup = indicator as FormGroup;
            const dataMonthsArray = indicatorGroup.get('dataMonths') as FormArray;

            if (dataMonthsArray) {
              dataMonthsArray.controls.forEach((month: AbstractControl) => {
                const monthGroup = month as FormGroup;

                // Subscribe to base_data and recount_data changes
                monthGroup.get('base_data')?.valueChanges.subscribe(() => {
                  this.updateRateAndConcordance(monthGroup);
                  this.updateLQASForMonth(dqGroup, monthGroup.get('mois')?.value);
                });

                monthGroup.get('recount_data')?.valueChanges.subscribe(() => {
                  this.updateRateAndConcordance(monthGroup);
                  this.updateLQASForMonth(dqGroup, monthGroup.get('mois')?.value);
                });

                // Subscribe to enabled toggle changes
                monthGroup.get('enabled')?.valueChanges.subscribe((enabled: boolean) => {
                  this.toggleMonthFormControls(monthGroup, enabled);
                });

                // Initial setup - disable controls by default
                this.toggleMonthFormControls(monthGroup, false);

                // Initial calculation
                this.updateRateAndConcordance(monthGroup);
              });
            }
          });

          // Initial LQAS calculation for all months
          this.updateAllLQAS(dqGroup);
        }
      }
    });
  }

  private updateRateAndConcordance(monthGroup: FormGroup): void {
    const baseData = monthGroup.get('base_data')?.value || 0;
    const recountData = monthGroup.get('recount_data')?.value || 0;

    let rate = 0;
    let concordance = true;

    if (baseData > 0) {
      rate = Math.round((baseData / recountData) * 100 * 100) / 100;
      // Consider concordance true if rate is >= 90%
      concordance = rate == 100;
    } else if (recountData == 0) {
      rate = 100;
      concordance = true;
    } else {
      rate = 0;
      concordance = false;
    }

    monthGroup.patchValue(
      {
        rate: rate,
        concordance: concordance,
      },
      { emitEvent: false },
    );
  }

  private updateLQASForMonth(dqGroup: FormGroup, targetMonth: string): void {
    const lqasArray = dqGroup.get('lqas') as FormArray;
    const indMoisArray = dqGroup.get('ind_mois') as FormArray;

    if (!lqasArray || !indMoisArray || !targetMonth) return;

    // Count discordant indicators for the target month
    let discordantCount = 0;

    indMoisArray.controls.forEach((indicator: AbstractControl) => {
      const indicatorGroup = indicator as FormGroup;
      const dataMonthsArray = indicatorGroup.get('dataMonths') as FormArray;

      if (dataMonthsArray) {
        const monthData = dataMonthsArray.controls.find((month: AbstractControl) => {
          const monthGroup = month as FormGroup;
          return monthGroup.get('mois')?.value === targetMonth;
        }) as FormGroup;

        if (monthData && monthData.get('concordance')?.value === false) {
          discordantCount++;
        }
      }
    });

    // Update the corresponding LQAS entry
    const lqasControl = lqasArray.controls.find((lqas: AbstractControl) => {
      const lqasGroup = lqas as FormGroup;
      return lqasGroup.get('mois')?.value === targetMonth;
    }) as FormGroup;

    if (lqasControl) {
      lqasControl.patchValue(
        {
          total: discordantCount,
        },
        { emitEvent: false },
      );
    }
  }

  private updateAllLQAS(dqGroup: FormGroup): void {
    const lqasArray = dqGroup.get('lqas') as FormArray;

    if (lqasArray) {
      lqasArray.controls.forEach((lqas: AbstractControl) => {
        const lqasGroup = lqas as FormGroup;
        const month = lqasGroup.get('mois')?.value;
        if (month) {
          this.updateLQASForMonth(dqGroup, month);
        }
      });
    }
  }

  private toggleMonthFormControls(monthGroup: FormGroup, enabled: boolean): void {
    const controlsToToggle = ['base_name', 'base_data', 'recount_source', 'recount_data'];

    controlsToToggle.forEach((controlName) => {
      const control = monthGroup.get(controlName);
      if (control) {
        if (enabled) {
          control.enable();
        } else {
          control.disable();
        }
      }
    });
  }
}
