import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AreasService } from 'src/app/services/areas.service';
import { VacanciesService } from 'src/app/services/vacancies.service';
import { TsUtils } from 'src/app/util/TsUtils'

@Component({
  selector: 'app-vacancies-insertion',
  templateUrl: './vacancies-insertion.component.html',
  styleUrls: ['./vacancies-insertion.component.css']
})
export class VacanciesInsertionComponent implements OnInit {
  public form: FormGroup = this.fb.group({
    registration_number: this.fb.control('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(8), Validators.minLength(8)]),
    name: this.fb.control('', [Validators.required]),
    description: this.fb.control('', [Validators.required]),
    type: this.fb.control('', [Validators.required]),
    total_payment: this.fb.control('', Validators.pattern("^[0-9]*$")),
    areas: this.fb.array([], TsUtils.atLeastOne(Validators.requiredTrue)),
  });
  // TODO: make dynamic
  public areaOptions: string[] = []

  constructor(private vacanciesService: VacanciesService, private fb: FormBuilder, public areasService: AreasService) { }

  ngOnInit(): void {

    this.areasService.getUpdateListener().subscribe({
      next: (res) => {
        this.areaOptions = res.data.map(area => area.area_name).sort()
        let areaOptionsArray = this.form.get('areas') as FormArray
        this.areaOptions.forEach((opt) => {
          areaOptionsArray.push(new FormControl());
        }
        )
      }
    })

    this.areasService.getData()
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
      await this.vacanciesService.saveVacancy(this.form.get('registration_number').value, this.form.get('name').value, this.form.get('type').value, this.form.get('description').value, selectedAreas, this.form.get('total_payment').value)
      this.resetForm()
    } catch (err) {
      console.error('Error saving data: ', err)
    }
  }

  public getAreaOptions(): FormArray {
    return this.form.get('areas') as FormArray
  }

}