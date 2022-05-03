import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { VacanciesInsertionComponent } from 'src/app/components/vacancies-insertion/vacancies-insertion.component'
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { VacanciesComponent } from './components/vacancies/vacancies.component';

const routes: Routes = [
  {
    path: 'vacancies-insertion',
    component: VacanciesInsertionComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full'
  },
  {
    path: 'vacancies',
    component: VacanciesComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full'
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full'
  },
  // default route
  {
    path: '',
    redirectTo: 'vacancies',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [CommonModule, BrowserModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
