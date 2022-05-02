import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { lastValueFrom } from 'rxjs';
import { AbstractArrayFetcherService } from './abstract-array.service';
import { Vacancy } from './models/vacancy.model';

const BACKEND_URL = 'http://localhost:5000/v1'

@Injectable({ providedIn: 'root' })
export class VacanciesService extends AbstractArrayFetcherService<Vacancy>{

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(http: HttpClient) {
    super(http, BACKEND_URL + '/select_vacancies')
  }

  public async saveVacancy(registration_number: string, name: string, type: string, description: string, areas: Array<string>, total_payment: number) {
    const url = `${BACKEND_URL}/insert_vacancy`
    try {
      const content: any = {
        parameters: {
          owner_registration_number: registration_number,
          name,
          type,
          description,
          areas,
          total_payment
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
