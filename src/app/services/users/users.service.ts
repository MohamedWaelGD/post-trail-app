import { Injectable } from '@angular/core';
import { doc, docData, Firestore, setDoc, updateDoc } from '@angular/fire/firestore'
import { from, Observable, of, switchMap } from 'rxjs';
import { UserProfile } from 'src/app/models/user-profile';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  get currentUserProfile$(): Observable<UserProfile | null>
  {
    return this.authSerivce.currentUser$.pipe(
      switchMap(user => {
        if (!user?.uid)
          return of(null)

        const ref = doc(this.firestore, 'users', user.uid);
        return docData(ref) as Observable<UserProfile>
      })
    )
  }

  constructor(private firestore: Firestore, private authSerivce: AuthService) { }

  getUserWithUid(uid: any) : Observable<any> {
    const ref = doc(this.firestore, 'users', uid);
    return from(docData(ref));
  }

  addUser(user: UserProfile) : Observable<any> {
    const ref = doc(this.firestore, 'users', user?.uid);
    return from(setDoc(ref, user));
  }

  updatUser(user: any) : Observable<any> {
    const ref = doc(this.firestore, 'users', user?.uid);
    return from(updateDoc(ref, { ...user }));
  }
}
