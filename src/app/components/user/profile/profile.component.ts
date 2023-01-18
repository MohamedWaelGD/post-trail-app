import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ToastrService } from 'ngx-toastr';
import { concatMap } from 'rxjs';
import { FriendsService } from 'src/app/services/friends/friends.service';
import { ImageUploadService } from 'src/app/services/image-upload/image-upload.service';
import { PostsService } from 'src/app/services/posts/posts.service';
import { UsersService } from 'src/app/services/users/users.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  firendStatus!: any;
  user!: any;
  activeUser!: any;
  posts: any[] = [];

  constructor(
    private usersService: UsersService,
    private postsService: PostsService,
    private friendsService: FriendsService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      const uid = params['uid'];
      this.usersService.getUserWithUid(uid).subscribe(data =>{
        if (!data)
        {
          this.router.navigate(['']);
          return;
        }

        this.user = data;
        this.usersService.currentUserProfile$.subscribe(activeUser => {
          this.activeUser = activeUser;
          this.updateFriendStatus();
        });
        this.postsService.getPostsByUserId(this.user.uid).subscribe(posts => {
          posts.forEach((element: any) => {
            this.posts.push(element.data());
          });
        });
      });
    })
  }

  updateFriendStatus() {
    this.friendsService.getFriendStatusRealTime(this.activeUser.uid, this.user.uid).subscribe(friendStatus => {
      this.firendStatus = friendStatus;
    });
  }
  
  requestFriend() {
    this.friendsService.requestFriend(this.activeUser.uid, this.user.uid).subscribe(data => {
      this.toastr.success('Request sent', 'Friend Request');
    })
  }

  cancelRequestFriend() {
    this.friendsService.cancelRequestFriend(this.activeUser.uid, this.user.uid).then(data => {
      this.toastr.success('Request cenceled', 'Friend Request');
    })
  }

  applyRequestFriend() {
    this.friendsService.applyRequestFriend(this.activeUser.uid, this.user.uid).then(data => {
      this.toastr.success('Request confirmed', 'Friend Request');
    })
  }

  unfriend() {
    this.friendsService.deleteFriend(this.activeUser.uid, this.user.uid).then(data => {
      this.toastr.success('Unfriend successfully', 'Friend Request');
    })
  }

  ngOnDestroy() { }
}
