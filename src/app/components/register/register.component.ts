import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

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
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit() {
  }

  register(email:string, name: string, password: string) {
    this.registerEmailStatus = '';
    this.registerPasswordStatus = '';
    this.authService.register(email, name, password, 'tutor')
    .then(
      res => {
        this.router.navigate(['/login']);
      },
      err => {
        switch (err.code) {
          case "auth/email-already-in-use":
            this.registerEmailStatus = 'failed';
            break;
          case "auth/invalid-email":
            this.registerEmailStatus = 'failed';
            break;
          case "auth/weak-password":
            this.registerPasswordStatus = 'failed';
            break;
        }
      }
    );
  }
}
