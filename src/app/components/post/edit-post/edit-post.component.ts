import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ToastrService } from 'ngx-toastr';
import { concatMap, switchMap } from 'rxjs';
import { ImageUploadService } from 'src/app/services/image-upload/image-upload.service';
import { PostsService } from 'src/app/services/posts/posts.service';
import { UsersService } from 'src/app/services/users/users.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {

  user$ = this.usersService.currentUserProfile$;
  postData!: any;

  contentInput!: any;
  @ViewChild('imageInput') imageInput!: any;
  imageFile!: any;
  imageSrc!: any;
  isLoading: boolean = false;

  constructor(
    private usersService: UsersService,
    private postsService: PostsService,
    private imageUploadService: ImageUploadService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      const uid = params['id'];
      console.log(uid);
      this.postsService.getPost(uid).subscribe(data =>{
        console.log(data);
        console.log(data.userId);
        if (!data)
        {
          this.router.navigate(['']);
          return;
        }

        this.user$.subscribe((user) => {
          if (user?.uid !== data.data().userId)
          {
            this.router.navigate(['']);
            return;
          }
  
          this.contentInput = data.data().content;
          this.imageSrc = data.data().photoURL;
          this.postData = data.data();
        })
      });
    })
  }

  ngOnDestroy() { }

  onImageChange(event: any) {
    this.imageFile = event.target.files[0];

    if (this.imageFile) {
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;

      reader.readAsDataURL(this.imageFile);
    }
  }

  clearImage() {
    this.imageFile = null;
    this.imageSrc = null;
    this.imageInput.nativeElement.value = '';
  }

  updatePost() {
    this.isLoading = true;
    this.toastr.info("Editing post...", "Edit Post");
    this.postsService.updatePost(
      {
        id: this.postData.id,
        content: this.contentInput
      }
    ).subscribe(data => {
      if (this.imageFile) {
        this.imageUploadService.uploadImage(this.imageFile, `images/posts/${this.postData.id}`).pipe(
          concatMap((photoUrl) => this.postsService.updatePost({id: this.postData.id, photoURL: photoUrl}))
        );
      }
      this.isLoading = false;
      this.toastr.success("Post successfully edited", "Edit Post");
    })
  }

  deletePost() {
    this.isLoading = true;
    this.toastr.info("Deleting post...", "Delete Post");
    this.postsService.deletePost(this.postData.id).subscribe(data => {
      this.toastr.success("Post successfully deleted", "Delete Post");
      this.isLoading = false;
      this.router.navigate(['']);
    });
  }
}
