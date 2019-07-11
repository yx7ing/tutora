import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tutor',
  templateUrl: './tutor.component.html',
  styleUrls: ['./tutor.component.css']
})
export class TutorComponent implements OnInit {

  currentUser: User;

  constructor(private authSrv: AuthService, private router: Router) { }

  ngOnInit() {
    this.authSrv.getCurrentUser().subscribe(
      response => {
        this.currentUser = response;
        if (!this.currentUser) {
          this.currentUser = {
            email: "",
            type: ""
          };
        }
        console.log(this.currentUser);
      }
    );
  }

  logout() {
    this.authSrv.logout();
  }

  returnHome() {
    this.router.navigate([''])
  }

}
