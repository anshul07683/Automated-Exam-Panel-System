import { Component, OnInit } from '@angular/core';
import { AllotedService, AllotedItem } from '../services/alloted.service';
import { HttpClient } from '@angular/common/http';
import {CheckboxModule} from 'primeng/checkbox';
import * as XLSX from 'xlsx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import {ToasterModule, ToasterService} from 'angular5-toaster';
import { NotificationService } from '../services/notification.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as quill from 'quill';
import { SubjectService, SubjectItem } from '../services/subject.service';
import { PaperValuationService, AllotedValuerItem } from '../services/paper-valuation.service';
import { ExaminerService, EmailItem } from '../services/examiner.service';

declare const $;

@Component({
  selector: 'app-paper-valuation',
  templateUrl: './paper-valuation.component.html',
  styleUrls: ['./paper-valuation.component.css']

})
export class PaperValuationComponent implements OnInit {

  subject_code: any;
  allotedValuers: AllotedValuerItem[];
  valuer: any;
  exam_codes: any;
  myformValuer: FormGroup;
  text1: string;
  myform: FormGroup;
  data1 = {
    exam_code:'',
    subject_code: '',
    valuer:'',
    name1:'',
    name2:'',
    name3:'',
    sent: '',
    recieved: ''
  }
  data: { to: any, subject: string, html: string };
  emails = [];

  public selectedExaminerToNotify : EmailItem[] = [];

  alloted_examiners: AllotedItem[];
  selectedValues = [];
  public sent = [];
  public recieved = [];

  constructor(private examinerService: ExaminerService,
     private http: HttpClient,
    private notificationService: NotificationService,
    private toasterService: ToasterService,
    private paperValuationService: PaperValuationService
  ) { 
    this.data = {
      to : [],
      subject: '',
      html: ''
    }

  }

  ngOnInit() {
    this.getExamCodes();
    this.getAllValuers();

    this.myform = new FormGroup({

      text: new FormControl('', [
          Validators.required
      ]),
      subject: new FormControl('')
  });
  this.myformValuer = new FormGroup({

    scode: new FormControl('', [
        Validators.required
    ]),
    name1: new FormControl(''),
    name2: new FormControl(''),
    name3: new FormControl(''),
    valuer: new FormControl('', [
      Validators.required
    ])
});
  }

  getExamCodes(){
    this.examinerService.getExamCodes().subscribe( res => {
      this.exam_codes = res;
    })
  }

  getAllValuers(){
    this.paperValuationService.getAllotedValuers().subscribe(
      res => {
        //console.log(res);
        this.allotedValuers = res;
      }
    )
  }

  updateStatus(alloted, type, idx) {
 
    console.log(alloted);
    if (type === 'sent') {
      alloted.sent = this.sent[idx];
      // alloted.recieved_time = new Date().getDate();
    }
    if (type === 'recieved') {
      alloted.recieved = this.recieved[idx];
      // alloted.proposal_sent = new Date().getDate();
    }


    this.paperValuationService.updateAllotedValuer(alloted).subscribe(res => this.getAllValuers());
  }

  // getStatus() {
  //   this.allotedService.getAlloted().subscribe(res => this.alloted_examiners = res);
  // }

  doit(type, fn, dl) {
    let valuersToExport = [];
    for(let data of this.allotedValuers){
      valuersToExport.push({
        'Exam Code': data.exam_code,
        'Valuer': data.valuer,
        'Co-Valuer 1': data.coval1,
        'Co-Valuer 2': data.coval2,
        'Co-Valuer 3': data.coval3,
        'Sent Status': data.sent,
        'Recieved Status': data.recieved

      })
    }

    const json = valuersToExport;
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const wb: XLSX.WorkBook = { Sheets: { 'Alloted Valuers': ws }, SheetNames: ['Alloted Valuers'] };
    XLSX.write(wb, {bookType: type, bookSST: true, type: 'base64'});
    XLSX.writeFile(wb, fn || ('Received_Status.' + (type || 'xlsx')));
}

async notify() {

  
  await this.examinerService.getSelectedEmail(this.selectedValues).toPromise().then(
    res => {
      this.selectedExaminerToNotify = res;
    }
  );

  this.selectedExaminerToNotify.map(item => this.emails.push(item.email));

  this.data.to = this.emails;
  this.sendMail();
  this.closex();
}

sendMail() {

this.notificationService.sendMail(this.data).subscribe(res => {
  if(res.status === true){
    this.toasterService.pop('success',res.message);
  }
  else{
    this.toasterService.pop('error',res.message);
  }
});
}



  // Select All Feature to be imeplemented  //

  toggleSelection(exam_code){
    const idx = this.selectedValues.indexOf(exam_code);
    if(idx > -1){
      this.selectedValues.splice(idx,1);
      this.allotedValuers[idx]['selected'] = false;
    }
    else{
      this.selectedValues.push(exam_code);
      const idx = this.selectedValues.indexOf(exam_code);
      this.allotedValuers[idx]['selected'] = true;
    }
    //console.log(this.selectedValues);
  }


  selectAll(){
    if(this.selectedValues.length === this.allotedValuers.length){
      this.allotedValuers.map((item) => {
        item['selected']=false;
        this.selectedValues.pop();
        
      });
    }
    else {
      this.allotedValuers.map((item) => {
        if(!this.selectedValues.includes(item.exam_code)){
          item['selected']=true;
          this.selectedValues.push(item.exam_code);
        }
      });
    }
  }
    // console.log(this.selectedValues);

  openAddWindow(val) {

    if(this.selectedValues.length === 0 && val === 'add'){
      this.toasterService.pop('info',"Please Select Atleast one record");
      this.closex();
    }
    $('#entry').val('Add');
    $('.modal_form').toggleClass('modal_form_on');
    $('.overlay').toggleClass('overlay_on');

    if(val==='val'){
      $('#notification').hide();
      $('#valuer').show();
    }

    if(val==='add'){
      $('#notification').show();
      $('#valuer').hide();
    }
    }
  
    closex() {
      $('.modal_form').toggleClass('modal_form_on');
      $('.overlay').toggleClass('overlay_on');
    }


    allotValuer(){
      this.data1.subject_code = this.subject_code;
      this.paperValuationService.allotPaperValuers(this.data1).subscribe(
        res => {
          if (res.status === true) {
            this.toasterService.pop('success', res.message);
            this.getAllValuers();
          }
          else{
            this.toasterService.pop('error', res.message);
          }
        }
      );
      this.closex();
    }

    getValuerName()
  {
      // console.log(this.data1.exam_code);
      // get internal Examiners for the subject
       this.http.get('http://localhost:3000/alloted/get_valuer/'+this.data1.exam_code).subscribe( data => {
           this.valuer = data[0].name;
           this.subject_code = data[0].Subject_Code;
           // console.log(this.valuer);
         });
  }

    deleteValuer(exam_code){
      this.paperValuationService.deleteValuer(exam_code).subscribe(
        res =>  {
          if(res.status === false){
            this.toasterService.pop('error',res.message);
          }
          else{
            this.getAllValuers();
            this.toasterService.pop('success',res.message);
          }
        })
    }

    deleteAllAllotedValuers(){
      if(this.allotedValuers.length===0){
        this.toasterService.pop('info',"No Details Found to Delete");
      }
      else{
        this.paperValuationService.deleteAllValuer().subscribe(
          res => {
            if(res.status===true){
              this.toasterService.pop('success',res.message);
              this.getAllValuers();
            }
          }
        )
      }
    }

    isValid(field: string) {
      return !this.myform.get(field).valid && this.myform.get(field).touched;
    }

    
}
