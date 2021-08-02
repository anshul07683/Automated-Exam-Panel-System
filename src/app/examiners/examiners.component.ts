import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import {Validators, FormGroup, FormControl} from '@angular/forms';
import { HttpModule, Headers } from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToasterModule, ToasterService} from 'angular5-toaster';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ExaminerService, ExaminerItem } from '../services/examiner.service';
import * as XLSX from 'xlsx';
import { SubjectService, SubjectItem } from '../services/subject.service';

import { Observable } from 'rxjs/Observable';
import { PaperRecievedComponent } from '../paper-recieved/paper-recieved.component';
import { PaperRecievedService } from '../services/paper-recieved.service';

@Component({
  selector: 'app-examiners',
  templateUrl: './examiners.component.html',
  styleUrls: ['./examiners.component.css']
})
export class ExaminersComponent implements OnInit {

private examiners: ExaminerItem[];

  myform: FormGroup;
  subjects: SubjectItem[];
  examiner = {
    id : '',
    name : '',
    subject_code : '',
    exam_code : '',
    address: '',
    department: '',
    type: '',
    email: '',
    contact: '',
  };

  public searchString: string;

  // File Reader---
  arrayBuffer: any;
  file: File;
  incomingfile(event) {
  this.file = event.target.files[0];
  }
  //
  constructor(private http: HttpClient,
    private router: RouterModule,
    private examinerService: ExaminerService,
    private paperRecievedService: PaperRecievedService,
    private subjectService: SubjectService,
    private toasterService: ToasterService
  ) {
  }

  ngOnInit() {
    // Fetch All Examiners & Subject Codes
    this.getExaminers();
    this.getCodes();

    this.myform = new FormGroup({

      email: new FormControl('', [
          Validators.required,
          Validators.email
      ]),
      name: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      scode: new FormControl('', [
          Validators.required
      ]),
      ecode: new FormControl('', [
          Validators.required
      ]),
      department: new FormControl('', [
          Validators.required
      ]),
      type: new FormControl(0, [
          Validators.required
      ]),
      contact: new FormControl('', [
          // Validators.minLength(10),
          Validators.required
      ])
  });
  }

  getCodes() {
    this.subjectService.getSubjects().subscribe(res => {
      this.subjects = res;
    });
  }

  isValid(field: string) {
    return !this.myform.get(field).valid && this.myform.get(field).touched;
  }

  displayFieldCss(field: string) {
    if (this.isValid(field)) {
      return 'has-error';
    }
    if (!this.isValid( field )) {
      return 'has-success';
    }else {
       return '';
     }
  }

  getExaminers() {
    this.examinerService.getExaminers().subscribe(res =>
      { 
        this.examiners = res;
        
      });

  }
// Modal Window functions
 openAddWindow() {
  this.examiner.id = '';
  this.examiner.name = '';
  this.examiner.subject_code = '';
  this.examiner.exam_code = '';
  this.examiner.address = '';
  this.examiner.department = '';
  this.examiner.type = '';
  this.examiner.email = '';
  this.examiner.contact = '';

  $('#entry').val('Add');
  $('.modal_form').toggleClass('modal_form_on');
  $('.overlay').toggleClass('overlay_on');

  }

  closex() {
    $('.modal_form').toggleClass('modal_form_on');
    $('.overlay').toggleClass('overlay_on');
  }


  openEditWindow(examiner) {
    this.examiner.id = examiner.id,
    this.examiner.name = examiner.name;
    this.examiner.subject_code = examiner.subject_code,
    this.examiner.exam_code = examiner.exam_code,
    this.examiner.address = examiner.address;
    this.examiner.email = examiner.email;
    this.examiner.contact = examiner.contact;
    this.examiner.department = examiner.department;
    this.examiner.type = examiner.type;
    $('#entry').val('Update');
    $('.modal_form').toggleClass('modal_form_on');
    $('.overlay').toggleClass('overlay_on');
  }

  deleteExaminer(code) {
    this.examinerService.deleteExaminer(code).subscribe(res => {
      if(res.status === true){
        this.toasterService.pop('success', res.message);
      }
      this.getExaminers();
    });
  }

  addDetail() {
    if ($('#entry').val() === 'Add') {
      this.addExaminer();
    }
    if ($('#entry').val() === 'Update') {
      this.editExaminer();
    }
  }

  addExaminer() {
    this.examinerService.addExaminer(this.examiner).subscribe(res => {
      if(res.status==false){
        this.toasterService.pop('error','Error: ',res.message);
      }
      else{
        this.getExaminers();
        this.toasterService.pop('success','Examiner Details Added Successfully');
        this.addToPaperRecieved();
      }
      
    });
    this.closex();
  }

  editExaminer() {
    this.examinerService.updateExaminer(this.examiner).subscribe(res => {
      
      this.getExaminers();
      this.toasterService.pop('info','Examiner Details Updated Successfully');
    });
    this.closex();

  }

  Upload() {
    const fileReader = new FileReader();
      fileReader.onload = (e) => {
          this.arrayBuffer = fileReader.result;
          const data = new Uint8Array(this.arrayBuffer);
          const arr = new Array();
          for ( let i = 0; i !== data.length; ++i) { arr[i] = String.fromCharCode(data[i]); }
          const bstr = arr.join('');
          const workbook = XLSX.read(bstr, {type: 'binary'});
          const first_sheet_name = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[first_sheet_name];
          const myFile = XLSX.utils.sheet_to_json(worksheet, { raw: true });
          this.examinerService.uploadFile(myFile).subscribe(res=>{
            if(res.status===false){
              this.toasterService.pop('error','Error While Uploading: ',res.message);
            }
            else if(res.status===true){
              this.getExaminers();
              this.toasterService.pop('success',res.message);
            }
          });
      };
      fileReader.readAsArrayBuffer(this.file);
    }

    doit(type, fn, dl) {
      let examinersToExport = [];
      // console.log(this.subjects);
      if (this.subjects.length === 0) {
        this.toasterService.pop('info', 'No Details Found to Export');
      }else {
        for( let data of this.examiners){
          examinersToExport.push({
            'Examiner': data.name,
            'Subject Code': data.subject_code,
            'Exam Code': data.exam_code,
            'Department': data.department,
            'Address': data.address,
            'Type': data.type,
            'Email': data.email,
            'Contact': data.contact
          })
        }
        const json = examinersToExport;
        // console.log(json);
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        const wb: XLSX.WorkBook = { Sheets: { 'Examiners': ws }, SheetNames: ['Examiners'] };
        XLSX.write(wb, {bookType: type, bookSST: true, type: 'base64'});
        XLSX.writeFile(wb, fn || ('Examiners.' + (type || 'xlsx')));
        this.toasterService.pop('success', 'Data Exported Successfully');
      }
    
      
  }

  deleteAllExaminers(){
    if(this.examiners.length===0){
      this.toasterService.pop('info',"No Details Found to Delete");
    }
    else{
        this.examinerService.deleteAllExaminers().subscribe(
          res => {
            if(res.status===true){
              this.toasterService.pop('success',res.message);
              this.getExaminers();
            }
          }
        )
      }
    }

    addToPaperRecieved(){
     this.paperRecievedService.addStatus(this.examiner);
    }


}
