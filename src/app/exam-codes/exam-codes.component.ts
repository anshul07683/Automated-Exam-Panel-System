import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DepartmentService, DepartmentItem } from '../services/department.service';
import { AllotedService } from '../services/alloted.service';
import { ExaminerService } from '../services/examiner.service';
import { SubjectService } from '../services/subject.service';
import {ToasterModule, ToasterService} from 'angular5-toaster';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-exam-codes',
  templateUrl: './exam-codes.component.html',
  styleUrls: ['./exam-codes.component.css']
})
export class ExamCodesComponent implements OnInit {

  
  myform: any;
  examCodes = [
    // {'examCode':'1001','dept':'CTA'},
    // {'examCode':'2001','dept':'ME'},
    // {'examCode':'2002','dept':'ME'}
  ];
    
  mappedSubjects = [
    // "1001":[{'scode':'CT1003'},{'scode':'CT1005'}],
    // "2001":[{'scode':'ME1008'},{'scode':'ME1001'}],
    // "2002":[{'scode':'ME8801'}]
  ];

  constructor(private allotedService: AllotedService,
    private subjectService: SubjectService,
    private examinerService: ExaminerService,
    private toasterService: ToasterService
  ) { }

  ngOnInit() {
    this.getExamCodeData();
    
  }

  getExamCodeData(){
    this.examinerService.getExamCodes().subscribe(
      res => {
        console.log(res);
        this.examCodes = res;
        this.examCodes.forEach(item => {
          this.getSubjectGroup(item['exam_code']);
        });
      }
    )
  }


  async getSubjectGroup(code){
    // console.log(code);
    await this.subjectService.getSubjectGroups(code).subscribe(
      res => {
        // console.log(res);
        this.mappedSubjects.push({"code": code, "data": res});
        console.log(this.mappedSubjects);
      }
    ) 
  }

  doit(type, fn, dl) {
    let examCodesToExport= [];
    if (this.mappedSubjects.length === 0){
      this.toasterService.pop("info","No Data Found To Export");
    }
    else{
      for( let ms of this.mappedSubjects){
        let test: string= '';
        for(let d of ms.data){
        test = test+d.Code;
        if(ms.data.indexOf(d)<ms.data.length-1){
          test = test+'/';
        }
        }
        examCodesToExport.push({'Exam Code': ms.code, 'Subject Groups':test});
      }

      const json = examCodesToExport;
      // console.log(json);
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
      const wb: XLSX.WorkBook = { Sheets: { 'Exam Code': ws }, SheetNames: ['Exam Code'] };
      XLSX.write(wb, {bookType: type, bookSST: true, type: 'base64'});
      XLSX.writeFile(wb, fn || ('Exam_Codes.' + (type || 'xlsx')));
      this.toasterService.pop('success', 'Data Exported Successfully');
    }
}

}
