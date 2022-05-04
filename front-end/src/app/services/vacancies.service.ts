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

  public async saveVacancy(registration_number: string, name: string,
    type: string, description: string, areas: Array<string>, total_payment: number, vacancy_id?: number) {
    const url = `${BACKEND_URL}/upsert_vacancy`
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
      console.log(vacancy_id)
      if (vacancy_id !== undefined) {
        content.parameters['vacancy_id'] = vacancy_id
      }

      await lastValueFrom(this.http.post(url, content));
      this.fetch()
    } catch (err) {
      console.error('Error in vacancies-service method: ', err)
      throw err
    }
  }

  public async updateOccupant(vacancy_id: number, occupant_registration_number?: string) {
    const url = `${BACKEND_URL}/update_occupant`
    try {
      const content: any = {
        parameters: {
          vacancy_id,
        }
      }
      if (occupant_registration_number) {
        content.parameters['occupant_registration_number'] = occupant_registration_number
      }

      await lastValueFrom(this.http.post(url, content));
      this.fetch()
    } catch (err) {
      console.error('Error in vacancies-service method: ', err)
      throw err
    }
  }

  public async deleteVacancy(vacancy_id: number) {
    const url = `${BACKEND_URL}/delete_vacancy`
    try {
      const content: any = {
        parameters: {
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

  public async deleteVacancyAreas(vacancy_id: number, areas: string[]) {
    const url = `${BACKEND_URL}/delete_vacancy_areas`
    try {
      const content: any = {
        parameters: {
          vacancy_id,
          areas,
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
