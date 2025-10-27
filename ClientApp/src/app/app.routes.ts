import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'search',
    pathMatch: 'full'
  },
  {
    path: 'search',
    loadComponent: () => import('./features/search/search.component').then(m => m.SearchComponent)
  },
  {
    path: 'results',
    loadComponent: () => import('./features/results/results.component').then(m => m.ResultsComponent)
  },
  {
    path: 'seatmap/:id',
    loadComponent: () => import('./features/seatmap/seatmap.component').then(m => m.SeatmapComponent)
  },
  {
    path: '**',
    redirectTo: 'search'
  }
];
