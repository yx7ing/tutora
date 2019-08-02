import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Application } from 'src/app/models/application';
import { FirebaseService } from 'src/app/services/firebase.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tutor-apply-application',
  templateUrl: './tutor-apply-application.component.html',
  styleUrls: ['./tutor-apply-application.component.css']
})
export class TutorApplyApplicationComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private fbSrv: FirebaseService, 
    private snackBar: MatSnackBar,
    private dialogRef:MatDialogRef<TutorApplyApplicationComponent>
  ) { }

  ngOnInit() {

  }

  submitApplication(mark: number, tutExpYes: boolean, courseExpYes: boolean, comments: string, timePref: string) {
    if (mark < 65) {
      this.snackBar.open("You cannot tutor a course if you scored below credit (65) in it.", '', {
        verticalPosition: 'top',
        panelClass: 'snackbar-red',
        duration: 2500
      });
    } else if (mark > 100) {
      this.snackBar.open("Please enter a valid mark.", '', {
        verticalPosition: 'top',
        panelClass: 'snackbar-red',
        duration: 2500
      });
    } else if (comments == "") {
      this.snackBar.open("Please enter a comment.", '', {
        verticalPosition: 'top',
        panelClass: 'snackbar-red',
        duration: 2500
      });
    } else if (timePref == "") {
      this.snackBar.open("Please list your time preferences", '', {
        verticalPosition: 'top',
        panelClass: 'snackbar-red',
        duration: 2500
      });
    } else {
      var application: Application = {
        email: this.data.user.email,
        course: this.data.vacancy.course,
        mark: mark,
        tutExp: tutExpYes ? "Y" : "N",
        courseExp: courseExpYes ? "Y" : "N",
        comments: comments,
        timePref: timePref
      }
      this.fbSrv.submitApplication(application);
      this.dialogRef.close();
    }
  }

}
