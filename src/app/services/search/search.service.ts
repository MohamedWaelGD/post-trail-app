import { Injectable } from '@angular/core';
import { Firestore, doc, collection, getDocs } from '@angular/fire/firestore';
import { DocumentData, endAt, orderBy, query, QueryDocumentSnapshot, startAt } from '@firebase/firestore';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private firestore: Firestore) { }

  searchUsers(search: string) : Observable<any> {
    search = search.toLocaleLowerCase();
    const ref = query(collection(this.firestore, 'users'));
    return from(getDocs(ref).then(data => {
      let result: any[] = [];
      data.docs.forEach((e: any) => {
        const displayName = e.data().displayName.toLocaleLowerCase();
        if (displayName.includes(search))
        {
          result.push(e.data());
        }
      })
      return result;
    }));
  }

  searchPosts(search: string) : Observable<any> {
    search = search.toLocaleLowerCase();
    const ref = query(collection(this.firestore, 'posts'));
    return from(getDocs(ref).then(data => {
      let result: any[] = [];
      data.docs.forEach((e: any) => {
        const content = e.data().content.toLocaleLowerCase();
        if (content.includes(search))
        {
          result.push(e.data());
        }
      })
      return result;
    }));
  }
}
