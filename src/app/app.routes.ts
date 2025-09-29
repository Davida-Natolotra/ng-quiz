import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/quiz/quiz').then((m) => m.Quiz),
  },
  {
    path: 'results',
    loadComponent: () => import('./components/results/results').then((m) => m.Results),
  },
  {
    path: 'recap',
    loadComponent: () => import('./components/recap/recap').then((m) => m.Recap),
  },
  {
    path: 'assessment',
    loadComponent: () =>
      import('./components/spt-assessment/spt-assessment').then((m) => m.SptAssessment),
  },

  {
    path: 'quiz',
    loadComponent: () => import('./components/spt-quiz/spt-quiz').then((m) => m.SptQuiz),
  },
];
