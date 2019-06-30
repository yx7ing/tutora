import { Component, OnInit } from '@angular/core';
import { TestService } from '../services/test.service';
import { TestModel } from '../models/testmodel';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  tests: TestModel[] = [];

  constructor(private testSrv: TestService) { }

  ngOnInit() {
    this.testSrv.getTests().subscribe(
      response => {
        this.tests = response.map(e => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data()
          } as TestModel;
        });
        console.log(this.tests);
      }
    );
  }

  create() {
    var date = new Date();
    this.testSrv.createTest(
      {
        id: "test2",
        name: "test2",
        details: "test2",
        date: date.toString()
      }
    );
  }
}
