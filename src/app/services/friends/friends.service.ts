import { Injectable } from '@angular/core';
import { doc, collection, query, addDoc, deleteDoc, updateDoc, Firestore, where, getDocs, collectionSnapshots } from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  private readonly FRIENDS_DB = 'friends';

  constructor(private firestore: Firestore) { }

  async getFriendStatus(uid: string) : Promise<any> {
    let refUserId1 = query(collection(this.firestore, this.FRIENDS_DB), where('userId1', '==', uid));
    let queryData1 = await getDocs(refUserId1).then(data1 => {
      if (data1.docs.length == 0)
        return null;
      
      return data1.docs[0].data();
    });

    if (queryData1)
    {
      return queryData1;
    }

    let refUserId2 = query(collection(this.firestore, this.FRIENDS_DB), where('userId2', '==', uid));
    return await getDocs(refUserId2).then(data2 => {
      if (data2.docs.length == 0)
        return null;

      return data2.docs[0].data();
    });
  }

  getFriendStatusRealTime(activeUserId: string, uid: string) : Observable<any> {
    const ref = query(collection(this.firestore, this.FRIENDS_DB));
    return from(collectionSnapshots(ref).pipe(map(data => {
      let result = null;
      data.forEach((e: any) => {
        let status = e.data();
        if ((status.userId1 == uid && status.userId2 == activeUserId) || (status.userId2 == uid && status.userId1 == activeUserId))
        {
          result = status;
          return;
        }
      })

      return result;
    })));
  }

  getFriends(uid: string) :  Observable<any> {
    const ref = query(collection(this.firestore, this.FRIENDS_DB));
    return from(collectionSnapshots(ref).pipe(map(data => {
      let result: any[] = [];
      data.forEach((e: any) => {
        let status = e.data();
        if (status.userId1 == uid || status.userId2 == uid)
        {
          status.friend = (status.userId1 == uid) ? status.userId2 : status.userId1;
          result.push(status);
        }
      })
      return result;
    })));
  }

  requestFriend(activeUserId: string, newFriendUid: string) : Observable<any> {
    const ref = collection(this.firestore, this.FRIENDS_DB);
    const data = {
      userId1: activeUserId,
      userId2: newFriendUid,
      status: 'request',
      createdAt: Date.now()
    };
    return from(addDoc(ref, data));
  }

  async cancelRequestFriend(activeUserId: string, newFriendUid: string) : Promise<any> {
    let ref = query(collection(this.firestore, this.FRIENDS_DB), where('userId1', '==', activeUserId), where('userId2', '==', newFriendUid));
    let result = await getDocs(ref);

    if (result.docs.length == 0)
      return null;

    console.log(result.docs[0]);
    let friendRequestId = result.docs[0].id;

    let newRef = doc(this.firestore, this.FRIENDS_DB, friendRequestId);
    return await deleteDoc(newRef);
  }

  async applyRequestFriend(activeUserId: string, newFriendUid: string) : Promise<any> {
    let ref = query(collection(this.firestore, this.FRIENDS_DB), where('userId2', '==', activeUserId), where('userId1', '==', newFriendUid));
    let result = await getDocs(ref);

    if (result.docs.length == 0)
      return null;

    console.log(result.docs[0]);
    let friendRequestId = result.docs[0].id;

    let newRef = doc(this.firestore, this.FRIENDS_DB, friendRequestId);
    return await updateDoc(newRef, {
      status: 'confirmed'
    });
  }

  async deleteFriend(activeUserId: string, newFriendUid: string) : Promise<any> {
    let ref = query(collection(this.firestore, this.FRIENDS_DB), where('userId1', '==', activeUserId), where('userId2', '==', newFriendUid));
    let result = await getDocs(ref);

    if (result.docs.length != 0)
    {
      let friendRequestId = result.docs[0].id;
  
      let newRef = doc(this.firestore, this.FRIENDS_DB, friendRequestId);
      return await deleteDoc(newRef);
    }

    ref = query(collection(this.firestore, this.FRIENDS_DB), where('userId2', '==', activeUserId), where('userId1', '==', newFriendUid));
    result = await getDocs(ref);

    if (result.docs.length != 0)
    {
      let friendRequestId = result.docs[0].id;
  
      let newRef = doc(this.firestore, this.FRIENDS_DB, friendRequestId);
      return await deleteDoc(newRef);
    }
    return null;
  }
}
