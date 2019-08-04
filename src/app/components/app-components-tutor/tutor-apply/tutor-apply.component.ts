import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Vacancy } from 'src/app/models/vacancy';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { TutorApplyApplicationComponent } from '../tutor-apply-application/tutor-apply-application.component';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/core/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Application } from 'src/app/models/application';

@Component({
  selector: 'app-tutor-apply',
  templateUrl: './tutor-apply.component.html',
  styleUrls: ['./tutor-apply.component.css']
})
export class TutorApplyComponent implements OnInit {

  vacancies: Vacancy[];
  displayedColumns: string[] = ['course', 'courseName', 'positions', 'lecturer'];
  dataSource;
  currentUser: User;
  applications: Application[];

  constructor(private fbSrv: FirebaseService, private dialog: MatDialog, private authSrv: AuthService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.authSrv.getCurrentUser().subscribe(
      response => {
        this.currentUser = response;
        this.fbSrv.searchApplications(response.email);
      }
    );

    this.fbSrv.searchVacancies();
    this.fbSrv.getVacancies().subscribe(
      response => {
        this.vacancies = response;
        this.dataSource = new MatTableDataSource(this.vacancies);
      }
    );

    this.fbSrv.getSubmitApplicationResponse().subscribe(
      response => {
        if (response == "success") {
          this.snackBar.open("Successfully submitted", '', {
            verticalPosition: 'top',
            panelClass: 'snackbar-green',
            duration: 2000
          });
        }
      }
    );

    this.fbSrv.getApplications().subscribe(
      response => {
        this.applications = response;
      }
    );
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  selectCourse(vacancy: Vacancy) {
    var applied = false;
    for (let application of this.applications) {
      if (vacancy.course == application.course) {
        applied = true;
      }
    }
    if (applied == false) {
      this.dialog.open(TutorApplyApplicationComponent, {
        data: {
          vacancy: vacancy,
          user: this.currentUser
        }
      });
    } else {
      this.snackBar.open("You have already applied for this position.", '', {
        verticalPosition: 'top',
        panelClass: 'snackbar-red',
        duration: 2000
      });
    }
  }

}
