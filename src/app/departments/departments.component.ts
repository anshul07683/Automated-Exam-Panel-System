import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { DepartmentItem, DepartmentService } from '../services/department.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {ToasterModule, ToasterService} from 'angular5-toaster';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit {


  myform: any;
  departments: DepartmentItem[];
  department = {
    dept_code: '',
    dept_name: '',
    start: 0,
    end: 0
  };

  constructor(
    private departmentService: DepartmentService,
    private toasterService: ToasterService
  ) { }

  ngOnInit() {


    this.getDepartments();

    this.myform = new FormGroup({

      deptCode: new FormControl('', [
          Validators.required
      ]),
      deptName: new FormControl('', [
          Validators.required
      ]),
      startRange: new FormControl(''),
      endRange: new FormControl('')
  });
  }

  openAddWindow() {
  
    this.department.dept_code = '',
    this.department.dept_name = '';
    this.department.start = null,
    this.department.end = null;
    $('#entry').val('Add');
    $('.modal_form').toggleClass('modal_form_on');
    $('.overlay').toggleClass('overlay_on');
  
    }
  
    closex() {
      $('.modal_form').toggleClass('modal_form_on');
      $('.overlay').toggleClass('overlay_on');
    }


    openEditWindow(department){
      this.department.dept_code = department.dept_code,
      this.department.dept_name = department.dept_name;
      this.department.start = department.start,
      this.department.end = department.end;
      $('#entry').val('Update');
      $('.modal_form').toggleClass('modal_form_on');
      $('.overlay').toggleClass('overlay_on');
    }

    addDetail() {
      if ($('#entry').val() === 'Add') {
        this.addDepartment();
      }
      if ($('#entry').val() === 'Update') {
        this.updateRange();
      }
    }

  updateRange() {
    this.departmentService.updateRange(this.department).subscribe(
      res => {
        this.getDepartments();
        this.toasterService.pop('info','Examiner Details Updated Successfully');
      });
    this.closex();
  }

  isValid(field: string) {
    return !this.myform.get(field).valid && this.myform.get(field).touched;
  }

  addDepartment(){
    this.departmentService.addDepartment(this.department).subscribe(
      res => {
        if(res.status==false){
          this.toasterService.pop('error','Server Error','Could not add Department');
        }
        else{
          this.toasterService.pop('success','Department Added Successfully');
        }
        this.getDepartments(); 
      }
    );
    this.closex();
  }

  deleteDepatment(code) {
    this.departmentService.deleteDepartment(code).subscribe(res => {
      if(res.status === true){
        this.toasterService.pop('success', res.message);
      }
      this.getDepartments();
    });
  }

  deleteAllDepartments(){
    if(this.departments.length===0){
      this.toasterService.pop('info',"No Details Found to Delete");
    }
    else{
        this.departmentService.deleteAllDepartments().subscribe(
          res => {
            if(res.status===true){
              this.toasterService.pop('success',res.message);
              this.getDepartments();
            }
          }
        )
      }
    }

  getDepartments(){
    this.departmentService.getDepartments().subscribe(
      res => this.departments = res
    );
  }


}
