import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: string;
  authenticated = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) { }

  login(email, password) {
    const params = new HttpParams().set('email', email).set('password', password);
    return this.http.post(environment.apiUrl + '/auth/login', params);
  }

  getUserID(token: string): string {
    let decodedToken = this.decodeToken(token);
    let userID = decodedToken.user._id;
    return userID;
  }

  getUsername(token: string): string {
    let decodedToken = this.decodeToken(token);
    let username = decodedToken.user.name;
    return username;
  }

  decodeToken(token: string): { iat: number, user: {_id: string, name: string, email: string} } {
    const decodedToken: { iat: number, user: {_id: string, name: string, email: string} } = JSON.parse(window.atob(token.split('.')[1]));
    return decodedToken;
  }
}
