import { Injectable } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
import { from, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser$ = authState(this.auth);

  constructor(private auth: Auth) { }

  login(email: any, password: any) {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout() {
    return from(this.auth.signOut());
  }

  signup(email: any, password: any) {
    return from(createUserWithEmailAndPassword(this.auth, email, password))
  }
}
