import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePostComponent } from './create-post/create-post.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

const routes: Routes = [
  { path: '',
    children: [
      { path: 'create', component: CreatePostComponent },
      { path: 'edit/:id', component: EditPostComponent }
    ]
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    CreatePostComponent,
    EditPostComponent  
  ]
})
export class PostModule { }
