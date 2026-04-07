import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { UniversityListComponent } from './components/university-list/university-list';
import { ApplicationsComponent } from './components/applications/applications';

export const routes: Routes = [
  { path: '', redirectTo: 'universities', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'universities', component: UniversityListComponent },
  { path: 'my-applications', component: ApplicationsComponent }
];