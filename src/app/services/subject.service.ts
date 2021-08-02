import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import {ExaminerItem } from '../services/examiner.service';

export class SubjectItem {
  constructor(
    public Code: string,
    public Nomenclature: string,
    public group_id: string
  ) {}
}
export class CodeItem {
  constructor(
    public Code: string,
  ) {}
}

@Injectable()
export class SubjectService {
  subjects: SubjectItem[];
  subject_groups: CodeItem[];
  addResponse: any;
  deleteResponse: any;

  constructor(private http: Http) {
    this.subjects = [];
  }


  addSCode(subject) {
    return this.http.post('http://localhost:3000/subject/add_subject', subject)
      .map(
        res => {
          this.getSubjects();
          return res.json();
        }
      );
  }

  deleteSubject(code) {
    return this.http.delete('http://localhost:3000/subject/delete_subject/' + code)
      .map(
        res => {
          return res.json();
        }
      );
  }

  deleteAllSubjects(){
    return this.http.delete('http://localhost:3000/subject/delete_all')
    .map(
      res => {
        return res.json();
      }
    )
  }

  uploadFile(file) {
    // console.log(file);
    return this.http.post('http://localhost:3000/subject/upload_file', file)
      .map(
        res => {
          console.log(res);
          return res.json();
        }
      );
  }

  getSubjects(): Observable<SubjectItem[]> {
   return this.http
        .get('http://localhost:3000/subject/get_subjects')
        .map(
          res => {
            // Success
            return res.json().map(item => {
              return new SubjectItem(
                item.Code,
                item.Nomenclature,
                item.group_id
              );
            });
          },
        );
  }

  getSubjectGroups(ex_code):Observable<CodeItem[]>{
    return this.http.get('http://localhost:3000/subject/get_group/' + ex_code)
                    .map(
                      res => {
                        return res.json().map(item => {
                          return new CodeItem(item.Code);
                        });
                      }
                    )
  }

}
