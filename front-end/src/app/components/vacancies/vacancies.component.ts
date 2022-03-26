import { Component, OnInit } from '@angular/core';
import { VacanciesService } from 'src/app/services/vacancies.service';

@Component({
  selector: 'app-vacancies',
  templateUrl: './vacancies.component.html',
  styleUrls: [ './vacancies.component.css' ]
})
export class VacanciesComponent implements OnInit {

  constructor(private vacanciesService: VacanciesService) { }

  ngOnInit(): void {
  }

 
}
