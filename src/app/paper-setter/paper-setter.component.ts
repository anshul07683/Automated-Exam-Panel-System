import { Component, OnInit } from '@angular/core';
import { SubjectService } from '../services/subject.service';
import { AllotedService } from '../services/alloted.service';
import { ExaminerService } from '../services/examiner.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { PaperSetterService, AllotedPaperSetterItem } from '../services/paper-setter.service';
import {ToasterModule, ToasterService} from 'angular5-toaster';declare const $;


@Component({
  selector: 'app-paper-setter',
  templateUrl: './paper-setter.component.html',
  styleUrls: ['./paper-setter.component.css']
})
export class PaperSetterComponent implements OnInit {

  examiner: any;
  allotedPaperSetter: AllotedPaperSetterItem[];
  examCodes= [];
  paperSetter = {
    subject_code: '',
    exam_code:'',
    examiner: ''
  }
  myform: any;
  subjects = [];
  constructor(
    private allotedService: AllotedService,
    private examinerService: ExaminerService,
    private paperSetterService : PaperSetterService,
    private toasterService: ToasterService
  ) { }

  ngOnInit() {
    this.getAllotedSubjects();
    this.getAllotedPaperSetter();

    this.myform = new FormGroup({

      sub_group: new FormControl('', [
          Validators.required
      ]),
      ex_code: new FormControl('', [
          Validators.required
      ])
  });
  }


  openAddWindow() {
    $('#entry').val('Add');
    $('.modal_form').toggleClass('modal_form_on');
    $('.overlay').toggleClass('overlay_on');
    }


  closex() {
    $('.modal_form').toggleClass('modal_form_on');
    $('.overlay').toggleClass('overlay_on');
  }


  getAllotedSubjects(){
    this.examinerService.getAllotedSubjects().subscribe(
      res => {
        this.subjects = res;
      })
  } 

  getExamCodes(subject_code){
    this.examinerService.getExamCodesBySubjectCode(subject_code).subscribe(
      res => {
        this.examCodes = res;
      }
    )
  }


  allotPaperSetter(){
    this.paperSetter.examiner = this.examiner;
    this.paperSetterService.allotPaperSetter(this.paperSetter).subscribe(
      res => {
        this.getAllotedPaperSetter();
        this.closex();
      }
    );
    this.paperSetter.examiner = '';
    this.paperSetter.exam_code = '';
    this.paperSetter.subject_code = '';
  }

  getAllotedPaperSetter(){
    this.paperSetterService.getAllotedPaperSetter().subscribe(
      res => {
        this.allotedPaperSetter = res;
      }
    )
  }

  deleteAlloted(exam_code){
    this.paperSetterService.deleteAlloted(exam_code).subscribe(
      res => {
        if(res.status === false){
          this.toasterService.pop('error',res.message);
        }
        else{
          this.getAllotedPaperSetter();
          this.toasterService.pop('success',res.message);
        }
      }
    )
  }

  getExaminerByExamCode(exam_code){
    //console.log(exam_code);
    this.paperSetterService.getExaminerByExamCode(exam_code).subscribe(
      res => {
        this.examiner = res[0].name;
      }
    )
  }
}
