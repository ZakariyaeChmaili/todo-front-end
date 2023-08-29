import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/components/authentication/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthenticationService,private route:Router) {

  }


  login() {
    this.authService.login({ username: this.username, password: this.password }).subscribe((res: any) => {
      console.log(res);
      localStorage.setItem('token', res.token);
      this.route.navigate(['/home/todos']);
    })
  }

  create() {
    console.log(this.username, this.password);
    this.authService.create({ username: this.username, password: this.password }).subscribe((res: any) => {
      console.log(res);
    })

  }



}
