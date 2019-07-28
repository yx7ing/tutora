import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClassUtilService {

  searchState: BehaviorSubject<string> = new BehaviorSubject<string>("initial");

  constructor(private http: HttpClient) { }

  searchfaculties() {
    this.http.get('https://cors-anywhere.herokuapp.com/http://classutil.unsw.edu.au', { responseType: 'text' }).subscribe(
      response => {
        var courses = response.match(/>[A-Z][A-Z][A-Z][A-Z]<.*<\/td> <\/tr>/g);
        var coursesParsed = []
        for (let course of courses) {
          course = course.replace(/>/g, '');
          course = course.replace(/<\/td/g, '');
          course = course.replace(/<td class=\"data\"/, '');
          course = course.replace(/ <\/tr/, '')
          coursesParsed.push(course);
        }
        console.log(coursesParsed)
      }
    )
  }

  searchCourses(faculty: string, term: string) {
    this.searchState.next("searching")
    var coursesParsed = new BehaviorSubject<string[]>([]);
    try {
      this.http.get('https://cors-anywhere.herokuapp.com/http://classutil.unsw.edu.au/' +
      faculty.toUpperCase() + '_' + term + '.html', { responseType: 'text' }).subscribe(
        response => {
          var responseArray = response.match(/<a name=\"[A-Z]{4}.*?<\/td><\/tr>/gs);
          var courses = []
          for (let course of responseArray) {
            course = course.replace(/</g, '');
            course = course.replace(/>/g, '');
            course = course.replace(/"/g, '');
            course = course.replace(/a name=/g, '');
            course = course.replace(/\/ab.*center/gs, ' ');
            course = course.replace(/\/td\/tr/g, '');
            course = course.replace(/amp;/g, '')
            courses.push(course);
          }
          coursesParsed.next(courses);
          console.log(courses);
          if (courses.length > 0) {
            this.searchState.next("found");
          }
        }
      )
    } catch {
      coursesParsed.next(['error']);
      return 
    }
    return coursesParsed;
  }

  getSearchState() {
    return this.searchState;
  }

}