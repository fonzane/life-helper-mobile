import { Component, Input, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  username: string;

  constructor(private auth: AuthService,
              private storage: Storage) { }

  ngOnInit() {
    this.storage.get('token').then(token => {
      this.username = this.auth.getUsername(token);
    })
  }
}