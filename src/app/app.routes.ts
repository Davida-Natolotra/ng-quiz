import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '', loadComponent: () => import('./components/quiz/quiz').then(m => m.Quiz)   
    },
    {
        path: 'results', loadComponent: () => import('./components/results/results').then(m => m.Results)
    }
];
