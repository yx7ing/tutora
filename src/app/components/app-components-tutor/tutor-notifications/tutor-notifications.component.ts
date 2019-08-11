import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-tutor-notifications',
  templateUrl: './tutor-notifications.component.html',
  styleUrls: ['./tutor-notifications.component.css']
})
export class TutorNotificationsComponent implements OnInit {

  notifications: any[] = []

  constructor(private authSrv: AuthService, private fbSrv: FirebaseService) { }

  ngOnInit() {
    this.authSrv.getCurrentUser().subscribe(
      response => {
        this.fbSrv.searchNotifications(response.email)
      }
    );

    this.fbSrv.getNotifications().subscribe(
      response => {
        this.notifications = response;
        this.notifications.sort((a,b) => (a.notification.timestamp < b.notification.timestamp) ? 1 : -1);
      }
    )
  }

}
