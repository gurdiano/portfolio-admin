import { Component, inject } from '@angular/core';
import { BaseCard } from '../../components/base-card/base-card';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {ErrorStateMatcher} from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth/auth-service';
import { Router } from '@angular/router';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  imports: [
    BaseCard,
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private formBuild = inject(FormBuilder);
  private authService = inject(AuthService);

  private router = inject(Router);

  constructor() {
    if(this.authService.isAuthenticated()){
      this.router.navigate(['/home']);
    }
  }


  hide = true;
  isInvalidLogin = false;
  matcher = new MyErrorStateMatcher();

  loginForm = this.formBuild.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.min(3)]]
  })

  onSubmit(){
    const value = this.loginForm.value;
    this.authService.login({email: value.email!, password: value.password!}).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: () => {
        this.isInvalidLogin = true;
      },
    })
  }
}
