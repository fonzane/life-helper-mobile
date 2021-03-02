import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {

  constructor(private http: HttpClient) { }

  getQuestionnaires(userID: string) {
    const headers = new HttpHeaders().set('userID', userID);
    return this.http.get(environment.apiUrl + '/questionnaires', {headers});
  }
}
