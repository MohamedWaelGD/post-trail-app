import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  })

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  constructor(private authService: AuthService, 
    private router: Router, 
    private toastr: ToastrService) { }

  ngOnInit() {
  }

  ngOnDestroy() { }

  loginSubmit() {
    if (!this.loginForm.valid)
      return;

    const { email, password } = this.loginForm.value; 
    let infoToastr = this.toastr.info('Logging in...', 'Login');
    this.authService.login(email, password).subscribe({
      next: value => {
        this.toastr.success('Logged in successfully', 'Login');
        this.router.navigate(['']);
        this.toastr.remove(infoToastr.toastId);
      },
      error: err => {
        const errStr = err.toString();
        if (errStr.includes('wrong-password') || errStr.includes('user-not-found'))
        {
          this.toastr.error('Invalid Password or Email', 'Login');
        }
        else
        {
          this.toastr.error('Error happened, Please try again', 'Login');
        }
        this.toastr.remove(infoToastr.toastId);
      }
    });
  }
}
