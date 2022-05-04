import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AreasService } from 'src/app/services/areas.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { VacanciesService } from 'src/app/services/vacancies.service';
import { VacanciesInterestsService } from 'src/app/services/vacancies-interests.service';
import { User } from 'src/app/services/models/user.model'
import { MatDialog } from '@angular/material/dialog';
import { Vacancy } from 'src/app/services/models/vacancy.model'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @ViewChild('errorDialog') errorDialog: TemplateRef<any>;
  @ViewChild('successDialog') successDialog: TemplateRef<any>;
  public currentTeacherVacancies: Vacancy[] = []
  public editingVacancy: Vacancy
  private currentUser: User
  private users: User[] = []
  public form: FormGroup = this.fb.group({
    name: this.fb.control('', [Validators.required]),
    password: this.fb.control('', [Validators.required]),
    email: this.fb.control('', [Validators.required]),
    cv: this.fb.control(''),
    areas: this.fb.array([]),
  });
  public vacancyForm: FormGroup = this.fb.group({
    name: this.fb.control('', [Validators.required]),
    description: this.fb.control('', [Validators.required]),
    type: this.fb.control('', [Validators.required]),
    total_payment: this.fb.control(''),
    areas: this.fb.array([]),
  });
  public areaOptions: string[] = []
  private interestsMap: Map<number, string[]> = new Map()
  public displayCols = ['Editar', 'Excluir', 'Nº Candidatos', 'Nome', 'Descrição', 'Tipo', 'Remuneração', 'Áreas']
  public userDisplayCols = ['Nome', 'Email', 'Link do CV', 'Ocupante']

  constructor(
    private vacanciesService: VacanciesService, private fb: FormBuilder,
    public authService: AuthService, private dialog: MatDialog,
    private userService: UsersService, private areasService: AreasService,
    private vacanciesInterestsService: VacanciesInterestsService
  ) { }

  ngOnInit(): void {

    this.vacanciesInterestsService.getUpdateListener().subscribe({
      next: (res) => {
        res.data.forEach(interest => {
          this.interestsMap.set(interest.vacancy_id, interest.registration_numbers)
        })
      }
    })

    this.vacanciesService.getUpdateListener().subscribe({
      next: (res) => {
        this.currentTeacherVacancies = this.authService.getCurrentUser().is_teacher ?
          res.data.filter(vacancy => vacancy.owner_registration_number === this.authService.getCurrentUser().registration_number) :
          []

      }
    })

    this.areasService.getUpdateListener().subscribe({
      next: (res) => {
        this.areaOptions = res.data.map(area => area.area_name).sort()
        let areaOptionsArray = this.form.get('areas') as FormArray
        this.areaOptions.forEach((opt) => {
          areaOptionsArray.push(new FormControl());
        })
        areaOptionsArray = this.vacancyForm.get('areas') as FormArray
        this.areaOptions.forEach((opt) => {
          areaOptionsArray.push(new FormControl());
        })
      }
    })

    this.userService.getUpdateListener().subscribe({
      next: (res => {
        this.users = res.data
        this.currentUser = res.data.filter(user => user.registration_number === this.authService.getCurrentUser().registration_number)[0]
        const userOptions = this.currentUser.area_interests.sort()
        this.getAreaOptions().controls.forEach((ct, index) => {
          if (userOptions.includes(this.areaOptions[index])) {
            ct.setValue(true)
          } else {
            ct.setValue(false)
          }
        })
        this.form.get('name').setValue(this.currentUser.name)
        this.form.get('password').setValue(this.currentUser.password)
        this.form.get('email').setValue(this.currentUser.email)
        this.form.get('cv').setValue(this.currentUser.cv_link)
      })
    })
    this.areasService.fetch()
    this.vacanciesService.fetch()
    this.userService.fetch()
    this.vacanciesInterestsService.fetch()
  }

  public resetForm(): void {
    const userOptions = this.currentUser.area_interests.sort()
    this.getAreaOptions().controls.forEach((ct, index) => {
      if (userOptions.includes(this.areaOptions[index])) {
        ct.setValue(true)
      }
    })
    this.form.get('name').setValue(this.currentUser.name)
    this.form.get('password').setValue(this.currentUser.password)
    this.form.get('email').setValue(this.currentUser.email)
    this.form.get('cv').setValue(this.currentUser.cv_link)
  }

  public async saveForm() {
    try {
      const areasToInsert = []
      const areasToDelete = []
      this.getAreaOptions().controls.forEach((ct, index) => {
        if (ct.value && !this.currentUser.area_interests.includes(this.areaOptions[index])) {
          areasToInsert.push(this.areaOptions[index])
        }
        else if (!ct.value && this.currentUser.area_interests.includes(this.areaOptions[index])) {
          areasToDelete.push(this.areaOptions[index])
        }
      })
      await this.userService.updateUser(
        this.authService.getCurrentUser().registration_number, this.form.get('name').value,
        this.form.get('password').value, this.form.get('email').value, this.form.get('cv').value
      )
      if (areasToInsert.length > 0) {
        await this.userService.saveInterests(
          this.authService.getCurrentUser().registration_number, areasToInsert
        )
      }
      if (areasToDelete.length > 0) {
        await this.userService.deleteInterests(
          this.authService.getCurrentUser().registration_number, areasToDelete
        )
      }
      this.openSucessDialog()
    } catch (err) {
      console.error('Error saving data: ', err)
      this.openErrorDialog()
    }
  }
  public getCurrentTeacherVacancies() {
    return this.currentTeacherVacancies
  }

  public onEditVacancy(element: Vacancy) {
    this.editingVacancy = element
    const areaOptions = element.areas.sort()
    this.getVacancyAreaOptions().controls.forEach((ct, index) => {
      if (areaOptions.includes(this.areaOptions[index])) {
        ct.setValue(true)
      }
      else {
        ct.setValue(false)
      }
    })
    this.vacancyForm.get('name').setValue(element.name)
    this.vacancyForm.get('description').setValue(element.description)
    this.vacancyForm.get('type').setValue(element.type)
    this.vacancyForm.get('total_payment').setValue(element.total_payment)
    console.log(this.editingVacancy, 'aa')

  }

  public onDeleteVacancy(element: Vacancy) {
    this.vacanciesService.deleteVacancy(element.vacancy_id)
  }

  public resetVacancyForm() {
    this.getVacancyAreaOptions().controls.forEach((ct, index) => {
      ct.setValue(false)
    })
    this.vacancyForm.get('name').reset('')
    this.vacancyForm.get('description').reset('')
    this.vacancyForm.get('type').reset('')
    this.vacancyForm.get('total_payment').reset('')
    this.editingVacancy = undefined
  }

  public async saveVacancyForm() {
    try {
      const areasToInsert: string[] = []
      const areasToDelete = []
      this.getVacancyAreaOptions().controls.forEach((ct, index) => {
        if (ct.value && !this.editingVacancy.areas.includes(this.areaOptions[index])) {
          areasToInsert.push(this.areaOptions[index])
        }
        else if (!ct.value && this.editingVacancy.areas.includes(this.areaOptions[index])) {
          areasToDelete.push(this.areaOptions[index])
        }
      })
      await this.vacanciesService.saveVacancy(
        this.editingVacancy.owner_registration_number,
        this.vacancyForm.get('name').value,
        this.vacancyForm.get('type').value,
        this.vacancyForm.get('description').value,
        areasToInsert,
        this.vacancyForm.get('total_payment').value,
        this.editingVacancy.vacancy_id,
      )
      if (areasToDelete.length > 0) {
        await this.vacanciesService.deleteVacancyAreas(this.editingVacancy.vacancy_id, areasToDelete)
      }
      this.resetVacancyForm()
      this.openSucessDialog()
    } catch (err) {
      this.openErrorDialog()
    }
  }

  public evaluatePayment(element: Vacancy) {
    return element.total_payment || 'Voluntária'
  }

  public isOccupant(element: User): boolean {
    return this.editingVacancy && this.editingVacancy.occupant_registration_number
      && this.editingVacancy.occupant_registration_number === element.registration_number
  }

  public onChooseStudent(element: User) {
    try {
      this.vacanciesService.updateOccupant(this.editingVacancy.vacancy_id, element.registration_number)
      this.resetVacancyForm()
      this.openSucessDialog()
    } catch (err) {
      this.openErrorDialog()
      console.log(err)
    }
  }

  public onRemoveStudent(element: User) {
    try {
      this.vacanciesService.updateOccupant(this.editingVacancy.vacancy_id)
      this.resetVacancyForm()
      this.openSucessDialog()
    } catch (err) {
      this.openErrorDialog()
      console.log(err)
    }
  }

  public getInterestedUsers() {
    return this.editingVacancy && this.interestsMap.get(this.editingVacancy.vacancy_id) ?
      this.users.filter(user => this.interestsMap.get(this.editingVacancy.vacancy_id).includes(user.registration_number)) :
      []
  }

  public getInterestedNumbers(element: Vacancy): number {
    if (this.interestsMap.has(element.vacancy_id)) {
      return (this.interestsMap.get(element.vacancy_id)).length
    }
    return 0
  }

  public getAreaOptions(): FormArray {
    return this.form.get('areas') as FormArray
  }

  public getVacancyAreaOptions(): FormArray {
    return this.vacancyForm.get('areas') as FormArray
  }

  public isTeacher() {
    return this.authService.getCurrentUser() && this.authService.getCurrentUser().is_teacher
  }

  public openErrorDialog() {
    this.dialog.open(this.errorDialog);
  }

  public openSucessDialog() {
    this.dialog.open(this.successDialog);
  }
}
