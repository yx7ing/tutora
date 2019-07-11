import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  account: Account;
  loginStatus: string = "";

  constructor(
    private authSrv: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  }


  login(email:string, password: string) {
    this.authSrv.login(email, password)
    .then(
      res => {
        this.router.navigate(['/_']);
      }, 
      error => {
        this.loginStatus = "failed";
        this.snackBar.open('Incorrect username or password', '', {
          verticalPosition: 'top',
          panelClass: 'snackbar-red',
          duration: 1500
        })
      }
    );
  }
}
