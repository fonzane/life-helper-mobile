import { Component, OnInit } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {

  constructor(private auth: AuthService,
              private storage: Storage,
              private router: Router) { }

  ngOnInit() {
    this.storage.get('token').then((storage) => {
      if (storage) {
        this.auth.authenticated.next(true);
        this.auth.token = storage;
        this.router.navigateByUrl('home');
      }
    })
  }

  onLogin(email: IonInput, password: IonInput) {
    const userEmail: string = email.value.toString();
    const userPassword: string = password.value.toString();
    this.auth.login(userEmail, userPassword).subscribe((resp: {message: string, auth: boolean, token: string}) => {
      this.auth.token = resp.token;
      this.storage.set('token', resp.token).then(response => {
        this.auth.authenticated.next(true);
        this.auth.getUserID(resp.token);
        this.router.navigateByUrl('home');
      }) 
    })
  }

}
