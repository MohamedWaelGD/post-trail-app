import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UsersService } from 'src/app/services/users/users.service';

export function passswordsMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return {
        passswordsMatchValidator: true
      }
    }

    return null;
  };
}

@AutoUnsubscribe()
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm = new FormGroup({
    displayName: new FormControl('', Validators.required),
    email: new FormControl('', [ Validators.required, Validators.email ]),
    password: new FormControl('', [ Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', Validators.required),
  }, { validators: passswordsMatchValidator() })
  toast: any;

  get displayName() {
    return this.registerForm.get('displayName');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  constructor(private authService: AuthService, 
    private usersService: UsersService, 
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {
  }

  ngOnDestroy() { }
  
  registerSubmit() {
    if (!this.registerForm.valid)
      return;

    const { displayName, email, password } = this.registerForm.value; 
    let infoToastr = this.toastr.info('Signing up...', 'Register');
    this.authService.signup(email, password).pipe(
      switchMap(({user: { uid } }) => this.usersService.addUser({ uid, displayName: displayName!, email: email! }))
    ).subscribe(
      {
        next: () => {
          this.toastr.remove(infoToastr.toastId);
          this.router.navigate(['']);
        },
        error: () => {
          this.toastr.error('Error happened, Please try again', 'Register');
        }
      });
  }
}
