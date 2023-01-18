import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectToLogin = () => redirectUnauthorizedTo(['login']);
const redirectToHome = () => redirectLoggedInTo(['']);

const routes: Routes = [
  { path: '', loadChildren: () => import('./components/core/core.module').then(m => m.CoreModule), ...canActivate(redirectToLogin) },
  { path: 'user', loadChildren: () => import('./components/user/user.module').then(m => m.UserModule), ...canActivate(redirectToLogin) },
  { path: 'post', loadChildren: () => import('./components/post/post.module').then(m => m.PostModule), ...canActivate(redirectToLogin) },
  { path: 'auth', loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule), ...canActivate(redirectToHome) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
