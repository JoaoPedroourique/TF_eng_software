import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { lastValueFrom } from 'rxjs';
import { Router } from "@angular/router";

const BACKEND_URL = 'http://localhost:5000/v1'

export interface User {
    cv_link: string;
    email: string;
    is_teacher: boolean;
    name: string;
    registration_number: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private loggedIn: boolean = false
    private currentUser: User;

    constructor(private router: Router, private http: HttpClient) {

    }

    public async login(user_number: string, password: string) {
        const url = `${BACKEND_URL}/select_user_password`
        const content: any = {
            parameters: {
                user_number: user_number,
            }
        }

        const res = await lastValueFrom(this.http.post(url, content));
        if (res && password === res['result'][0].password) {
            this.setLoggedIn(true)
            this.setCurrentUser(res['result'][0]);
            // redirects to default route
            this.router.navigate(['/'])
        } else {
            this.setLoggedIn(false)
            throw new Error('Error logging in. User password does not match')
        }
    }

    public logout() {
        this.setLoggedIn(false)
        this.router.navigate['login']
    }

    public isLoggedIn(): boolean {
        return this.loggedIn
    }

    public getCurrentUser(): User {
        return this.currentUser
    }

    public setCurrentUser(user: User) {
        this.currentUser = { ...user }
    }

    public setLoggedIn(value: boolean) {
        this.loggedIn = value
    }
}