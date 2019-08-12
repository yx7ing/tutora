import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AdminCreateLecturerComponent } from '../admin-create-lecturer/admin-create-lecturer.component';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UserLecturer } from 'src/app/models/userLecturer';
import { MatTableDataSource } from '@angular/material/table';
import { AdminEditComponent } from '../admin-edit/admin-edit.component';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {

  lecturers: UserLecturer[];
  displayedColumns: string[] = ['name', 'email'];
  dataSource;

  selectedRowIndex: number = -1;

  constructor(private authSrv: AuthService, private router: Router, private dialog: MatDialog, private fbSrv: FirebaseService) { }

  ngOnInit() {
    this.authSrv.getCurrentUser().subscribe(
      response => {
        this.fbSrv.searchLecturers(response.email);
      }
    )

    this.fbSrv.getLecturers().subscribe(
      response => {
        this.lecturers = response;
        this.dataSource = new MatTableDataSource(this.lecturers);
      }
    )
  }

  openCreateLecturerDialog() {
    this.dialog.open(AdminCreateLecturerComponent, {
      width: '30vw',
      position: {
        top: '60px'
      }
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.selectedRowIndex = -1;
  }

  highlight(index){
    this.selectedRowIndex = index;
  }

  edit() {
    this.dialog.open(AdminEditComponent, {
      width: '30vw',
      position: {
        top: '60px'
      },
      data: {
        lecturer: this.lecturers[this.selectedRowIndex]
      }
    });
  }

}
