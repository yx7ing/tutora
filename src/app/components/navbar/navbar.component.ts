import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
   
  user: User = {email:"", name:"", type:""};
  name: string = "";

  constructor(private authSrv: AuthService) { }

  ngOnInit() {
    this.authSrv.getCurrentUser().subscribe(
      response => {
        this.user = response;
        var firstName = response.name.match(/.+\s/)[0];
        this.name = firstName.substr(0, firstName.length);
        var lastName = response.name.match(/\s[^\s]+$/)[0];
        this.name += lastName.substr(1, 1);
      }
    )
  }

}
