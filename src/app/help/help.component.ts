import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})

export class HelpComponent implements OnInit {

  message = '';
  data = {
    subject: '',
    text: ''
  };

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  sendMail() {

    this.message = 'Sending E-mail please wait...';
    this.http.post('http://localhost:3000/contact_developers', this.data).subscribe(res => {
       if (res) {
         this.message = 'Message Sent Successfully';
       }
    });
  }
}
