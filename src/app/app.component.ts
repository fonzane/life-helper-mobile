import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  
  constructor(private auth: AuthService,
              private storage: Storage,
              private router: Router) {}

  onLogout() {
    this.auth.authenticated.next(false);
    this.storage.remove('token');
    this.router.navigateByUrl('auth');
    window.location.reload();
  }

  isLoggedIn() {
    return this.auth.authenticated.value;
  }
}
