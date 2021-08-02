import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

export class PaperStatus {
  constructor(
    public exam_code: string,
    public examiner: string,
    public proposal: string,
    public status: string,
    public proposal_sent: string,
    public received_time: string,
  ) {}
}

@Injectable()
export class PaperRecievedService {

  paperStatus : PaperStatus[];

  constructor(private http: Http) { 
    this.paperStatus = [];
  }

  addStatus(alloted){
    return this.http.post('http://localhost:3000/papers/addStatus', alloted)
    .subscribe(
      res => {
        this.getStatus();
        return res.json();
      }
    )
  }

  addAllotedToStatus(alloted){
    return this.http.post('http://localhost:3000/papers/addAllotedToStatus', alloted)
    .subscribe(
      res => {
        this.getStatus();
        return res.json();
      }
    )
  }

  updateStatus(alloted){
     return this.http.post('http://localhost:3000/papers/updateStatus', alloted)
      .map(
        res => {
          this.getStatus();
          return res.json();
        }
      );
}

  getStatus(): Observable<PaperStatus[]> {
      return this.http.get('http://localhost:3000/papers/getStatus')
      .map(res => {
        return res.json().map(item => {
           return new PaperStatus(
             item.exam_code,
             item.examiner,
             item.proposal,
             item.status,
             item.proposal_sent,
             item.received_time
           );
         });
      });
    }
}
