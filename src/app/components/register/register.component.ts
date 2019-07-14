import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
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
    private router: Router
  ) { }

  ngOnInit() {
  }

  register(email:string, name: string, password: string) {
    this.registerEmailStatus = '';
    this.registerPasswordStatus = '';
    this.authService.registerTutor(email, name, password, 'tutor')
    .then(
      res => {
        this.router.navigate(['/register-details']);
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
