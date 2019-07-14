import { Component, OnInit } from '@angular/core';
import { UploadDetailsService } from 'src/app/services/upload-details.service';
import { TutorExperience } from 'src/app/models/tutorExperience';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Upload } from 'src/app/models/upload';
import { UserTutor } from 'src/app/models/userTutor';
import { AuthService } from 'src/app/core/auth.service';
import { User } from 'src/app/models/user';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-details',
  templateUrl: './register-details.component.html',
  styleUrls: ['./register-details.component.css']
})
export class RegisterDetailsComponent implements OnInit {

  user: User;
  detailsStep = 1;
  activeUploads = 0;
  cv: Upload;
  tutExps: TutorExperience[] = [];

  constructor(
    private udSrv: UploadDetailsService, 
    private snackBar: MatSnackBar, 
    private authSrv: AuthService, 
    private fbSrv: FirebaseService,
    private router: Router
  ) { }

  ngOnInit() {
    this.udSrv.getActiveUploads().subscribe(
      response => this.activeUploads = response
    )
    this.authSrv.getCurrentUser().subscribe(
      response => this.user = response
    )
  }

  addTutExp() {
    var tutExp: TutorExperience = {
      course: "",
      courseName: "",
      taught: "",
      lic: "",
      document: null
    }
    this.tutExps.push(tutExp);
  }

  saveDetails(dob: string, mob: string, add: string, deg: string, yoc: string, uoc: string, wam: string) {
    if (dob == "" || mob == "" || add == "" || deg == "" || yoc == "" || uoc == "" || wam == "") {
      this.snackBar.open('Please fill all fields.', '', {
        verticalPosition: 'top',
        panelClass: 'snackbar-red',
        duration: 2500
      });
    } else {
      if (!this.udSrv.getCvUpload()) {
        this.snackBar.open('Please upload a CV.', '', {
          verticalPosition: 'top',
          panelClass: 'snackbar-red',
          duration: 2500
        });
      } else {
        this.cv = this.udSrv.getCvUpload()
        for (var i = 0; i < this.tutExps.length; i++) {
          this.tutExps[i].document = this.udSrv.getMyExpUploads()[i]
        }
        for (let tutExp of this.tutExps) {
          if (tutExp.course == "" || tutExp.courseName == "" || tutExp.taught == "" || tutExp.lic == "" || !tutExp.document) {
            this.snackBar.open('Please fill all fields of each tutoring experience row, or remove unnecessary rows.', '', {
              verticalPosition: 'top',
              panelClass: 'snackbar-red',
              duration: 2500
            });
            return;
          }
          var tutor: UserTutor = {
            email: this.user.email,
            name: this.user.name,
            dob: dob,
            mobile: mob,
            address: add,
            degree: deg,
            yoc: yoc,
            uoc: uoc,
            wam: wam,
            cv: this.cv,
            tutorExperience: this.tutExps
          }
          this.fbSrv.createTutorProfile(tutor)
          .then(
            res => {
              this.snackBar.open('Details saved. You are now ready to apply for positions.', '', {
                verticalPosition: 'top',
                panelClass: 'snackbar-green',
                duration: 2500
              });
              this.router.navigate(['']);
            }, err => {
              this.snackBar.open('Something went wrong. Please try again, or skip to your homepage and contact support.', '', {
                verticalPosition: 'top',
                panelClass: 'snackbar-red',
                duration: 2500
              });
            }
          )
        }
      }
    }
  }

  removeRow(i: number){
    this.tutExps.splice(i, 1);
    this.udSrv.removeMyExpUpload(i);
  }

}
