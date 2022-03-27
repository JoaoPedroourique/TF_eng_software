import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { VacanciesService } from 'src/app/services/vacancies.service';
import { TsUtils } from 'src/app/util/TsUtils'

@Component({
  selector: 'app-vacancies',
  templateUrl: './vacancies.component.html',
  styleUrls: ['./vacancies.component.css']
})
export class VacanciesComponent implements OnInit {
  public form: FormGroup = this.fb.group({
    registration_number: this.fb.control('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(8), Validators.minLength(8)]),
    name: this.fb.control('', [Validators.required]),
    description: this.fb.control('', [Validators.required]),
    type: this.fb.control('', [Validators.required]),
    areas: this.fb.array([], TsUtils.atLeastOne(Validators.requiredTrue)),
  });
  // TODO: make dynamic
  public areaOptions: Array<string> = ['Engenharia de Software', 'Inteligência Artificial'].sort()

  constructor(private vacanciesService: VacanciesService, private fb: FormBuilder) {
  }

  ngOnInit(): void {

    let areaOptionsArray = this.form.get('areas') as FormArray
    this.areaOptions.forEach((opt) => {
      areaOptionsArray.push(new FormControl());
    })
  }

  public resetForm(): void {
    this.form.reset();
  }

  public async saveForm() {
    try {
      const selectedAreas = []
      this.getAreaOptions().controls.forEach((ct, index) => {
        if (ct.value) {
          selectedAreas.push(this.areaOptions[index])
        }
      })
      console.log('a')
      await this.vacanciesService.saveVacancy(this.form.get('registration_number').value, this.form.get('name').value, this.form.get('type').value, this.form.get('description').value, selectedAreas)
      this.resetForm()
    } catch (err) {
      console.error('Error saving data: ', err)
    }
  }

  public getAreaOptions(): FormArray {
    return this.form.get('areas') as FormArray
  }

}
