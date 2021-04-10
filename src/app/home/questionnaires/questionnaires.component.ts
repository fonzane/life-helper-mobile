import { Component, Input, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Plugins } from '@capacitor/core';
import { ToastController, ModalController, AlertController } from '@ionic/angular';

import { Questionnaire, Schedule, Question, SolvedQuestion } from '../../models/questionnaire';
import { AuthService } from '../../services/auth.service';
import { QuestionnaireService } from '../../services/questionnaire.service';
import { concat, defer, from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './questionnaires.component.html',
  styleUrls: ['./questionnaires.component.scss'],
})
export class QuestionnairesComponent implements OnInit {
  questionnaires: Questionnaire[];
  weekdays: Array<string> = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  today: string = this.weekdays[new Date().getDay()];
  questionnaireQueue: Questionnaire[] = [];
  solvedQuestions: SolvedQuestion[] = [];

  constructor(private questionnaireService: QuestionnaireService,
              private storage: Storage,
              private toastController: ToastController,
              private auth: AuthService,
              public modalController: ModalController,
              public alertController: AlertController) { }

  async ngOnInit() {
    this.questionnaireService.getQuestionnaires(this.auth.getUserID(this.auth.token)).subscribe((questionnaires: Questionnaire[]) => {
      if(questionnaires) {
        this.storage.set('questionnaires', questionnaires);
        this.questionnaires = questionnaires;
        this.presentToast("Fragebögen wurden aus der Datenbank geladen.", 1500);
      } else {
        this.presentToast("Es konnten keine Fragebögen gefunden werden.", 3000);
      }
      this.showQuestionnaire(this.questionnaires[0]);
      // this.questionnaires.forEach((questionnaire: Questionnaire) => {
      //   questionnaire.schedule.forEach((schedule: Schedule) => {
      //     const date = new Date();
      //     const today = this.weekdays[date.getDay()];
      //     const hour = date.getHours().toString().length === 1 ? "0" + date.getHours() : date.getHours();
      //     // const minute = date.getMinutes().toString().length === 1 ? "0" + date.getMinutes() : date.getMinutes();
      //     if(schedule[today] && schedule[today].split(":")[0] == hour) {
      //       if(!this.questionnaireQueue.includes(questionnaire)) {
      //         this.questionnaireQueue.push(questionnaire);
      //       }
      //       console.log(this.questionnaireQueue);
      //     }
      //   })
      // })
    });
  }

    // showQuestionnaire(questionnaire: Questionnaire): Observable<ReadonlyArray<Answer>> { 
    //   const questions$ = questionnaire.questions.map(question => this.askQuestion(question));
    //   return concat(questions$);
    // }
    // private askQuestion(question: Question): Observable<Answer> {
    //   const name = `question....`;
    //   return this.alertController.create({...}).pipe(
    //     switchMap(alert => alert.present())
    //   );
    // }
  
    showQuestionnaire(questionnaire: Questionnaire) {
      const question$ = questionnaire.questions.map(question => this.askQuestion(question));
      return concat(question$);
    }

  private async askQuestion(question: Question) {
    const name = `${question._id}`;
    console.log("hello");
    return from(this.alertController.create({
      header: question.phrase,
      inputs: [
        {
          name: name,
          type: 'text',
        }
      ],
      buttons: [
        {
          text: 'Antwort',
          handler: (resp) => {
            this.solvedQuestions.push(resp[name]);
          }
        }
      ]
    })).pipe(
      switchMap(alert => alert.present())
    );
  }

  // async fillQuestionnaire(questionnaire: Questionnaire) {
  //   let solvedQuestions: SolvedQuestion[] = [];

  //   const answering = new Promise(async resolve => {
  //     for(let i = questionnaire.questions.length-1; i >= 0; i--) {
  //       const name = `question${questionnaire.questions.indexOf(questionnaire.questions[i])}`
  //       const alert = await this.alertController.create({
  //         header: questionnaire.questions[i].phrase,
  //         inputs: [
  //           {
  //             name: name,
  //             type: 'text',
  //           }
  //         ],
  //         buttons: [
  //           {
  //             text: 'Antwort',
  //             handler: (resp) => {
  //               solvedQuestions.push(resp[name]);
  //               if (solvedQuestions.length === questionnaire.questions.length) {
  //                 resolve(solvedQuestions);
  //               }
  //             }
  //           }
  //         ]
  //       })
  //       await alert.present();
  //     }
  //   })
  //   answering.then(questions => console.log(questions))
  // }

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

  checkQuestionnaireSchedule() {
    const { App, BackgroundTask, LocalNotifications } = Plugins;
    App.addListener('appStateChange', (state) => {
      let taskId = BackgroundTask.beforeExit(async () => {
        const date = new Date();
        const today = this.weekdays[date.getDay()];
        const hours = date.getHours().toString().length === 1 ? "0" + date.getHours() : date.getHours();
        const minutes = date.getMinutes().toString().length === 1 ? "0" + date.getMinutes() : date.getMinutes();
      })
      BackgroundTask.finish({
        taskId
      })
    })
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