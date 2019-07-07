import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerEmailStatus: string = '';
  registerPasswordStatus: string = '';

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  register(email:string, password: string) {
    this.registerEmailStatus = '';
    this.registerPasswordStatus = '';
    this.authService.register(email, password)
    .then(
      res => {
        console.log(res);
        console.log('registered');
      },
      err => {
        var error: string;
        switch (err.code) {
          case "auth/email-already-in-use":
            error = "Email already registered, please sign in or enter a different email.";
            this.registerEmailStatus = 'failed';
            break;
          case "auth/invalid-email":
            error = "Invalid email. Please enter a valid email address."
            this.registerEmailStatus = 'failed';
            break;
          case "auth/weak-password":
            error = "Password must be at least 6 characters."
            this.registerPasswordStatus = 'failed';
            break;
          default:
            error = "Unknown error. Please contact support."
            break;
        }
        this.snackBar.open(error, '', {
          verticalPosition: 'top',
          panelClass: 'snackbar-red',
          duration: 2500
        })
      }
    )
  }
}
