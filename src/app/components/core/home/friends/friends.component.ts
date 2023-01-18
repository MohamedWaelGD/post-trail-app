import { Component, OnInit } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ToastrService } from 'ngx-toastr';
import { FriendsService } from 'src/app/services/friends/friends.service';
import { UsersService } from 'src/app/services/users/users.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

  activeUser!: any;
  requestedFriends: any = {};
  myFriends: any = {};

  requests() : Array<any> {
    return Object.keys(this.requestedFriends);
  }

  friends() : Array<any> {
    return Object.keys(this.myFriends);
  }

  constructor(
    private usersService: UsersService, 
    private friendsService: FriendsService,
    private toastr: ToastrService) 
  {
  }

  ngOnInit() {
    this.usersService.currentUserProfile$.subscribe(
      {
        next: user => {
          this.activeUser = user;
          this.friendsService.getFriends(this.activeUser.uid).subscribe(friends => {
            this.myFriends = {};
            this.requestedFriends = {};
            friends.forEach((friend: any) => {
              if (friend.status === "request")
              {
                if (friend.userId1 != this.activeUser.uid)
                {
                  this.usersService.getUserWithUid(friend.userId1).subscribe(user => {
                    this.requestedFriends[user.uid] = user
                  });
                }
              }
              else
              {
                this.usersService.getUserWithUid(friend.friend).subscribe(user => {
                  this.myFriends[user.uid] = user
                });
              }
            });
          })
        }
      });
  }

  ngOnDestroy() { }

  applyRequestFriend(userId: string) {
    this.friendsService.applyRequestFriend(this.activeUser.uid, userId).then(data => {
      this.toastr.success('Request confirmed', 'Friend Request');
    })
  }

  unfriend(userId: string) {
    this.friendsService.deleteFriend(this.activeUser.uid, userId).then(data => {
      this.toastr.success('Request denied', 'Friend Request');
    })
  }
}
