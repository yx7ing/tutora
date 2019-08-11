import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Application } from 'src/app/models/application';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-lecturer-course-assign',
  templateUrl: './lecturer-course-assign.component.html',
  styleUrls: ['./lecturer-course-assign.component.css']
})
export class LecturerCourseAssignComponent implements OnInit {

  user: User;
  dataSource;
  displayedColumns: string[] = ['name', 'time'];
  selectedRowIndex: number = -1;
  selectedApplication: Application;
  existingTutor: number = -1;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fbSrv: FirebaseService,
    private authSrv: AuthService
  ) { }

  ngOnInit() {
    this.authSrv.getCurrentUser().subscribe(
      response => {
        this.user = response;
      }
    )

    this.dataSource = new MatTableDataSource(this.data.acceptedTutors);
    if (this.data.class.tutor != "") {
      for (let i = 0; i < this.data.acceptedTutors.length; i++) {
        if (this.data.acceptedTutors[i].email == this.data.class.tutor) {
          this.selectedRowIndex = i;
          this.existingTutor = i;
        }
      }
    }
  }

  selectTutor(application: Application, index) {
    if (this.selectedRowIndex == index) {
      this.selectedRowIndex = -1;
      this.selectedApplication = null;
    } else {
      this.selectedRowIndex = index;
      this.selectedApplication = application;
    }
    console.log(this.selectedApplication);
  }

  assign(){
    this.fbSrv.updateClass(
      this.data.class, 
      this.data.acceptedTutors[this.selectedRowIndex].email, 
      this.data.acceptedTutors[this.selectedRowIndex].name,
      this.data.vacancy,
      this.data.class.tutor
    );
    this.fbSrv.notify(
      this.data.acceptedTutors[this.selectedRowIndex].email,
      this.user.name + " has assigned you to class " + this.data.class.session + " for " + this.data.class.course + "."
    );
  }

  unassign() {
    this.fbSrv.updateClass(this.data.class, "", "", this.data.vacancy, this.data.class.tutor);
    this.fbSrv.notify(
      this.data.acceptedTutors[this.selectedRowIndex].email,
      this.user.name + " has unassigned you from class " + this.data.class.session + " for " + this.data.class.course + "."
    );
  }

}
