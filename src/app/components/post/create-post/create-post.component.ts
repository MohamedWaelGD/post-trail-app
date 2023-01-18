import { Component, OnInit, ViewChild } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ToastrService } from 'ngx-toastr';
import { concatMap } from 'rxjs';
import { ImageUploadService } from 'src/app/services/image-upload/image-upload.service';
import { PostsService } from 'src/app/services/posts/posts.service';
import { UsersService } from 'src/app/services/users/users.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  user$ = this.usersService.currentUserProfile$;

  contentInput!: any;
  @ViewChild('imageInput') imageInput!: any;
  imageFile!: any;
  imageSrc!: any;
  isLoading: boolean = false;

  constructor(
    private usersService: UsersService,
    private postsService: PostsService,
    private imageUploadService: ImageUploadService,
    private toastr: ToastrService) { }

  ngOnInit() {
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

  createPost() {
    this.isLoading = true;
    let creating = false;
    this.toastr.info('Creating the post...', 'Post Creation');
    this.usersService.currentUserProfile$.subscribe(data => {
      if (!creating)
      {
        creating = true;
        this.postsService.addPost(
          {
            content: this.contentInput,
            userId: data?.uid
          }
        ).subscribe(data => {
          if (this.imageSrc)
          {
            this.imageUploadService.uploadImage(this.imageFile, `images/posts/${data.id}`).pipe(
              concatMap((photoUrl) => this.postsService.updatePost({id: data.id, photoURL: photoUrl}))
            ).subscribe((data)=>{
              this.toastr.success('Post Is Created', 'Post Creation');
              this.contentInput = "";
              this.clearImage();
              this.isLoading = false;
            });
          }
          else
          {
            this.postsService.updatePost({id: data.id}).subscribe((data)=>{
              this.toastr.success('Post Is Created', 'Post Creation');
              this.contentInput = "";
              this.clearImage();
              this.isLoading = false;
            });
          }
        })
      }
    })
  }
}
