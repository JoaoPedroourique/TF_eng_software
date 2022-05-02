import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { AreasService } from 'src/app/services/areas.service';
import { AuthService } from 'src/app/services/auth.service';
import { VacanciesService } from 'src/app/services/vacancies.service';
import { Vacancy } from '../../services/models/vacancy.model'
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-vacancies',
  templateUrl: './vacancies.component.html',
  styleUrls: ['./vacancies.component.css']
})
export class VacanciesComponent implements OnInit {
  @ViewChild('errorDialog') errorDialog: TemplateRef<any>;
  @ViewChild('successDialog') successDialog: TemplateRef<any>;

  public vacanciesFilter = ''
  public selectedArea = ''
  public areaOptions: string[] = []
  public displayCols = ['Nome', 'Descrição', 'Tipo', 'Remuneração', 'Áreas']
  public vacanciesToDisplay: Vacancy[] = []
  private vacancies: Vacancy[] = []
  constructor(public authService: AuthService, public vacanciesService: VacanciesService,
    public areasService: AreasService, private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    if (this.authService.getCurrentUser() && !this.authService.getCurrentUser().is_teacher) {
      this.displayCols.unshift('Candidatar-se')
    }

    this.vacanciesService.getUpdateListener().subscribe({
      next: (res) => {
        this.vacancies = res.data
        this.vacanciesToDisplay = res.data
      }
    })

    this.areasService.getUpdateListener().subscribe({
      next: (res) => {
        this.areaOptions = res.data.map(area => area.area_name).sort()
        this.areaOptions.unshift('Todas')
      }
    })

    this.areasService.getData()
    this.vacanciesService.getData()
  }

  public onSelectionChange() {
    this.vacanciesToDisplay = this.selectedArea !== 'Todas' ? this.vacancies.filter((vacancy) => {
      return vacancy.areas.includes(this.selectedArea)
    }) : this.vacancies
  }

  public onInput() {
    this.vacanciesToDisplay = this.vacanciesFilter ? this.vacancies.filter((vacancy) => {
      return vacancy.description.includes(this.vacanciesFilter) || vacancy.name.includes(this.vacanciesFilter)
    }) : this.vacancies
  }

  public evaluatePayment(element: Vacancy) {
    console.log(element, element.total_payment)
    return element.total_payment || 'Voluntária'
  }

  public isStudent() {
    return this.authService.getCurrentUser() && !this.authService.getCurrentUser().is_teacher
  }

  public async onClickVacancy(element: Vacancy) {
    try {
      await this.vacanciesService.saveInterest(
        this.authService.getCurrentUser().registration_number,
        element.vacancy_id
      )
      this.openSucessDialog()
    } catch (err) {
      console.log(err)
      this.openErrorDialog()
    }

  }

  public openErrorDialog() {
    this.dialog.open(this.errorDialog);
  }

  public openSucessDialog() {
    this.dialog.open(this.successDialog);
  }
}
