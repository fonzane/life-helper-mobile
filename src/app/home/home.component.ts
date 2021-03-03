import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Plugins } from '@capacitor/core';
const { App, BackgroundTask, LocalNotifications } = Plugins;

import { Questionnaire } from '../models/questionnaire';
import { AuthService } from '../services/auth.service';
import { QuestionnaireService } from '../services/questionnaire.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  questionnaires: Questionnaire[];
  weekdays: Array<string> = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  today: string = this.weekdays[new Date().getDay()];
  hour = new Date().getHours();

  constructor(private questionnaireService: QuestionnaireService,
              private auth: AuthService,
              private storage: Storage) { }

  async ngOnInit() {
    console.log(this.hour);
    this.questionnaireService.getQuestionnaires(this.auth.getUserID(this.auth.token)).subscribe((questionnaires: Questionnaire[]) => {
      this.storage.set('questionnaires', questionnaires);
      this.questionnaires = questionnaires;
    });
  }

  checkQuestionnaireTime(questionnaires: Questionnaire[]): Questionnaire | null {
    questionnaires.forEach((questionnaire: Questionnaire) => {
      
    })
  }
}