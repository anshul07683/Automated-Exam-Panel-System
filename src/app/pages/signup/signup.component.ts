import { Component, OnInit } from '@angular/core';
import {Validators, FormGroup, FormControl} from '@angular/forms';
import { UserService } from '../../services/users.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

 myform: FormGroup;
 clerk = {
  id : null,
  name : null,
  email : null,
  password : null,
  cpassword : null,
  role: null
 }
  constructor(private userService: UserService ) { }

  ngOnInit() {

    this.myform = new FormGroup({


      name: new FormControl('', [ 
        Validators.required
      ]),
      eid: new FormControl('', [ 
        Validators.required
      ]),
      email: new FormControl('', [ 
          Validators.required,
          Validators.email
      ]),
      password: new FormControl('', [
          Validators.required
      ]),
      cpassword: new FormControl('', [
          Validators.required
      ]),
      role: new FormControl('', [
        Validators.required
    ])
  });
  }

  isValid(field: string) {
    return !this.myform.get(field).valid && this.myform.get(field).touched;
  }

  displayFieldCss(field: string) {
    if(this.isValid(field)){
      return 'has-error';
    }
    else if(!this.isValid(field)){
      return 'has-success';
    }
    else return ''
  }

  addUser() {
    this.userService.addUser(this.clerk).subscribe();
  }
}
