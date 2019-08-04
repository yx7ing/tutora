import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AuthService } from 'src/app/core/auth.service';
import { UserTutor } from 'src/app/models/userTutor';

@Component({
  selector: 'app-lecturer-course-application',
  templateUrl: './lecturer-course-application.component.html',
  styleUrls: ['./lecturer-course-application.component.css']
})
export class LecturerCourseApplicationComponent implements OnInit {

  tutor: UserTutor;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbSrv: FirebaseService
  ) { }

  ngOnInit() {
    this.fbSrv.searchTutor(this.data.application.email);
    this.fbSrv.getTutor().subscribe(
      response => {
        this.tutor = response;
      }
    )
  }

}
 