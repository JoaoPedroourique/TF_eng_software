import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { lastValueFrom } from 'rxjs';

const BACKEND_URL = 'http://localhost:5000/v1'

@Injectable({ providedIn: 'root' })
export class VacanciesService {

  private heroesUrl = 'api/heroes';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient) { }

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

    } catch (err) {
      console.error('Error in vacancies-service method: ', err)
      throw err
    }
  }

}
