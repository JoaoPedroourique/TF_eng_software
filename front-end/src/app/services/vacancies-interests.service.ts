import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { lastValueFrom } from 'rxjs';
import { AbstractArrayFetcherService } from './abstract-array.service';
import { VacancyInterest } from './models/vacancy_interest.model';

const BACKEND_URL = 'http://localhost:5000/v1'

@Injectable({ providedIn: 'root' })
export class VacanciesInterestsService extends AbstractArrayFetcherService<VacancyInterest>{

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(http: HttpClient) {
    super(http, BACKEND_URL + '/select_vacancies_interests')
  }

  public async saveInterest(registration_number: string, vacancy_id: number) {
    const url = `${BACKEND_URL}/insert_vacancy_interest`
    try {
      const content: any = {
        parameters: {
          registration_number,
          vacancy_id,
        }
      }

      await lastValueFrom(this.http.post(url, content));
      this.fetch()

    } catch (err) {
      console.error('Error in vacancies-service method: ', err)
      throw err
    }
  }

}
