// LoginComponent TypeScript
import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private authService: AuthService) {}

  logIn() {
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    this.authService.logInWithEmailAndPassword(email, password);
  }

  logInWithGoogle() {
    this.authService.logInWithGoogleProvider();
  }
}
