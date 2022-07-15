import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService } from '../sdk/custom/user.service';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  loading: any;
  router: any;
  constructor(private formBuilder: FormBuilder,
  private userService: UserService) {}
  registerForm!: FormGroup;


  ngOnInit(): void {
    this.formInitializer();
  }

  formInitializer() {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirm_password: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          this.matchOtherValidator('password')
        ]
      ]
    });
  }

  matchOtherValidator(otherControlName: string) {
    return (control: AbstractControl | any)  => {
      const otherControl: AbstractControl = control.root.get(otherControlName);

      if (otherControl) {
        const subscription: Subscription = otherControl.valueChanges.subscribe(
          () => {
            control.updateValueAndValidity();
            subscription.unsubscribe();
          }
        );
      }

      return otherControl && control.value !== otherControl.value
        ? { match: true }
        : null;
    };
  }
  save() {
    this.loading = true;
console.log("working");
    this.userService.userRegister(this.registerForm.value).subscribe(
      data => {
        console.log('got response from server', data);
        this.loading = false;
        this.router.navigateByUrl('/home');
      },
      error => {
        this.loading = false;
        console.log('error', error);
      }
    );
  }
}
