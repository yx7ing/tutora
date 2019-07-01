import { Component, OnInit } from '@angular/core';
import { TestModel } from 'src/app/models/testmodel';
import { TestService } from 'src/app/services/test.service';

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
        this.tests.sort((a,b) => {
          var datea = new Date(a.date);
          var dateb = new Date(b.date);
          return (datea > dateb) ? 1 : -1;
        })
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
