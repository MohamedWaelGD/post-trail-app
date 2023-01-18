import { Injectable } from '@angular/core';
import { Unsubscribe } from '@angular/fire/auth';
import { doc, query, getDoc, addDoc, updateDoc, deleteDoc, orderBy, where, Firestore, collection, docSnapshots, collectionSnapshots } from '@angular/fire/firestore'
import { getDocs } from '@firebase/firestore';
import { from, map, Observable } from 'rxjs';
import { Comment } from 'src/app/models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  private readonly COMMENTS_DB = 'comments';

  constructor(private firestore: Firestore) { }

  addComment(comment: any) : Observable<any> {
    const ref = collection(this.firestore, this.COMMENTS_DB);
    return from(addDoc(ref, comment));
  }

  getCommentsOfPost(postId: string) : Observable<any> {
    const ref = query(collection(this.firestore, this.COMMENTS_DB), where('postId', '==', postId));
    // , orderBy('createdAt', 'desc')
    return from(getDocs(ref).then(data => {
      const comments: any = [];
      data.forEach((e: any) => {
        let data = {
          id: e.id,
          data: e.data(),
        }
        comments.push(data);
      })
      return comments;
    }));
  }

  getCommentsOfPostRealTime(postId: string) : Observable<any> {
    const ref = collection(this.firestore, this.COMMENTS_DB);
    // , orderBy('createdAt', 'desc')
    return from(collectionSnapshots(ref).pipe(map(data => {
      const comments: any = [];
      data.forEach((e: any) => {
        let data = {
          id: e.id,
          data: e.data(),
        }
        comments.push(data);
      })
      return comments;
    }), map(data => {
      const comments: any = [];
      data.forEach((e: any) => {
        if (e.data.postId === postId)
          comments.push(e);
      })
      return comments;
    })));
  }

  deleteComment(commentId: string) : Observable<any> {
    const ref = doc(this.firestore, this.COMMENTS_DB, commentId);

    return from(deleteDoc(ref));
  }
}
