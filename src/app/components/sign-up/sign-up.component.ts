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
    if (this.authService.validateName(userName) && this.authService.validatePhoneNumber(phone)) {
      this.authService.signUpWithEmailAndPassword(email, password, userName, phone);
    } else {
      if (!this.authService.validateName(userName)) {
        alert("Please enter a valid name (at least 2 words containing only letters).");
      }
      if (!this.authService.validatePhoneNumber(phone)) {
        alert("Please enter a valid phone number (from 9 to 10 digits).");
      }
    }
  }
  logInWithGoogle() {
    this.authService.logInWithGoogleProvider();
  } 
}
