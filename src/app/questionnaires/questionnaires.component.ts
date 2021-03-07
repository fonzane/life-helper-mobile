import { Component, Input, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Plugins } from '@capacitor/core';
import { ToastController, ModalController } from '@ionic/angular';

import { Questionnaire } from '../models/questionnaire';
import { AuthService } from '../services/auth.service';
import { QuestionnaireService } from '../services/questionnaire.service';

const { App, BackgroundTask, LocalNotifications } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: './questionnaires.component.html',
  styleUrls: ['./questionnaires.component.scss'],
})
export class QuestionnairesComponent implements OnInit {
  questionnaires: Questionnaire[];
  weekdays: Array<string> = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  today: string = this.weekdays[new Date().getDay()];

  constructor(private questionnaireService: QuestionnaireService,
              private auth: AuthService,
              private storage: Storage,
              private toastController: ToastController,
              public modalController: ModalController) { }

  async ngOnInit() {
    this.questionnaireService.getQuestionnaires(this.auth.getUserID(this.auth.token)).subscribe((questionnaires: Questionnaire[]) => {
      if(questionnaires) {
        this.storage.set('questionnaires', questionnaires);
        this.questionnaires = questionnaires;
        this.presentToast("Fragebögen wurden aus der Datenbank geladen", 3000);
      } else {
        this.presentToast("Fragebögen konnten nicht gefunden werden.", 3000);
      }
    });
  }

  async presentToast(message, duration) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: 'top',
      buttons: [
        {
          side: 'end',
          icon: 'checkmark-outline'
        }
      ]
    });
    toast.present();
  }

  async presentModal(questionnaire) {
    console.log(questionnaire);
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'custom-modal',
      componentProps: {questionnaire}
    })
    await modal.present();
  }

  checkQuestionnaireTime(questionnaires: Questionnaire[]): Questionnaire | null {
    return null;
  }
}

@Component({
  selector: 'modal-page',
  template: `<ion-list>
    <ion-list-header>
      <ion-label>{{questionnaire.name}}</ion-label>
    </ion-list-header>
    <ion-item *ngFor="let question of questionnaire.questions">
      <ion-label>{{question.phrase}}</ion-label>
    </ion-item>
  </ion-list>
  <ion-button color="light" expand="full" (click)="dismiss()">Close</ion-button>`
})
export class ModalPage {
  @Input() questionnaire: Questionnaire;

  constructor(private modalCtrl: ModalController) {}

  dismiss() {
    this.modalCtrl.dismiss({
      dismissed: true
    })
  }
}