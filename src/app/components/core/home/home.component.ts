import { Component, OnInit } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { PostsService } from 'src/app/services/posts/posts.service';
import { UsersService } from 'src/app/services/users/users.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  activeUser!: any;
  posts: any[] = [];

  constructor(private postsService: PostsService, private usersService: UsersService) { }

  ngOnInit() {
    this.usersService.currentUserProfile$.subscribe(user => {
      this.activeUser = user;
      this.postsService.getPosts().subscribe(data => {
        this.posts = data;
      })
    })
  }

  ngOnDestroy() { }
}
