import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lecturer',
  templateUrl: './lecturer.component.html',
  styleUrls: ['./lecturer.component.css']
})
export class LecturerComponent implements OnInit {

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
