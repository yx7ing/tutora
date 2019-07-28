import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-lecturer-course',
  templateUrl: './lecturer-course.component.html',
  styleUrls: ['./lecturer-course.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LecturerCourseComponent implements OnInit {

  @Input() course: string;

  constructor(private router: Router) {
    if (this.router.getCurrentNavigation()) {
      this.course = this.router.getCurrentNavigation().extras.state.course;
    } else {
      this.course = "No Course Selected";
    }
  }

  ngOnInit() {
  }

}
