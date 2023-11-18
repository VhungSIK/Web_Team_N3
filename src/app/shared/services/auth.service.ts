import { Injectable, NgZone } from '@angular/core';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: any;

  constructor(
    private firebaseAuthenticationService: AngularFireAuth,
    private firebaseDatabase: AngularFireDatabase,
    private router: Router,
    private ngZone: NgZone
  ) {
    // OBSERVER save user in localStorage (log-in) and setting up null when log-out
    this.firebaseAuthenticationService.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
      } else {
        localStorage.setItem('user', 'null');
      }
    })

  }

  // log-in with email and password
  logInWithEmailAndPassword(email: string, password: string) {
    return this.firebaseAuthenticationService.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        this.userData = userCredential.user
        this.observeUserState()
      })
      .catch((error) => {
        alert(error.message);
      })
  }

  // log-in with google
  logInWithGoogleProvider() {
    return this.firebaseAuthenticationService.signInWithPopup(new GoogleAuthProvider())
      .then(() => this.observeUserState())
      .catch((error: Error) => {
        alert(error.message);
      })
  }

  // sign-up with email and password
  signUpWithEmailAndPassword(email: string, password: string) {
    return this.firebaseAuthenticationService.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        this.userData = userCredential.user
        this.observeUserState();
        this.saveUserDataInDatabase(userCredential.user);
      })
      .catch((error) => {
        alert(error.message);
      })
  }
  saveUserDataInDatabase(user: any) {
    const userData = {
      uid: user.uid,
      email: user.email,
      userType: 'user',
    };
    this.firebaseDatabase.object(`users/${user.uid}`).update(userData);
  }
  observeUserState() {
    this.firebaseAuthenticationService.authState.subscribe((userState) => {
      if (userState) {
        const userRef = this.firebaseDatabase.object(`users/${userState.uid}`);
        userRef.valueChanges().subscribe((userData: any) => {
          if (userData && userData.userType) {
            if (userData.userType === 'user') {
              this.ngZone.run(() => this.router.navigate(['dashboard']));
            } else if (userData.userType === 'admin') {
              this.ngZone.run(() => this.router.navigate(['admin']));
            }
          }
        });
      }
    });
  }
  
  // return true when user is logged in
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null;
  }

  // logOut
  logOut() {
    return this.firebaseAuthenticationService.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    })
  }

}
