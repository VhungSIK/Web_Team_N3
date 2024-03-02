import { Injectable, NgZone } from '@angular/core';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { of, switchMap } from 'rxjs';

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
  signUpWithEmailAndPassword(email: string, password: string, userName: string,  phone: string) {
    return this.firebaseAuthenticationService.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        this.userData = userCredential.user
        this.observeUserState();
        this.saveUserDataInDatabase(userCredential.user, userName, phone);
      })
      .catch((error) => {
        alert(error.message);
      })
  }
  validateName(name: string): boolean {
    const nameRegex = /^[a-zA-Z]{2,}(?: [a-zA-Z]+)*$/; // Biểu thức chính quy kiểm tra họ tên
  
    return nameRegex.test(name);
  }
  validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^\d{9,10}$/; // Biểu thức chính quy kiểm tra số điện thoại từ 9 đến 10 chữ số

    return phoneRegex.test(phone);
  }
  saveUserDataInDatabase(user: any, userName: string, phone: string) {
    const userData = {
      uid: user.uid,
      email: user.email,
      userName:userName,
      phone:phone,
      userType: 'user',
      rank:'0',
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
  observeUserData() {
    return this.firebaseAuthenticationService.authState.pipe(
      switchMap(userState => {
        if (userState) {
          return this.firebaseDatabase.object(`users/${userState.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }
  
  // return true when user is logged in
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null;
  }
  
  getUserDataByUserId(userId: string) {
    return this.firebaseDatabase.object(`users/${userId}`).valueChanges();
  }
  
  getUsers() {
    return this.firebaseDatabase.list('users').valueChanges();
  }
  updateUserType(userId: string, newType: string) {
    return this.firebaseDatabase.object(`users/${userId}/userType`).set(newType);
  }
  getOrders() {
    return this.firebaseDatabase.list('orders').valueChanges();
  }
  // logOut
  logOut() {
    return this.firebaseAuthenticationService.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    })
  }
}
