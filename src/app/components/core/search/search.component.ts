import { registerLocaleData } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { PostsService } from 'src/app/services/posts/posts.service';
import { SearchService } from 'src/app/services/search/search.service';
import { UsersService } from 'src/app/services/users/users.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  activeUser!: any;
  users!: any[];
  posts!: any[];
  searchData!: any;

  constructor(
    private usersService: UsersService,
    private searchService: SearchService,
    private postsService: PostsService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.searchData = params['search'];
      const searchDataPostId = params['id'];
      console.log(this.router.url);
      console.log("Search: " + this.searchData);
      console.log("Search ID: " + searchDataPostId);
      if (!this.searchData && !searchDataPostId)
      {
        this.router.navigate(['']);
        return;
      }

      this.usersService.currentUserProfile$.subscribe(user => {
        this.activeUser = user;
        if (this.searchData)
        {
            this.searchService.searchUsers(this.searchData).subscribe(data => {
              this.users = data;
            })
            this.searchService.searchPosts(this.searchData).subscribe(data => {
              this.posts = data;
            })
        }
        else
        {
          this.postsService.getPost(searchDataPostId).subscribe(data => {
            if (!data.data())
            {
              this.router.navigate(['']);
            }
            else
            {
              this.posts = [data.data()];
            }
          })
        }
      });

    })
  }

  ngOnDestroy() { }
}
