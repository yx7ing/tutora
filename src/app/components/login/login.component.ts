import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { DocumentChangeAction } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  account: Account;

  constructor(private fbSrv: FirebaseService, private router: Router) { }

  ngOnInit() {
  }


  login(username:string, password: string) {
    this.fbSrv.login(username, password).subscribe(res => {
      if (res.length > 0) {
        this.router.navigate(['/a-home'])
      } else {
        console.log("incorrect username or password")
      }
    });
  }
}
