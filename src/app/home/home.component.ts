import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { QuestionnaireService } from '../services/questionnaire.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  constructor(private questionnaireService: QuestionnaireService,
              private auth: AuthService) { }

  ngOnInit() {
    this.questionnaireService.getQuestionnaires(this.auth.getUserID(this.auth.token)).subscribe(questionnaires => {
      console.log(questionnaires);
    });
  }

}
