import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';
import { SubjectService, SubjectItem } from '../services/subject.service';
import * as XLSX from 'xlsx';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToasterModule, ToasterService} from 'angular5-toaster';
import * as FileSaver from 'file-saver';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ExaminerItem } from '../services/examiner.service';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css']
})



export class SubjectsComponent implements OnInit {
  myform: FormGroup;
  subjects: SubjectItem[];

  subject = {
    Code: '',
    Nomenclature: '',
    group_id: ''
  };

  // File Reader---

  arrayBuffer: any;
  file: File;
  incomingfile(event) {
    this.file = event.target.files[0];
  }
  //

  constructor(private subjectService: SubjectService,
    private toasterService: ToasterService
  ) {}

  ngOnInit() {
      this.getSubjects();

      this.myform = new FormGroup({

        scode: new FormControl('', [
            Validators.required
        ]),
        sNomen: new FormControl('', [Validators.required]),
        group: new FormControl('', [Validators.required]),
       });
  }

  addSCode() {
    this.subjectService.addSCode(this.subject).subscribe(res => {
      if ( res.status === false) {
        this.toasterService.pop('error', res.message);
      }else {
        this.getSubjects();
        this.toasterService.pop('success',res.message)
      }

    });
    this.closex();
  }

  getSubjects() {
    this.subjectService.getSubjects().subscribe(res => this.subjects = res);
  }

  deleteSubject(code) {
    
    this.subjectService.deleteSubject(code).subscribe(res => this.getSubjects());
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
          const myFile = XLSX.utils.sheet_to_json(worksheet, { raw: true});
          this.subjectService.uploadFile(myFile).subscribe(res => {
            if ( res.status === false ) {
              this.toasterService.pop('error', 'Error While Uploading: ', res.message);
            } else if ( res.status === true) {
              this.getSubjects();
              this.toasterService.pop('success', res.message);
            }
          });
      };
      fileReader.readAsArrayBuffer(this.file);
    }

   doit(type, fn, dl) {
    // console.log(this.subjects);
    if (this.subjects.length === 0) {
      this.toasterService.pop('info', 'No Details Found to Export');
    }else {
      const json = this.subjects;
      // console.log(json);
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
      const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
      XLSX.write(wb, {bookType: type, bookSST: true, type: 'base64'});
      XLSX.writeFile(wb, fn || ('Subjects.' + (type || 'xlsx')));
      this.toasterService.pop('success', 'Data Exported Successfully');
    }
}

// Modal Window functions
openAddWindow() {
  this.subject.Code = '';
  this.subject.Nomenclature = '';
  this.subject.group_id = '';

  $('#entry').val('Add');
  $('.modal_form').toggleClass('modal_form_on');
  $('.overlay').toggleClass('overlay_on');

  }

  closex() {
    $('.modal_form').toggleClass('modal_form_on');
    $('.overlay').toggleClass('overlay_on');
  }


  openEditWindow(subject) {
    this.subject.Code = subject.code,
    this.subject.Nomenclature = subject.Nomenclature;
    this.subject.group_id = subject.group_id,
    $('#entry').val('Update');
    $('.modal_form').toggleClass('modal_form_on');
    $('.overlay').toggleClass('overlay_on');
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

  deleteAllSubjects() {
    // console.log(this.subjects);
    if ( this.subjects.length === 0) {
      this.toasterService.pop('info', 'No Details Found to Delete');
    }else {
      this.subjectService.deleteAllSubjects().subscribe(
          res => {
            if (res.status === false) {
              this.toasterService.pop('error', res.message);
            }
            if ( res.status === true) {
              this.toasterService.pop('success', res.message);
              this.getSubjects();
            }
          });
      }
    }


}
