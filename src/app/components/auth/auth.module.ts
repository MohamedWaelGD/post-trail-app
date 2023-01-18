import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

const routers: Routes = [
  { path: '',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent }
    ]
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routers),
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    AuthComponent,
    LoginComponent,
    RegisterComponent,
  ]
})
export class AuthModule { }
