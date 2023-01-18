import { Injectable } from '@angular/core';
import { doc, getDoc, query, deleteDoc, where, orderBy, getDocs, addDoc, collection, updateDoc, Firestore } from '@angular/fire/firestore'
import { deleteObject, getStorage, ref } from '@angular/fire/storage';
import { from, map, Observable, Subject } from 'rxjs';
import { Comment } from 'src/app/models/comment';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private firestore: Firestore) { }

  getPostsByUserId(uid: any) : Observable<any> {
    const ref = query(collection(this.firestore, 'posts'), where('userId', '==', uid));
    return from(getDocs(ref));
  }

  getPosts() : Observable<any> {
    const ref = query(collection(this.firestore, 'posts'), orderBy('createdAt', 'desc'));
    return from(getDocs(ref))
      .pipe(
        map((value)=>
        {
          let data: any[] = [];
          value.forEach((e: any) => {
            data.push(e.data());
          })
          return data;
        }));
  }

  getPost(id: any) : Observable<any> {
    const ref = doc(this.firestore, 'posts', id);
    return from(getDoc(ref));
  }

  addPost(post: any) : Observable<any> {
    post.createdAt = Date.now();
    const ref = collection(this.firestore, 'posts');
    return from(addDoc(ref, post));
  }

  updatePost(post: any) : Observable<any> {
    const ref = doc(this.firestore, 'posts', post.id);
    return from(updateDoc(ref, { ...post} ));
  }

  deletePost(id: any): Observable<any> {
    const refPost = doc(this.firestore, 'posts', id);
    return from(getDoc(refPost).then((data: any) => {
      if (data?.data().photoURL)
      {
        const storage = getStorage();
        const imageRef = ref(storage, `images/posts/${id}`);
        deleteObject(imageRef)
      }
    })
    .then((data: any) => {
      deleteDoc(refPost);
    }));
  }
}
