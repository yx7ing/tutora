import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/auth.service';
import { UserService } from './core/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'tutora';

  constructor(
    private authSrv: AuthService,
    private userSrv: UserService
  ) { }

  ngOnInit() {
    this.userSrv.getCurrentUser().then(
      res => {
        this.authSrv.setCurrentUser(res.email);
      }
    )
  }
}
