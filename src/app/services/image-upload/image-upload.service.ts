import { Injectable } from '@angular/core';
import { getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';
import { from, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  constructor(private storage: Storage) { }

  uploadImage(image: File, path: string): Observable<string> {
    const strorageRef = ref(this.storage, path);
    const uploadTask = from(uploadBytes(strorageRef, image));
    return uploadTask.pipe(
      switchMap((result) => getDownloadURL(result.ref))
    )
  }
}
