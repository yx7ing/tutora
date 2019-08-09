import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UserTutor } from 'src/app/models/userTutor';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-lecturer-course-application',
  templateUrl: './lecturer-course-application.component.html',
  styleUrls: ['./lecturer-course-application.component.css']
})
export class LecturerCourseApplicationComponent implements OnInit {

  application = this.data.application;
  tutor: UserTutor;
  runOnce = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbSrv: FirebaseService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.fbSrv.searchTutor(this.data.application.email);
    this.fbSrv.getTutor().subscribe(
      response => {
        this.tutor = response;
        var cv = document.getElementById("downloadcv");
        if (this.tutor.cv) {
          cv.setAttribute("href", this.tutor.cv.downloadUrl);
        }
        if (this.tutor.tutorExperience.length > 0) {
          setInterval(this.increment.bind(this), 1);
        }
      }
    );
    this.fbSrv.searchApplication(this.application.email, this.application.course);
    this.fbSrv.getApplication().subscribe(
      response => {
        if (response) {
          this.application = response;
        }
      }
    )
  }

  updateInterview(update: string, type: string) {
    if (type == "setTime" && !update.match(/[0-9][0-9]\/[0-9][0-9]\/[0-9][0-9]\s[0-9][0-9]:[0-9][0-9]/)) {
      this.snackBar.open('Please follow the date/time format provided (DD/MM/YY HH:MM)', '', {
        verticalPosition: 'top',
        panelClass: 'snackbar-red',
        duration: 3000
      });
    } else {
      this.fbSrv.updateInterview(this.application.email, this.application.course, update);
    }
  }

  increment() {
    if (this.runOnce == 0) {
      var i = 0
      for (let tutExp of this.tutor.tutorExperience) {
        var id = "tutExpDoc" + i;
        var tutExpDoc = document.getElementById(id);
        if (!tutExpDoc) return;
        tutExpDoc.setAttribute("href", tutExp.document.downloadUrl);
        i++;
      }
    }
    this.runOnce++;
  }

  updateStatus(status: string) {
    this.fbSrv.updateApplicationStatus(this.application.email, this.application.course, status);
  }
}
 