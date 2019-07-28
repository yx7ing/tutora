import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassUtilService } from 'src/app/services/class-util.service';
import { ClassModel } from 'src/app/models/classModel';

@Component({
  selector: 'app-lecturer-course',
  templateUrl: './lecturer-course.component.html',
  styleUrls: ['./lecturer-course.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LecturerCourseComponent implements OnInit {

  @Input() course: string;
  classes: ClassModel[] = [];

  constructor(private router: Router, private cuSrv: ClassUtilService) {
    if (this.router.getCurrentNavigation()) {
      this.course = this.router.getCurrentNavigation().extras.state.course;
      this.cuSrv.searchClasses(this.course);
    } else {
      this.router.navigate(['/crelture/home'])
    }

    this.cuSrv.searchClasses(this.course).subscribe(
      response => {
        this.classes = response;
      }
    )
  }

  ngOnInit() {
  }

}
