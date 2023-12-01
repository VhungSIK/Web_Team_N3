import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  constructor(private authService: AuthService) {

  }

  signUp(email: string, password: string, userName: string, phone: string) {
    this.authService.signUpWithEmailAndPassword(email, password, userName, phone);
  }
  logInWithGoogle() {
    this.authService.logInWithGoogleProvider();
  }
}
