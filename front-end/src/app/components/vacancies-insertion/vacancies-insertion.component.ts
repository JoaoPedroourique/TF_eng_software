import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AreasService } from 'src/app/services/areas.service';
import { AuthService } from 'src/app/services/auth.service';
import { VacanciesService } from 'src/app/services/vacancies.service';
import { TsUtils } from 'src/app/util/TsUtils'

@Component({
  selector: 'app-vacancies-insertion',
  templateUrl: './vacancies-insertion.component.html',
  styleUrls: ['./vacancies-insertion.component.css']
})
export class VacanciesInsertionComponent implements OnInit {
  public form: FormGroup = this.fb.group({
    name: this.fb.control('', [Validators.required]),
    description: this.fb.control('', [Validators.required]),
    type: this.fb.control('', [Validators.required]),
    total_payment: this.fb.control('', Validators.pattern("^[0-9]*$")),
    areas: this.fb.array([], TsUtils.atLeastOne(Validators.requiredTrue)),
  });
  public areaOptions: string[] = []

  constructor(private vacanciesService: VacanciesService, private authService: AuthService,
    private fb: FormBuilder, public areasService: AreasService) { }

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
      await this.vacanciesService.saveVacancy(this.authService.getCurrentUser().registration_number, this.form.get('name').value, this.form.get('type').value, this.form.get('description').value, selectedAreas, this.form.get('total_payment').value)
      this.resetForm()
    } catch (err) {
      console.error('Error saving data: ', err)
    }
  }

  public getAreaOptions(): FormArray {
    return this.form.get('areas') as FormArray
  }

}
