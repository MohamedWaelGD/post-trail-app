import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { PostModule } from '../post/post.module';
import { CoreModule } from '../core/core.module';

const routes: Routes = [
  { path: '',
    children: [
      { path: 'profile/:uid', component: ProfileComponent },
      { path: 'edit-profile', component: EditProfileComponent }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    CoreModule
  ],
  declarations: [
    UserComponent,
    ProfileComponent,
    EditProfileComponent
  ]
})
export class UserModule { }
