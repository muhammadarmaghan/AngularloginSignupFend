import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { UserService } from '../sdk/custom/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loading: any;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) { }
  loginForm!: FormGroup ;
  ngOnInit(): void {
    this.formInitializer();
  }
  formInitializer(){
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]]
    });
  }
  save() {
    const loginData = this.loginForm.value;
    console.log('loginData', loginData);
    // we need to send this data to our node.js server

    this.userService.userLogin(loginData).subscribe(
      (      data: any) => {
        console.log('got response from server', data);
        this.loading = false;
      },
      (      error: any) => {
        this.loading = false;
        console.log('error', error);
      }
    );
  }
}

