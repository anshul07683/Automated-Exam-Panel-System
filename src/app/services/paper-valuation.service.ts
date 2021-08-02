import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

export class AllotedValuerItem{
  constructor(
    public exam_code,
    public subject_code,
    public valuer,
    public coval1,
    public coval2,
    public coval3,
    public sent,
    public recieved
  ){

  }
}

@Injectable()
export class PaperValuationService {

  constructor(private http: Http) { }


  allotPaperValuers(data){
    return this.http.post('http://localhost:3000/valuer/add_valuer',data)
    .map(
      res => {
        this.getAllotedValuers();
        return res.json();
      }
    )
  }


  getAllotedValuers(): Observable<AllotedValuerItem[]>{
    return this.http.get('http://localhost:3000/valuer/get_all_valuers')
    .map(
      res => {
        return res.json().map(item => {
          // console.log(item);
          return new AllotedValuerItem(
            item.Exam_Code,
            item.subject_code,
            item.Valuer_Name,
            item.Co_valuer_1,
            item.Co_valuer_2,
            item.Co_valuer_3,
            item.Sent_Status,
            item.Recieved_Status
          )
        })
      }
    )
  }

  deleteValuer(exam_code){
    return this.http.delete('http://localhost:3000/valuer/delete_valuer/'+exam_code)
    .map(
      res => {
        this.getAllotedValuers();
        return res.json();
      }
    )
  }

  deleteAllValuer(){
    return this.http.delete('http://localhost:3000/valuer/delete_all')
    .map(
      res => {
        this.getAllotedValuers();
        return res.json();
      }
    )
  }

  updateAllotedValuer(data){
    return this.http.post("http://localhost:3000/valuer/update_valuer", data)
    .map(
      res => {
        return res.json();
      }
    )
  }

}
