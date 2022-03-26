import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { VacanciesComponent } from 'src/app/components/vacancies/vacancies.component'

const routes: Routes = [
  {
  path:'vacancies',
component: VacanciesComponent,
pathMatch:'full'
  }
];

@NgModule({
  imports: [CommonModule, BrowserModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
