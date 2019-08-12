import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/core/auth.service';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { MatMenu } from '@angular/material/menu';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit {
   
  user: User = {email:"", name:"", type:""};
  name: string = "";
  notifications: any[] = [];
  newNotifications: any[] = [];
  notif: boolean = false;

  @ViewChild('appMenu', {static: true}) myMenu: MatMenu;

  constructor(private authSrv: AuthService, private router: Router, private fbSrv: FirebaseService) { }

  ngOnInit() {
    this.authSrv.getCurrentUser().subscribe(
      response => {
        this.user = response;
        if (response.name.match(/.+\s/)) {
          var firstName = response.name.match(/.+\s/)[0];
          this.name = firstName.substr(0, firstName.length);
          if (response.name.match(/\s[^\s]+$/)) {
            var lastName = response.name.match(/\s[^\s]+$/)[0];
            this.name += lastName.substr(1, 1);
          }
        } else {
          this.name = response.name;
        }

        if (this.user.type == "tutor") {
          this.fbSrv.searchNotifications(this.user.email);
        }
      }
    );

    this.fbSrv.getNotifications().subscribe(
      response => {
        this.notifications = response;
        this.newNotifications = [];
        for (let notification of this.notifications) {
          if (!notification.notification.seen) {
            this.newNotifications.push(notification);
            this.notif = true;
          } else {
            this.notif = false;
          }
        }
        this.newNotifications.sort((a,b) => (a.notification.timestamp < b.notification.timestamp) ? 1 : -1);
      }
    );
  }

  logout() {
    this.authSrv.logout()
    .then(
      res => {
        this.router.navigate(['/login']);
      }, 
      error => {
        console.log("Logout error", error);
      }
    );    
  }

  seeNotifs() {
    this.myMenu._animationDone
    .pipe(filter(event => event.toState === 'void'), take(1))
    .subscribe(() => {
      this.fbSrv.seeTutorNotifications(this.newNotifications);
    });
  }

}
