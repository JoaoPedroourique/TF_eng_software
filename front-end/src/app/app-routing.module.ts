import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { VacanciesComponent } from 'src/app/components/vacancies/vacancies.component'
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  {
    path: 'vacancies',
    component: VacanciesComponent,
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
    component: VacanciesComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [CommonModule, BrowserModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
