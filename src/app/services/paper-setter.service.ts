import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

export class AllotedPaperSetterItem{
  constructor(
    public subject_code,
    public exam_code,
    public examiner
  ){}
}

@Injectable()
export class PaperSetterService {

  constructor(
    private http: Http
  ) { }

  getAllotedPaperSetter(): Observable<AllotedPaperSetterItem[]>{
    return this.http.get('http://localhost:3000/paperSetter/get_alloted')
    .map(
      res => {
        return res.json().map(item => {
          return new AllotedPaperSetterItem(
            item.exam_code,
            item.subject_code,
            item.examiner
          )
        })
      }
    )
  }

  allotPaperSetter(data){
    return this.http.post('http://localhost:3000/paperSetter/allot_paper_setter',data)
    .map(
      res => {
        return res.json();
      }
    )
  }

  deleteAlloted(exam_code){
    return this.http.delete('http://localhost:3000/paperSetter/delete_alloted/'+exam_code)
    .map(
      res => {
        return res.json();
      }
    )
  }


  getExaminerByExamCode(exam_code){
    return this.http.get('http://localhost:3000/paperSetter/get_examiner/'+exam_code)
    .map(
      res => {
        return res.json();
      }
    )
  }

}
