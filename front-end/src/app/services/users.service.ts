import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { lastValueFrom } from 'rxjs';
import { AbstractArrayFetcherService } from './abstract-array.service';
import { User } from '../services/models/user.model'

const BACKEND_URL = 'http://localhost:5000/v1'

@Injectable({ providedIn: 'root' })
export class UsersService extends AbstractArrayFetcherService<User>{

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(http: HttpClient) {
    super(http, BACKEND_URL + '/select_users')
  }

  public async updateUser(registration_number: string, name: string, password: string, email: string, cv_link: string) {
    const url = `${BACKEND_URL}/update_user`
    try {
      const content: any = {
        parameters: {
          registration_number,
          name,
          password,
          email,
          cv_link
        }
      }

      await lastValueFrom(this.http.post(url, content));
      this.fetch()
    } catch (err) {
      console.error('Error in vacancies-service method: ', err)
      throw err
    }
  }

  public async saveInterests(registration_number: string, area_interests: string[]) {
    const url = `${BACKEND_URL}/insert_user_interests`
    try {
      const content: any = {
        parameters: {
          registration_number,
          area_interests,
        }
      }

      await lastValueFrom(this.http.post(url, content));
      this.fetch()
    } catch (err) {
      console.error('Error in vacancies-service method: ', err)
      throw err
    }
  }

  public async deleteInterests(registration_number: string, area_interests: string[]) {
    const url = `${BACKEND_URL}/delete_user_interests`
    try {
      const content: any = {
        parameters: {
          registration_number,
          area_interests,
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
