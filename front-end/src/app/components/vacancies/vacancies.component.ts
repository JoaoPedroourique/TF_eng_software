import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { AreasService } from 'src/app/services/areas.service';
import { AuthService } from 'src/app/services/auth.service';
import { VacanciesService } from 'src/app/services/vacancies.service';
import { Vacancy } from '../../services/models/vacancy.model'
import { MatDialog } from '@angular/material/dialog';
import { VacanciesInterestsService } from 'src/app/services/vacancies-interests.service';

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
  public displayCols = ['Nº Candidatos', 'Nome', 'Descrição', 'Tipo', 'Remuneração', 'Áreas']
  public vacanciesToDisplay: Vacancy[] = []
  private vacancies: Vacancy[] = []
  private interestsMap: Map<number, string[]> = new Map()

  constructor(public authService: AuthService, public vacanciesService: VacanciesService,
    public areasService: AreasService, private dialog: MatDialog, public vacanciesInterestsService: VacanciesInterestsService,
  ) { }

  ngOnInit(): void {
    if (this.authService.getCurrentUser() && !this.authService.getCurrentUser().is_teacher) {
      this.displayCols.unshift('Candidatar-se')
    }

    this.vacanciesService.getUpdateListener().subscribe({
      next: (res) => {
        this.vacancies = res.data.filter(vacancy => !vacancy.occupant_registration_number)
        this.vacanciesToDisplay = this.vacancies
      }
    })

    this.vacanciesInterestsService.getUpdateListener().subscribe({
      next: (res) => {
        res.data.forEach(interest => {
          this.interestsMap.set(interest.vacancy_id, interest.registration_numbers)
        })
      }
    })

    this.areasService.getUpdateListener().subscribe({
      next: (res) => {
        this.areaOptions = res.data.map(area => area.area_name).sort()
        this.areaOptions.unshift('Todas')
      }
    })

    this.areasService.fetch()
    this.vacanciesService.fetch()
    this.vacanciesInterestsService.fetch()
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
    return element.total_payment || 'Voluntária'
  }

  public isStudent() {
    return this.authService.getCurrentUser() && !this.authService.getCurrentUser().is_teacher
  }

  public async onClickVacancy(element: Vacancy) {
    try {
      await this.vacanciesInterestsService.saveInterest(
        this.authService.getCurrentUser().registration_number,
        element.vacancy_id
      )
      this.openSucessDialog()
    } catch (err) {
      console.log(err)
      this.openErrorDialog()
    }
  }

  public checkIfInterested(element: Vacancy): boolean {
    if (this.interestsMap.has(element.vacancy_id)) {
      return this.interestsMap.get(element.vacancy_id).includes(this.authService.getCurrentUser().registration_number)
    }
    return false
  }

  public getInterestedNumbers(element: Vacancy): number {
    if (this.interestsMap.has(element.vacancy_id)) {
      return (this.interestsMap.get(element.vacancy_id)).length
    }
    return 0
  }

  public openErrorDialog() {
    this.dialog.open(this.errorDialog);
  }

  public openSucessDialog() {
    this.dialog.open(this.successDialog);
  }
}
