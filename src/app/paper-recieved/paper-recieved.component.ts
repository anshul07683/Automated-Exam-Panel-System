import { Component, OnInit } from '@angular/core';
import { AllotedService, AllotedItem } from '../services/alloted.service';
import { HttpClient } from '@angular/common/http';
import {CheckboxModule} from 'primeng/checkbox';
import * as XLSX from 'xlsx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import {ToasterModule, ToasterService} from 'angular5-toaster';
import { NotificationService } from '../services/notification.service';
import { ExaminerItem, ExaminerService, EmailItem } from '../services/examiner.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as quill from 'quill';
import { PaperRecievedService, PaperStatus } from '../services/paper-recieved.service';

declare const $;

@Component({
  selector: 'app-paper-recieved',
  templateUrl: './paper-recieved.component.html',
  styleUrls: ['./paper-recieved.component.css']
})

export class PaperRecievedComponent implements OnInit {

  examiners: ExaminerItem[];
  text1: string;
  myform: FormGroup;
  data: { to: any, subject: string, html: string };
  emails = [];

  public selectedExaminerToNotify : EmailItem[] = [];

  
  paperStatus: PaperStatus[];
  selectedValues = [];
  public status = [];
  public proposal = [];

  constructor(private paperReceivedService: PaperRecievedService,
     private http: HttpClient,
    private examinerService: ExaminerService,
    private notificationService: NotificationService,
    private toasterService: ToasterService,
  ) { 
    this.data = {
      to : [],
      subject: '',
      html: ''
    }

  }

  ngOnInit() {
    this.getStatus();
    this.myform = new FormGroup({

      text: new FormControl('', [
          Validators.required
      ]),
      subject: new FormControl('')
  });
  }

  updateStatus(alloted, type, idx) {

    console.log(type);
    if(type === 'proposal'){
      alloted.proposal = this.proposal[idx];
    }
    if(type === 'status'){
      alloted.status = this.status[idx];
      console.log(this.status[idx]);
    }

    this.paperReceivedService.updateStatus(alloted).subscribe(res => this.getStatus());
  }

  getStatus() {
    this.paperReceivedService.getStatus().subscribe(res => this.paperStatus = res);
  }

  doit(type, fn, dl) {

    let paperRecievedStatusToExport = [];
    if(this.paperStatus.length === 0 ){
      this.toasterService.pop("info","No Data Found to Export");
    }
    else{
    for( let data of this.paperStatus){
      paperRecievedStatusToExport.push({
        'Exam Code': data.exam_code,
        'Examiner': data.examiner,
        'Proposal': data.proposal,
        'Status': data.status,
        'Proposal Sent': data.proposal_sent,
        'Received Time': data.received_time
      })
    }

    const json = paperRecievedStatusToExport;
    //console.log(json);
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const wb: XLSX.WorkBook = { Sheets: { 'Paper Recieved Status': ws }, SheetNames: ['Paper Recieved Status'] };
    // console.log(wb);
    XLSX.write(wb, {bookType: type, bookSST: true, type: 'base64'});
    XLSX.writeFile(wb, fn || ('Received_Status.' + (type || 'xlsx')));
    this.toasterService.pop('success','Data Exported Successfully');
    }

    
}

async notify() {
  
  await this.examinerService.getSelectedEmail(this.selectedValues).toPromise().then(
    res => {
      this.selectedExaminerToNotify = res;
    }
  );

  this.selectedExaminerToNotify.map(item => this.emails.push(item.email));
 // console.log(this.selectedExaminerToNotify);

  this.data.to = this.emails;
  this.sendMail();
  this.closex();
}

sendMail() {
// console.log(this.data);
//this.message = 'Sending E-mail please wait...';
this.notificationService.sendMail(this.data).subscribe(res => {
  if(res.status === true){
    this.toasterService.pop('success',res.message);
  }
  else{
    this.toasterService.pop('error',res.message);
  }
});
}

  toggleSelection(scode){
    const idx = this.selectedValues.indexOf(scode);
    if(idx > -1){
      this.selectedValues.splice(idx,1);
      this.paperStatus[idx]['selected'] = false;
    }
    else{
      this.selectedValues.push(scode);
      const idx = this.selectedValues .indexOf(scode);
      this.paperStatus[idx]['selected'] = true;
    }
    // console.log(this.selectedValues);
  }


  selectAll(){
    if(this.selectedValues.length === this.paperStatus.length){
      this.paperStatus.map((item) => {
        item['selected']=false;
        this.selectedValues.pop();
        
      });
    }
    else {
      this.paperStatus.map((item) => {
        if(!this.selectedValues.includes(item.exam_code)){
          item['selected']=true;
          this.selectedValues.push(item.exam_code);
        }
      });
    }
    // console.log(this.selectedValues);
  }


  openAddWindow() {
    if(this.selectedValues.length===0){
      this.toasterService.pop('info',"Please Select Atleast one E-record");
      this.closex();
    }
    $('#entry').val('Add');
    $('.modal_form').toggleClass('modal_form_on');
    $('.overlay').toggleClass('overlay_on');
    }
  
    closex() {
      $('.modal_form').toggleClass('modal_form_on');
      $('.overlay').toggleClass('overlay_on');
    }


    isValid(field: string) {
      return !this.myform.get(field).valid && this.myform.get(field).touched;
    }


    

    
}
