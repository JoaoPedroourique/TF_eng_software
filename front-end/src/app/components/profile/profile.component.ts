import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AreasService } from 'src/app/services/areas.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { VacanciesService } from 'src/app/services/vacancies.service';
import { User } from 'src/app/services/models/user.model'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private currentUser: User
  public form: FormGroup = this.fb.group({
    name: this.fb.control('', [Validators.required]),
    password: this.fb.control('', [Validators.required]),
    email: this.fb.control('', [Validators.required]),
    cv: this.fb.control(''),
    areas: this.fb.array([]),
  });
  // TODO: make dynamic
  public areaOptions: string[] = []

  constructor(private vacanciesService: VacanciesService, private fb: FormBuilder, public authService: AuthService,
    private userService: UsersService, private areasService: AreasService
  ) { }

  ngOnInit(): void {

    this.areasService.getUpdateListener().subscribe({
      next: (res) => {
        this.areaOptions = res.data.map(area => area.area_name).sort()
        let areaOptionsArray = this.form.get('areas') as FormArray
        this.areaOptions.forEach((opt) => {
          areaOptionsArray.push(new FormControl());
        })
      }
    })

    this.userService.getUpdateListener().subscribe({
      next: (res => {
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
    this.userService.fetch()
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
    } catch (err) {
      console.error('Error saving data: ', err)
    }
  }

  public getAreaOptions(): FormArray {
    return this.form.get('areas') as FormArray
  }

  public isTeacher() {
    return this.authService.getCurrentUser() && this.authService.getCurrentUser().is_teacher
  }
}
