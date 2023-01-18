import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './components/auth/auth.module';
import { CoreModule } from './components/core/core.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth, } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore'
import { provideStorage, getStorage } from '@angular/fire/storage'
import { AuthService } from './services/auth/auth.service';
import { UsersService } from './services/users/users.service';
import { PostModule } from './components/post/post.module';
import { PostsService } from './services/posts/posts.service';
import { CommentsService } from './services/comments/comments.service';
import { FriendsService } from './services/friends/friends.service';
import { SearchService } from './services/search/search.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-left',
      progressBar: true
    }),
    AuthModule,
    CoreModule,
    PostModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ],
  providers: [
    AuthService,
    UsersService,
    PostsService,
    CommentsService,
    FriendsService,
    SearchService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
