import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  message = '';
  data = {
    to : '',
    subject: '',
    text: ''
  };

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  sendMail() {

    this.message = 'Sending E-mail please wait...';
    this.http.post('http://localhost:3000/send_mail', this.data).subscribe(res => {
       if (res) {
         this.message = 'Message Sent Successfully';
       }
    });
  }
}
