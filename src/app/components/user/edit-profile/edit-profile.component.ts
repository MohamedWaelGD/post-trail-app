import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ToastrService } from 'ngx-toastr';
import { concatMap } from 'rxjs';
import { ImageUploadService } from 'src/app/services/image-upload/image-upload.service';
import { UsersService } from 'src/app/services/users/users.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  user$ = this.usersService.currentUserProfile$;
  activeUser!: any;
  isLoading: boolean = false;

  profileForm = new FormGroup({
    uid: new FormControl(''),
    displayName: new FormControl(''),
    birthdate: new FormControl(''),
    phone: new FormControl(''),
    address: new FormControl('')
  });

  constructor(
    private usersService: UsersService,
    private imageUploadService:ImageUploadService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.usersService.currentUserProfile$.subscribe((user) => {
      this.profileForm.patchValue({ ...user })
      this.activeUser = user;
    })
  }

  uploadImage(event: any, user: any) {
    this.isLoading = true;
    this.toastr.info("Updating Picture...", "Change Picture");
    this.imageUploadService.uploadImage(event.target.files[0], `images/profile/${user.uid}`).pipe(
      concatMap((photoUrl) => this.usersService.updatUser({ uid: user.uid, photoURL: photoUrl}))
    ).subscribe(()=>{
      this.isLoading = false;
      this.toastr.success("Picture successfully updated", "Change Picture");
    });
  }

  saveProfile()
  {
    this.isLoading = true;
    const profileData = this.profileForm.value;
    this.toastr.info("Updating Information...", "Update Information");
    this.usersService.updatUser(profileData).subscribe(()=>{
      this.isLoading = false;
      this.toastr.success("Information successfully updated", "Update Information");
    });
  }

  ngOnDestroy() { }
}
