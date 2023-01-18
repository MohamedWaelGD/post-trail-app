import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreComponent } from './core.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule, Routes } from '@angular/router';
import { PostComponent } from './post/post.component';
import { CommentComponent } from './comment/comment.component';
import { HomeComponent } from './home/home.component';
import { FriendsComponent } from './home/friends/friends.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: HomeComponent },
      { path: 'search/:search', component: SearchComponent },
      { path: 'search/post/:id', component: SearchComponent },
    ]
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    NavbarComponent,
    PostComponent,
    CommentComponent,
    HomeComponent,
    FriendsComponent,
    SearchComponent
  ],
  declarations: [
    CoreComponent,
    NavbarComponent,
    PostComponent,
    CommentComponent,
    HomeComponent,
    FriendsComponent,
    SearchComponent
  ]
})
export class CoreModule { }
