import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { ClassModel } from '../models/classModel';

@Injectable({
  providedIn: 'root'
})
export class ClassUtilService {

  searchState: BehaviorSubject<string> = new BehaviorSubject<string>("initial");
  getSearchState() {
    return this.searchState;
  }

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
    this.http.get('https://cors-anywhere.herokuapp.com/http://classutil.unsw.edu.au/' +
    faculty.toUpperCase() + '_' + term + '.html', { responseType: 'text' }).subscribe(
      response => {
        console.log(response);
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
        } else {
          this.searchState.next("notfound");
        }
      }, error => {
        this.searchState.next("error");
      }
    );
    return coursesParsed;
  }

  searchClasses(course: string) {
    var classesParsed = new BehaviorSubject<ClassModel[]>([]);
    var faculty = course.substring(0, 4);
    var term = course.substring(8, 10);
    this.http.get('https://cors-anywhere.herokuapp.com/http://classutil.unsw.edu.au/' +
    faculty.toUpperCase() + '_' + term + '.html', { responseType: 'text' }).subscribe(
      response => {
        var regex = new RegExp(course + "\"><\/a.+?<tr><td colspan=2 class=\"cucourse\" align=right valign=center>", "gs");
        var responseArray = response.match(regex);
        var classes = responseArray[0].match(/<td.*?>[A-Z]{3}<\/td>.+?<\/td> <\/tr>/gs);
        var classModels = [];
        for (let _class of classes) {
          if (!_class.includes(">CRS<") && !_class.includes(">LEC<")) {
            var classModel: ClassModel = {
              type: _class.match(/>[A-Z]{3}</)[0].substring(1,4),
              session: _class.match(/>[A-Z]\d\d[A-Z]</)[0].substring(1,5),
              id: _class.match(/> \d{4}</)[0].substring(2,6),
              status: _class.match(/>[A-Z][a-z]{3,}?</)[0].substring(1).replace("<",""),
              enrolments: _class.match(/[0-9]+?\/.+?</)[0].replace("<",""),
              details: _class.match(/<td>(?:(?!<td>).)*?<\/td> <\/tr>$/s)[0].substring(4).replace("<\/td> <\/tr>", "").replace(/<.+?>/gs, "")
            }
            classModels.push(classModel);
          }
        }
        classesParsed.next(classModels);
        console.log(classModels);
      }
    );
    return classesParsed;
  }

}